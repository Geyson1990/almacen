using Presto.Core.SQL.IData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace Presto.Core.SQL.Data
{
    public class Db : IDb, IDisposable
    {
        private readonly string _connectionString;
        private Lazy<IDbConnection> _connection;
        private readonly DbProviderFactory _connectionFactory;
        private readonly IDbConnection _externalConnection;
        private bool _disposed;
        private string options;

        internal DbConfig Config { get; }

        public Db(IDbConnection connection)
        {
            this._externalConnection = connection;
            this._disposed = false;
            this.Config = DbConfig.Default;
        }

        public Db(IDbConnection connection, DbConfig config)
        {
            this._externalConnection = connection;
            this.Config = config ?? DbConfig.Default;
            this._disposed = false;
        }

        internal Db(string connectionString, DbConfig config, DbProviderFactory connectionFactory)
        {
            this._connectionString = connectionString;
            this._connectionFactory = connectionFactory;
            this._connection = new Lazy<IDbConnection>(new Func<IDbConnection>(this.CreateConnection));
            this.Config = config;
        }

        public void Connect()
        {
            IDbConnection dbConnection = this._externalConnection ?? this._connection.Value;
            if (dbConnection.State == ConnectionState.Open)
                return;
            dbConnection.Open();
        }

        public IDbConnection Connection
        {
            get
            {
                this.Connect();
                return this._externalConnection ?? this._connection.Value;
            }
        }

        public string ConnectionString => this._connectionString;

        public string ProviderName => this.Config.ProviderName;

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize((object)this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this._disposed & disposing)
            {
                if (this._externalConnection != null && this._externalConnection.State == ConnectionState.Open)
                    this._externalConnection.Close();
                if (this._connection != null)
                {
                    this._connection.Value.Close();
                    this._connection = (Lazy<IDbConnection>)null;
                }
            }
            this._disposed = true;
        }

        private IDbConnection CreateConnection() => this._connectionFactory.CreateConnection(this._connectionString);
    }
}
