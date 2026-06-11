using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um cargo ou papel dentro de um grupo.
/// </summary>
public class Cargo : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo ao qual o cargo pertence.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Nome do cargo (ex: ADM, Gerente, Aluno, etc.).
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Descrição do cargo (opcional).
    /// </summary>
    public string? Descricao { get; set; }

    /// <summary>
    /// Ordem de exibição do cargo.
    /// </summary>
    public int OrdemExibicao { get; set; }

    /// <summary>
    /// Permite gerenciar membros do grupo.
    /// </summary>
    public bool PodeGerenciarMembros { get; set; }

    /// <summary>
    /// Permite gerenciar tarefas do grupo.
    /// </summary>
    public bool PodeGerenciarTarefas { get; set; }

    /// <summary>
    /// Permite gerenciar chats do grupo.
    /// </summary>
    public bool PodeGerenciarChat { get; set; }

    /// <summary>
    /// Permite gerenciar avisos do grupo.
    /// </summary>
    public bool PodeGerenciarAvisos { get; set; }
}

