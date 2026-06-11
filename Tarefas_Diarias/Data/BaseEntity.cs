using System.ComponentModel.DataAnnotations;

namespace TarefaExpress.Data;

/// <summary>
/// Classe base para todas as entidades do sistema.
/// Fornece o campo Id comum (chave primária GUID).
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Identificador único da entidade (chave primária).
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();
}
