using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Presto.Core.SQL.IData
{
    public interface IBaseUnitOfWork
    {
        void BulkCopy<T>(
          IEnumerable<T> items,
          string destinationTableName,
          string[] excludeColumnMappings = null,
          int bulkCopyTimeout = 30)
          where T : class;

        void BulkCopy(
          DataTable dt,
          string destinationTableName,
          string[] excludeColumnMappings = null,
          int bulkCopyTimeout = 30);

        void BeginTransaction(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);

        bool Commit();

        void Rollback();
    }
}
