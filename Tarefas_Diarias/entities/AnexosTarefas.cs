using TarefaExpress.Data;

namespace TarefaExpress.Entities;

/// <summary>
/// Entidade que representa um anexo associado a uma tarefa.
/// </summary>
public class AnexoTarefa : BaseEntity
{
    /// <summary>
    /// Identificador único da tarefa à qual o anexo está associado.
    /// </summary>
    public Guid IdTarefa { get; set; }

    /// <summary>
    /// Identificador único do usuário que fez o upload do anexo.
    /// </summary>
    public Guid IdUsuarioUpload { get; set; }

    /// <summary>
    /// Nome do arquivo do anexo.
    /// </summary>
    public string NomeArquivo { get; set; } = string.Empty;

    /// <summary>
    /// URL do arquivo do anexo.
    /// </summary>
    public string UrlArquivo { get; set; } = string.Empty;

    /// <summary>
    /// Tipo de conteúdo do arquivo (MIME type).
    /// </summary>
    public string TipoConteudo { get; set; } = string.Empty;

    /// <summary>
    /// Tamanho do arquivo em bytes.
    /// </summary>
    public long TamanhoBytes { get; set; }
}

