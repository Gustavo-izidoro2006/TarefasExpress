using System.Collections.Generic;
using TarefaExpress.DTOs;

namespace TarefaExpress.Services;

// Interface para o serviço de Usuários.
public interface IUsuarioService
{
    IEnumerable<UsuarioDto> GetAll();
    UsuarioDto? GetById(Guid id);
    UsuarioDto Create(CreateUsuarioDto dto);
    bool Update(Guid id, CreateUsuarioDto dto);
    bool UpdatePartial(Guid id, PatchUsuarioDto dto);
    bool Delete(Guid id);
}
