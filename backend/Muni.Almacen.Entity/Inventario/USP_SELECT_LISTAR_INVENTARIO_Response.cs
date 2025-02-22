using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Entity.Inventario
{
    public class USP_SELECT_LISTAR_INVENTARIO_Response
    {
        public long idProducto { get; set; }
        public string nombre { get; set; }
        public string material { get; set; }
        public string color { get; set; }
        public string talla { get; set; }
        public string tipo { get; set; }
        public string medidas { get; set; }
        public string marca { get; set; }
        public int idUnidadMedida { get; set; }
        public string nombreUnidadMedida { get; set; }
        public int cantidad { get; set; }
        public int estadoStock { get; set; }
        public DateTime? fechaVencimiento { get; set; }
        public int estado { get; set; }
    }
}
