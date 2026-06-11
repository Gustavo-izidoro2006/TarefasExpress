using TarefaExpress.Entities;

namespace TarefaExpress.DTOs;

// DTO para leitura de Grupo
public class GrupoDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public TipoGrupo Tipo { get; set; }
    public Guid IdUsuarioCriador { get; set; }
    public bool EstaArquivado { get; set; }
}

