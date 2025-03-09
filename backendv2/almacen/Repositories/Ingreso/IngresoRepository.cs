using almacen.Models.Autenticacion;
using almacen.Models.Ingreso;
using almacen.Models.Inventario;
using almacen.Utils;
using Dapper;
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

        public async Task<StatusResponse<long>> GrabarProductos(GrabarProductoRequest request)
        {
            try
            {
                string sql = string.Empty;
                var param = new DynamicParameters();
                if (request.idProducto == 0)
                {
                    sql += @"INSERT INTO [dbo].[producto]
                                   ([NOMBRE]
                                   ,[MATERIAL]
                                   ,[COLOR]
                                   ,[TALLA]
                                   ,[TIPO]
                                   ,[MEDIDAS]
                                   ,[MARCA]
                                   ,[ID_UNIDAD_MEDIDA]
                                   ,[CANTIDAD]
                                   ,[ESTADO_STOCK]
                                   ,[FECHA_VENCIMIENTO]
                                   ,[ESTADO]
                                   ,[USUARIO_CREACION]
                                   ,[FECHA_CREACION]
                                   ,[STOCK_MINIMO]
                                   ,[ESTADO_REGISTRO]
                                   )
                             OUTPUT INSERTED.ID_PRODUCTO
                             VALUES
                                (@Nombre, @Material, @Color, @Talla, @Tipo, @Medida, 
                                 @Marca, @IdUnidadMedida, @StockInicial ,1, @FechaVencimiento, 1, 'admin', GETDATE(),
                                 @StockMinimo, 1)";
                }
                else
                {
                    sql += @"UPDATE [dbo].[producto]
                               SET [NOMBRE] = @Nombre
                                  ,[MATERIAL] = @Material
                                  ,[COLOR] = @Color
                                  ,[TALLA] = @Talla
                                  ,[TIPO] = @Tipo
                                  ,[MEDIDAS] = @Medida
                                  ,[MARCA] = @Marca
                                  ,[ID_UNIDAD_MEDIDA] = @IdUnidadMedida
                                  ,[FECHA_VENCIMIENTO] = @FechaVencimiento
                                  ,[USUARIO_MODIFICACION] = 'ADMIN'
                                  ,[FECHA_MODIFICACION] = GETDATE()
                                  ,[STOCK_MINIMO] = @StockMinimo
                             WHERE [ID_PRODUCTO] = @IdProducto";                    
                }

                param.Add("@IdProducto", request.idProducto);
                param.Add("@Nombre", request.nombre);
                param.Add("@Material", request.material);
                param.Add("@Color", request.color);
                param.Add("@Talla", request.talla);
                param.Add("@Tipo", request.tipo);
                param.Add("@Medida", request.medida);
                param.Add("@Marca", request.marca);
                param.Add("@IdUnidadMedida", request.idUnidadMedida);
                param.Add("@FechaVencimiento", request.fechaVencimiento);
                param.Add("@StockMinimo", request.stockMinimo);
                param.Add("@StockInicial", request.stockInicial);

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

        public async Task<StatusResponse<GrabarProductoResponse>> ObtenerProducto(long idProducto)
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT [ID_PRODUCTO] idProducto
                                  ,[NOMBRE] nombre
                                  ,[MATERIAL] material
                                  ,[COLOR] color
                                  ,[TALLA] talla
                                  ,[TIPO] tipo
                                  ,[MEDIDAS] medida
                                  ,[MARCA] marca
                                  ,[ID_UNIDAD_MEDIDA] idUnidadMedida
                                  ,[CANTIDAD] stockInicial
                                  ,[FECHA_VENCIMIENTO] fechaVencimiento
                                  ,[STOCK_MINIMO] stockMinimo
                              FROM [dbo].[producto]
                              WHERE [ID_PRODUCTO]= @IdProducto";

                var parameters = new DynamicParameters();
                parameters.Add("@IdProducto", idProducto);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryFirstOrDefaultAsync<GrabarProductoResponse>(sql, parameters) ?? throw new Exception("Unidades de medidas no válidas");

                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<GrabarProductoResponse>(ex);
            }

        }


        public async Task<StatusResponse<long>> EliminarProducto(long id)
        {
            try
            {
                var param = new DynamicParameters();
                string sql = @"UPDATE [dbo].[producto]
                               SET [ESTADO_REGISTRO] = @EstadoRegistro
                             WHERE [ID_PRODUCTO] = @IdProducto";

                param.Add("@IdProducto", id);
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

    }
}
