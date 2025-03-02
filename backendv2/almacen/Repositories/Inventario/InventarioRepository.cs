using almacen.Models.Autenticacion;
using almacen.Models.Inventario;
using almacen.Utils;
using Dapper;
using static almacen.Utils.Message;

namespace almacen.Repositories.Inventario
{
    public class InventarioRepository(IDbSession conn) : IInventarioRepository
    {
        private readonly IDbSession _conn = conn;

        public async Task<StatusResponse<IEnumerable<ListarInventarioResponse>>> GetAll()
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT 
	                              CAST(ROW_NUMBER() OVER(ORDER BY a.ID_PRODUCTO DESC) as int) registro,
	                               a.[ID_PRODUCTO] idProducto
                                  ,a.[NOMBRE] nombre
                                  ,a.[MATERIAL] material
                                  ,a.[COLOR] color
                                  ,a.[TALLA] talla
                                  ,a.[TIPO] tipo
                                  ,a.[MEDIDAS] medidas
                                  ,a.[MARCA] marca
	                              ,a.[ID_UNIDAD_MEDIDA] idUnidadMedida
                                  ,b.[NOMBRE] nombreUnidadMedida
                                  ,a.[CANTIDAD] cantidad
                                  ,a.[ESTADO_STOCK] estadoStock
                                  ,a.[FECHA_VENCIMIENTO] fechaVencimiento
                                  ,a.[ESTADO] estado
                              FROM [dbo].[producto] a
                              INNER JOIN dbo.unidad_medida b ON a.ID_UNIDAD_MEDIDA = b.ID_UNIDAD_MEDIDA";

                var parameters = new DynamicParameters();
                //parameters.Add("@Alias", request.alias);
                //parameters.Add("@Contrasenia", request.contrasenia);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryAsync<ListarInventarioResponse>(sql, null) ?? throw new Exception("Usuario no válido");
           
                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<IEnumerable<ListarInventarioResponse>>(ex);
            }

        }
    }
}
