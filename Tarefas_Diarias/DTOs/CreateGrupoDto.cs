using TarefaExpress.Entities;

namespace TarefaExpress.DTOs;

// DTO para criação de um novo Grupo.
public class CreateGrupoDto
{
    public required string Nome { get; set; }
    public string? Descricao { get; set; }
    public TipoGrupo Tipo { get; set; }
    public Guid IdUsuarioCriador { get; set; }
}

