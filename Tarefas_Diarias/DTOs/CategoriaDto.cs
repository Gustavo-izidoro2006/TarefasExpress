namespace TarefaExpress.DTOs;

// DTO para leitura de uma Categoria.
public class CategoriaDto
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public string? Descricao { get; set; }
    public string? Cor { get; set; }
    public bool Ativa { get; set; } = true;
}
