namespace almacen.Utils
{
    public static partial class Message
    {
        public static StatusResponse<T> Exception<T>(Exception exception, string? mensaje = null)
        {
            if (!string.IsNullOrEmpty(mensaje))
                return new()
                {
                    Message = mensaje,
                    Success = false
                };
            else
                return new()
                {
                    Message = Constante.EX_GENERICA + "--" + exception,
                    Success = false
                };
        }

        public static StatusResponse<T> Successful<T>(T? response)
        {
            return new()
            {
                Message = Constante.RESPUESTA_EXITOSA,
                Success = true,
                Data = response
            };
        }

        public static StatusResponse<T> NoAuthorize<T>()
        {

            return new()
            {
                Message = Constante.EX_MENSAJE_NO_AUTORIZADO,
                Success = false
            };
        }

        public class StatusResponse<T>
        {
            public bool Success { get; set; }
            public string? Message { get; set; }
            public T Data { get; set; }
        }
    }
}
