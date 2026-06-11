using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa uma mensagem em uma sala de chat.
/// </summary>
public class MensagemChat : BaseEntity
{
    /// <summary>
    /// Identificador único da sala de chat onde a mensagem foi enviada.
    /// </summary>
    public Guid IdSalaChat { get; set; }

    /// <summary>
    /// Identificador único do usuário remetente da mensagem.
    /// </summary>
    public Guid IdUsuarioRemetente { get; set; }

    /// <summary>
    /// Conteúdo da mensagem.
    /// </summary>
    public string Conteudo { get; set; } = string.Empty;

    /// <summary>
    /// Data e hora de envio da mensagem.
    /// </summary>
    public DateTimeOffset EnviadaEm { get; set; }

    /// <summary>
    /// Data e hora de edição da mensagem (opcional).
    /// </summary>
    public DateTimeOffset? EditadaEm { get; set; }

    /// <summary>
    /// Data e hora de exclusão da mensagem (opcional).
    /// </summary>
    public DateTimeOffset? ExcluidaEm { get; set; }

    /// <summary>
    /// Identificador da mensagem à qual esta é uma resposta (opcional).
    /// </summary>
    public Guid? RespostaParaIdMensagem { get; set; }
}

