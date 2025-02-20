using System;
using System.Collections.Generic;
using System.Text;

namespace Presto.Core.SQL.Data
{
    public static class SQLOperators
    {
        public static Dictionary<string, string> Operators = new Dictionary<string, string>()
    {
      {
        "SELECT ",
        "--SELECT--"
      },
      {
        "WHERE ",
        "--WHERE--"
      },
      {
        "DROP ",
        "--DROP--"
      },
      {
        "EXECUTE ",
        "--EXECUTE--"
      },
      {
        "EXEC ",
        "--EXEC--"
      },
      {
        "dbo.",
        "--dbo.--"
      },
      {
        "sys.",
        "--sys.--"
      },
      {
        "DELETE ",
        "--DELETE--"
      },
      {
        "TRUNCATE ",
        "--TRUNCATE--"
      },
      {
        "FROM ",
        "--FROM--"
      },
      {
        "HAVING ",
        "--HAVING--"
      },
      {
        "INSERT ",
        "--INSERT--"
      },
      {
        "UPDATE ",
        "--UPDATE--"
      },
      {
        "CREATE ",
        "--CREATE--"
      },
      {
        "GRANT ",
        "--GRANT--"
      }
    };
    }
}
