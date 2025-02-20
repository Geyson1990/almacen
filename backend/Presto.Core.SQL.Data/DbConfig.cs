using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading;

namespace Presto.Core.SQL.Data
{
    public class DbConfig
    {
        public static readonly DbConfig Default = DbConfig.Create("System.Data.SqlClient");

        internal DbConfig(Action<IDbCommand> prepareCommand, string providerName)
        {
            this.PrepareCommand = prepareCommand;
            this.ProviderName = providerName;
        }

        public Action<IDbCommand> PrepareCommand { get; }

        public string ProviderName { get; }

        private static DbConfig Create(string providerName) => new DbConfig((Action<IDbCommand>)(c => { }), providerName);

        public void Attempts(Action operation, int attempt = 5)
        {
            int num1 = 0;
            int num2;
            while (true)
            {
                try
                {
                    operation();
                    num2 = 0;
                    break;
                }
                catch
                {
                    if (num1 == attempt)
                    {
                        num2 = 0;
                        throw;
                    }
                    else
                    {
                        ++num1;
                        Thread.Sleep(new TimeSpan(0, 0, 1));
                    }
                }
            }
        }
    }
}
