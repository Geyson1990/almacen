using Muni.Almacen.Data;
using Muni.Almacen.IRepository;
using Microsoft.EntityFrameworkCore;
using Muni.Almacen.Entity.Autenticacion;
using Microsoft.Data.SqlClient;

namespace Muni.Almacen.Repository
{
    public class AutenticacionRepository(Minem_Db_Context Minem_Db_Context) : IAutenticacionRepository
    {
        private readonly Minem_Db_Context _minemDbContext = Minem_Db_Context;
        private readonly string _connection = Minem_Db_Context.Database.GetConnectionString() ?? string.Empty;

        public async Task<USP_SELECT_OBTENER_USUARIO_Response> AutenticarUsuario(USP_SELECT_OBTENER_USUARIO_Request request)
        {
            //var _db = new GenericRepository(_connection);
            var aliasParam = new SqlParameter("@Alias", request.alias);
            var contraseniaParam = new SqlParameter("@Contrasenia", request.contrasenia);


            return await _connection..ExecuteProcedureToEntity<USP_SELECT_OBTENER_USUARIO_Response>("USP_SELECT_OBTENER_USUARIO", param);
            //var result = await _minemDbContext.Set<USP_SELECT_OBTENER_USUARIO_Response>()
            //    .FromSqlRaw("EXEC USP_SELECT_OBTENER_USUARIO @Alias, @Contrasenia", aliasParam, contraseniaParam)
            //    .ToListAsync();

            //return result.FirstOrDefault();
        }


    }
}
