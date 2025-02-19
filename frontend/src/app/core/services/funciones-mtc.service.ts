import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { TipoSolicitudModel } from '../models/TipoSolicitudModel';
import { CONSTANTES } from 'src/app/enums/constants';

@Injectable({
  providedIn: 'root'
})
export class FuncionesMtcService {

  colorMtc = '';

  constructor(private spinner: NgxSpinnerService) {
    this.colorMtc = window.getComputedStyle(document.documentElement).getPropertyValue('--color-mtc');
  }

  mostrarCargando(): this {
    this.spinner.show();
    return this;
  }

  ocultarCargando(): this {
    this.spinner.hide();
    return this;
  }

  mensaje(text: string): Promise<void> {
    return new Promise((resolve) => {
      Swal.fire({
        text,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeWarn(text: string): Promise<void> {
    return new Promise((resolve) => {
      Swal.fire({
        text,
        icon: 'warning',
        confirmButtonColor:'#2778c4',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeInfo(text: string): Promise<void> {
    return new Promise((resolve) => {
      Swal.fire({
        text,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeOk(text: string): Promise<void> {
    return new Promise((resolve) => {
      Swal.fire({
        text,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeOkTit(titulo: string, text: string): Promise<void> {
    return new Promise((resolve) => {
      Swal.fire({
        title: titulo,
        text,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeError(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        text,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        confirmButtonColor: this.colorMtc
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeErrorTit(titulo: string,text: string): Promise<void> {
    return new Promise((resolve) => {
      Swal.fire({
        title: titulo,
        text,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        confirmButtonColor: this.colorMtc
      }).then(() => {
        resolve();
      });
    });
  }

  mensajeErrorHtml(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        html: text,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        confirmButtonColor: this.colorMtc
      }).then(() => {
        resolve();
      });
    });

  }

  mensajeConfirmar(text: string, title: string = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Swal.fire({
        title,
        text,
        icon: 'question',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: '#b5b3b3',
        confirmButtonColor:'#2778c4',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
      }).then((resultado) => {
        if (resultado.value) {
          resolve();
        }
        else {
          reject();
        }
      });
    });
  }

  mensajeWarnConfirmar(text: string, title: string = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Swal.fire({
        title,
        text,
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: '#b5b3b3',
        confirmButtonColor:'#2778c4',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
      }).then((resultado) => {
        if (resultado.value) {
          resolve();
        }
        else {
          reject();
        }
      });
    });
  }

  mensajeErrorConfirmar(text: string, title: string = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Swal.fire({
        title,
        text,
        icon: 'error',
        iconHtml: '?',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonColor: '#b5b3b3',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
      }).then((resultado) => {
        if (resultado.value) {
          resolve();
        }
        else {
          reject();
        }
      });
    });
  }

  mensajeOkEncuesta(title, text="", html="", confirmButtonText=""): Promise<void>{
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: title,
            icon: 'success',
            iconHtml: '<i class="fas fa-check" style="color: #008000"></i>',
            width: 400,
            text: text,
            html: html,
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: confirmButtonText != ""? confirmButtonText : "Aceptar",
            confirmButtonColor: '#008000',
            cancelButtonText:' Cerrar',
            // footer: footerHtml,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
              resolve();
            }else{
              reject();
            }
        });
    });
}

  jsonToFormData(data: any): FormData {
    const formData = new FormData();
    this.buildFormData(formData, data);
    return formData;
  }  
 
  private buildFormData(formData: FormData, data: any, parentKey = undefined): void {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      let separationOpen = '';
      let separationClose = '';
      Object.keys(data).forEach((key: any) => {
        if (isNaN(key) === true) {// es letra
          separationOpen = '.';
          separationClose = '';
        } else {// es número
          separationOpen = '[';
          separationClose = ']';
        }
        this.buildFormData(formData, data[key], parentKey ? `${parentKey}${separationOpen}${key}${separationClose}` : key);
      });
    } else {
      const value = data == null ? '' : data;

      formData.append(parentKey, value);
    }
  }

  mensajeHtml(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        html: text,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      }).then(() => {
        resolve();
      });
    });

  }

  validateFormFieldFijo(dia: any, path: string, errorMsg: string, n: number, field: string): string {   
     
    const value = path.split('.').reduce((obj, key) => obj && obj[key], dia);    

    if (Array.isArray(value)) {  
      if (value.every(item => item[field] !== n.toString())) {
        return errorMsg;
      }
    } return '';  
  }

  validateFormField(dia: any, path: string, errorMsg: string): string {    
   
    const value = path.split('.').reduce((obj, key) => obj && obj[key], dia);    
 
    if (Array.isArray(value) && value.length === 0) {
      return errorMsg;
    } else if ((typeof value === 'string' && value.trim() === '') || 
    (typeof value === 'string' && (value.trim() === '0' || value.trim() === '1')) || 
    (typeof value === 'number' && value === 0)) {      
    return errorMsg;
    }else{
      return '';
    }   
  }

  validateFormFields(dia: any, paths: string[], errorMsg: string): string {    
    //let errors = '';  
    for (const path of paths) {
      const value = path.split('.').reduce((obj, key) => obj && obj[key], dia);    
  
      if (Array.isArray(value) && value.length === 0) {
        return errorMsg;
       // errors += `${errorMsg} (Path: ${path})\n`;
      } else if (value === undefined || value === null ||
                 (typeof value === 'string' && value.trim() === '') ||
                 (typeof value === 'string' && (value.trim() === '0')) ||
                 (typeof value === 'number' && value === 0)) {
        //errors += `${errorMsg} (Path: ${path})\n`;
        return errorMsg;
      }
    }  
    //if (errors) {      
    //  return errors;
    //}  
    return '';
  }
 
  validateFormFechaRegistro(dia: any, path: string, errorMsg: string): string {
    
    const value = path.split('.').reduce((obj, key) => obj && obj[key], dia);
    if (typeof value === 'string' && value.trim() === '') {
      return value;
    }
    return value;
  }
  validateFormLista(dia: any, path: string, errorMsg: string): string {
    
    const value = path.split('.').reduce((obj, key) => obj && obj[key], dia);
    if (typeof value === 'string' && value.trim() === '0') {
      return value;
    }
    return value;
  }
  
  validateForm(dia: any, node: string): any {
    let msg = '';
    let msgFecha= '';
   
    if (!dia || !node) {
      return msg;
    }
    
    const formConfig = {
      [CONSTANTES.FormDia.RESUMEN_EJECUTIVO]: () => {
        
        if (dia[node]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
 
        if (dia[node]?.Save === true) {
          
          msg += this.validateFormField(dia, `${node}.Resumen`, CONSTANTES.MsgFormDia.MSG_0011_RESUMEN_EJECUTIVO+'<br>');
          msg += this.validateFormField(dia, `${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0012_ADJUNTAR_RESUMEN_EJECUTIVO+'<br>');
        }
      },
      [CONSTANTES.FormDia.DESCRIPCION_PROYECTO]: () => {
       if (dia[node]?.Antecedentes.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.Antecedentes.FechaRegistro`, '');
        }
 
        if (dia[node]?.Antecedentes.Save === true) {
          msg += this.validateFormField(dia, `${node}.Antecedentes.DatosGenerales.NombreProyecto`, CONSTANTES.MsgFormDia.MSG_0211_NOMBRE_PROYECTO+'<br>');
          //msg += this.validateFormField(dia, `${node}.Antecedentes.DatosGenerales.InversionEstimada`, CONSTANTES.MsgFormDia.MSG_0211_INVERSION_ESTIMADA+'<br>');
         // msg += this.validateFormField(dia, `${node}.Antecedentes.CorreoNotificacion.EmailNotificacion1`, CONSTANTES.MsgFormDia.MSG_0211_CORREOS_NOTIFICACION+'<br>');
        
          const paths = [
            `${node}.Antecedentes.CorreoNotificacion.EmailNotificacion1`,
            `${node}.Antecedentes.CorreoNotificacion.EmailNotificacion2`           
          ];

        const errorCorreoMsg = CONSTANTES.MsgFormDia.MSG_0211_CORREOS_NOTIFICACION + '<br>';
        msg += this.validateFormFields(dia, paths, errorCorreoMsg);
        
          msg += this.validateFormField(dia, `${node}.Antecedentes.DatosGenerales.UnidadMinera`, CONSTANTES.MsgFormDia.MSG_0211_UNIDAD_MINERA+'<br>');
          msg += this.validateFormField(dia, `${node}.Antecedentes.MapaComponentes`,CONSTANTES.MsgFormDia.MSG_2151_MAPA_COMPONENTES+'<br>');         
          msg += this.validateFormField(dia, `${node}.Antecedentes.Permisos`, CONSTANTES.MsgFormDia.MSG_0217_PERMISOS_LICENCIAS+'<br>');
          msg += this.validateFormField(dia, `${node}.Antecedentes.PropiedadSuperficial`, CONSTANTES.MsgFormDia.MSG_0218_PROPIEDAD_SUPERFICIAL+'<br>');
          msg += this.validateFormField(dia, `${node}.Antecedentes.Estudios`, CONSTANTES.MsgFormDia.MSG_0216_ESTUDIOS+'<br>');
          //msg += this.validateFormField(dia, `${node}.Antecedentes.MapaAreasNaturales`, CONSTANTES.MsgFormDia.MSG_2193_MAPA_AREAS_NATURALS+'<br>');         

        }
      },
      [CONSTANTES.FormDia.OBJETIVO]: () => {
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `DescripcionProyecto.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO]?.Save === true) {
          msg += this.validateFormField(dia, `DescripcionProyecto.Objetivo`, CONSTANTES.MsgFormDia.MSG_0022_DESCRIPCION_OBJETIVO+'<br>');
        }
      },
      [CONSTANTES.FormDia.LOCALIZACION_GEOGRAFICA]: () => { 
       if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.LOCALIZACION_GEOGRAFICA]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `DescripcionProyecto.${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.LOCALIZACION_GEOGRAFICA]?.Save === true) {  
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.LocalizacionSuperpuesta`, CONSTANTES.MsgFormDia.MSG_0232_LOCALIZACION_SUPERPUESTA+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.DistanciaPobladosCercanos`, CONSTANTES.MsgFormDia.MSG_0233_DISTANCIA_POBLADOS+'<br>');
        }
      },
      [CONSTANTES.FormDia.DELIMITACION]: () => { 
       if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.DELIMITACION]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `DescripcionProyecto.${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.DELIMITACION]?.Save === true) {  
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.AreasActividadMinera`, CONSTANTES.MsgFormDia.MSG_0241_AREAS_ACTIVIDAD_MINERA+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.CoordenadaPuntoEste`, CONSTANTES.MsgFormDia.MSG_0242_COORDENADAS_ESTE+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.CoordenadaPuntoNorte`, CONSTANTES.MsgFormDia.MSG_0242_COORDENADAS_NORTE+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0243_MAPA_EFECTIVA+'<br>');
        }
      },
      [CONSTANTES.FormDia.AREAS_INFLUENCIA]: () => { 
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.AREAS_INFLUENCIA]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `DescripcionProyecto.${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.AREAS_INFLUENCIA]?.Save === true) {  

          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.AreaDirectaAmbiental`, CONSTANTES.MsgFormDia.MSG_0251_AREAS_DIRECTA_AMBIENTAL+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.AreaIndirectaAmbiental`, CONSTANTES.MsgFormDia.MSG_0252_AREAS_INDIRECTA_AMBIENTAL+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.AreaDirectaSocial`, CONSTANTES.MsgFormDia.MSG_0253_AREAS_DIRECTA_SOCIAL+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.AreaIndirectaDirectaSocial`, CONSTANTES.MsgFormDia.MSG_0254_AREAS_INDIRECTA_SOCIAL+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.ArchivoEscaneado`, CONSTANTES.MsgFormDia.MSG_0255_ARCHIVOS_ESCANEADOS+'<br>');
        }
      },
      [CONSTANTES.FormDia.CRONOGRAMA_INVERSION]: () => { 
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.CRONOGRAMA_INVERSION]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `DescripcionProyecto.${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.CRONOGRAMA_INVERSION]?.Save === true) {  
    
          const paths0026 = [
            `DescripcionProyecto.${node}.Cierre.FechaFin.day`,
            `DescripcionProyecto.${node}.Cierre.FechaFin.month`,
            `DescripcionProyecto.${node}.Cierre.FechaFin.year`,
            `DescripcionProyecto.${node}.Cierre.FechaInicio.day`,
            `DescripcionProyecto.${node}.Cierre.FechaInicio.month`,
            `DescripcionProyecto.${node}.Cierre.FechaInicio.year`,
            `DescripcionProyecto.${node}.Cierre.Inversion`,
            `DescripcionProyecto.${node}.Cierre.TotalMeses`,
            `DescripcionProyecto.${node}.Construccion.FechaFin.day`,
            `DescripcionProyecto.${node}.Construccion.FechaFin.month`,
            `DescripcionProyecto.${node}.Construccion.FechaFin.year`,
            `DescripcionProyecto.${node}.Construccion.FechaInicio.day`,
            `DescripcionProyecto.${node}.Construccion.FechaInicio.month`,
            `DescripcionProyecto.${node}.Construccion.FechaInicio.year`,
            `DescripcionProyecto.${node}.Construccion.Inversion`,
            `DescripcionProyecto.${node}.Construccion.TotalMeses`,
            `DescripcionProyecto.${node}.Exploracion.FechaFin.day`,
            `DescripcionProyecto.${node}.Exploracion.FechaFin.month`,
            `DescripcionProyecto.${node}.Exploracion.FechaFin.year`,
            `DescripcionProyecto.${node}.Exploracion.FechaInicio.day`,
            `DescripcionProyecto.${node}.Exploracion.FechaInicio.month`,
            `DescripcionProyecto.${node}.Exploracion.FechaInicio.year`,
            `DescripcionProyecto.${node}.Exploracion.Inversion`,
            `DescripcionProyecto.${node}.Exploracion.TotalMeses`, 
            `DescripcionProyecto.${node}.PostCierre.FechaFin.day`,
            `DescripcionProyecto.${node}.PostCierre.FechaFin.month`,
            `DescripcionProyecto.${node}.PostCierre.FechaFin.year`,
            `DescripcionProyecto.${node}.PostCierre.FechaInicio.day`,
            `DescripcionProyecto.${node}.PostCierre.FechaInicio.month`,
            `DescripcionProyecto.${node}.PostCierre.FechaInicio.year`,
            `DescripcionProyecto.${node}.PostCierre.Inversion`,
            `DescripcionProyecto.${node}.PostCierre.TotalMeses`
          ];

        const errorMsg = CONSTANTES.MsgFormDia.MSG_0026_CRONOGRAMA + '<br>';
        msg += this.validateFormFields(dia, paths0026, errorMsg);
        
        }
      },
      [CONSTANTES.FormDia.DESCRIPCION_ETAPAS]: () => { 
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.DESCRIPCION_ETAPAS]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `DescripcionProyecto.${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_PROYECTO][CONSTANTES.FormDia.DESCRIPCION_ETAPAS]?.Save === true) {  
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Documento`, CONSTANTES.MsgFormDia.MSG_0027_DOCUMENTO+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.MineralAExplotar`, CONSTANTES.MsgFormDia.MSG_0271_MINERAL_EXPORTAR+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.ComponentesPrincipales.Zona`, CONSTANTES.MsgFormDia.MSG_0272_COMPONENTES_PRINCIPALES+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Archivos`, CONSTANTES.MsgFormDia.MSG_2752_DEMANDA_AGUA+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.ComponentesProyecto`, CONSTANTES.MsgFormDia.MSG_2731_COMPONENTES_PROYECTO+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.TopSoil`, CONSTANTES.MsgFormDia.MSG_2733_TOPSOIL+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Residuos`, CONSTANTES.MsgFormDia.MSG_0274_RESIDUOS_GENERAR+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.RequerimientoAgua`, CONSTANTES.MsgFormDia.MSG_2751_REQUERIMIENTO_AGUA+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.BalanceAgua`, CONSTANTES.MsgFormDia.MSG_2753_BALANCE_AGUA+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Insumos`, CONSTANTES.MsgFormDia.MSG_0276_INSUMOS_PROYECTO+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Instalaciones`, CONSTANTES.MsgFormDia.MSG_0276_MANEJO_EFLUENTES+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Maquinarias`, CONSTANTES.MsgFormDia.MSG_2772_MAQUINARIAS+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.Equipos`, CONSTANTES.MsgFormDia.MSG_2773_EQUIPOS+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.ArchivosMDS`, CONSTANTES.MsgFormDia.MSG_2774_MDS+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.ViasAccesoExistente`, CONSTANTES.MsgFormDia.MSG_2781_VIAS_EXISTENTES+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.ViasAccesoNueva`, CONSTANTES.MsgFormDia.MSG_2782_VIAS_NUEVAS+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.FuenteAbastecimientoEnergia`, CONSTANTES.MsgFormDia.MSG_2710_FUENTE_ENERGIA+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.CierrePostCierre`, CONSTANTES.MsgFormDia.MSG_2711_CIERRE_POSTCIERRE+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.MapaComponentes`, CONSTANTES.MsgFormDia.MSG_2712_MAPA_COMPONENTES+'<br>');
          msg += this.validateFormField(dia, `DescripcionProyecto.${node}.TipoManoObra`, CONSTANTES.MsgFormDia.MSG_2791_TIPO_MANO_OBRA+'<br>');          
          
          const paths = [
              `DescripcionProyecto.${node}.ManoObra.Construccion`,
              `DescripcionProyecto.${node}.ManoObra.Cierre`,
              `DescripcionProyecto.${node}.ManoObra.Exploracion`,
              `DescripcionProyecto.${node}.ManoObra.PorcentajeCierre`,
              `DescripcionProyecto.${node}.ManoObra.PorcentajeConstruccion`,
              `DescripcionProyecto.${node}.ManoObra.PorcentajeExploracion`,
              `DescripcionProyecto.${node}.ManoObra.Total`
            ];

          const errorMsg = CONSTANTES.MsgFormDia.MSG_0279_MANO_OBRA + '<br>';
          msg += this.validateFormFields(dia, paths, errorMsg);
        }
      },
      [CONSTANTES.FormDia.DESCRIPCION_MEDIO_FISICO]: () => { 
       if (dia[CONSTANTES.FormDia.DESCRIPCION_MEDIO_FISICO]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        } 
        if (dia[CONSTANTES.FormDia.DESCRIPCION_MEDIO_FISICO]?.Save === true) {  
          msg += this.validateFormField(dia, `${node}.Metereologia`,  CONSTANTES.MsgFormDia.MSG_0311_METEOROLOGIA+'<br>');
          msg += this.validateFormField(dia, `${node}.CalidadAire`, CONSTANTES.MsgFormDia.MSG_0312_CALIDAD_AIRE+'<br>');
          msg += this.validateFormField(dia, `${node}.CalidadRuidoAmbiental`, CONSTANTES.MsgFormDia.MSG_0313_CALIDAD_RUIDO+'<br>');
          msg += this.validateFormField(dia, `${node}.Topografia`, CONSTANTES.MsgFormDia.MSG_3141_TOPOGRAFIA+'<br>');
          msg += this.validateFormField(dia, `${node}.Geologia`, CONSTANTES.MsgFormDia.MSG_3142_GEOLOGIA+'<br>');
          msg += this.validateFormField(dia, `${node}.Geomorfologia`, CONSTANTES.MsgFormDia.MSG_3143_GEOMORFOLOGIA+'<br>');
          msg += this.validateFormField(dia, `${node}.Hidrologia`, CONSTANTES.MsgFormDia.MSG_3152_HIDROGRAFIA+'<br>');
          msg += this.validateFormField(dia, `${node}.Hidrogeologia`, CONSTANTES.MsgFormDia.MSG_3152_HIDROGEOLOGIA+'<br>');
          msg += this.validateFormField(dia, `${node}.CalidadAgua`, CONSTANTES.MsgFormDia.MSG_3154_CALIDAD_AGUA+'<br>');
          msg += this.validateFormField(dia, `${node}.EstudioSuelo`,  CONSTANTES.MsgFormDia.MSG_3161_ESTUDIO_SUELO+'<br>');
          msg += this.validateFormField(dia, `${node}.ClasificacionTierras`, CONSTANTES.MsgFormDia.MSG_3162_CLASIFICACION_TIERRAS+'<br>');
          msg += this.validateFormField(dia, `${node}.UsoActualTierra`, CONSTANTES.MsgFormDia.MSG_3163_USO_TIERRAS+'<br>');
         // msg += this.validateFormField(dia, `${node}.CalidadSuelos`, CONSTANTES.MsgFormDia.MSG_3164_CALIDAD_SUELOS+'<br>');
        }
      },
      [CONSTANTES.FormDia.DESCRIPCION_MEDIO_BIOLOGICO]: () => { 
        if (dia[CONSTANTES.FormDia.DESCRIPCION_MEDIO_BIOLOGICO]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_MEDIO_BIOLOGICO]?.Save === true) {  
          //msg += this.validateFormField(dia, `${node}.CriteriosEvaluacion`, CONSTANTES.MsgFormDia.MSG_0321_CRITERIOS+'<br>');
          //msg += this.validateFormField(dia, `${node}.DescripcionEcosistemas`, CONSTANTES.MsgFormDia.MSG_0322_DESCRIPCION_ECOSISTEMA+'<br>');
          msg += this.validateFormField(dia, `${node}.Ecosistemas`, CONSTANTES.MsgFormDia.MSG_3221_ECOSISTEMAS+'<br>');
          msg += this.validateFormField(dia, `${node}.FloraTerrestre`, CONSTANTES.MsgFormDia.MSG_3222_FLORA_TERRESTRE+'<br>');
          msg += this.validateFormField(dia, `${node}.FaunaTerrestre`, CONSTANTES.MsgFormDia.MSG_3223_FAUNA_TERRESTRE+'<br>');
          //msg += this.validateFormField(dia, `${node}.Hidrobiologia`,  CONSTANTES.MsgFormDia.MSG_3224_FAUNA_TERRESTRE+'<br>');
          msg += this.validateFormField(dia, `${node}.EcosistemasFragiles`, CONSTANTES.MsgFormDia.MSG_3225_ECOSISTEMAS_FRAGILES+'<br>');
          //msg += this.validateFormField(dia, `${node}.AreasNaturales`, CONSTANTES.MsgFormDia.MSG_3226_AREAS_NATURALES+'<br>');
          msg += this.validateFormField(dia, `${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0032_DOCUMENTOS+'<br>');
        }
      },
      [CONSTANTES.FormDia.PUNTO_MUESTREO]: () => {   
        if (dia.FechaRegistroPuntoMuestreo !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `FechaRegistroPuntoMuestreo`, '');
        }     

        if (dia.SavePuntoMuestreo === true) {           
          msg += this.validateFormField(dia, `${node}`, CONSTANTES.MsgFormDia.MSG_0331_PUNTO_MUESTREO+'<br>');
        }
      },
      [CONSTANTES.FormDia.DESCRIPCION_ASPECTO_SOCIAL]: () => { 
        if (dia[CONSTANTES.FormDia.DESCRIPCION_ASPECTO_SOCIAL]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.DESCRIPCION_ASPECTO_SOCIAL]?.Save === true) {  
           msg += this.validateFormField(dia, `${node}.Descripcion`, CONSTANTES.MsgFormDia.MSG_0342_DESCRIPCION+'<br>');
           msg += this.validateFormField(dia, `${node}.Indices`, CONSTANTES.MsgFormDia.MSG_0341_INDICES+'<br>');
           msg += this.validateFormField(dia, `${node}.OtrosAspectos`, CONSTANTES.MsgFormDia.MSG_0343_OTROS_ASPECTOS+'<br>');
        }
      },
      [CONSTANTES.FormDia.ARQUEOLOGIA]: () => { 
        if (dia[CONSTANTES.FormDia.ARQUEOLOGIA]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.ARQUEOLOGIA]?.Save === true) {  
         // msg += this.validateFormField(dia, `${node}.Descripcion`, CONSTANTES.MsgFormDia.MSG_0351_DESCRIPCION+'<br>');
          msg += this.validateFormField(dia, `${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0035_DOCUMENTOS+'<br>');
          }
      },
      [CONSTANTES.FormDia.CARTOGRAFIA]: () => { 
        if (dia.FechaRegistroCartografia !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `FechaRegistroCartografia`, '');
        }
        if (dia.SaveCartografia === true) {  
          msg += this.validateFormField(dia, `${node}`, CONSTANTES.MsgFormDia.MSG_0036_CARTOGRAFIA+'<br>');
           }
      },
      [CONSTANTES.FormDia.PARTICIPACION_CIUDADANA]: () => { 
        if (dia[CONSTANTES.FormDia.PARTICIPACION_CIUDADANA]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.PARTICIPACION_CIUDADANA]?.Save === true) {  
         // msg += this.validateFormField(dia, `${node}.Mecanismos`, CONSTANTES.MsgFormDia.MSG_0041_MECANISMOS+'<br>');
          msg += this.validateFormFieldFijo(dia, `${node}.Mecanismos`, CONSTANTES.MsgFormDia.MSG_00411_MECANISMO_RESUMENES+'<br>',1,'Mecanismos');
          msg += this.validateFormFieldFijo(dia, `${node}.Mecanismos`, CONSTANTES.MsgFormDia.MSG_00411_MECANISMO_TALLERES+'<br>',10,'Mecanismos');
          msg += this.validateFormField(dia, `${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0042_DOCUMENTOS+'<br>');
          }
      },
      [CONSTANTES.FormDia.IMPACTOS_AMBIENTALES]: () => { 
       if (dia.FechaRegistroImpactosAmbientales !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `FechaRegistroImpactosAmbientales`, '');
        }
        if (dia.SaveImpactosAmbientales === true) {  
          msg += this.validateFormField(dia, `${node}`,  CONSTANTES.MsgFormDia.MSG_0051_IMPACTO_AMBIENTAL+'<br>');
           }
      },
      [CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL]: () => { 
        if (dia[CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL]?.Save === true) {  
          msg += this.validateFormField(dia, `${node}.PlanManejo`, CONSTANTES.MsgFormDia.MSG_0611_PLAN_MANEJO+'<br>');
          }
      },
      [CONSTANTES.FormDia.PLAN_VIGILANCIA_AMBIENTAL]: () => { 
        if (dia[CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL][CONSTANTES.FormDia.PLAN_VIGILANCIA_AMBIENTAL]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `PlanManejoAmbiental.${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL][CONSTANTES.FormDia.PLAN_VIGILANCIA_AMBIENTAL]?.Save === true) {  
          msg += this.validateFormField(dia, `PlanManejoAmbiental.${node}.PuntosMonitoreo`, CONSTANTES.MsgFormDia.MSG_0621_PUNTOS_MONITOREO+'<br>');
          msg += this.validateFormField(dia, `PlanManejoAmbiental.${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0622_DOCUMENTOS+'<br>');
          }
      },
      [CONSTANTES.FormDia.PLAN_MINIMIZACION]: () => { 
        if (dia[CONSTANTES.FormDia.PLAN_MINIMIZACION]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.PLAN_MINIMIZACION]?.Save === true) {  
          msg += this.validateFormField(dia, `${node}.Descripcion`, CONSTANTES.MsgFormDia.MSG_0631_DESCRIPCION+'<br>');
          }
      },
      [CONSTANTES.FormDia.PLAN_CONTINGENCIA]: () => { 
        if (dia[CONSTANTES.FormDia.PLAN_CONTINGENCIA]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        if (dia[CONSTANTES.FormDia.PLAN_CONTINGENCIA]?.Save === true) {  
          msg += this.validateFormField(dia, `${node}.Descripcion`, CONSTANTES.MsgFormDia.MSG_0064_DESCRIPCION+'<br>');
          }
      },
      [CONSTANTES.FormDia.PROTOCOLO_RELACIONAMIENTO]: () => { 
        if (dia[CONSTANTES.FormDia.PROTOCOLO_RELACIONAMIENTO]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        
        if (dia[CONSTANTES.FormDia.PROTOCOLO_RELACIONAMIENTO]?.Save === true) {  
          msg += this.validateFormField(dia, `${node}.Descripcion`, CONSTANTES.MsgFormDia.MSG_0065_DESCRIPCION+'<br>');
          }
      },
      [CONSTANTES.FormDia.PLAN_CIERRE]: () => { 
       
       if (dia[CONSTANTES.FormDia.PLAN_CIERRE]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        
        if (dia[CONSTANTES.FormDia.PLAN_CIERRE]?.Save === true) {  
          msg += this.validateFormField(dia, `${node}.DescripcionCierre`, CONSTANTES.MsgFormDia.MSG_0661_DESCRIPCION_CIERRE+'<br>');
          msg += this.validateFormField(dia, `${node}.DescripcionPostCierre`, CONSTANTES.MsgFormDia.MSG_0662_DESCRIPCION_POST_CIERRE+'<br>');
          }
      },
      [CONSTANTES.FormDia.RESUMEN]: () => {   
       
        if (dia[CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL][CONSTANTES.FormDia.RESUMEN]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `PlanManejoAmbiental.${node}.FechaRegistro`, '');
        }  
          
        if (dia[CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL][CONSTANTES.FormDia.RESUMEN]?.Save === true) {           
          msg += this.validateFormField(dia, `PlanManejoAmbiental.${node}.Compromisos`, CONSTANTES.MsgFormDia.MSG_0671_COMPROMISOS+'<br>');
          //msg += this.validateFormField(dia, `PlanManejoAmbiental.${node}.MontoInversion`, CONSTANTES.MsgFormDia.MSG_0671_MONTO_INVERSION+'<br>');
          msg += this.validateFormField(dia, `PlanManejoAmbiental.${node}.UnidadMonetaria`, CONSTANTES.MsgFormDia.MSG_0671_UNIDAD_MONETARIA+'<br>');
          msg += this.validateFormField(dia, `PlanManejoAmbiental.${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0672_DOCUMENTOS+'<br>');
        }


                                                                  

      },
      [CONSTANTES.FormDia.CONSULTORA]: () => { 
       
        if (dia[CONSTANTES.FormDia.CONSULTORA]?.FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
        
        if (dia[CONSTANTES.FormDia.CONSULTORA]?.Save === true) {  
         // msg += this.validateFormField(dia, `${node}.EmpresaConsultora.Nombre`, CONSTANTES.MsgFormDia.MSG_0071_NOMBRE_CONSULTORA+'<br>');
          msg += this.validateFormField(dia, `${node}.ProfesionalConsultora`, CONSTANTES.MsgFormDia.MSG_0072_PROFESIONAL_CONSULTORA+'<br>');
         //msg += this.validateFormField(dia, `${node}.OtroProfesionalConsultora`, CONSTANTES.MsgFormDia.MSG_0073_OTRO_PROFESIONAL_CONSULTORA+'<br>');
         //msg += this.validateFormField(dia, `${node}.Documentos`, CONSTANTES.MsgFormDia.MSG_0074_DOCUMENTOS+'<br>');
        }

 


      },
      [CONSTANTES.FormDia.SOLICITUD_TITULO]: () => { 
        if (dia[node].FechaRegistro !== '') {          
          msgFecha = this.validateFormFechaRegistro(dia, `${node}.FechaRegistro`, '');
        }
       

        if (dia[node].Save === true && dia[node].SolicitaTitulo==='1') {  
          
          msg += this.validateFormField(dia, `${node}.SolicitaTitulo`, CONSTANTES.MsgFormDia.MSG_0081_SOLICITA_TITULO+'<br>');
          
           }
           
      }
    };
   
    if (formConfig[node]) {
      formConfig[node]();
    }
    const respuesta = {
      msg: msg,
      Fecha: msgFecha
    };

    return respuesta;
  }

  dateNow(){
    const currentDateTime = new Date().toISOString();
    return currentDateTime;
  }

}
