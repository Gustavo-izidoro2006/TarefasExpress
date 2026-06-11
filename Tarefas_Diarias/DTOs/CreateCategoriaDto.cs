namespace TarefaExpress.DTOs;

// DTO para criação/atualização de uma Categoria.
public class CreateCategoriaDto
{
    public required string Nome { get; set; }
    public string? Descricao { get; set; }
    public string? Cor { get; set; }
    public bool Ativa { get; set; } = true;
}
