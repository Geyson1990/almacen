using Presto.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presto.Core.General
{
    public static partial class MessageResponse
    {
        public static StatusResponse<T> Exception<T>(Exception exception)
        {
            if (exception.GetType().IsAssignableFrom(typeof(Exception))
             || exception.GetType().IsAssignableFrom(typeof(ArgumentException)))
                return new StatusResponse<T>()
                {
                    Message = exception.Message,
                    Success = false,
                    Code = (int)StatusCode.NotFound
                };
            else
                return new StatusResponse<T>()
                {
                    Message = Constante.EX_GENERICA,
                    Success = false,
                    Code = (int)StatusCode.InternalServer
                };
        }

        public static StatusResponse<T> Successful<T>(T response, string mensaje = null)
        {
            return new StatusResponse<T>()
            {
                Message = mensaje ?? Constante.RESPUESTA_EXITOSA,
                Success = true,
                Code = (int)StatusCode.Successful,
                Data = response
            };
        }

        public static StatusResponse<T> NoAuthorize<T>()
        {

            return new StatusResponse<T>()
            {
                Message = Constante.EX_MENSAJE_NO_AUTORIZADO,
                Success = false,
                Code = (int)StatusCode.NotFound
            };
        }

        public static byte[] ToByteArray(this string value) => Convert.FromBase64String(value);
    }
}
