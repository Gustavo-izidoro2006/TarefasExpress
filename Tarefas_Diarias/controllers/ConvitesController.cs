using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TarefaExpress.Data;
using TarefaExpress.Entities;

namespace TarefaExpress.Controllers;

public class AceitarConviteDto
{
    public required string Codigo { get; set; }
    public Guid IdUsuario { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class ConvitesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ConvitesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("aceitar")]
    public IActionResult Aceitar([FromBody] AceitarConviteDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Codigo))
            return BadRequest(new { message = "Código de convite inválido." });

        // Encontrar convite pendente com o código correspondente
        var invite = _db.ConvitesGrupo
            .FirstOrDefault(c => c.CodigoConvite.ToUpper() == dto.Codigo.Trim().ToUpper() && c.Status == StatusConvite.Pendente);

        if (invite == null)
            return NotFound(new { message = "Convite não encontrado, já utilizado ou expirado." });

        if (invite.ExpiraEm < DateTimeOffset.UtcNow)
        {
            invite.Status = StatusConvite.Expirado;
            _db.SaveChanges();
            return BadRequest(new { message = "Este convite expirou." });
        }

        // Verificar se usuário existe
        var userExists = _db.Usuarios.Any(u => u.Id == dto.IdUsuario);
        if (!userExists)
            return BadRequest(new { message = "Usuário não encontrado." });

        // Verificar se já é membro do grupo
        var jaMembro = _db.MembrosGrupos
            .Any(m => m.IdGrupo == invite.IdGrupo && m.IdUsuario == dto.IdUsuario && m.Status == StatusMembro.Ativo);

        if (!jaMembro)
        {
            // Criar registro de membro
            var membro = new MembroGrupo
            {
                IdGrupo = invite.IdGrupo,
                IdUsuario = dto.IdUsuario,
                IdCargo = Guid.Empty, // Administrador implícito ou membro comum
                Status = StatusMembro.Ativo,
                EntradaEm = DateTimeOffset.UtcNow
            };
            _db.MembrosGrupos.Add(membro);
        }

        // Atualizar convite
        invite.Status = StatusConvite.Aceito;
        invite.IdUsuarioConvidado = dto.IdUsuario;
        invite.AceitoEm = DateTimeOffset.UtcNow;

        _db.SaveChanges();

        return Ok(new { message = "Você entrou no grupo com sucesso!", grupoId = invite.IdGrupo });
    }
}
