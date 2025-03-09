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
                              INNER JOIN dbo.unidad_medida b ON a.ID_UNIDAD_MEDIDA = b.ID_UNIDAD_MEDIDA
                              WHERE a.ESTADO_REGISTRO = 1";

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

        public async Task<StatusResponse<IEnumerable<ListarUnidadesMedidaResponse>>> ListarUnidadesMedida()
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT 
                                 [ID_UNIDAD_MEDIDA] idUnidadMedida
                                ,[NOMBRE]+' - '+[ABREVIATURA] AS nombre
                              FROM [dbo].[unidad_medida]";

                var parameters = new DynamicParameters();
                //parameters.Add("@Alias", request.alias);
                //parameters.Add("@Contrasenia", request.contrasenia);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryAsync<ListarUnidadesMedidaResponse>(sql, null) ?? throw new Exception("Unidades de medidas no válidas");

                return Message.Successful(response);
            }
            catch (Exception ex)
            {
                return Message.Exception<IEnumerable<ListarUnidadesMedidaResponse>>(ex);
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
