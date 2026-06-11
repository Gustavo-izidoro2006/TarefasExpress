using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa a associação de um usuário a um grupo (membro).
/// </summary>
public class MembroGrupo : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo do qual o usuário é membro.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Identificador único do usuário membro.
    /// </summary>
    public Guid IdUsuario { get; set; }

    /// <summary>
    /// Identificador único do cargo do membro no grupo.
    /// </summary>
    public Guid IdCargo { get; set; }

    /// <summary>
    /// Status atual da membresia.
    /// </summary>
    public StatusMembro Status { get; set; } = StatusMembro.Ativo;

    /// <summary>
    /// Data e hora de entrada no grupo.
    /// </summary>
    public DateTimeOffset EntradaEm { get; set; }

    /// <summary>
    /// Data e hora de saída do grupo (opcional).
    /// </summary>
    public DateTimeOffset? SaidaEm { get; set; }
}

/// <summary>
/// Enumeração dos status de um membro de grupo.
/// </summary>
public enum StatusMembro
{
    /// <summary>
    /// Membro ativo.
    /// </summary>
    Ativo = 1,

    /// <summary>
    /// Membro pendente.
    /// </summary>
    Pendente = 2,

    /// <summary>
    /// Membro bloqueado.
    /// </summary>
    Bloqueado = 3,

    /// <summary>
    /// Membro que saiu do grupo.
    /// </summary>
    Saiu = 4
}

