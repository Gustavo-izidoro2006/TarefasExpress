using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TarefaExpress.Data;
using TarefaExpress.DTOs;
using TarefaExpress.Entities;
using TarefaExpress.Services;

namespace TarefaExpress.Controllers;

public class CreateTarefaInput
{
    public required string Titulo { get; set; }
    public string? Desc { get; set; }
    public string? Prioridade { get; set; }
    public DateTimeOffset? VenceEm { get; set; }
    public Guid IdUsuarioCriador { get; set; }
}

public class SendMessageInput
{
    public required string Msg { get; set; }
    public Guid UserId { get; set; }
}

public class CreateInviteInput
{
    public string? Email { get; set; }
    public Guid IdUsuarioConvidante { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class GruposController : ControllerBase
{
    private readonly IGrupoService _service;
    private readonly AppDbContext _db;

    public GruposController(IGrupoService service, AppDbContext db)
    {
        _service = service;
        _db = db;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var g = _service.GetById(id);
        if (g == null) return NotFound();
        return Ok(g);
    }

    [HttpPost]
    public IActionResult Post(CreateGrupoDto dto)
    {
        var created = _service.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Put(Guid id, CreateGrupoDto dto)
    {
        var ok = _service.Update(id, dto);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}")]
    public IActionResult Patch(Guid id, PatchGrupoDto dto)
    {
        var ok = _service.UpdatePartial(id, dto);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var ok = _service.Delete(id);
        if (!ok) return NotFound();
        return NoContent();
    }

    // ─── TAREFAS DO GRUPO ───────────────────────────────────────────────────

    [HttpGet("{id}/tarefas")]
    public IActionResult GetTarefas(Guid id)
    {
        var tarefas = _db.ItemTarefas
            .Where(t => t.IdGrupo == id)
            .OrderByDescending(t => t.VenceEm)
            .ToList();

        var list = tarefas.Select(t => {
            var prioStr = t.Prioridade switch
            {
                PrioridadeTarefa.Baixa => "Baixa",
                PrioridadeTarefa.Normal => "Média",
                PrioridadeTarefa.Alta => "Alta",
                PrioridadeTarefa.Critica => "Alta",
                _ => "Média"
            };

            return new
            {
                id = t.Id,
                titulo = t.Titulo,
                desc = t.Descricao ?? "",
                prazo = t.VenceEm?.ToString("dd/MM/yyyy") ?? "",
                prazoRelativo = GetRelativeTime(t.VenceEm, t.Status == StatusTarefa.Concluida),
                prioridade = prioStr,
                concluida = t.Status == StatusTarefa.Concluida
            };
        });

        return Ok(list);
    }

    [HttpPost("{id}/tarefas")]
    public IActionResult CreateTarefa(Guid id, [FromBody] CreateTarefaInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Titulo))
            return BadRequest(new { message = "O título é obrigatório." });

        var prio = input.Prioridade?.ToLower() switch
        {
            "baixa" => PrioridadeTarefa.Baixa,
            "média" => PrioridadeTarefa.Normal,
            "media" => PrioridadeTarefa.Normal,
            "alta" => PrioridadeTarefa.Alta,
            _ => PrioridadeTarefa.Normal
        };

        var tarefa = new ItemTarefa
        {
            IdGrupo = id,
            IdUsuarioCriador = input.IdUsuarioCriador,
            Titulo = input.Titulo,
            Descricao = input.Desc,
            Status = StatusTarefa.Pendente,
            Prioridade = prio,
            VenceEm = input.VenceEm
        };

        _db.ItemTarefas.Add(tarefa);
        _db.SaveChanges();

        return Ok(tarefa);
    }

    // ─── MEMBROS DO GRUPO ───────────────────────────────────────────────────

    [HttpGet("{id}/membros")]
    public IActionResult GetMembros(Guid id, [FromQuery] Guid? userId)
    {
        var grupo = _db.Grupos.Find(id);
        if (grupo == null) return NotFound(new { message = "Grupo não encontrado." });

        // Auto-heal: Garantir que o criador esteja nos membros
        var temCriador = _db.MembrosGrupos.Any(m => m.IdGrupo == id && m.IdUsuario == grupo.IdUsuarioCriador);
        if (!temCriador)
        {
            _db.MembrosGrupos.Add(new MembroGrupo
            {
                IdGrupo = id,
                IdUsuario = grupo.IdUsuarioCriador,
                IdCargo = Guid.Empty,
                Status = StatusMembro.Ativo,
                EntradaEm = DateTimeOffset.UtcNow
            });
            _db.SaveChanges();
        }

        var membros = (from m in _db.MembrosGrupos
                       join u in _db.Usuarios on m.IdUsuario equals u.Id
                       where m.IdGrupo == id && m.Status == StatusMembro.Ativo
                       select new {
                           m.Id,
                           idUsuario = u.Id,
                           nome = u.NomeCompleto,
                           email = u.Email,
                           cargo = m.IdUsuario == grupo.IdUsuarioCriador ? "Administrador" : "Membro",
                           isAdm = m.IdUsuario == grupo.IdUsuarioCriador,
                           online = true, // Simulado como online para desenvolvimento
                           voce = userId.HasValue && m.IdUsuario == userId.Value
                       }).ToList();

        return Ok(membros);
    }

    // ─── CHAT DO GRUPO ───────────────────────────────────────────────────────

    [HttpGet("{id}/chat")]
    public IActionResult GetChatMessages(Guid id, [FromQuery] Guid? userId)
    {
        // Encontrar ou criar SalaChat padrão do grupo
        var sala = _db.SalasChat.FirstOrDefault(s => s.IdGrupo == id);
        if (sala == null)
        {
            sala = new SalaChat
            {
                IdGrupo = id,
                Nome = "Chat Geral",
                Tipo = TipoSalaChat.Grupo
            };
            _db.SalasChat.Add(sala);
            _db.SaveChanges();
        }

        var messages = (from msg in _db.MensagensChat
                        join u in _db.Usuarios on msg.IdUsuarioRemetente equals u.Id
                        where msg.IdSalaChat == sala.Id
                        orderby msg.EnviadaEm ascending
                        select new {
                            id = msg.Id,
                            autor = u.NomeCompleto,
                            cargo = msg.IdUsuarioRemetente == _db.Grupos.Where(g => g.Id == id).Select(g => g.IdUsuarioCriador).FirstOrDefault() ? "Administrador" : "Membro",
                            msg = msg.Conteudo,
                            hora = msg.EnviadaEm.ToLocalTime().ToString("HH:mm"),
                            meu = userId.HasValue && msg.IdUsuarioRemetente == userId.Value
                        }).ToList();

        return Ok(messages);
    }

    [HttpPost("{id}/chat")]
    public IActionResult SendChatMessage(Guid id, [FromBody] SendMessageInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Msg))
            return BadRequest(new { message = "A mensagem não pode ser vazia." });

