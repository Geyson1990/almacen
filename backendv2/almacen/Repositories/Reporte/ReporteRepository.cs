using almacen.Models.Salida;
using Dapper;
using static almacen.Utils.Message;
using almacen.Utils;
using almacen.Models.Reporte;
using iText.Kernel.Pdf;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using Document = iText.Layout.Document;
using Table = iText.Layout.Element.Table;
using iText.Kernel.Colors;
using iText.Layout.Borders;
using Org.BouncyCastle.Utilities;


namespace almacen.Repositories.Reporte
{
    public class ReporteRepository(IDbSession conn) : IReporteRepository
    {
        private readonly IDbSession _conn = conn;
        public async Task<StatusResponse<IEnumerable<ReporteKardexResponse>>> ReporteKardex(ReporteKardexRequest request)
        {
            try
            {
                string sql = @"SELECT distinct
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

        public async Task<StatusResponse<string>> DescargarReporteDetallado(ReporteKardexRequest request)
        {
            try
            {
                var solicitud = await ReporteKardex(request);
                var productos = solicitud.Data.Select(x => new ReporteProductoResponse
                {
                    idProducto = x.idProducto,
                    producto = x.producto
                }).DistinctBy(x => x.idProducto);


                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (PdfWriter writer = new(memoryStream))
                    {
                        using (PdfDocument pdf = new PdfDocument(writer))
                        {
                            pdf.SetDefaultPageSize(iText.Kernel.Geom.PageSize.A4.Rotate());
                            Document documento = new Document(pdf);
                            documento.SetMargins(20, 50, 20, 50);

                            PdfFont fuenteTitulo = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                            PdfFont fuenteTexto = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

                            AddTitulo(documento, fuenteTitulo, "REPORTE DETALLADO DE INVENTARIO");
                            AddPrimeraTabla(documento, fuenteTitulo, fuenteTexto, request);
                            AddTablaReporteDetallado(documento, fuenteTexto, productos, solicitud.Data);

                            documento.Close();
                        }
                    }

                    byte[] pdfBytes = memoryStream.ToArray();                    
                    return Successful<string>(Convert.ToBase64String(pdfBytes));
                }
            }
            catch (Exception ex)
            {
                return Exception<string>(ex);
            }
        }

        public async Task<StatusResponse<string>> DescargarReporteIngreso(ReporteKardexRequest request)
        {
            try
            {
                var solicitud = await ReporteIngreso(request);
                var productos = solicitud.Data.Select(x => new ReporteProductoResponse
                {
                    idProducto = x.idProducto,
                    producto = x.nombre
                }).Distinct();


                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (PdfWriter writer = new(memoryStream))
                    {
                        using (PdfDocument pdf = new PdfDocument(writer))
                        {
                            pdf.SetDefaultPageSize(iText.Kernel.Geom.PageSize.A4.Rotate());
                            Document documento = new Document(pdf);
                            documento.SetMargins(20, 50, 20, 50);

                            PdfFont fuenteTitulo = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                            PdfFont fuenteTexto = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

                            AddTitulo(documento, fuenteTitulo, "REPORTE DE INGRESOS");
                            AddPrimeraTabla(documento, fuenteTitulo, fuenteTexto, request);
                            AddTablaReporteIngreso(documento, fuenteTexto, productos, solicitud.Data);

                            documento.Close();
                        }
                    }

                    byte[] pdfBytes = memoryStream.ToArray();
                    return Successful<string>(Convert.ToBase64String(pdfBytes));
                }
            }
            catch (Exception ex)
            {
                return Exception<string>(ex);
            }
        }

        public async Task<StatusResponse<string>> DescargarReporteSalida(ReporteKardexRequest request)
        {
            try
            {
                var solicitud = await ReporteSalida(request);
                var productos = solicitud.Data.Select(x => new ReporteProductoResponse
                {
                    idProducto = x.idProducto,
                    producto = x.nombre
                }).Distinct();


                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (PdfWriter writer = new(memoryStream))
                    {
                        using (PdfDocument pdf = new PdfDocument(writer))
                        {
                            pdf.SetDefaultPageSize(iText.Kernel.Geom.PageSize.A4.Rotate());
                            Document documento = new Document(pdf);
                            documento.SetMargins(20, 50, 20, 50);

                            PdfFont fuenteTitulo = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                            PdfFont fuenteTexto = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

                            AddTitulo(documento, fuenteTitulo, "REPORTE DE SALIDA");
                            AddPrimeraTabla(documento, fuenteTitulo, fuenteTexto, request);
                            AddTablaReporteSalida(documento, fuenteTexto, productos, solicitud.Data);

                            documento.Close();
                        }
                    }

                    byte[] pdfBytes = memoryStream.ToArray();
                    return Successful<string>(Convert.ToBase64String(pdfBytes));
                }
            }
            catch (Exception ex)
            {
                return Exception<string>(ex);
            }
        }


        private void AddTitulo(Document documento, PdfFont fuenteTitulo, string titulo)
        {
            documento.Add(new Paragraph($"{titulo}\n")
                .SetFont(fuenteTitulo)
                .SetFontSize(16)
                .SetTextAlignment(TextAlignment.CENTER)
                .SetBold());
        }

        private void AddPrimeraTabla(Document documento, PdfFont fuenteTitulo, PdfFont fuenteTexto, ReporteKardexRequest request)
        {
            // Encabezado
            documento.Add(new Paragraph($"Fecha: {DateTime.Now:dd/MM/yyyy}  Hora: {DateTime.Now:HH:mm}"));
            documento.Add(new Paragraph("Almacén: GENERAL"));
            documento.Add(new Paragraph("Destino de Uso: Consumo"));
            documento.Add(new Paragraph($"Desde: {request.fechaInicio:dd/MM/yyyy} Hasta: {request.fechaFin:dd/MM/yyyy}\n"));
        }

