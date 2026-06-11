using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TarefaExpress.Data;
using TarefaExpress.Entities;

namespace TarefaExpress.Controllers;

public class UpdateTarefaDto
{
    public string? Titulo { get; set; }
    public string? Descricao { get; set; }
    public string? Prioridade { get; set; }
    public DateTimeOffset? VenceEm { get; set; }
    public bool? Concluida { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class TarefasController : ControllerBase
{
    private readonly AppDbContext _db;

    public TarefasController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var t = _db.ItemTarefas.Find(id);
        if (t == null) return NotFound(new { message = "Tarefa não encontrada." });

        var prioStr = t.Prioridade switch
        {
            PrioridadeTarefa.Baixa => "Baixa",
            PrioridadeTarefa.Normal => "Média",
            PrioridadeTarefa.Alta => "Alta",
            PrioridadeTarefa.Critica => "Alta",
            _ => "Média"
        };

        var resp = new
        {
            id = t.Id,
            idGrupo = t.IdGrupo,
            idUsuarioCriador = t.IdUsuarioCriador,
            titulo = t.Titulo,
            desc = t.Descricao ?? "",
            prazo = t.VenceEm?.ToString("dd/MM/yyyy HH:mm") ?? "",
            prazoRelativo = GetRelativeTime(t.VenceEm, t.Status == StatusTarefa.Concluida),
            prioridade = prioStr,
            concluida = t.Status == StatusTarefa.Concluida,
            venceEm = t.VenceEm
        };

        return Ok(resp);
    }

    [HttpPut("{id}")]
    public IActionResult Put(Guid id, [FromBody] UpdateTarefaDto dto)
    {
        var t = _db.ItemTarefas.Find(id);
        if (t == null) return NotFound(new { message = "Tarefa não encontrada." });

        if (dto.Titulo != null) t.Titulo = dto.Titulo;
        if (dto.Descricao != null) t.Descricao = dto.Descricao;
        if (dto.VenceEm != null) t.VenceEm = dto.VenceEm;

        if (dto.Prioridade != null)
        {
            t.Prioridade = dto.Prioridade.ToLower() switch
            {
                "baixa" => PrioridadeTarefa.Baixa,
                "média" => PrioridadeTarefa.Normal,
                "media" => PrioridadeTarefa.Normal,
                "alta" => PrioridadeTarefa.Alta,
                _ => PrioridadeTarefa.Normal
            };
        }

        if (dto.Concluida.HasValue)
        {
            t.Status = dto.Concluida.Value ? StatusTarefa.Concluida : StatusTarefa.Pendente;
            t.ConcluidaEm = dto.Concluida.Value ? DateTimeOffset.UtcNow : null;
        }

        _db.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var t = _db.ItemTarefas.Find(id);
        if (t == null) return NotFound(new { message = "Tarefa não encontrada." });

        _db.ItemTarefas.Remove(t);
        _db.SaveChanges();
        return NoContent();
    }

    private static string GetRelativeTime(DateTimeOffset? dt, bool concluida)
    {
        if (concluida) return "Concluída";
        if (!dt.HasValue) return "Sem prazo";

        var diff = dt.Value - DateTimeOffset.UtcNow;
        if (diff.TotalSeconds < 0) return "Atrasada";

        if (diff.TotalDays >= 1) return $"Em {(int)diff.TotalDays} dia(s)";
        if (diff.TotalHours >= 1) return $"Em {(int)diff.TotalHours} hora(s)";
        return $"Em {(int)diff.TotalMinutes} minuto(s)";
    }
}
