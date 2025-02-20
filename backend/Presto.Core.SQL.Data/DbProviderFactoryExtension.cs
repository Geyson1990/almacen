using System.Data;
using System.Data.Common;

namespace Presto.Core.SQL.Data
{
    internal static class DbProviderFactoryExtension
    {
        public static IDbConnection CreateConnection(
          this DbProviderFactory factory,
          string connectionString)
        {
            DbConnection connection = factory.CreateConnection();
            connection.ConnectionString = connectionString;
            return (IDbConnection)connection;
        }
    }
}
