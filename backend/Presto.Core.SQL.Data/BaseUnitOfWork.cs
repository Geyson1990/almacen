using Presto.Core.SQL.IData;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Presto.Core.SQL.Data
{
    public class BaseUnitOfWork : IBaseUnitOfWork, IDisposable
    {
        private IDb _db;
        private bool _disposed;
        private DbTransaction _transaction;
        private readonly string _connectionString;

        public BaseUnitOfWork(string connectionString)
        {
            this._connectionString = connectionString;
        }

        public bool ClearInjection { get; set; }

        public void BeginTransaction(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
        {
            SqlConnection sqlConnection = new SqlConnection(this._connectionString);
            if (((DbConnection)sqlConnection).State != ConnectionState.Open)
                ((DbConnection)sqlConnection).Open();
            this._transaction = (DbTransaction)sqlConnection.BeginTransaction(isolationLevel);
        }

        public void BulkCopy<T>(
          IEnumerable<T> items,
          string destinationTableName,
          string[] excludeColumnMappings = null,
          int bulkCopyTimeout = 30)
          where T : class
        {
            string name = typeof(T).Name;
            IList<T> objList = (IList<T>)items;
            DataTable dataTable = this.ToDataTable<T>((IEnumerable<T>)objList);
            using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy((SqlConnection)this._db.Connection))
            {
                sqlBulkCopy.BulkCopyTimeout = bulkCopyTimeout;
                try
                {
                    foreach (DataColumn column in (InternalDataCollectionBase)dataTable.Columns)
                    {
                        DataColumn item = column;
                        if (excludeColumnMappings != null && ((IEnumerable<string>)excludeColumnMappings).Any<string>())
                        {
                            if (((IEnumerable<string>)excludeColumnMappings).FirstOrDefault<string>((Func<string, bool>)(x => x.ToUpper() == item.ColumnName.ToUpper())) == null)
                                sqlBulkCopy.ColumnMappings.Add(item.ColumnName, item.ColumnName);
                        }
                        else
                            sqlBulkCopy.ColumnMappings.Add(item.ColumnName, item.ColumnName);
                    }
                    sqlBulkCopy.BatchSize = objList.Count;
                    sqlBulkCopy.DestinationTableName = destinationTableName;
                    sqlBulkCopy.WriteToServer(dataTable);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("Received an invalid column length from the bcp client for colid"))
                    {
                        string pattern = "\\d+";
                        int index = Convert.ToInt32(Regex.Match(ex.Message.ToString(), pattern).Value) - 1;
                        object obj1 = typeof(SqlBulkCopy).GetField("_sortedColumnMappings", BindingFlags.Instance | BindingFlags.NonPublic).GetValue((object)sqlBulkCopy);
                        object[] objArray = (object[])obj1.GetType().GetField("_items", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(obj1);
                        object obj2 = objArray[index].GetType().GetField("_metadata", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(objArray[index]);
                        throw new Exception(string.Format("Column: {0} contains data with a length greater than: {1}", obj2.GetType().GetField("column", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public).GetValue(obj2), obj2.GetType().GetField("length", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public).GetValue(obj2)), ex);
                    }
                    throw ex;
                }
                finally
                {
                    sqlBulkCopy.Close();
                }
            }
        }

        public void BulkCopy(
          DataTable dt,
          string destinationTableName,
          string[] excludeColumnMappings = null,
          int bulkCopyTimeout = 30)
        {
            using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy((SqlConnection)this.Connection, (SqlBulkCopyOptions)19, (SqlTransaction)null))
            {
                sqlBulkCopy.DestinationTableName = destinationTableName;
                sqlBulkCopy.BulkCopyTimeout = bulkCopyTimeout;
                try
                {
                    foreach (DataColumn column in (InternalDataCollectionBase)dt.Columns)
                    {
                        DataColumn item = column;
                        if (excludeColumnMappings != null && ((IEnumerable<string>)excludeColumnMappings).Any<string>())
                        {
                            if (((IEnumerable<string>)excludeColumnMappings).FirstOrDefault<string>((Func<string, bool>)(x => x.ToUpper() == item.ColumnName.ToUpper())) == null)
                                sqlBulkCopy.ColumnMappings.Add(item.ColumnName, item.ColumnName);
                        }
                        else
                            sqlBulkCopy.ColumnMappings.Add(item.ColumnName, item.ColumnName);
                    }
                    sqlBulkCopy.BatchSize = dt.Rows.Count;
                    sqlBulkCopy.WriteToServer(dt);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("Received an invalid column length from the bcp client for colid"))
                    {
                        string pattern = "\\d+";
                        int index = Convert.ToInt32(Regex.Match(ex.Message.ToString(), pattern).Value) - 1;
                        object obj1 = typeof(SqlBulkCopy).GetField("_sortedColumnMappings", BindingFlags.Instance | BindingFlags.NonPublic).GetValue((object)sqlBulkCopy);
                        object[] objArray = (object[])obj1.GetType().GetField("_items", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(obj1);
                        object obj2 = objArray[index].GetType().GetField("_metadata", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(objArray[index]);
                        throw new Exception(string.Format("Column: {0} contains data with a length greater than: {1}", obj2.GetType().GetField("column", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public).GetValue(obj2), obj2.GetType().GetField("length", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public).GetValue(obj2)), ex);
                    }
                    throw ex;
                }
                finally
                {
                    sqlBulkCopy.Close();
                }
            }
        }

        public bool Commit()
        {
            if (this._transaction?.Connection == null)
                return false;
            this._transaction.Commit();
            return true;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this._disposed & disposing)
            {
                if (this._db != null)
                {
                    try
                    {
                        if (this._db.Connection.State == ConnectionState.Open)
                            this._db.Connection.Close();
                        if (this._transaction?.Connection != null)
                            this._transaction.Dispose();
                    }
                    catch (ObjectDisposedException ex)
                    {
                    }
                    this._db?.Dispose();
                    this._db = (IDb)null;
                }
            }
            this._disposed = true;
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize((object)this);
        }

        public void Rollback()
        {
            if (this._transaction.Connection == null)
                return;
            this._transaction.Rollback();
        }

        protected async Task<int> ExecuteNonQueryAsync(
          string sqlText,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            return await this.ExecuteNonQueryAsync(sqlText, CommandType.StoredProcedure, parameters, commandTimeout);
        }

        protected async Task<int> ExecuteNonQueryAsync(
          string sqlText,
          CommandType commandType,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            int num1 = 0;
            int num2;
            using (SqlConnection con = new SqlConnection(this._connectionString))
            {
                using (DbCommand command = (DbCommand)con.CreateCommand())
                {
                    command.Transaction = this._transaction;
                    if (this._transaction != null)
                    {
                        command.Connection = this._transaction.Connection;
                        command.Transaction = this._transaction;
                    }
                    if (command.Connection.State != ConnectionState.Open)
                        command.Connection.Open();
                    command.Parameters.Clear();
                    command.CommandText = sqlText;
                    command.CommandType = commandType;
                    command.CommandTimeout = commandTimeout ?? command.CommandTimeout;
                    if (parameters != null && parameters.Length != 0)
                    {
                        foreach (Parameter parameter1 in parameters)
                        {
                            IDbDataParameter parameter2 = (IDbDataParameter)command.CreateParameter();
                            parameter2.ParameterName = parameter1.Name;
                            parameter2.Value = this.CustomValue(parameter1.Value);
                            parameter2.Direction = parameter1.Direction;
                            parameter2.Size = parameter1.Size;
                            command.Parameters.Add((object)parameter2);
                        }
                    }
                    num1 = await command.ExecuteNonQueryAsync();
                    command.Parameters.Clear();
                }
                num2 = num1;
            }
            return num2;
        }

        protected async Task<IEnumerable<T>> ExecuteReaderAsync<T>(
          string sqlText,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            return await this.ExecuteReaderAsync<T>(sqlText, CommandType.StoredProcedure, parameters, commandTimeout);
        }

        protected async Task<IEnumerable<T>> ExecuteReaderAsync<T>(
          string sqlText,
          CommandType commandType,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            List<T> objList = new List<T>();
            using (SqlConnection con = new SqlConnection(this._connectionString))
            {
                using (DbCommand command = (DbCommand)con.CreateCommand())
                {
                    if (command.Connection.State != ConnectionState.Open)
                        command.Connection.Open();
                    command.Transaction = this._transaction;
                    command.Parameters.Clear();
                    command.CommandText = sqlText;
                    command.CommandType = commandType;
                    command.CommandTimeout = commandTimeout ?? command.CommandTimeout;
                    if (parameters != null && parameters.Length != 0)
                    {
                        foreach (Parameter parameter1 in parameters)
                        {
                            IDbDataParameter parameter2 = (IDbDataParameter)command.CreateParameter();
                            parameter2.ParameterName = parameter1.Name;
                            parameter2.Value = this.CustomValue(parameter1.Value);
                            parameter2.Direction = parameter1.Direction;
                            parameter2.Size = parameter1.Size;
                            command.Parameters.Add((object)parameter2);
                        }
                    }
                    using (IDataReader dataReader = (IDataReader)await command.ExecuteReaderAsync())
                    {
                        if (((DbDataReader)dataReader).HasRows)
                        {
                            int fieldCount = dataReader.FieldCount;
                            Dictionary<int, string> dictionary = new Dictionary<int, string>();
                            for (int index = 0; index < fieldCount; ++index)
                                dictionary.Add(index, dataReader.GetName(index));
                            object[] values = new object[fieldCount];
                            while (dataReader.Read())
                            {
                                dataReader.GetValues(values);
                                T instance = Activator.CreateInstance<T>();
                                foreach (PropertyInfo property in instance.GetType().GetTypeInfo().GetProperties())
                                {
                                    foreach (KeyValuePair<int, string> keyValuePair in dictionary)
                                    {
                                        if (!(property.Name.ToUpper() != keyValuePair.Value.ToUpper()))
                                        {
                                            object obj = values[keyValuePair.Key];
                                            if (obj.GetType() != typeof(DBNull))
                                                property.SetValue((object)instance, obj, (object[])null);
                                        }
                                    }
                                }
                                objList.Add(instance);
                            }
                        }
                    }
                    command.Parameters.Clear();
                }
            }
            IEnumerable<T> objs = (IEnumerable<T>)objList;
            objList = (List<T>)null;
            return objs;
        }

        protected DataTable ExecuteReader(
          string sqlText,
          CommandType commandType,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            DataTable dataTable = new DataTable();
            using (IDbCommand command = this._db.Connection.CreateCommand())
            {
                command.Transaction = (IDbTransaction)this._transaction;
                command.Parameters.Clear();
                command.CommandText = sqlText;
                command.CommandType = commandType;
                command.CommandTimeout = commandTimeout ?? command.CommandTimeout;
                if (parameters != null && parameters.Length != 0)
                {
                    foreach (Parameter parameter1 in parameters)
                    {
                        IDbDataParameter parameter2 = command.CreateParameter();
                        parameter2.ParameterName = parameter1.Name;
                        parameter2.Value = this.CustomValue(parameter1.Value);
                        parameter2.Direction = parameter1.Direction;
                        parameter2.Size = parameter1.Size;
                        command.Parameters.Add((object)parameter2);
                    }
                }
                using (IDataReader reader = command.ExecuteReader())
                    dataTable.Load(reader);
                parameters = this.OutParameters(command.Parameters, parameters);
                command.Parameters.Clear();
            }
            foreach (DataColumn column in (InternalDataCollectionBase)dataTable.Columns)
                column.ReadOnly = false;
            return dataTable;
        }

        protected async Task<T> ExecuteScalarAsync<T>(
          string sqlText,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            return await this.ExecuteScalarAsync<T>(sqlText, CommandType.StoredProcedure, parameters, commandTimeout);
        }

        protected async Task<T> ExecuteScalarAsync<T>(
          string sqlText,
          CommandType commandType,
          Parameter[] parameters,
          int? commandTimeout = null)
        {
            T obj1;
            using (SqlConnection sqlConnection = new SqlConnection(this._connectionString))
            {
                T obj2;
                using (DbCommand command = (DbCommand)sqlConnection.CreateCommand())
                {
                    if (this._transaction != null)
                    {
                        command.Connection = this._transaction.Connection;
                        command.Transaction = this._transaction;
                    }
                    if (command.Connection.State != ConnectionState.Open)
                        command.Connection.Open();
                    command.Transaction = this._transaction;
                    command.Parameters.Clear();
                    command.CommandText = sqlText;
                    command.CommandType = commandType;
                    command.CommandTimeout = commandTimeout ?? command.CommandTimeout;
                    if (parameters != null && parameters.Length != 0)
                    {
                        foreach (Parameter parameter1 in parameters)
                        {
                            IDbDataParameter parameter2 = (IDbDataParameter)command.CreateParameter();
                            parameter2.ParameterName = parameter1.Name;
                            parameter2.Value = this.CustomValue(parameter1.Value);
                            parameter2.Direction = parameter1.Direction;
                            parameter2.Size = parameter1.Size;
                            command.Parameters.Add((object)parameter2);
                        }
                    }
                    obj2 = (T)command.ExecuteScalar();
                    command.Parameters.Clear();
                }
                obj1 = obj2;
            }
            return obj1;
        }

        protected string ExecuteXmlReader(
          string sqlText,
          ref Parameter[] parameters,
          int? commandTimeout = null)
        {
            return this.ExecuteXmlReader(sqlText, CommandType.StoredProcedure, ref parameters, commandTimeout);
        }

        protected string ExecuteXmlReader(
          string sqlText,
          CommandType commandType,
          ref Parameter[] parameters,
          int? commandTimeout = null)
        {
            StringBuilder stringBuilder = new StringBuilder();
            using (IDbCommand command = this._db.Connection.CreateCommand())
            {
                command.Transaction = (IDbTransaction)this._transaction;
                command.Parameters.Clear();
                command.CommandText = sqlText;
                command.CommandType = commandType;
                command.CommandTimeout = commandTimeout ?? command.CommandTimeout;
                if (parameters != null && parameters.Length != 0)
                {
                    foreach (Parameter parameter1 in parameters)
                    {
                        IDbDataParameter parameter2 = command.CreateParameter();
                        parameter2.ParameterName = parameter1.Name;
                        parameter2.Value = this.CustomValue(parameter1.Value);
                        parameter2.Direction = parameter1.Direction;
                        parameter2.Size = parameter1.Size;
                        command.Parameters.Add((object)parameter2);
                    }
                }
                using (IDataReader dataReader = command.ExecuteReader())
                {
                    if (!((DbDataReader)dataReader).HasRows)
                    {
                        command.Parameters.Clear();
                        return (string)null;
                    }
                    while (dataReader.Read())
                    {
                        if (dataReader.GetValue(0).GetType() != typeof(DBNull))
                            stringBuilder.Append((string)dataReader.GetValue(0));
                    }
                }
                parameters = this.OutParameters(command.Parameters, parameters);
                command.Parameters.Clear();
            }
            return stringBuilder.ToString();
        }

        private DataTable ToDataTable<T>(IEnumerable<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);
            PropertyInfo[] array = ((IEnumerable<PropertyInfo>)typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public)).Where<PropertyInfo>((Func<PropertyInfo, bool>)(x =>
            {
                Type type = Nullable.GetUnderlyingType(x.PropertyType);
                if ((object)type == null)
                    type = x.PropertyType;
                return this.ValidateType(type);
            })).ToArray<PropertyInfo>();
            foreach (PropertyInfo propertyInfo in array)
            {
                dataTable.Columns.Add(propertyInfo.Name);
                DataColumn column = dataTable.Columns[propertyInfo.Name];
                Type type1 = Nullable.GetUnderlyingType(propertyInfo.PropertyType);
                if ((object)type1 == null)
                    type1 = propertyInfo.PropertyType;
                Type type2 = type1;
                column.DataType = type2;
            }
            foreach (T obj in items)
            {
                object[] objArray = new object[array.Length];
                for (int index = 0; index < array.Length; ++index)
                {
                    PropertyInfo propertyInfo = array[index];
                    objArray[index] = propertyInfo.GetValue((object)obj, (object[])null);
                }
                dataTable.Rows.Add(objArray);
            }
            return dataTable;
        }

        private bool ValidateType(Type type)
        {
            if (!type.IsEnum)
            {
                switch (Type.GetTypeCode(type))
                {
                    case TypeCode.DBNull:
                    case TypeCode.Boolean:
                    case TypeCode.Char:
                    case TypeCode.Byte:
                    case TypeCode.Int16:
                    case TypeCode.Int32:
                    case TypeCode.Int64:
                    case TypeCode.Double:
                    case TypeCode.Decimal:
                    case TypeCode.DateTime:
                    case TypeCode.String:
                        return true;
                }
            }
            return false;
        }

        private object CustomValue(object value)
        {
            if (value == null)
                return (object)DBNull.Value;
            return !this.ClearInjection || !(value is string) ? value : (object)this.MultipleReplace(value.ToString());
        }

        private string MultipleReplace(string text) => SQLOperators.Operators.Keys.Where<string>(new Func<string, bool>(text.Contains)).Aggregate<string, string>(text, (Func<string, string, string>)((current, textToReplace) => current.Replace(textToReplace, SQLOperators.Operators[textToReplace])));

        protected IDbTransaction Transaction => (IDbTransaction)this._transaction;

        protected IDbConnection Connection => this._db.Connection;

        private Parameter[] OutParameters(
          IDataParameterCollection cmdParameters,
          Parameter[] parameters)
        {
            if (parameters != null && parameters.Length != 0)
            {
                foreach (object cmdParameter in (IEnumerable)cmdParameters)
                {
                    IDataParameter pp = (IDataParameter)cmdParameter;
                    if (pp.Direction == ParameterDirection.InputOutput || pp.Direction == ParameterDirection.Output)
                        ((IEnumerable<Parameter>)parameters).First<Parameter>((Func<Parameter, bool>)(x => x.Name.ToUpper() == pp.ParameterName.ToUpper())).Value = pp.Value;
                }
            }
            return parameters;
        }
    }
}
