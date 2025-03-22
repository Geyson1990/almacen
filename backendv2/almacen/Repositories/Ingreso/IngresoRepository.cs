using almacen.Models.Autenticacion;
using almacen.Models.Ingreso;
using almacen.Models.Inventario;
using almacen.Utils;
using Dapper;
using System.Data.Common;
using System.Transactions;
using static almacen.Utils.Message;

namespace almacen.Repositories.Ingreso
{
    public class IngresoRepository(IDbSession conn) : IIngresoRepository
    {
        private readonly IDbSession _conn = conn;

        public async Task<StatusResponse<IEnumerable<ListarIngresoResponse>>> GetAll()
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT
	                            CAST(ROW_NUMBER() OVER(ORDER BY re.ID_ENTRADA DESC) as int) registro,
	                            re.FECHA fecha, 
	                            re.ID_ENTRADA idEntrada,
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
	                            re.CANTIDAD cantidad, 
	                            p.FECHA_VENCIMIENTO fechaVencimiento
                            FROM dbo.registro_entrada re INNER JOIN
                                 dbo.producto p ON re.ID_PRODUCTO = p.ID_PRODUCTO INNER JOIN
                                 dbo.unidad_medida um ON p.ID_UNIDAD_MEDIDA = um.ID_UNIDAD_MEDIDA
                            WHERE re.ESTADO_REGISTRO = 1";

                var parameters = new DynamicParameters();
                //parameters.Add("@Alias", request.alias);
                //parameters.Add("@Contrasenia", request.contrasenia);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryAsync<ListarIngresoResponse>(sql, null) ?? throw new Exception("Usuario no válido");
           
                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<IEnumerable<ListarIngresoResponse>>(ex);
            }

        }

        public async Task<StatusResponse<long>> GrabarIngreso(GrabarIngresoRequest request)
        {
            try
            {
                string sql = string.Empty;
                var param = new DynamicParameters();
                if (request.idEntrada == 0)
                {
                    sql += @"INSERT INTO [dbo].[registro_entrada]
                                   ([FECHA]
                                   ,[ID_PRODUCTO]
                                   ,[CANTIDAD]
                                   ,[FECHA_VENCIMIENTO]
                                   ,[ESTADO_REGISTRO])
                             OUTPUT INSERTED.ID_ENTRADA
                             VALUES
                                   (GETDATE()
                                   ,@IdProducto
                                   ,@Cantidad
                                   ,NULL
                                   ,1);


                            UPDATE producto
                            SET CANTIDAD = ISNULL(CANTIDAD,0) + @Cantidad
                            WHERE ID_PRODUCTO = @IdProducto;
                    ";
                }
                else
                {
                    sql += @"UPDATE [dbo].[registro_entrada]
                               SET [CANTIDAD] = CANTIDAD + (@CANTIDAD - CANTIDAD)
                             WHERE [ID_ENTRADA] = @IdEntrada;

                            UPDATE producto
                            SET CANTIDAD = CANTIDAD + (@CANTIDAD - CANTIDAD)
                            WHERE ID_PRODUCTO = @IdProducto;

";                    
                }

                param.Add("@IdEntrada", request.idEntrada);
                param.Add("@IdProducto", request.idProducto);
                param.Add("@Cantidad", request.cantidad);

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

        public async Task<StatusResponse<ObtenerIngresoResponse>> ObtenerIngreso(long idEntrada)
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT        
	                                re.ID_ENTRADA idEntrada, 
	                                re.ID_PRODUCTO idProducto,
	                                re.CANTIDAD cantidad
                                FROM dbo.registro_entrada re INNER JOIN
                                dbo.producto p ON re.ID_PRODUCTO = p.ID_PRODUCTO INNER JOIN
                                dbo.unidad_medida um ON p.ID_UNIDAD_MEDIDA = um.ID_UNIDAD_MEDIDA
                                WHERE re.ID_ENTRADA = @IdEntrada";

                var parameters = new DynamicParameters();
                parameters.Add("@IdEntrada", idEntrada);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryFirstOrDefaultAsync<ObtenerIngresoResponse>(sql, parameters) ?? throw new Exception("Error al obtener información");
                return Successful(response);
            }
            catch (Exception ex)
            {
                return Exception<ObtenerIngresoResponse>(ex);
            }
        }

        public async Task<StatusResponse<long>> EliminarIngreso(long id)
        {
            try
            {
                string selectQuery = @"
                    SELECT CANTIDAD, ID_PRODUCTO
                    FROM [dbo].[registro_entrada]
                    WHERE ID_ENTRADA = @IdEntrada AND ESTADO_REGISTRO = 1;";

                var entrada = await _conn.Connection.QueryFirstOrDefaultAsync<(int Cantidad, long IdProducto)>(
                    selectQuery, new { IdEntrada = id });

                if (entrada == default)
                    throw new Exception("Entrada no encontrada o ya eliminada");

                // Validar que haya suficiente stock para restar
                string checkStockQuery = @"
                    SELECT CANTIDAD FROM [dbo].[producto] WHERE ID_PRODUCTO = @IdProducto;";

                int stockActual = await _conn.Connection.ExecuteScalarAsync<int>(
                    checkStockQuery, new { IdProducto = entrada.IdProducto });

                if (stockActual < entrada.Cantidad)
                    throw new Exception("No se puede eliminar la entrada, stock insuficiente");

                string updateStockQuery = @"
                    UPDATE [dbo].[producto]
                    SET CANTIDAD = CANTIDAD - @Cantidad,
                        USUARIO_MODIFICACION = @UsuarioModificacion,
                        FECHA_MODIFICACION = GETDATE()
                    WHERE ID_PRODUCTO = @IdProducto;";

                await _conn.Connection.ExecuteAsync(updateStockQuery, new
                {
                    IdProducto = entrada.IdProducto,
                    Cantidad = entrada.Cantidad,
                    UsuarioModificacion = "Sistema"
                });

                // Marcar la entrada como eliminada
                string updateEntradaQuery = @"
                    UPDATE [dbo].[registro_entrada]
                    SET ESTADO_REGISTRO = 0
                    WHERE ID_ENTRADA = @IdEntrada;";

                await _conn.Connection.ExecuteAsync(updateEntradaQuery, new { IdEntrada = id });
                return Successful(1L);
                
            }
            catch (Exception ex)
            {
                return Message.Exception<long>(ex);
            }
        }

        

    }
}
