using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa uma advertência emitida a um usuário em um grupo.
/// </summary>
public class Advertencia : BaseEntity
{
    /// <summary>
    /// Identificador único do grupo onde a advertência foi emitida.
    /// </summary>
    public Guid IdGrupo { get; set; }

    /// <summary>
    /// Identificador único do usuário que emitiu a advertência.
    /// </summary>
    public Guid IdUsuarioEmissor { get; set; }

    /// <summary>
    /// Identificador único do usuário alvo da advertência.
    /// </summary>
    public Guid IdUsuarioAlvo { get; set; }

    /// <summary>
    /// Motivo da advertência.
    /// </summary>
    public string Motivo { get; set; } = string.Empty;

    /// <summary>
    /// Nível de gravidade da advertência.
    /// </summary>
    public NivelAdvertencia Nivel { get; set; } = NivelAdvertencia.Médio;

    /// <summary>
    /// Data e hora em que a advertência foi emitida.
    /// </summary>
    public DateTimeOffset EmitidaEm { get; set; }

    /// <summary>
    /// Indica se a advertência foi resolvida.
    /// </summary>
    public bool EstaResolvida { get; set; }
}

/// <summary>
/// Enumeração dos níveis de gravidade de uma advertência.
/// </summary>
public enum NivelAdvertencia
{
    /// <summary>
    /// Nível baixo de gravidade.
    /// </summary>
    Baixo = 1,

    /// <summary>
    /// Nível médio de gravidade.
    /// </summary>
    Médio = 2,

    /// <summary>
    /// Nível alto de gravidade.
    /// </summary>
    Alto = 3,

    /// <summary>
    /// Nível crítico de gravidade.
    /// </summary>
    Crítico = 4
}

