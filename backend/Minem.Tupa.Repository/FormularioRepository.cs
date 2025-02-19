using Minem.Tupa.Data;
using Minem.Tupa.IRepository;
using System.Data.Common;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Reflection;
using Oracle.ManagedDataAccess.Client;
using Minem.Tupa.Entity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Minem.Tupa.Entity.Formulario;

namespace Minem.Tupa.Repository
{
    public class FormularioRepository : IFormularioRepository
    {
        private readonly Minem_Db_Context _minemDbContext;
        private readonly string _connection;
        public FormularioRepository(Minem_Db_Context Minem_Db_Context)
        {
            _minemDbContext = Minem_Db_Context;
            _connection = Minem_Db_Context.Database.GetConnectionString();
        }

        public async Task<long> GuardarFormulario(long p_CodMaeSolicitud, string p_DataJson)
        {
            var _db = new GenericRepository(_connection);
            List<OracleParameter> param =
            [
                new OracleParameter("p_CodMaeSolicitud", OracleDbType.Int64, p_CodMaeSolicitud, ParameterDirection.Input),
                new OracleParameter("p_DataJson", OracleDbType.Clob, p_DataJson, ParameterDirection.Input)
            ];

            return await _db.ExecuteProcedureToLongWithOutput("PCK_ADMINISTRADO.USP_I_INSERTAR_FORMULARIO_DIA", param, "p_Resultado");
        }

        public async Task<USP_S_OBTENER_FORMULARIO_DIA_Response_Entity> ObtenerFormularioDia(long codMaeSolicitud)
        {
            var _db = new GenericRepository(_connection);
            List<OracleParameter> param =
            [
                new OracleParameter("p_CodMaeSolicitud", OracleDbType.Int64, codMaeSolicitud, ParameterDirection.Input),
                new OracleParameter("p_Resultado", OracleDbType.RefCursor,ParameterDirection.Output)
            ];

            return await _db.ExecuteProcedureToEntity<USP_S_OBTENER_FORMULARIO_DIA_Response_Entity>("PCK_ADMINISTRADO.USP_S_OBTENER_FORMULARIO_DIA", param);
        }

    }

    
}
