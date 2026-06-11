using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TarefaExpress.Data;
using TarefaExpress.DTOs;
using TarefaExpress.Entities;

namespace TarefaExpress.Services;

public class CategoriaService : ICategoriaService
{
    private readonly AppDbContext _db;

    public CategoriaService(AppDbContext db)
    {
        _db = db;
    }

    private static CategoriaDto ToDto(Categoria c) => new CategoriaDto
    {
        Id = c.Id,
        Nome = c.Nome,
        Descricao = c.Descricao,
        Cor = c.Cor,
        Ativa = c.Ativa,
    };

    public IEnumerable<CategoriaDto> GetAll()
    {
        return _db.Categorias
            .AsNoTracking()
            .Select(c => new CategoriaDto
            {
                Id = c.Id,
                Nome = c.Nome,
                Descricao = c.Descricao,
                Cor = c.Cor,
                Ativa = c.Ativa,
            })
            .ToList();
    }

    public CategoriaDto? GetById(int id)
    {
        var c = _db.Categorias.AsNoTracking().FirstOrDefault(x => x.Id == id);
        return c == null ? null : ToDto(c);
    }

    public CategoriaDto Create(CreateCategoriaDto dto)
    {
        var novo = new Categoria
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            Cor = dto.Cor,
            Ativa = dto.Ativa,
        };
        _db.Categorias.Add(novo);
        _db.SaveChanges();
        return ToDto(novo);
    }

    public bool Update(int id, CreateCategoriaDto dto)
    {
        var c = _db.Categorias.Find(id);
        if (c == null) return false;
        c.Nome = dto.Nome;
        c.Descricao = dto.Descricao;
        c.Cor = dto.Cor;
        c.Ativa = dto.Ativa;
        _db.SaveChanges();
        return true;
    }

    public bool UpdatePartial(int id, PatchCategoriaDto dto)
    {
        var c = _db.Categorias.Find(id);
        if (c == null) return false;
        if (dto.Nome is not null) c.Nome = dto.Nome;
        _db.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var c = _db.Categorias.Find(id);
        if (c == null) return false;
        _db.Categorias.Remove(c);
        _db.SaveChanges();
        return true;
    }
}
