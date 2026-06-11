using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um grupo de usuários.
/// </summary>
public class Grupo : BaseEntity
{
    /// <summary>
    /// Nome do grupo.
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Descrição do grupo (opcional).
    /// </summary>
    public string? Descricao { get; set; }

    /// <summary>
    /// Tipo do grupo.
    /// </summary>
    public TipoGrupo Tipo { get; set; }

    /// <summary>
    /// Identificador único do usuário que criou o grupo.
    /// </summary>
    public Guid IdUsuarioCriador { get; set; }

    /// <summary>
    /// Indica se o grupo está arquivado.
    /// </summary>
    public bool EstaArquivado { get; set; }
}

/// <summary>
/// Enumeração dos tipos de grupo.
/// </summary>
public enum TipoGrupo
{
    /// <summary>
    /// Grupo de empresa.
    /// </summary>
    Empresa = 1,

    /// <summary>
    /// Grupo escolar.
    /// </summary>
    Escola = 2,

    /// <summary>
    /// Grupo familiar.
    /// </summary>
    Casa = 3,

    /// <summary>
    /// Grupo personalizado.
    /// </summary>
    Personalizado = 4
}

