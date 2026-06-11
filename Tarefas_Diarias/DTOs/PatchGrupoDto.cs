using TarefaExpress.Entities;

namespace TarefaExpress.DTOs;

// DTO para atualização parcial de Grupo.
public class PatchGrupoDto
{
    public string? Nome { get; set; }
    public string? Descricao { get; set; }
    public TipoGrupo? Tipo { get; set; }
    public bool? EstaArquivado { get; set; }
}

