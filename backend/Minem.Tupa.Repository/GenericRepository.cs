using Microsoft.Data.SqlClient;
using Minem.Tupa.Data;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Repository
{
    public class GenericRepository
    {
        private readonly string _connectionString;

        public GenericRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<T> ExecuteProcedureToEntity<T>(string procedureName, List<OracleParameter> parameters) where T : new()
        {
            T entity = new T();

            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    try
                    {
                        await connection.OpenAsync();

                        using (OracleCommand command = connection.CreateCommand())
                        {
                            command.CommandText = procedureName;
                            command.CommandType = CommandType.StoredProcedure;

                            command.Parameters.AddRange(parameters.ToArray());

                            using (OracleDataReader reader = (OracleDataReader)await command.ExecuteReaderAsync())
                            {
                                entity = reader.MapToDomain<T>();
                            }
                        }
                    }
                    catch (Exception exCon)
                    {
                        throw new Exception("Error al ejecutar el procedimiento almacenado.", exCon);
                    }

                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            return entity;
        }


        public async Task<List<T>> ExecuteProcedureToList<T>(string procedureName, List<OracleParameter> parameters) where T : new()
        {
            List<T> list = new List<T>();

            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    try
                    {
                        await connection.OpenAsync();

                        using (OracleCommand command = connection.CreateCommand())
                        {
                            command.CommandText = procedureName;
                            command.CommandType = CommandType.StoredProcedure;
                            command.Parameters.AddRange(parameters.ToArray());

                            using (OracleDataReader reader = (OracleDataReader)await command.ExecuteReaderAsync(CommandBehavior.CloseConnection))
                            {
                                //list = new GenericInstance<T>().readDataReaderList(reader);// reader.MapToListDomain<T>();
                                list = reader.MapToListDomain<T>();
                                //while (await reader.ReadAsync())
                                //{
                                //    T obj = MapToObject<T>(reader);
                                //    list.Add(obj);
                                //}
                            }
                        }
                    }
                    catch (Exception exCon)
                    {
                        throw new Exception("Error al ejecutar el procedimiento almacenado.", exCon);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            return list;
        }


        private T MapToObject<T>(IDataReader dr) where T : new()
        {
            T obj = new T();
            var props = typeof(T).GetProperties();

            foreach (var prop in props)
            {
                if (this.ColumnExists(dr, prop.Name))
                {
                    if (!dr.IsDBNull(dr.GetOrdinal(prop.Name)))
                    {
                        object value = dr[prop.Name];
                        prop.SetValue(obj, value is DBNull ? null : value);
                    }
                }
            }

            return obj;
        }

        public bool ColumnExists(IDataReader oIDataReader, string sColumnName)
        {
            for (int i = 0; i < oIDataReader.FieldCount; i++)
            {
                if (oIDataReader.GetName(i).Equals(sColumnName))
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<long> ExecuteProcedureToLongWithOutput(string procedureName, List<OracleParameter> parameters, string outputParameterName)
        {
            //long result = 0;

            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    try
                    {
                        await connection.OpenAsync();

                        using (OracleCommand command = connection.CreateCommand())
                        {
                            command.CommandText = procedureName;
                            command.CommandType = CommandType.StoredProcedure;
                            command.Parameters.AddRange(parameters.ToArray());

                            command.Parameters.Add(new OracleParameter(outputParameterName, OracleDbType.Int64)
                            {
                                Direction = ParameterDirection.Output
                            });

                            await command.ExecuteNonQueryAsync();
                            long entero;
                            long.TryParse(command.Parameters[outputParameterName].Value.ToString(), out entero);

                            return entero;
                        }
                    }
                    catch (Exception exCon)
                    {
                        throw new Exception("Error al ejecutar el procedimiento almacenado.", exCon);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al ejecutar el procedimiento almacenado.", ex);
            }

            //return result;
        }

        public async Task<int> ExecuteNonQueryProcedure(string procedureName, List<OracleParameter> parameters)
        {
            int rowsAffected = 0;
            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    try
                    {
                        await connection.OpenAsync();

                        using (OracleCommand command = connection.CreateCommand())
                        {
                            command.CommandText = procedureName;
                            command.CommandType = CommandType.StoredProcedure;
                            command.Parameters.AddRange(parameters.ToArray());

                            rowsAffected = await command.ExecuteNonQueryAsync();
                        }
                    }
                    catch (Exception exCon)
                    {
                        throw new Exception(exCon.Message, exCon);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }

            return rowsAffected;
        }
    }
}
