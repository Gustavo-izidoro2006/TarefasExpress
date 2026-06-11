namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa uma categoria de tarefas.
/// </summary>
public class Categoria
{
    /// <summary>
    /// Identificador único da categoria (chave primária).
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Nome da categoria.
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Descrição opcional da categoria.
    /// </summary>
    public string? Descricao { get; set; }

    /// <summary>
    /// Cor associada à categoria (opcional).
    /// </summary>
    public string? Cor { get; set; }

    /// <summary>
    /// Indica se a categoria está ativa.
    /// </summary>
    public bool Ativa { get; set; } = true;
}
