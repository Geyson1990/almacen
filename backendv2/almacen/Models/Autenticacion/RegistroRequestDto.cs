namespace almacen.Models.Autenticacion
{
    public class RegistroRequestDto
    {
        public string? apellidoPaterno { get; set; }
        public string? apellidoMaterno { get; set; }
        public string? nombres { get; set; }
        public string? numeroDocumento { get; set; }
        public string? contrasenia { get; set; }
        public string correoElectronico { get; set; }
    }
}
