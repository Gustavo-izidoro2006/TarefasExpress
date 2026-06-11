using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa uma sessão ativa de um usuário.
/// </summary>
public class SessaoUsuario : BaseEntity
{
    /// <summary>
    /// Identificador único do usuário associado à sessão.
    /// </summary>
    public Guid IdUsuario { get; set; }

    /// <summary>
    /// Hash do token de refresh da sessão.
    /// </summary>
    public string HashTokenRefresh { get; set; } = string.Empty;

    /// <summary>
    /// Informações do dispositivo utilizado (opcional).
    /// </summary>
    public string? InfoDispositivo { get; set; }

    /// <summary>
    /// Endereço IP do dispositivo (opcional).
    /// </summary>
    public string? EnderecoIp { get; set; }

    /// <summary>
    /// Data e hora de início da sessão.
    /// </summary>
    public DateTimeOffset IniciadaEm { get; set; }

    /// <summary>
    /// Data e hora da última atividade na sessão.
    /// </summary>
    public DateTimeOffset UltimaAtividadeEm { get; set; }

    /// <summary>
    /// Data e hora de término da sessão (opcional).
    /// </summary>
    public DateTimeOffset? TerminadaEm { get; set; }

    /// <summary>
    /// Indica se a sessão está ativa.
    /// </summary>
    public bool EstaAtiva { get; set; }
}

