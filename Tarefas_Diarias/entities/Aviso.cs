using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um aviso ou anúncio em um grupo.
/// </summary>
public class Aviso : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo onde o aviso foi publicado.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Identificador único do usuário que criou o aviso.
    /// </summary>
    public Guid IdUsuarioCriador { get; set; }

    /// <summary>
    /// Título do aviso.
    /// </summary>
    public string Titulo { get; set; } = string.Empty;

    /// <summary>
    /// Conteúdo do aviso.
    /// </summary>
    public string Conteudo { get; set; } = string.Empty;

    /// <summary>
    /// Prioridade do aviso.
    /// </summary>
    public PrioridadeAviso Prioridade { get; set; } = PrioridadeAviso.Normal;

    /// <summary>
    /// Data e hora de publicação do aviso (opcional).
    /// </summary>
    public DateTimeOffset? PublicadoEm { get; set; }

    /// <summary>
    /// Data e hora de expiração do aviso (opcional).
    /// </summary>
    public DateTimeOffset? ExpiraEm { get; set; }
}

/// <summary>
/// Enumeração das prioridades de um aviso.
/// </summary>
public enum PrioridadeAviso
{
    /// <summary>
    /// Prioridade baixa.
    /// </summary>
    Baixa = 1,

    /// <summary>
    /// Prioridade normal.
    /// </summary>
    Normal = 2,

    /// <summary>
    /// Prioridade alta.
    /// </summary>
    Alta = 3
}

