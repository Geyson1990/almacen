using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presto.Core.General
{
    public class DataTableParameter
    {
        public int draw { get; set; }
        public int length { get; set; }
        public int start { get; set; }
        public searchtxt search { get; set; }
        public List<object> columns { get;set; }
        public List<object> order { get; set; }
        public int? opcion { get; set; }
        public string cadena { get; set; }
    }

    public class searchtxt
    {
        public string value { get; set; }
    }

    public struct DataTableResponse<T>
    {
        public int draw;
        public int recordsTotal;
        public int recordsFiltered;
        public List<T> data;
    }
}