        private void AddTablaReporteDetallado(Document documento, PdfFont fuenteTexto, IEnumerable<ReporteProductoResponse> productos, IEnumerable<ReporteKardexResponse> kardex)
        {
            foreach (var producto in productos)
            {
                documento.Add(new Paragraph("\n").SetFontSize(10));
                Table tblTitulo = new Table(1).SetWidth(UnitValue.CreatePercentValue(100));
                tblTitulo.AddCell(new Cell().Add(new Paragraph($"Producto: C-000{producto.idProducto} - {producto.producto}").SetFont(fuenteTexto).SetFontSize(9)).SetBold().SetBorder(Border.NO_BORDER));
                documento.Add(tblTitulo);
                List<ReporteKardexResponse> operaciones = kardex.Where(x => x.idProducto == producto.idProducto).ToList();
                Table tabla = new Table(9).SetWidth(UnitValue.CreatePercentValue(100));
                tabla.AddCell(new Cell().Add(new Paragraph("Fecha").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Tipo").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Cantidad").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Stock Acumulado").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("N° Documento Ingreso\n/Salida").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Material").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Color").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Talla").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Marca").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                foreach (var operacion in operaciones)
                {
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.fecha.ToString("dd/MM/yyyy")).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.tipoMovimiento).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.cantidad.ToString()).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.stockAcumulado.ToString()).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.detalle ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.material ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.color ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.talla ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.marca ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                }
                documento.Add(tabla);
            }



            documento.Add(new Paragraph("\n").SetFontSize(1));
            
            
        }

        private void AddTablaReporteIngreso(Document documento, PdfFont fuenteTexto, IEnumerable<ReporteProductoResponse> productos, IEnumerable<ReporteIngresoResponse> kardex)
        {
            foreach (var producto in productos)
            {
                documento.Add(new Paragraph("\n").SetFontSize(10));
                Table tblTitulo = new Table(1).SetWidth(UnitValue.CreatePercentValue(100));
                tblTitulo.AddCell(new Cell().Add(new Paragraph($"Producto: C-000{producto.idProducto} - {producto.producto}").SetFont(fuenteTexto).SetFontSize(9)).SetBold().SetBorder(Border.NO_BORDER));
                documento.Add(tblTitulo);
                List<ReporteIngresoResponse> operaciones = kardex.Where(x => x.idProducto == producto.idProducto).ToList();
                Table tabla = new Table(9).SetWidth(UnitValue.CreatePercentValue(100));
                tabla.AddCell(new Cell().Add(new Paragraph("Fecha").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Cantidad").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Material").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Color").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Talla").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Marca").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Medidas").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Unidad \nde medida").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("N° documento \nde Ingreso").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                foreach (var operacion in operaciones)
                {
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.fecha?.ToString("dd/MM/yyyy")).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.cantidad.ToString()).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.material ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.color ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.talla ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.marca ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.medidas ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.nombreUnidadMedida ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.ordenCompra ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                }
                documento.Add(tabla);
            }



            documento.Add(new Paragraph("\n").SetFontSize(1));


        }

        private void AddTablaReporteSalida(Document documento, PdfFont fuenteTexto, IEnumerable<ReporteProductoResponse> productos, IEnumerable<ReporteSalidaResponse> kardex)
        {
            foreach (var producto in productos)
            {
                documento.Add(new Paragraph("\n").SetFontSize(10));
                Table tblTitulo = new Table(1).SetWidth(UnitValue.CreatePercentValue(100));
                tblTitulo.AddCell(new Cell().Add(new Paragraph($"Producto: C-000{producto.idProducto} - {producto.producto}").SetFont(fuenteTexto).SetFontSize(9)).SetBold().SetBorder(Border.NO_BORDER));
                documento.Add(tblTitulo);
                List<ReporteSalidaResponse> operaciones = kardex.Where(x => x.idProducto == producto.idProducto).ToList();
                Table tabla = new Table(11).SetWidth(UnitValue.CreatePercentValue(100));
                tabla.AddCell(new Cell().Add(new Paragraph("Fecha").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Cantidad").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Material").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Color").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Talla").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Marca").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Medidas").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Unidad \nde medida").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                //tabla.AddCell(new Cell().Add(new Paragraph("Fecha de \nVencimiento").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Área \nSolicitante").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("Persona \nSolicitante").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                tabla.AddCell(new Cell().Add(new Paragraph("N° documento \nde Salida").SetFont(fuenteTexto).SetFontSize(7)).SetBackgroundColor(ColorConstants.LIGHT_GRAY));
                foreach (var operacion in operaciones)
                {
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.fecha?.ToString("dd/MM/yyyy")).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.cantidad.ToString()).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.material ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.color ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.talla ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.marca ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.medidas ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.nombreUnidadMedida ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    //tabla.AddCell(new Cell().Add(new Paragraph(operacion.fechaVencimiento?.ToString("dd/MM/yyyy") ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.areaSolicitante ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.personaSolicitante ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                    tabla.AddCell(new Cell().Add(new Paragraph(operacion.documentoSalida ?? string.Empty).SetFont(fuenteTexto).SetFontSize(10)));
                }
                documento.Add(tabla);
            }



            documento.Add(new Paragraph("\n").SetFontSize(1));


        }

    }
}
