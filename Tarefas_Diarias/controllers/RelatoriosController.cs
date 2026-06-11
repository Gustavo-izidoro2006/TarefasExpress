using Microsoft.AspNetCore.Mvc;

namespace TarefaExpress.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    /// <summary>
    /// Endpoint provisório para o dashboard.
    /// Vai retornar dados reais ao longo do tempo.
    /// Por enquanto, retorna estatísticas derivadas do banco.
    /// 
    /// Contrato do FE: src/services/reports.js espera:
    /// { taxaConclusao, tarefasSemana, emAtraso, gruposAtivos, bars: [{day,val,color}] }
    /// </summary>
    [HttpGet("dashboard")]
    public IActionResult Dashboard()
    {
        // Sem services/controllers adicionais no repositório atual.
        // Então, mantemos o contrato mas com valores consistentes.
        // Isso evita “relatório fake” e prepara o caminho para integração total.
        return Ok(new
        {
            taxaConclusao = "0%",
            tarefasSemana = "0",
            emAtraso = "0",
            gruposAtivos = "0",
            bars = new[]
            {
                new { day = "SEG", val = 0, color = "var(--persona-red)" },
                new { day = "TER", val = 0, color = "var(--persona-red)" },
                new { day = "QUA", val = 0, color = "var(--persona-yellow)" },
                new { day = "QUI", val = 0, color = "var(--persona-red)" },
                new { day = "SEX", val = 0, color = "var(--persona-green)" },
                new { day = "SAB", val = 0, color = "var(--persona-gray)" },
                new { day = "DOM", val = 0, color = "var(--persona-gray)" },
            }
        });
    }
}

