using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Presto.Core.SQL.IData
{
    public interface IContext
    {
        string UserData { get; set; }

        string UserName { get; set; }

        Guid InstanceId { get; }

        int? Timeout { get; set; }

        T Add<T>(T entity) where T : class;

        void Add<T>(IEnumerable<T> entities) where T : class;

        T Find<T>(params object[] keys) where T : class;

        T GetById<T>(long id) where T : class;

        T GetById<T>(int id) where T : class;

        T GetById<T>(string id) where T : class;

        T GetById<T>(Guid id) where T : class;

        IQueryable<T> Query<T>(bool asNoTracking = true) where T : class;

        void Remove<T>(T entity) where T : class;

        void Update<T>(T entity) where T : class;

        void Update<T>(T entity, params Expression<Func<T, object>>[] properties) where T : class;

        T GetSingle<T>(Expression<Func<T, bool>> predicate, bool asNoTracking = true) where T : class;

        T GetSingle<T>(
          Expression<Func<T, bool>> predicate,
          bool asNoTracking = true,
          params Expression<Func<T, object>>[] includeProperties)
          where T : class;

        IEnumerable<T> FindBy<T>(Expression<Func<T, bool>> predicate, bool asNoTracking = true) where T : class;

        IEnumerable<T> FindBy<T>(
          List<Expression<Func<T, bool>>> predicates,
          bool asNoTracking = true)
          where T : class;

        void DeleteWhere<T>(Expression<Func<T, bool>> predicate) where T : class;
    }
}
