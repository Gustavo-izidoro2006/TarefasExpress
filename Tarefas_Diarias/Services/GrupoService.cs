using System.Collections.Generic;
using System.Linq;
using TarefaExpress.Data;
using TarefaExpress.DTOs;
using TarefaExpress.Entities;

namespace TarefaExpress.Services;

public class GrupoService : IGrupoService
{
    private readonly AppDbContext _db;

    public GrupoService(AppDbContext db)
    {
        _db = db;
    }

    private static GrupoDto ToDto(Grupo g) => new GrupoDto
    {
        Id = g.Id,
        Nome = g.Nome,
        Descricao = g.Descricao,
        Tipo = g.Tipo,
        IdUsuarioCriador = g.IdUsuarioCriador,
        EstaArquivado = g.EstaArquivado,
    };

    public IEnumerable<GrupoDto> GetAll()
    {
        return _db.Grupos
            .Where(g => !g.EstaArquivado)
            .Select(g => new GrupoDto
            {
                Id = g.Id,
                Nome = g.Nome,
                Descricao = g.Descricao,
                Tipo = g.Tipo,
                IdUsuarioCriador = g.IdUsuarioCriador,
                EstaArquivado = g.EstaArquivado,
            })
            .ToList();
    }

    public GrupoDto? GetById(Guid id)
    {
        var g = _db.Grupos.Find(id);
        return g == null ? null : ToDto(g);
    }

    public GrupoDto Create(CreateGrupoDto dto)
    {
        var novo = new Grupo
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            Tipo = dto.Tipo,
            IdUsuarioCriador = dto.IdUsuarioCriador,
            EstaArquivado = false,
        };
        _db.Grupos.Add(novo);
        _db.SaveChanges();

        // Adicionar o criador como membro inicial do grupo
        var membro = new MembroGrupo
        {
            IdGrupo = novo.Id,
            IdUsuario = dto.IdUsuarioCriador,
            IdCargo = Guid.Empty, // Administrador implícito
            Status = StatusMembro.Ativo,
            EntradaEm = DateTimeOffset.UtcNow
        };
        _db.MembrosGrupos.Add(membro);
        _db.SaveChanges();

        return ToDto(novo);
    }

    public bool Update(Guid id, CreateGrupoDto dto)
    {
        var g = _db.Grupos.Find(id);
        if (g == null) return false;
        g.Nome = dto.Nome;
        g.Descricao = dto.Descricao;
        g.Tipo = dto.Tipo;
        _db.SaveChanges();
        return true;
    }

    public bool UpdatePartial(Guid id, PatchGrupoDto dto)
    {
        var g = _db.Grupos.Find(id);
        if (g == null) return false;
        if (dto.Nome is not null) g.Nome = dto.Nome;
        if (dto.Descricao is not null) g.Descricao = dto.Descricao;
        if (dto.EstaArquivado is not null) g.EstaArquivado = dto.EstaArquivado.Value;
        _db.SaveChanges();
        return true;
    }

    public bool Delete(Guid id)
    {
        var g = _db.Grupos.Find(id);
        if (g == null) return false;
        _db.Grupos.Remove(g);
        _db.SaveChanges();
        return true;
    }
}
