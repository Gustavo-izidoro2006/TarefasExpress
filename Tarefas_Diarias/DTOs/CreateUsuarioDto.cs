namespace TarefaExpress.DTOs;

// DTO para criação de um novo Usuario (POST).
// Não inclui Id (gerado automaticamente) ou HashSenha (gerado pelo serviço).
public class CreateUsuarioDto
{
    public required string NomeCompleto { get; set; }
    public required string Email { get; set; }
    public string Senha { get; set; } = string.Empty;
    public string? NumeroTelefone { get; set; }
    public string? Biografia { get; set; }
}
