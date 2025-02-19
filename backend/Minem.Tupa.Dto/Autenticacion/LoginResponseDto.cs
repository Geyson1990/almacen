using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Dto.Autenticacion
{
    public class LoginResponseDto
    {
        public int CodMovUsuario { get; set; }
        public string CodMovTrabajador { get; set; }
        public string NombUsuario { get; set; }
        public string Contrasenia { get; set; }
        public System.DateTime FechIniVigencia { get; set; }
        public System.DateTime FechFinVigencia { get; set; }
        public Nullable<long> CodMovPersona { get; set; }
        public Nullable<bool> IndTrabajador { get; set; }
        public Nullable<bool> IndConfirmacion { get; set; }
        public string Descripcion { get; set; }
        public int RegUsuaRegistra { get; set; }
        public Nullable<System.DateTime> FechRegistra { get; set; }
        public Nullable<bool> Estado { get; set; }
        public string? AccessToken { get; set; }        
        public bool IndAccesoCasilla { get; set; }

        #region atributos de clases 
        //public List<SEMaeUsuarioRol> listaRoles { get; set; }
        //public GEMovPersona GEMovPersona { get; set; }
        //public GEMovTrabajador GEMovTrabajador { get; set; }
        //public GEMaeEmpresa GEMaeEmpresa { get; set; }
        //public GEMaeRepLegal GEMaeRepLegal { get; set; }
        #endregion
    }
}
