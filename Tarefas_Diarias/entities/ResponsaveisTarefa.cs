using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um responsável atribuído a uma tarefa.
/// </summary>
public class ResponsavelTarefa : BaseEntity
{
    /// <summary>
    /// Identificador único da tarefa à qual o responsável está atribuído.
    /// </summary>
    public Guid IdTarefa { get; set; }

    /// <summary>
    /// Identificador único do usuário responsável.
    /// </summary>
    public Guid IdUsuario { get; set; }

    /// <summary>
    /// Indica se este é o responsável principal da tarefa.
    /// </summary>
    public bool EhPrincipal { get; set; }
}

