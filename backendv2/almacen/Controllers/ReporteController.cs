using almacen.Models.Ingreso;
using almacen.Models.Inventario;
using almacen.Models.Reporte;
using almacen.Repositories.Ingreso;
using almacen.Repositories.Inventario;
using almacen.Repositories.Reporte;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace almacen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController(IReporteRepository service) : ControllerBase
    {
        private readonly IReporteRepository _service = service;

        [AllowAnonymous]
        [HttpPost("reporte-kardex")]
        public async Task<IActionResult> ReporteKardex([FromBody] ReporteKardexRequest request)
        {
            byte[] file = null;
            var respuesta = await _service.ReporteKardex(request);
            if (respuesta.Success)
                file = descargarReporteKardex(respuesta.Data);

            if (file == null || file.Length == 0)
                return BadRequest("No se pudo generar el reporte.");

            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "KardexReporte.xlsx");
        }

        [AllowAnonymous]
        [HttpPost("reporte-ingreso")]
        public async Task<IActionResult> ReporteIngreso([FromBody] ReporteKardexRequest request)
        {
            byte[] file = null;
            var respuesta = await _service.ReporteIngreso(request);
            if (respuesta.Success)
                file = descargarReporteIngreso(respuesta.Data);

            if (file == null || file.Length == 0)
                return BadRequest("No se pudo generar el reporte.");

            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteIngreso.xlsx");
        }

        [AllowAnonymous]
        [HttpPost("reporte-salida")]
        public async Task<IActionResult> ReporteSalida([FromBody] ReporteKardexRequest request)
        {
            byte[] file = null;
            var respuesta = await _service.ReporteSalida(request);
            if (respuesta.Success)
                file = descargarReporteSalida(respuesta.Data);

            if (file == null || file.Length == 0)
                return BadRequest("No se pudo generar el reporte.");

            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteSalida.xlsx");
        }

        [AllowAnonymous]
        [HttpPost("reporte-kardex-pdf")]
        public async Task<IActionResult> ReporteKardexPdf([FromBody] ReporteKardexRequest request)
        {
            var respuesta = await _service.DescargarReporteDetallado(request);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("reporte-ingreso-pdf")]
        public async Task<IActionResult> ReporteIngresoPdf([FromBody] ReporteKardexRequest request)
        {
            var respuesta = await _service.DescargarReporteIngreso(request);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("reporte-salida-pdf")]
        public async Task<IActionResult> ReporteSalidaPdf([FromBody] ReporteKardexRequest request)
        {
            var respuesta = await _service.DescargarReporteSalida(request);
            return Ok(respuesta);
        }


        private byte[] descargarReporteKardex(IEnumerable<ReporteKardexResponse> request)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Kardex");
                worksheet.Cell(1, 1).Value = "ID PRODUCTO";
                worksheet.Cell(1, 2).Value = "PRODUCTO";
                worksheet.Cell(1, 3).Value = "FECHA";
                worksheet.Cell(1, 4).Value = "TIPO MOVIMIENTO";
                worksheet.Cell(1, 5).Value = "CANTIDAD";
                worksheet.Cell(1, 6).Value = "MOTIVO";
                worksheet.Cell(1, 7).Value = "STOCK ACUMULADO";
                worksheet.Cell(1, 8).Value = "N° DOCUMENTO";
                worksheet.Cell(1, 9).Value = "MATERIAL";
                worksheet.Cell(1, 10).Value = "COLOR";
                worksheet.Cell(1, 11).Value = "TALLA";
                worksheet.Cell(1, 12).Value = "MARCA";

                int row = 2;
                foreach (var mov in request)
                {
                    worksheet.Cell(row, 1).Value = mov.idProducto;
                    worksheet.Cell(row, 2).Value = mov.producto;
                    worksheet.Cell(row, 3).Value = mov.fecha.ToString("yyyy-MM-dd");
                    worksheet.Cell(row, 4).Value = mov.tipoMovimiento;
                    worksheet.Cell(row, 5).Value = mov.cantidad;
                    worksheet.Cell(row, 6).Value = mov.descripcionTipo;
                    worksheet.Cell(row, 7).Value = mov.stockAcumulado;
                    worksheet.Cell(row, 8).Value = mov.detalle;
                    worksheet.Cell(row, 9).Value = mov.material;
                    worksheet.Cell(row, 10).Value = mov.color;
                    worksheet.Cell(row, 11).Value = mov.talla;
                    worksheet.Cell(row, 12).Value = mov.marca;
                    row++;
                }

                worksheet.Columns().AdjustToContents();
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }
        private byte[] descargarReporteIngreso(IEnumerable<ReporteIngresoResponse> request)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Ingreso");
                worksheet.Cell(1, 1).Value = "REGISTRO";
                worksheet.Cell(1, 2).Value = "FECHA";
                worksheet.Cell(1, 3).Value = "ID ENTRADA";
                worksheet.Cell(1, 4).Value = "ID PRODUCTO";
                worksheet.Cell(1, 5).Value = "NOMBRE";
                worksheet.Cell(1, 6).Value = "MATERIAL";
                worksheet.Cell(1, 7).Value = "COLOR";
                worksheet.Cell(1, 8).Value = "TALLA";
                worksheet.Cell(1, 9).Value = "TIPO";
                worksheet.Cell(1, 10).Value = "MEDIDAS";
                worksheet.Cell(1, 11).Value = "MARCA";
                //worksheet.Cell(1, 12).Value = "ID UNIDAD MEDIDA";
                worksheet.Cell(1, 12).Value = "NOMBRE UNIDAD MEDIDA";
                worksheet.Cell(1, 13).Value = "CANTIDAD";
                worksheet.Cell(1, 14).Value = "FECHA VENCIMIENTO";
                worksheet.Cell(1, 15).Value = "MOTIVO";
                worksheet.Cell(1, 16).Value = "ORDEN COMPRA";

                int row = 2;
                foreach (var ingreso in request)
                {
                    worksheet.Cell(row, 1).Value = ingreso.registro;
                    worksheet.Cell(row, 2).Value = ingreso.fecha?.ToString("yyyy-MM-dd");
                    worksheet.Cell(row, 3).Value = ingreso.idEntrada;
                    worksheet.Cell(row, 4).Value = ingreso.idProducto;
                    worksheet.Cell(row, 5).Value = ingreso.nombre;
                    worksheet.Cell(row, 6).Value = ingreso.material;
                    worksheet.Cell(row, 7).Value = ingreso.color;
                    worksheet.Cell(row, 8).Value = ingreso.talla;
                    worksheet.Cell(row, 9).Value = ingreso.tipo;
                    worksheet.Cell(row, 10).Value = ingreso.medidas;
                    worksheet.Cell(row, 11).Value = ingreso.marca;
                    //worksheet.Cell(row, 12).Value = ingreso.idUnidadMedida;
                    worksheet.Cell(row, 12).Value = ingreso.nombreUnidadMedida;
                    worksheet.Cell(row, 13).Value = ingreso.cantidad;
                    worksheet.Cell(row, 14).Value = ingreso.fechaVencimiento?.ToString("yyyy-MM-dd");
                    worksheet.Cell(row, 15).Value = ingreso.descripcionTipo;
                    worksheet.Cell(row, 16).Value = ingreso.ordenCompra;
                    row++;
                }

                worksheet.Columns().AdjustToContents();
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }

        private byte[] descargarReporteSalida(IEnumerable<ReporteSalidaResponse> request)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Salida");
                worksheet.Cell(1, 1).Value = "REGISTRO";
                worksheet.Cell(1, 2).Value = "FECHA";
                worksheet.Cell(1, 3).Value = "ID SALIDA";
                worksheet.Cell(1, 4).Value = "ID PRODUCTO";
                worksheet.Cell(1, 5).Value = "NOMBRE";
                worksheet.Cell(1, 6).Value = "MATERIAL";
                worksheet.Cell(1, 7).Value = "COLOR";
                worksheet.Cell(1, 8).Value = "TALLA";
                worksheet.Cell(1, 9).Value = "TIPO";
                worksheet.Cell(1, 10).Value = "MEDIDAS";
                worksheet.Cell(1, 11).Value = "MARCA";
                //worksheet.Cell(1, 12).Value = "ID UNIDAD MEDIDA";
                worksheet.Cell(1, 12).Value = "NOMBRE UNIDAD MEDIDA";
                worksheet.Cell(1, 13).Value = "CANTIDAD";
                worksheet.Cell(1, 14).Value = "FECHA VENCIMIENTO";
                //worksheet.Cell(1, 16).Value = "ID AREA SOLICITANTE";
                worksheet.Cell(1, 15).Value = "AREA SOLICITANTE";
                worksheet.Cell(1, 16).Value = "PERSONA SOLICITANTE";
                worksheet.Cell(1, 17).Value = "MOTIVO";
                worksheet.Cell(1, 18).Value = "DOCUMENTO SALIDA";

                int row = 2;
                foreach (var salida in request)
                {
                    worksheet.Cell(row, 1).Value = salida.registro;
                    worksheet.Cell(row, 2).Value = salida.fecha?.ToString("yyyy-MM-dd");
                    worksheet.Cell(row, 3).Value = salida.idSalida;
                    worksheet.Cell(row, 4).Value = salida.idProducto;
                    worksheet.Cell(row, 5).Value = salida.nombre;
                    worksheet.Cell(row, 6).Value = salida.material;
                    worksheet.Cell(row, 7).Value = salida.color;
                    worksheet.Cell(row, 8).Value = salida.talla;
                    worksheet.Cell(row, 9).Value = salida.tipo;
                    worksheet.Cell(row, 10).Value = salida.medidas;
                    worksheet.Cell(row, 11).Value = salida.marca;
                    //worksheet.Cell(row, 12).Value = salida.idUnidadMedida;
                    worksheet.Cell(row, 12).Value = salida.nombreUnidadMedida;
                    worksheet.Cell(row, 13).Value = salida.cantidad;
                    worksheet.Cell(row, 14).Value = salida.fechaVencimiento?.ToString("yyyy-MM-dd");
                    //worksheet.Cell(row, 16).Value = salida.idAreaSolicitante;
                    worksheet.Cell(row, 15).Value = salida.areaSolicitante;
                    worksheet.Cell(row, 16).Value = salida.personaSolicitante;
                    worksheet.Cell(row, 17).Value = salida.descripcionTipo;
                    worksheet.Cell(row, 18).Value = salida.documentoSalida;
                    row++;
                }

                worksheet.Columns().AdjustToContents();
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }

    }
}
