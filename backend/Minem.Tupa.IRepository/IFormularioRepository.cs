﻿using Minem.Tupa.Entity;
using Minem.Tupa.Entity.Formulario;

namespace Minem.Tupa.IRepository
{
    public interface IFormularioRepository
    {
        Task<long> GuardarFormulario(long p_CodMaeSolicitud, string p_DataJson);
        Task<USP_S_OBTENER_FORMULARIO_DIA_Response_Entity> ObtenerFormularioDia(long codMaeSolicitud);
    }
}
