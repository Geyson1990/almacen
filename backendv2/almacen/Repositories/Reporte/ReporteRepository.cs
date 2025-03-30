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

        public async Task<StatusResponse<ReporteKardexResponse>> DescargarDocumento(ReporteKardexRequest request)
        {
            try
            {
                var solicitud = await ReporteKardex(request);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (PdfWriter writer = new(memoryStream))
                    {
                        using (PdfDocument pdf = new PdfDocument(writer))
                        {
                            Document documento = new Document(pdf);
                            documento.SetMargins(20, 50, 20, 50);

                            PdfFont fuenteTitulo = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                            PdfFont fuenteTexto = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

                            AddTitulo(documento, fuenteTitulo);
                            AddPrimeraTabla(documento, fuenteTitulo, fuenteTexto);
                            AddSegundaTabla(documento, fuenteTexto);
                            AddTerceraTabla(documento, fuenteTitulo, fuenteTexto, solicitud);
                            AddTablaTitular(documento, fuenteTexto, solicitud);
                            AddTablaRepresentanteLegal(documento, fuenteTexto, solicitud);
                            AddTablaUbigeo(documento, fuenteTexto, solicitud);
                            AddMotivoSolicitud(documento, fuenteTitulo, fuenteTexto, solicitud);
                            AddDocumentos(documento, fuenteTitulo, fuenteTexto);
                            AddFooter(documento, fuenteTexto);

                            documento.Close();
                        }
                    }

                    byte[] pdfBytes = memoryStream.ToArray();
                    return new StatusResponse<DescargarPlantillaDiaResponseDto>
                    {
                        Success = true,
                        Data = new DescargarPlantillaDiaResponseDto
                        {
                            base64Documento = Convert.ToBase64String(pdfBytes)
                        }
                    };
                }
            }
            catch (Exception ex)
            {
                return Message.Exception<DescargarPlantillaDiaResponseDto>(ex);
            }
        }

        private void AddTitulo(Document documento, PdfFont fuenteTitulo)
        {
            documento.Add(new Paragraph("DETALLE DE ALMACÉN\n")
                .SetFont(fuenteTitulo)
                .SetFontSize(14)
                .SetTextAlignment(TextAlignment.CENTER));
        }

        private void AddPrimeraTabla(Document documento, PdfFont fuenteTitulo, PdfFont fuenteTexto)
        {
            Table tablaDatos = new Table(2).SetWidth(UnitValue.CreatePercentValue(100));
            tablaDatos.AddCell(new Cell().Add(new Paragraph("Fecha").SetFont(fuenteTitulo).SetFontSize(7)));
            tablaDatos.AddCell(new Cell().Add(new Paragraph("Código Ítem").SetFont(fuenteTitulo).SetFontSize(7)));
            tablaDatos.AddCell(new Cell().Add(new Paragraph("DIA").SetFont(fuenteTexto).SetFontSize(10)));
            tablaDatos.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            documento.Add(tablaDatos);
        }

        private void AddSegundaTabla(Document documento, PdfFont fuenteTexto)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            Table tablaDependencia = new Table(3).SetWidth(UnitValue.CreatePercentValue(100));
            tablaDependencia.AddCell(new Cell().Add(new Paragraph("Dependencia a la que dirige la solicitud:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaDependencia.AddCell(new Cell().Add(new Paragraph("Nº comprobante:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaDependencia.AddCell(new Cell().Add(new Paragraph("Fecha de Pago:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaDependencia.AddCell(new Cell().Add(new Paragraph("DGAAM").SetFont(fuenteTexto).SetFontSize(10)));
            tablaDependencia.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            tablaDependencia.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            documento.Add(tablaDependencia);
        }

        private void AddTerceraTabla(Document documento, PdfFont fuenteTitulo, PdfFont fuenteTexto, SP_OBTENER_DATOS_DETALLADO_SOLICITUD_Response_Entity solicitud)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            Table tablaExpediente = new Table(2).SetWidth(UnitValue.CreatePercentValue(100));
            tablaExpediente.AddCell(new Cell().Add(new Paragraph("Identificación del expediente en caso de que este ya estuviera firmado").SetFont(fuenteTitulo).SetFontSize(7)));
            tablaExpediente.AddCell(new Cell().Add(new Paragraph("Nro Folios").SetFont(fuenteTitulo).SetFontSize(7)));
            tablaExpediente.AddCell(new Cell().Add(new Paragraph(solicitud.NombreProyecto ?? ".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.NombreProyecto) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            tablaExpediente.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            documento.Add(tablaExpediente);
        }

        private void AddTablaTitular(Document documento, PdfFont fuenteTexto, SP_OBTENER_DATOS_DETALLADO_SOLICITUD_Response_Entity solicitud)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            documento.Add(new Paragraph("Solicitante:").SetFont(fuenteTexto).SetFontSize(10));
            Table tablaTitular = new Table(2).SetWidth(UnitValue.CreatePercentValue(100));
            tablaTitular.AddCell(new Cell().Add(new Paragraph("Nombre o Razón Social:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaTitular.AddCell(new Cell().Add(new Paragraph("RUC:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaTitular.AddCell(new Cell().Add(new Paragraph(solicitud.NombreTitular ?? ".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.NombreTitular) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            tablaTitular.AddCell(new Cell().Add(new Paragraph(solicitud.Ruc ?? ".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.Ruc) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            documento.Add(tablaTitular);

            Table tablaTitular2 = new Table(2).SetWidth(UnitValue.CreatePercentValue(100));
            tablaTitular2.AddCell(new Cell().Add(new Paragraph("DNI/LE/CE/Pasaporte Nº:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaTitular2.AddCell(new Cell().Add(new Paragraph("Inscripción en SUNARP" + "\n" + "Nro de Ficha Registral o Asiento, Folio, Tomo, Libro y Oficina Registral:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaTitular2.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            tablaTitular2.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            documento.Add(tablaTitular2);
        }

        private void AddTablaRepresentanteLegal(Document documento, PdfFont fuenteTexto, SP_OBTENER_DATOS_DETALLADO_SOLICITUD_Response_Entity solicitud)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            Table tablaRepresentante = new Table(2).SetWidth(UnitValue.CreatePercentValue(100));
            tablaRepresentante.AddCell(new Cell().Add(new Paragraph("Representante Legal:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaRepresentante.AddCell(new Cell().Add(new Paragraph("DNI/LE/CE/Pasaporte:").SetFont(fuenteTexto).SetFontSize(7)));

            string nombreRepresentante = $"{solicitud.ApellidoPaterno ?? ""} {solicitud.ApellidoMaterno ?? ""} {solicitud.Nombres ?? ""}".Trim();
            tablaRepresentante.AddCell(new Cell().Add(new Paragraph(nombreRepresentante).SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(nombreRepresentante) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            tablaRepresentante.AddCell(new Cell().Add(new Paragraph(solicitud.DocumentoIdentidad ?? ".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.DocumentoIdentidad) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            documento.Add(tablaRepresentante);

            Table tablaRepresentante2 = new Table(1).SetWidth(UnitValue.CreatePercentValue(100));
            tablaRepresentante2.AddCell(new Cell().Add(new Paragraph("Inscripción en SUNARP" + "\n" + "Nro de Ficha Registral o Asiento, Folio, Tomo, Libro y Oficina Registral:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaRepresentante2.AddCell(new Cell().Add(new Paragraph(".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)));
            documento.Add(tablaRepresentante2);
        }

        private void AddTablaUbigeo(Document documento, PdfFont fuenteTexto, SP_OBTENER_DATOS_DETALLADO_SOLICITUD_Response_Entity solicitud)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            Table tablaUbigeo = new Table(3).SetWidth(UnitValue.CreatePercentValue(100));
            string[]? ubigeo = solicitud.Region?.Split("-");
            tablaUbigeo.AddCell(new Cell().Add(new Paragraph("Domicilio Legal (para efectos de notificación:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo.AddCell(new Cell().Add(new Paragraph("Distrito:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo.AddCell(new Cell().Add(new Paragraph("Provincia:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo.AddCell(new Cell().Add(new Paragraph(solicitud.Direccion ?? ".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.Direccion?.Trim()) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            tablaUbigeo.AddCell(new Cell().Add(new Paragraph(ubigeo?.ElementAtOrDefault(2) ?? ".    ").SetFont(fuenteTexto).SetFontSize(10)));
            tablaUbigeo.AddCell(new Cell().Add(new Paragraph(ubigeo?.ElementAtOrDefault(1) ?? ".    ").SetFont(fuenteTexto).SetFontSize(10)));
            documento.Add(tablaUbigeo);

            Table tablaUbigeo2 = new Table(4).SetWidth(UnitValue.CreatePercentValue(100));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph("Departamento:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph("Correo electrónico:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph("Teléfonos:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph("Fax:").SetFont(fuenteTexto).SetFontSize(7)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph(ubigeo?[0] ?? ".    ").SetFont(fuenteTexto).SetFontSize(10)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph(solicitud.Email ?? ".").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.Email?.Trim()) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph(solicitud.Telefono ?? " .   ").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.Telefono?.Trim()) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            tablaUbigeo2.AddCell(new Cell().Add(new Paragraph(solicitud.Fax ?? ".    ").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.Fax?.Trim()) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            documento.Add(tablaUbigeo2);

            documento.Add(new Paragraph("*El nombre o razón social,Nro de RUC y dirección del solicitante deberán consignarse en forma obligatoria.").SetFont(fuenteTexto).SetFontSize(6));
        }

        private void AddMotivoSolicitud(Document documento, PdfFont fuenteTitulo, PdfFont fuenteTexto, SP_OBTENER_DATOS_DETALLADO_SOLICITUD_Response_Entity solicitud)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            documento.Add(new Paragraph("Motivo de la Solicitud (Objeto y Fundamentos):").SetFont(fuenteTitulo).SetFontSize(10));
            Table tablaMotivo = new Table(1).SetWidth(UnitValue.CreatePercentValue(100));
            tablaMotivo.AddCell(new Cell().Add(new Paragraph(solicitud.Objetivo ?? ".    \n\n\n\n .").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(string.IsNullOrWhiteSpace(solicitud.Objetivo?.Trim()) ? ColorConstants.WHITE : ColorConstants.BLACK)));
            documento.Add(tablaMotivo);
            documento.Add(new Paragraph("Indicar en forma clara y precisa lo que se solicita, expresando cuando sea necesario, los fundamentos de hecho y derecho que correspondan.").SetFont(fuenteTexto).SetFontSize(6));
        }

        private void AddDocumentos(Document documento, PdfFont fuenteTitulo, PdfFont fuenteTexto)
        {
            documento.Add(new Paragraph("\n").SetFontSize(1));
            documento.Add(new Paragraph("Relación de Documentos y anexos que se acompaña (Si falta espacio, usar hojas adicionales):").SetFont(fuenteTitulo).SetFontSize(8));
            Table tablaDocumentos = new Table(1).SetWidth(UnitValue.CreatePercentValue(100));
            for (int i = 1; i <= 6; i++)
            {
                tablaDocumentos.AddCell(new Cell().Add(new Paragraph(i.ToString()).SetFont(fuenteTexto).SetFontSize(10)));
            }
            documento.Add(tablaDocumentos);
        }

        private void AddFooter(Document documento, PdfFont fuenteTexto)
        {
            documento.Add(new Paragraph("\n").SetFontSize(20));
            documento.Add(new Paragraph("\n").SetFontSize(20));
            Table tablaFooter = new Table(UnitValue.CreatePercentArray(new float[] { 30, 30, 10, 30 })).SetWidth(UnitValue.CreatePercentValue(100)).SetHorizontalAlignment(HorizontalAlignment.CENTER);
            tablaFooter.AddCell(new Cell().Add(new Paragraph("Lugar y fecha: ........................").SetFont(fuenteTexto).SetFontSize(8).SetHorizontalAlignment(HorizontalAlignment.LEFT)).SetBorder(Border.NO_BORDER));
            tablaFooter.AddCell(new Cell().Add(new Paragraph("Firma o huella digital del interesado o representante").SetFont(fuenteTexto).SetTextAlignment(TextAlignment.CENTER).SetFontSize(8)).SetPaddingTop(4f).SetBorderTop(new DottedBorder(ColorConstants.BLACK, 1)).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(Border.NO_BORDER).SetBorderRight(Border.NO_BORDER));
            tablaFooter.AddCell(new Cell().Add(new Paragraph(".....").SetFont(fuenteTexto).SetFontSize(10).SetFontColor(ColorConstants.WHITE)).SetPaddingTop(4f).SetBorderTop(Border.NO_BORDER).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(Border.NO_BORDER).SetBorderRight(Border.NO_BORDER));
            tablaFooter.AddCell(new Cell().Add(new Paragraph("Firma y sello de abogado\n(Si el procedimiento lo requiere)").SetFont(fuenteTexto).SetTextAlignment(TextAlignment.CENTER).SetFontSize(8)).SetPaddingTop(4f).SetBorderTop(new DottedBorder(ColorConstants.BLACK, 1)).SetBorderBottom(Border.NO_BORDER).SetBorderLeft(Border.NO_BORDER).SetBorderRight(Border.NO_BORDER));
            documento.Add(tablaFooter);
        }
    }
}
