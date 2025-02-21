using Muni.Almacen.Data;
using Muni.Almacen.IRepository;
using Microsoft.EntityFrameworkCore;
using Muni.Almacen.Entity.Autenticacion;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Reflection.Metadata;

namespace Muni.Almacen.Repository
{
    public class AutenticacionRepository(Minem_Db_Context Minem_Db_Context) : IAutenticacionRepository
    {
        private readonly Minem_Db_Context _minemDbContext = Minem_Db_Context;
        private readonly string _connection = Minem_Db_Context.Database.GetConnectionString() ?? string.Empty;

        public async Task<USP_SELECT_OBTENER_USUARIO_Response> AutenticarUsuario(USP_SELECT_OBTENER_USUARIO_Request request)
        {
            var _db = new GenericRepository(_connection);
            List<SqlParameter> param = 
                [
                    new SqlParameter("@Alias", SqlDbType.VarChar, 50) { Value = request.alias },
                    new SqlParameter("@Contrasenia", SqlDbType.VarChar, 50) { Value = request.contrasenia }
                ];

            return await _db.ExecuteProcedureToEntity<USP_SELECT_OBTENER_USUARIO_Response>("USP_SELECT_OBTENER_USUARIO", param);


        }


    }
}
