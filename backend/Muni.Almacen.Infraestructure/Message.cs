using Muni.Almacen.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Infraestructure
{
    public static partial class Message
    {
        public static StatusResponse<T> Exception<T>(Exception exception, string? mensaje = null)
        {
            if (!string.IsNullOrEmpty(mensaje))
                return new StatusResponse<T>()
                {
                    Message = mensaje,
                    Success = false
                };
            else
                return new StatusResponse<T>()
                {
                    Message = Constante.EX_GENERICA + "--"+exception,
                    Success = false,
                    //Message = exception.Message
                };
        }

        public static StatusResponse<T> Successful<T>(T response)
        {
            return new StatusResponse<T>()
            {
                Message = Constante.RESPUESTA_EXITOSA,
                Success = true,
                Data = response,
            };
        }

        public static StatusResponse<T> NoAuthorize<T>()
        {

            return new StatusResponse<T>()
            {
                Message = Constante.EX_MENSAJE_NO_AUTORIZADO,
                Success = false
            };
        }
    }
}
