using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um token para recuperação de senha.
/// </summary>
public class TokenRecuperacaoSenha : BaseEntity
{
    /// <summary>
    /// Identificador único do usuário associado ao token.
    /// </summary>
    public Guid IdUsuario { get; set; }

    /// <summary>
    /// Token único para recuperação de senha.
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Data e hora de expiração do token.
    /// </summary>
    public DateTimeOffset ExpiraEm { get; set; }

    /// <summary>
    /// Data e hora de uso do token (opcional).
    /// </summary>
    public DateTimeOffset? UsadoEm { get; set; }
}

