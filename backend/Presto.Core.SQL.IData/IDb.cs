using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Presto.Core.SQL.IData
{
    public interface IDb : IDisposable
    {
        void Connect();

        IDbConnection Connection { get; }

        string ConnectionString { get; }

        string ProviderName { get; }
    }
}