        // Encontrar ou criar SalaChat padrão do grupo
        var sala = _db.SalasChat.FirstOrDefault(s => s.IdGrupo == id);
        if (sala == null)
        {
            sala = new SalaChat
            {
                IdGrupo = id,
                Nome = "Chat Geral",
                Tipo = TipoSalaChat.Grupo
            };
            _db.SalasChat.Add(sala);
            _db.SaveChanges();
        }

        var msg = new MensagemChat
        {
            IdSalaChat = sala.Id,
            IdUsuarioRemetente = input.UserId,
            Conteudo = input.Msg,
            EnviadaEm = DateTimeOffset.UtcNow
        };

        _db.MensagensChat.Add(msg);
        _db.SaveChanges();

        return Ok(msg);
    }

    // ─── CONVITES DO GRUPO ───────────────────────────────────────────────────

    [HttpGet("{id}/convites")]
    public IActionResult GetConvites(Guid id)
    {
        var convites = _db.ConvitesGrupo
            .Where(c => c.IdGrupo == id && c.Status == StatusConvite.Pendente)
            .OrderByDescending(c => c.ExpiraEm)
            .Select(c => new {
                id = c.Id,
                codigo = c.CodigoConvite,
                email = c.Email,
                expiraEm = c.ExpiraEm
            })
            .ToList();

        return Ok(convites);
    }

    [HttpPost("{id}/convites")]
    public IActionResult CreateConvite(Guid id, [FromBody] CreateInviteInput input)
    {
        var rnd = new Random();
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var code = new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[rnd.Next(s.Length)]).ToArray());

        var convite = new ConviteGrupo
        {
            IdGrupo = id,
            IdUsuarioConvidante = input.IdUsuarioConvidante,
            Email = input.Email ?? "geral",
            CodigoConvite = code,
            Status = StatusConvite.Pendente,
            ExpiraEm = DateTimeOffset.UtcNow.AddDays(7)
        };

        _db.ConvitesGrupo.Add(convite);
        _db.SaveChanges();

        return Ok(new {
            id = convite.Id,
            codigo = convite.CodigoConvite,
            email = convite.Email,
            expiraEm = convite.ExpiraEm
        });
    }

    // ─── AUXILIARES ─────────────────────────────────────────────────────────

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
