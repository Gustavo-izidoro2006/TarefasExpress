using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um comentário em uma tarefa.
/// </summary>
public class ComentarioTarefa : BaseEntity
{
    /// <summary>
    /// Identificador único da tarefa ao qual o comentário está associado.
    /// </summary>
    public Guid IdTarefa { get; set; }

    /// <summary>
    /// Identificador único do usuário que fez o comentário.
    /// </summary>
    public Guid IdUsuario { get; set; }

    /// <summary>
    /// Conteúdo do comentário.
    /// </summary>
    public string Conteudo { get; set; } = string.Empty;
}

