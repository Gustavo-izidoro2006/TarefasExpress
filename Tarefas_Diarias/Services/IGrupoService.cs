using System.Collections.Generic;
using TarefaExpress.DTOs;

namespace TarefaExpress.Services;

// Interface para o serviço de Grupos.
public interface IGrupoService
{
    IEnumerable<GrupoDto> GetAll();
    GrupoDto? GetById(Guid id);
    GrupoDto Create(CreateGrupoDto dto);
    bool Update(Guid id, CreateGrupoDto dto);
    bool UpdatePartial(Guid id, PatchGrupoDto dto);
    bool Delete(Guid id);
}

