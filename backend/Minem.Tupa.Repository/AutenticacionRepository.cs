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
using Minem.Tupa.Entity.Tupa;

namespace Minem.Tupa.Repository
{
    public class AutenticacionRepository : IAutenticacionRepository
    {
        private readonly Minem_Db_Context _minemDbContext;
        private readonly string _connection;
        public AutenticacionRepository(Minem_Db_Context Minem_Db_Context)
        {
            _minemDbContext = Minem_Db_Context;
            _connection = Minem_Db_Context.Database.GetConnectionString();
        }
        public async Task<SEMovUsuario> AutenticarUsuario(USP_S_Persona_Buscar_DNI_Request_Entity request)
        {
            var entity = new SEMovUsuario();

            try
            {
                using (OracleConnection connection = new(_connection))
                {
                    await connection.OpenAsync();

                    using OracleCommand command = connection.CreateCommand();
                    command.CommandText = "pkgprueba2.mi_procedimiento";
                    command.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros
                    command.Parameters.Add("NomUsuario", OracleDbType.Varchar2).Value = request.Username;
                    command.Parameters.Add("Contrasenia", OracleDbType.Varchar2).Value = request.Password;
                    command.Parameters.Add("CodTabTipoPersona", OracleDbType.Varchar2).Value = request.TipoUsuario;
                    command.Parameters.Add("p_Result", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                    using (OracleDataReader reader = (OracleDataReader)await command.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            entity = reader.MapToDomain<SEMovUsuario>();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            return entity;
        }

        public async Task<SEMovUsuario> ObtenerTrabajadorPorUsuario(string? nombreUsuario)
        {
            var entity = new SEMovUsuario();

            try
            {
                using (OracleConnection connection = new(_connection))
                {
                    await connection.OpenAsync();

                    using OracleCommand command = connection.CreateCommand();
                    command.CommandText = "SEGURIDAD.USP_S_TrabajadorPorUsuario";
                    command.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros
                    command.Parameters.Add("NomUsuario", OracleDbType.Varchar2).Value = nombreUsuario;
                    command.Parameters.Add("p_Result", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                    using (OracleDataReader reader = (OracleDataReader)await command.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            entity = reader.MapToDomain<SEMovUsuario>();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            return entity;
        }

        public async Task<IEnumerable<SEMaeRol>> ListarPorUsuario(int codMovUsuario)
        {
            var entities = new List<SEMaeRol>();

            using (OracleConnection connection = new(_connection))
            {
                using var command = new OracleCommand();
                command.CommandText = "";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("PCodMovUsuario", OracleDbType.Int32).Value = codMovUsuario;
                command.Parameters.Add("p_Result", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                await connection.OpenAsync();

                using (OracleDataReader reader = (OracleDataReader)await command.ExecuteReaderAsync())
                {
                    while (reader.Read())
                    {
                        var entity = reader.MapToDomain<SEMaeRol>();
                        entities.Add(entity);
                    }
                }
            }
            return entities.AsEnumerable();
        }
    }

    
}
