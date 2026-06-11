using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um relatório de um grupo.
/// </summary>
public class Relatorio : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo ao qual o relatório pertence.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Identificador único do usuário que criou o relatório.
    /// </summary>
    public Guid IdUsuarioCriador { get; set; }

    /// <summary>
    /// Título do relatório.
    /// </summary>
    public string Titulo { get; set; } = string.Empty;

    /// <summary>
    /// Conteúdo do relatório.
    /// </summary>
    public string Conteudo { get; set; } = string.Empty;

    /// <summary>
    /// Data de referência do relatório (opcional).
    /// </summary>
    public DateTimeOffset? DataReferencia { get; set; }

    /// <summary>
    /// Status atual do relatório.
    /// </summary>
    public StatusRelatorio Status { get; set; } = StatusRelatorio.Rascunho;
}

/// <summary>
/// Enumeração dos status de um relatório.
/// </summary>
public enum StatusRelatorio
{
    /// <summary>
    /// Relatório em rascunho.
    /// </summary>
    Rascunho = 1,

    /// <summary>
    /// Relatório enviado para revisão.
    /// </summary>
    Enviado = 2,

    /// <summary>
    /// Relatório revisado.
    /// </summary>
    Revisado = 3,

    /// <summary>
    /// Relatório aprovado.
    /// </summary>
    Aprovado = 4,

    /// <summary>
    /// Relatório rejeitado.
    /// </summary>
    Rejeitado = 5
}

