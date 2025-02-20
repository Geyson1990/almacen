using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presto.Core.General
{
    public class Paginado
    {
        public int? pageSize { get; set; }
        public int? totalCount { get; set; }
        public int? pageNum { get; set; }
    }
}
