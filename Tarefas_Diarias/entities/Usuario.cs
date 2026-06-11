using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um usuário do sistema.
/// </summary>
public class Usuario : BaseEntity
{
    /// <summary>
    /// Nome completo do usuário.
    /// </summary>
    public string NomeCompleto { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Hash da senha do usuário.
    /// </summary>
    public string HashSenha { get; set; } = string.Empty;

    /// <summary>
    /// URL da foto de perfil do usuário (opcional).
    /// </summary>
    public string? UrlAvatar { get; set; }

    /// <summary>
    /// Número de telefone do usuário (opcional).
    /// </summary>
    public string? NumeroTelefone { get; set; }

    /// <summary>
    /// Biografia do usuário (opcional).
    /// </summary>
    public string? Biografia { get; set; }

    /// <summary>
    /// Status atual do usuário.
    /// </summary>
    public StatusUsuario Status { get; set; } = StatusUsuario.Ativo;

    /// <summary>
    /// Data e hora do último login (opcional).
    /// </summary>
    public DateTimeOffset? UltimoLoginEm { get; set; }
}

/// <summary>
/// Enumeração dos status de um usuário.
/// </summary>
public enum StatusUsuario
{
    /// <summary>
    /// Usuário ativo.
    /// </summary>
    Ativo = 1,

    /// <summary>
    /// Usuário suspenso.
    /// </summary>
    Suspenso = 2,

    /// <summary>
    /// Usuário deletado.
    /// </summary>
    Deletado = 3
}

