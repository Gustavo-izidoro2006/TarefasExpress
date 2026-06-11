using TarefaExpress.Entities;

namespace TarefaExpress.DTOs;

// DTO para leitura de Usuario
public class UsuarioDto
{
    public Guid Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? UrlAvatar { get; set; }
    public string? NumeroTelefone { get; set; }
    public string? Biografia { get; set; }
    public StatusUsuario Status { get; set; }
    public DateTimeOffset? UltimoLoginEm { get; set; }
}
