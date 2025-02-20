using Microsoft.Data.SqlClient;
using Muni.Almacen.Data;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Repository
{
    public class GenericRepository(string connectionString)
    {
        private readonly string _connectionString = connectionString;

        public async Task<T> ExecuteProcedureToEntity<T>(string procedureName, List<SqlParameter> parameters) where T : new()
        {
            T entity = new T();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            entity = reader.MapToDomain<T>();
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

        public async Task<List<T>> ExecuteProcedureToList<T>(string procedureName, List<SqlParameter> parameters) where T : new()
        {
            List<T> list = new List<T>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());

                        using (SqlDataReader reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection))
                        {
                            list = reader.MapToListDomain<T>();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            return list;
        }

        public async Task<long> ExecuteProcedureToLongWithOutput(string procedureName, List<SqlParameter> parameters, string outputParameterName)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());

                        SqlParameter outputParam = new SqlParameter(outputParameterName, SqlDbType.BigInt)
                        {
                            Direction = ParameterDirection.Output
                        };
                        command.Parameters.Add(outputParam);

                        await command.ExecuteNonQueryAsync();
                        return Convert.ToInt64(outputParam.Value);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }
        }

        public async Task<int> ExecuteNonQueryProcedure(string procedureName, List<SqlParameter> parameters)
        {
            int rowsAffected = 0;
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());

                        rowsAffected = await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            return rowsAffected;
        }
    }
}
