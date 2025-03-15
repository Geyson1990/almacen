using almacen.Models.Autenticacion;
using almacen.Models.Salida;
using almacen.Models.Inventario;
using almacen.Utils;
using Dapper;
using static almacen.Utils.Message;

namespace almacen.Repositories.Salida
{
    public class SalidaRepository(IDbSession conn) : ISalidaRepository
    {
        private readonly IDbSession _conn = conn;

        public async Task<StatusResponse<IEnumerable<ListarSalidaResponse>>> GetAll()
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT
                                    CAST(ROW_NUMBER() OVER(ORDER BY rs.ID_SALIDA DESC) as int) registro,
                                    rs.FECHA fecha, 
                                    rs.ID_SALIDA idSalida,
                                    p.ID_PRODUCTO idProducto,
                                    p.NOMBRE nombre, 
                                    p.MATERIAL material, 
                                    p.COLOR color, 
                                    p.TALLA talla, 
                                    p.TIPO tipo, 
                                    p.MEDIDAS medidas, 
                                    p.MARCA marca,
                                    p.ID_UNIDAD_MEDIDA idUnidadMedida,
                                    um.NOMBRE nombreUnidadMedida, 
                                    rs.CANTIDAD cantidad, 
                                    p.FECHA_VENCIMIENTO fechaVencimiento,
	                                a.ID idAreaSolicitante,
	                                a.NOMBRE areaSolicitante,
	                                rs.PERSONA_SOLICITANTE personaSolicitante
                                FROM dbo.registro_salida rs INNER JOIN
                                     dbo.producto p ON rs.ID_PRODUCTO = p.ID_PRODUCTO INNER JOIN
                                     dbo.unidad_medida um ON p.ID_UNIDAD_MEDIDA = um.ID_UNIDAD_MEDIDA INNER JOIN
	                                 dbo.area_solicitante a ON rs.ID_AREA_SOLICITANTE = a.ID
                                WHERE rs.ESTADO_REGISTRO = 1";

                var response = await _conn.Connection.QueryAsync<ListarSalidaResponse>(sql, null) ?? throw new Exception("Usuario no válido");
           
                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<IEnumerable<ListarSalidaResponse>>(ex);
            }

        }

        public async Task<StatusResponse<long>> GrabarSalida(GrabarSalidaRequest request)
        {
            try
            {
                string sql = string.Empty;
                var param = new DynamicParameters();
                if (request.idSalida == 0)
                {
                    sql += @"INSERT INTO [dbo].[registro_salida]
                                   ([FECHA]
                                   ,[ID_PRODUCTO]
                                   ,[CANTIDAD]
                                   ,[ID_AREA_SOLICITANTE]
                                   ,[PERSONA_SOLICITANTE]
                                   ,[ESTADO_REGISTRO])
                             OUTPUT INSERTED.ID_SALIDA
                             VALUES
                                   (GETDATE()
                                   ,@IdProducto
                                   ,@Cantidad
                                   ,@IdAreaSolicitante
                                   ,@PersonaSolicitante
                                   ,1)";
                }
                else
                {
                    sql += @"UPDATE [dbo].[registro_salida]
                               SET [CANTIDAD] = @Cantidad
                                  ,[ID_AREA_SOLICITANTE] = @IdAreaSolicitante
                                  ,[PERSONA_SOLICITANTE] = @PersonaSolicitante
                             WHERE [ID_SALIDA] = @Id";                    
                }

                param.Add("@Id", request.idSalida);
                param.Add("@IdProducto", request.idProducto);
                param.Add("@Cantidad", request.cantidad);
                param.Add("@IdAreaSolicitante", request.idAreaSolicitante);
                param.Add("@PersonaSolicitante", request.personaSolicitante);

                long response = await _conn.Connection.ExecuteScalarAsync<long>(sql, param);
                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<long>(ex);
            }
        }

        public async Task<StatusResponse<long>> InsertarStockInicial(GrabarStockInicialRequest request)
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"INSERT INTO [dbo].[registro_entrada]
                                   ([FECHA]
                                   ,[ID_PRODUCTO]
                                   ,[CANTIDAD])
                            OUTPUT INSERTED.ID_ENTRADA
                             VALUES
                                   (GETDATE()
                                   ,@ID_PRODUCTO
                                   ,@CANTIDAD)";

                var param = new DynamicParameters();
                param.Add("@ID_PRODUCTO", request.idProducto);
                param.Add("@CANTIDAD", request.cantidad);                

                long response = await _conn.Connection.ExecuteScalarAsync<long>(sql, param);
                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<long>(ex);
            }

        }

        public async Task<StatusResponse<ObtenerSalidaResponse>> ObtenerSalida(long idSalida)
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT        
	                                re.ID_SALIDA idSalida, 
	                                re.ID_PRODUCTO idProducto,
	                                re.CANTIDAD cantidad,
                                    re.ID_AREA_SOLICITANTE idAreaSolicitante,
                                    re.PERSONA_SOLICITANTE personaSolicitante
                                FROM dbo.registro_salida re INNER JOIN
                                dbo.producto p ON re.ID_PRODUCTO = p.ID_PRODUCTO INNER JOIN
                                dbo.unidad_medida um ON p.ID_UNIDAD_MEDIDA = um.ID_UNIDAD_MEDIDA
                                WHERE re.ID_SALIDA = @Id";

                var parameters = new DynamicParameters();
                parameters.Add("@Id", idSalida);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryFirstOrDefaultAsync<ObtenerSalidaResponse>(sql, parameters) ?? throw new Exception("Error al obtener información");
                return Successful(response);
            }
            catch (Exception ex)
            {
                return Exception<ObtenerSalidaResponse>(ex);
            }
        }

        public async Task<StatusResponse<long>> EliminarSalida(long id)
        {
            try
            {
                var param = new DynamicParameters();
                string sql = @"UPDATE [dbo].[registro_salida]
                               SET [ESTADO_REGISTRO] = @EstadoRegistro
                             WHERE [ID_SALIDA] = @Id";

                param.Add("@Id", id);
                param.Add("@EstadoRegistro", false);                

                long response = await _conn.Connection.ExecuteAsync(sql, param);
                if (!(response > 0)) throw new Exception("Eliminación no ha sido procesada.");
                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<long>(ex);
            }
        }

        public async Task<StatusResponse<IEnumerable<ListarAreasSolicitantesResponse>>> ListarAreasSolicitantes()
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @" SELECT [ID] id
                                      ,[NOMBRE] nombre
                                  FROM [dbo].[area_solicitante]
                                WHERE ESTADO = 1";

                var response = await _conn.Connection.QueryAsync<ListarAreasSolicitantesResponse>(sql, null) ?? throw new Exception("Usuario no válido");

                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<IEnumerable<ListarAreasSolicitantesResponse>>(ex);
            }

        }
    }
}
