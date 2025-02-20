using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Entity.Autenticacion
{
    public class USP_SELECT_OBTENER_USUARIO_Response
    {
        public string apellidoPaterno {  get; set; }
        public string apellidoMaterno { get; set; }
        public string nombres {  get; set; }
        public string numeroDocumento {  get; set; }
    }
}
