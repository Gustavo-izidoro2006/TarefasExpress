using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TarefaExpress.Data;
using TarefaExpress.DTOs;
using TarefaExpress.Entities;

namespace TarefaExpress.Services;

// Implementação do serviço de Usuários.
public class UsuarioService : IUsuarioService
{
    private readonly AppDbContext _db;

    public UsuarioService(AppDbContext db)
    {
        _db = db;
    }

    public IEnumerable<UsuarioDto> GetAll()
    {
        return _db.Usuarios
            .AsNoTracking()
            .Select(u => new UsuarioDto 
            {
                Id = u.Id,
                NomeCompleto = u.NomeCompleto,
                Email = u.Email,
                UrlAvatar = u.UrlAvatar,
                NumeroTelefone = u.NumeroTelefone,
                Biografia = u.Biografia,
                Status = u.Status,
                UltimoLoginEm = u.UltimoLoginEm
            })
            .ToList();
    }

    public UsuarioDto? GetById(Guid id)
    {
        var u = _db.Usuarios.AsNoTracking().FirstOrDefault(x => x.Id == id);
        if (u == null) return null;
        return new UsuarioDto 
        {
            Id = u.Id,
            NomeCompleto = u.NomeCompleto,
            Email = u.Email,
            UrlAvatar = u.UrlAvatar,
            NumeroTelefone = u.NumeroTelefone,
            Biografia = u.Biografia,
            Status = u.Status,
            UltimoLoginEm = u.UltimoLoginEm
        };
    }

    public UsuarioDto Create(CreateUsuarioDto dto)
    {
        var novo = new Usuario 
        {
            NomeCompleto = dto.NomeCompleto,
            Email = dto.Email,
            HashSenha = dto.Senha // Nota: Em produção, use BCrypt ou Argon2 para hash
        };
        _db.Usuarios.Add(novo);
        _db.SaveChanges();
        return new UsuarioDto 
        {
            Id = novo.Id,
            NomeCompleto = novo.NomeCompleto,
            Email = novo.Email,
            // outros campos...
            Status = novo.Status,
            UltimoLoginEm = novo.UltimoLoginEm
        };
    }

    public bool Update(Guid id, CreateUsuarioDto dto)
    {
        var u = _db.Usuarios.Find(id);
        if (u == null) return false;
        u.NomeCompleto = dto.NomeCompleto;
        u.Email = dto.Email;
        if (!string.IsNullOrEmpty(dto.Senha)) u.HashSenha = dto.Senha;
        _db.SaveChanges();
        return true;
    }

    public bool UpdatePartial(Guid id, PatchUsuarioDto dto)
    {
        var u = _db.Usuarios.Find(id);
        if (u == null) return false;
        if (dto.NomeCompleto != null) u.NomeCompleto = dto.NomeCompleto;
        if (dto.Email != null) u.Email = dto.Email;
        if (dto.NumeroTelefone != null) u.NumeroTelefone = dto.NumeroTelefone;
        if (dto.Biografia != null) u.Biografia = dto.Biografia;
        _db.SaveChanges();
        return true;
    }

    public bool Delete(Guid id)
    {
        var u = _db.Usuarios.Find(id);
        if (u == null) return false;
        _db.Usuarios.Remove(u);
        _db.SaveChanges();
        return true;
    }
}

