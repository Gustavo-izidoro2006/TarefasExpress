using Microsoft.AspNetCore.Mvc;
using TarefaExpress.DTOs;
using TarefaExpress.Services;

namespace TarefaExpress.Controllers;

// Controller REST para o recurso "Usuarios".
// Rota base: api/Usuarios
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _service;

    public UsuariosController(IUsuarioService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var u = _service.GetById(id);
        if (u == null) return NotFound();
        return Ok(u);
    }

    [HttpPost]
    public IActionResult Post(CreateUsuarioDto dto)
    {
        var created = _service.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Put(Guid id, CreateUsuarioDto dto)
    {
        var ok = _service.Update(id, dto);
        if (!ok) return NotFound();
        var updated = _service.GetById(id);
        return Ok(updated);
    }

    [HttpPatch("{id}")]
    public IActionResult Patch(Guid id, PatchUsuarioDto dto)
    {
        var ok = _service.UpdatePartial(id, dto);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var ok = _service.Delete(id);
        if (!ok) return NotFound();
        return NoContent();
    }
}

