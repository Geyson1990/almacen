namespace almacen.Models.Autenticacion
{
    public class LoginResponseDto
    {
        public string apellidoPaterno { get; set; }
        public string apellidoMaterno { get; set; }
        public string nombres { get; set; }
        public string numeroDocumento { get; set; }
        public string accessToken { get; set; }
    }
}
