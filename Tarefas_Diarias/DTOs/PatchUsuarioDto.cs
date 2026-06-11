namespace TarefaExpress.DTOs;

// DTO para atualização parcial de Usuario (PATCH).
// Propriedades opcionais (nullable); apenas enviadas são atualizadas.
public class PatchUsuarioDto
{
    public string? NomeCompleto { get; set; }
    public string? Email { get; set; }
    public string? NumeroTelefone { get; set; }
    public string? Biografia { get; set; }
}
