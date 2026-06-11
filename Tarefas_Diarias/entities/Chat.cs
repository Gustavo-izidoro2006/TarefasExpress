using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa uma sala de chat em um grupo.
/// </summary>
public class SalaChat : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo ao qual a sala pertence.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Nome da sala de chat.
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Tipo da sala de chat.
    /// </summary>
    public TipoSalaChat Tipo { get; set; } = TipoSalaChat.Grupo;
}

/// <summary>
/// Enumeração dos tipos de sala de chat.
/// </summary>
public enum TipoSalaChat
{
    /// <summary>
    /// Chat em grupo.
    /// </summary>
    Grupo = 1,

    /// <summary>
    /// Chat direto entre dois usuários.
    /// </summary>
    Direto = 2,

    /// <summary>
    /// Chat privado.
    /// </summary>
    Privado = 3
}

