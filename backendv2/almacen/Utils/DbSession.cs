using System.Data;
using System.Data.SqlClient;

namespace almacen.Utils
{
    public class DbSession : IDbSession
    {
        public IDbConnection Connection { get; }

        public DbSession(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new ArgumentException("La cadena de conexión no puede estar vacía.", nameof(connectionString));
            }

            try
            {
                Connection = new SqlConnection(connectionString);
                Connection.Open();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al abrir la conexión a la base de datos.", ex);
            }
        }

        public void Dispose()
        {
            if (Connection?.State != ConnectionState.Closed)
            {
                Connection?.Close();
                Connection?.Dispose();
            }
        }
    }

    public interface IDbSession : IDisposable
    {
        IDbConnection Connection { get; }
    }
}
