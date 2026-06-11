using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um convite para participar de um grupo.
/// </summary>
public class ConviteGrupo : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo para o qual o convite é destinado.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Identificador único do usuário que enviou o convite.
    /// </summary>
    public Guid IdUsuarioConvidante { get; set; }

    /// <summary>
    /// Identificador único do usuário convidado (opcional, preenchido após aceitação).
    /// </summary>
    public Guid? IdUsuarioConvidado { get; set; }

    /// <summary>
    /// Email do usuário convidado (usado quando não há ID conhecido).
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Código único do convite.
    /// </summary>
    public string CodigoConvite { get; set; } = string.Empty;

    /// <summary>
    /// Status atual do convite.
    /// </summary>
    public StatusConvite Status { get; set; } = StatusConvite.Pendente;

    /// <summary>
    /// Data e hora de expiração do convite.
    /// </summary>
    public DateTimeOffset ExpiraEm { get; set; }

    /// <summary>
    /// Data e hora de aceitação do convite (opcional).
    /// </summary>
    public DateTimeOffset? AceitoEm { get; set; }
}

/// <summary>
/// Enumeração dos status de um convite de grupo.
/// </summary>
public enum StatusConvite
{
    /// <summary>
    /// Convite pendente de resposta.
    /// </summary>
    Pendente = 1,

    /// <summary>
    /// Convite aceito.
    /// </summary>
    Aceito = 2,

    /// <summary>
    /// Convite rejeitado.
    /// </summary>
    Rejeitado = 3,

    /// <summary>
    /// Convite expirado.
    /// </summary>
    Expirado = 4
}

