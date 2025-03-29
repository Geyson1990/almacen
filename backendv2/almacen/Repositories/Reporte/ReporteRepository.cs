using almacen.Models.Salida;
using Dapper;
using static almacen.Utils.Message;
using almacen.Utils;
using almacen.Models.Reporte;

namespace almacen.Repositories.Reporte
{
    public class ReporteRepository(IDbSession conn) : IReporteRepository
    {
        private readonly IDbSession _conn = conn;
        public async Task<StatusResponse<IEnumerable<ReporteKardexResponse>>> ReporteKardex(ReporteKardexRequest request)
        {
            try
            {
                string sql = @"SELECT 
                                    CAST(ROW_NUMBER() OVER(ORDER BY p.ID_PRODUCTO ASC) as int) registro,
                                    p.ID_PRODUCTO idProducto,
                                    p.NOMBRE AS producto,
                                    m.FECHA fecha,
                                    m.TIPO_MOVIMIENTO tipoMovimiento,
                                    m.CANTIDAD cantidad,
                                    SUM(m.CANTIDAD) OVER (PARTITION BY p.ID_PRODUCTO ORDER BY m.FECHA, m.TIPO_MOVIMIENTO) AS stockAcumulado,
                                    m.DETALLE detalle,
                                    p.MATERIAL material,
                                    p.COLOR color,
                                    p.TALLA talla,
                                    p.MARCA marca
                                FROM (
                                    -- Ingresos
                                    SELECT 
                                        re.ID_PRODUCTO, 
                                        re.FECHA, 
                                        'INGRESO' AS TIPO_MOVIMIENTO, 
                                        re.CANTIDAD,
                                        re.ORDEN_COMPRA AS DETALLE
                                    FROM registro_entrada re
    
                                    UNION ALL
    
                                    -- Salidas
                                    SELECT 
                                        rs.ID_PRODUCTO, 
                                        rs.FECHA, 
                                        'SALIDA' AS TIPO_MOVIMIENTO, 
                                        -rs.CANTIDAD AS CANTIDAD,
                                        rs.ORDEN_SALIDA AS DETALLE
                                    FROM registro_salida rs
                                ) AS m
                                JOIN producto p ON p.ID_PRODUCTO = m.ID_PRODUCTO
                                WHERE m.FECHA BETWEEN @FechaInicio AND @FechaFin
                                ORDER BY p.ID_PRODUCTO, m.FECHA, m.TIPO_MOVIMIENTO;";

                var parameters = new DynamicParameters();
                parameters.Add("@FechaInicio", request.fechaInicio);
                parameters.Add("@FechaFin", request.fechaFin);

                var response = await _conn.Connection.QueryAsync<ReporteKardexResponse>(sql, parameters) ?? throw new Exception("Usuario no válido");

                return Successful(response);
            }
            catch (Exception ex)
            {
                return Exception<IEnumerable<ReporteKardexResponse>>(ex);
            }

        }

        public async Task<StatusResponse<IEnumerable<ReporteIngresoResponse>>> ReporteIngreso(ReporteKardexRequest request)
        {
            try
            {
                string sql = @"SELECT
	                            CAST(ROW_NUMBER() OVER(ORDER BY re.ID_ENTRADA ASC) as int) registro,
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
	                            p.FECHA_VENCIMIENTO fechaVencimiento,
                                re.ID_TIPO_ENTRADA idTipoEntrada,
                                re.ORDEN_COMPRA ordenCompra
                            FROM dbo.registro_entrada re INNER JOIN
                                 dbo.producto p ON re.ID_PRODUCTO = p.ID_PRODUCTO INNER JOIN
                                 dbo.unidad_medida um ON p.ID_UNIDAD_MEDIDA = um.ID_UNIDAD_MEDIDA
                            WHERE re.ESTADO_REGISTRO = 1
                            AND re.FECHA BETWEEN @FechaInicio AND @FechaFin
                            ORDER BY p.ID_PRODUCTO, re.FECHA;";

                var parameters = new DynamicParameters();
                parameters.Add("@FechaInicio", request.fechaInicio);
                parameters.Add("@FechaFin", request.fechaFin);

                var response = await _conn.Connection.QueryAsync<ReporteIngresoResponse>(sql, parameters) ?? throw new Exception("Usuario no válido");

                return Successful(response);
            }
            catch (Exception ex)
            {
                return Exception<IEnumerable<ReporteIngresoResponse>>(ex);
            }

        }

        public async Task<StatusResponse<IEnumerable<ReporteSalidaResponse>>> ReporteSalida(ReporteKardexRequest request)
        {
            try
            {
                string sql = @"SELECT
                                    CAST(ROW_NUMBER() OVER(ORDER BY rs.ID_SALIDA ASC) as int) registro,
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
	                                rs.PERSONA_SOLICITANTE personaSolicitante,
                                    rs.ID_TIPO_SALIDA idTipoSalida,
                                    rs.ORDEN_SALIDA documentoSalida
                                FROM dbo.registro_salida rs INNER JOIN
                                     dbo.producto p ON rs.ID_PRODUCTO = p.ID_PRODUCTO INNER JOIN
                                     dbo.unidad_medida um ON p.ID_UNIDAD_MEDIDA = um.ID_UNIDAD_MEDIDA INNER JOIN
	                                 dbo.area_solicitante a ON rs.ID_AREA_SOLICITANTE = a.ID
                                WHERE rs.ESTADO_REGISTRO = 1
                            AND rs.FECHA BETWEEN @FechaInicio AND @FechaFin
                            ORDER BY p.ID_PRODUCTO, rs.FECHA;";

                var parameters = new DynamicParameters();
                parameters.Add("@FechaInicio", request.fechaInicio);
                parameters.Add("@FechaFin", request.fechaFin);

                var response = await _conn.Connection.QueryAsync<ReporteSalidaResponse>(sql, parameters) ?? throw new Exception("Usuario no válido");

                return Successful(response);
            }
            catch (Exception ex)
            {
                return Exception<IEnumerable<ReporteSalidaResponse>>(ex);
            }

        }

    }
}
