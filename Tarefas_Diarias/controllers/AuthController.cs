using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TarefaExpress.Data;
using TarefaExpress.DTOs;
using TarefaExpress.Entities;

namespace TarefaExpress.Controllers;

public class LoginDto
{
    public required string Email { get; set; }
    public required string Senha { get; set; }
}

public class LoginResultDto
{
    public Guid Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? UrlAvatar { get; set; }
    public string? Biografia { get; set; }
    public StatusUsuario Status { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Realiza login verificando email e senha.
    /// Nota: Em produção use BCrypt/JWT. Aqui usamos comparação simples para dev.
    /// </summary>
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var user = _db.Usuarios
            .AsNoTracking()
            .FirstOrDefault(u => u.Email.ToLower() == dto.Email.ToLower());

        if (user == null)
            return Unauthorized(new { message = "Usuário não encontrado." });

        // Comparação direta de senha (sem hash). Em produção, use BCrypt.
        if (user.HashSenha != dto.Senha)
            return Unauthorized(new { message = "Senha incorreta." });

        if (user.Status == StatusUsuario.Suspenso)
            return Unauthorized(new { message = "Conta suspensa." });

        return Ok(new LoginResultDto
        {
            Id = user.Id,
            NomeCompleto = user.NomeCompleto,
            Email = user.Email,
            UrlAvatar = user.UrlAvatar,
            Biografia = user.Biografia,
            Status = user.Status,
        });
    }
}
