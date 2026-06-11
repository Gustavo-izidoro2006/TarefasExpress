using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um item de tarefa em um grupo.
/// </summary>
public class ItemTarefa : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo ao qual a tarefa pertence.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Identificador único do usuário que criou a tarefa.
    /// </summary>
    public Guid IdUsuarioCriador { get; set; }

    /// <summary>
    /// Título da tarefa.
    /// </summary>
    public string Titulo { get; set; } = string.Empty;

    /// <summary>
    /// Descrição da tarefa (opcional).
    /// </summary>
    public string? Descricao { get; set; }

    /// <summary>
    /// Status atual da tarefa.
    /// </summary>
    public StatusTarefa Status { get; set; } = StatusTarefa.Pendente;

    /// <summary>
    /// Prioridade da tarefa.
    /// </summary>
    public PrioridadeTarefa Prioridade { get; set; } = PrioridadeTarefa.Normal;

    /// <summary>
    /// Data e hora de vencimento da tarefa (opcional).
    /// </summary>
    public DateTimeOffset? VenceEm { get; set; }

    /// <summary>
    /// Data e hora de início da tarefa (opcional).
    /// </summary>
    public DateTimeOffset? IniciadaEm { get; set; }

    /// <summary>
    /// Data e hora de conclusão da tarefa (opcional).
    /// </summary>
    public DateTimeOffset? ConcluidaEm { get; set; }

    /// <summary>
    /// Identificador da tarefa pai (para subtarefas, opcional).
    /// </summary>
    public Guid? IdTarefaPai { get; set; }
}

/// <summary>
/// Enumeração dos status de uma tarefa.
/// </summary>
public enum StatusTarefa
{
    /// <summary>
    /// Tarefa pendente.
    /// </summary>
    Pendente = 1,

    /// <summary>
    /// Tarefa em progresso.
    /// </summary>
    EmProgresso = 2,

    /// <summary>
    /// Tarefa concluída.
    /// </summary>
    Concluida = 3,

    /// <summary>
    /// Tarefa cancelada.
    /// </summary>
    Cancelada = 4,

    /// <summary>
    /// Tarefa atrasada.
    /// </summary>
    Atrasada = 5
}

/// <summary>
/// Enumeração das prioridades de uma tarefa.
/// </summary>
public enum PrioridadeTarefa
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
    Alta = 3,

    /// <summary>
    /// Prioridade crítica.
    /// </summary>
    Critica = 4
}

