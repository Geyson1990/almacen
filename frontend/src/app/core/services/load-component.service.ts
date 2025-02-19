import { Injectable, Type } from '@angular/core';

export class DynamicComponent {
  constructor(public component: Type<any>, data: any) { }
}

@Injectable({
  providedIn: 'root'
})
export class LoadComponentService {

  // constructor(private cfr: ComponentFactoryResolver) {
  // }

  // async loadComponent(vcr: ViewContainerRef, indexComponent: number) {
  //   const component = await this.loadMapCompoent(indexComponent);

  //   vcr.clear();
  //   return vcr.createComponent(
  //     this.cfr.resolveComponentFactory(component))

  //   //   //const componente = await import(pathUrl);
  //   //   debugger;
  //   //   //const componente = await import('src/app/pages/formulario_001_17/components/anexos/anexo001-a17/anexo001-a17.component');
  //   //   const componente = await import();
  //   //   const cmpToCreate = new DynamicComponent(componente[nameComponent], {});
  //   //   const componentFactory = this.cfr.resolveComponentFactory(cmpToCreate.component)
  //   //   vcr.clear();
  //   //   vcr.createComponent(componentFactory);
  // }

  async getComponent(codigoFormAnexo: string) {

    const componente = await this.loadMapCompoent(codigoFormAnexo);
    return componente;
  }

  private async loadMapCompoent(codigoFormAnexo: string): Promise<Type<any>> {

    switch (codigoFormAnexo) {
      //***GRUPO 1***
      //...
      case "FORM_003_17": //FORMULARIO 3
        return await (await import('src/app/pages/formulario_003_17/components/formulario/formulario.component')).FormularioComponent;

      case "ANEXO_003_A17":
        return await (await import('src/app/pages/formulario_003_17/components/anexos/anexo003-a17/anexo003-a17.component')).Anexo003A17Component;

      /*case "ANEXO_003_B17":
        return await (await import('src/app/pages/formulario_003_17/components/anexos/anexo003-b17/anexo003-b17.component')).Anexo003B17Component;
      */

      case "ANEXO_003_C17":
        return await (await import('src/app/pages/formulario_003_17/components/anexos/anexo003-c17/anexo003-c17.component')).Anexo003C17Component;

      case "ANEXO_003_D17":
        return await (await import('src/app/pages/formulario_003_17/components/anexos/anexo003-d17/anexo003-d17.component')).Anexo003D17Component;

      case "ANEXO_003_F17":
        return await (await import('src/app/pages/formulario_003_17/components/anexos/anexo003-f17/anexo003-f17.component')).Anexo003F17Component;


      case "ANEXO_006_C17":
        return await (await import('src/app/pages/formulario_006_17/components/anexos/anexo006-c17/anexo006-c17.component')).Anexo006C17Component;
      case "ANEXO_006_A17":
        return await (await import('src/app/pages/formulario_006_17/components/anexos/anexo006-a17/anexo006-a17.component')).Anexo006A17Component;
      case "ANEXO_006_B17":
        return await (await import('src/app/pages/formulario_006_17/components/anexos/anexo006-b17/anexo006-b17.component')).Anexo006B17Component;
      case "FORM_006_17": //FORMULARIO 006/17
        return await (await import('src/app/pages/formulario_006_17/components/formulario/formulario06.component')).FormularioComponent;



      //***GRUPO 2***
      //...

      case "FORM_002_17": //FORMULARIO 002/17
        return await (await import('src/app/pages/formulario_002_17/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_002_12": //FORMULARIO 002/12
        return await (await import('src/app/pages/formulario_002_12/presentation/pages/formulario/formulario.component')).FormularioComponent;
      // case "FORM_003_12": //FORMULARIO 003/12
      //   return await (await import('src/app/pages/formulario_003_12/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_003_12NT": //FORMULARIO 003/12
        return await (await import('src/app/pages/formulario_003_12NT/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "FORM_004_12": //FORMULARIO 004/12
        return await (await import('src/app/pages/formulario_004_12/components/formulario/formulario.component')).FormularioComponent;

      case "ANEXO_002_E17": //Anexo 002-E/17
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-e17/anexo002-e17.component')).Anexo002E17Component;
      case "ANEXO_002_F17": //Anexo 002-F/17
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-f17/anexo002-f17.component')).Anexo002F17Component;
      case "ANEXO_002_G17": //Anexo 002-G/17
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-g17/anexo002-g17.component')).Anexo002G17Component;
      case "ANEXO_002_H17": //Anexo 002-H/17
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-h17/anexo002-h17.component')).Anexo002H17Component;
      case "ANEXO_002_I17": //Anexo 002-I/17
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-i17/anexo002-i17.component')).Anexo002I17Component;

      case "ANEXO_003_B17": //Anexo 003-B/17
        return await (await import('src/app/pages/formulario_003_17/components/anexos/anexo003-b17/anexo003-b17.component')).Anexo003B17Component;


      //***GRUPO 3***


      case "FORM_001_17": //FORMULARIO 1
        return await (await import('src/app/pages/formulario_001_17/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_001_A12": //FORMULARIO 1 -12
        return await (await import('src/app/pages/formulario_001_a12/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_001_B12": //FORMULARIO 001-B/12
        return await (await import('src/app/pages/formulario_001_b12/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_002_A12": //FORMULARIO 002-A/12
        return await (await import('src/app/pages/formulario_002_a12/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_002_B12": //FORMULARIO 002-B/12
        return await (await import('src/app/pages/formulario_002_b12/components/formulario/formulario.component')).FormularioComponent;

      //Anexos Grupo03
      case "ANEXO_001_H17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-h17/anexo001-h17.component')).Anexo001H17Component;
      case "ANEXO_002_A17":
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-a17/anexo002-a17.component')).Anexo002A17Component;
      case "ANEXO_002_B17":
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-b17/anexo002-b17.component')).Anexo002B17Component;
      case "ANEXO_002_D17":
        return await (await import('src/app/pages/formulario_002_17/components/anexos/anexo002-d17/anexo002-d17.component')).Anexo002D17Component;

      //***GRUPO 4***
      case "ANEXO_001_A17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-a17/anexo001-a17.component')).Anexo001A17Component;
      case "ANEXO_001_B17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-b17/anexo001-b17.component')).Anexo001B17Component;
      case "ANEXO_001_C17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-c17/anexo001-c17.component')).Anexo001C17Component;
      case "ANEXO_001_D17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-d17/anexo001-d17.component')).Anexo001D17Component;
      case "ANEXO_001_E17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-e17/anexo001-e17.component')).Anexo001E17Component;
      case "ANEXO_001_F17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-f17/anexo001-f17.component')).Anexo001F17Component;
      case "ANEXO_001_G17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo001-g17/anexo001-g17.component')).Anexo001G17Component;
      case "ANEXO_003_E17":
        return await (await import('src/app/pages/formulario_001_17/components/anexos/anexo003-e17/anexo003-e17.component')).Anexo003E17Component;

      //***GRUPO FASE2***
      case "FORM_001_28": //FORMULARIO 001/28
        return await (await import('src/app/pages/formulario_001_28/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_002_28": //FORMULARIO 002/28
        return await (await import('src/app/pages/formulario_002_28/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_001_27": //FORMULARIO 001/27
        return await (await import('src/app/pages/formulario_001_27/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_001_27NT": //FORMULARIO 001/27
        return await (await import('src/app/pages/formulario_001_27NT/components/formulario/formulario.component')).FormularioComponent;
      case "FORM_004_27":
        return await (await import('src/app/pages/formulario_004_27/components/formulario/formulario.component')).FormularioComponent;

      case "ANEXO_001_A28":
        return await (await import('src/app/pages/formulario_001_28/components/anexos/anexo001-a28/anexo001-a28.component')).Anexo001A28Component;
      case "ANEXO_001_B28":
        return await (await import('src/app/pages/formulario_001_28/components/anexos/anexo001-b28/anexo001-b28.component')).Anexo001B28Component;
      case "ANEXO_001_C28":
        return await (await import('src/app/pages/formulario_001_28/components/anexos/anexo001-c28/anexo001-c28.component')).Anexo001C28Component;
      case "ANEXO_001_D28":
        return await (await import('src/app/pages/formulario_001_28/components/anexos/anexo001-d28/anexo001-d28.component')).Anexo001D28Component;
      case "ANEXO_002_A28":
        return await (await import('src/app/pages/formulario_002_28/components/anexos/anexo002-a28/anexo002-a28.component')).Anexo002A28Component;
      case "ANEXO_002_F28":
        return await (await import('src/app/pages/formulario_002_28/components/anexos/anexo002-f28/anexo002-f28.component')).Anexo002F28Component;
      case "ANEXO_002_G28":
        return await (await import('src/app/pages/formulario_002_28/components/anexos/anexo002-g28/anexo002-g28.component')).Anexo002G28Component;
      case "ANEXO_001_A_27": //ANEXO 001/A27
        return await (await import('src/app/pages/formulario_001_27/components/anexos/anexo001-a27/anexo001-a27.component')).Anexo001A27Component;
      case "ANEXO_001_C_27": //ANEXO 001/C28
        return await (await import('src/app/pages/formulario_001_27/components/anexos/anexo001-c27/anexo001-c27.component')).Anexo001C27Component;
      case "ANEXO_001_D_27": //ANEXO 001/D27
        return await (await import('src/app/pages/formulario_001_27/components/anexos/anexo001-d27/anexo001-d27.component')).Anexo001D27Component;
      case "ANEXO_001_B_27": //ANEXO 001/B27
        return await (await import('src/app/pages/formulario_001_27/components/anexos/anexo001-b27/anexo001-b27.component')).Anexo001B27Component;

      case "ANEXO_001_A27NT": //ANEXO 001/A27
        return await (await import('src/app/pages/formulario_001_27NT/components/anexos/anexo001-a27/anexo001-a27.component')).Anexo001A27Component;
      case "ANEXO_001_B27NT": //ANEXO 001/B27
        return await (await import('src/app/pages/formulario_001_27NT/components/anexos/anexo001-b27/anexo001-b27.component')).Anexo001B27Component;
      case "ANEXO_001_C27NT": //ANEXO 001/C28
        return await (await import('src/app/pages/formulario_001_27NT/components/anexos/anexo001-c27/anexo001-c27.component')).Anexo001C27Component;
      case "ANEXO_001_D27NT": //ANEXO 001/D27
        return await (await import('src/app/pages/formulario_001_27NT/components/anexos/anexo001-d27/anexo001-d27.component')).Anexo001D27Component;
      case "ANEXO_001_E27NT": //ANEXO 001/D27
        return await (await import('src/app/pages/formulario_001_27NT/components/anexos/anexo001-e27/anexo001-e27.component')).Anexo001E27Component;

      // RC
      case "ANEXO_004_A27":
        return await (await import('src/app/pages/formulario_004_27/components/anexos/anexo004-a27/anexo004-a27.component')).Anexo004A27Component;
      case "ANEXO_004_B27":
        return await (await import('src/app/pages/formulario_004_27/components/anexos/anexo004-b27/anexo004-b27.component')).Anexo004B27Component;
      case "ANEXO_004_C27":
        return await (await import('src/app/pages/formulario_004_27/components/anexos/anexo004-c27/anexo004-c27.component')).Anexo004C27Component;
      case "ANEXO_004_D27":
        return await (await import('src/app/pages/formulario_004_27/components/anexos/anexo004-d27/anexo004-d27.component')).Anexo004D27Component;

      //--------------------------------------------------------------------------------------------------------------------------------------------------------
      case "FORM_003_17_2":
        return await (await import('src/app/pages/formulario_003_17_2/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_003_A17_2":
        return await (await import('src/app/pages/formulario_003_17_2/presentation/pages/anexo003_a17_2/anexo003_a17_2.component')).Anexo003_a17_2_Component;
      case "ANEXO_003_B17_2":
        return await (await import('src/app/pages/formulario_003_17_2/presentation/pages/anexo003_b17_2/anexo003_b17_2.component')).Anexo003_b17_2_Component;

      case "FORM_002_17_2": //FORMULARIO 002/17.02
        return await (await import('src/app/pages/formulario_002_17_2/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_002_A17_2": //ANEXO 002-A/17.02
        return await (await import('src/app/pages/formulario_002_17_2/presentation/pages/anexo002_a17_2/anexo002_a17_2.component')).Anexo002_a17_2_Component;
      case "ANEXO_002_B17_2": //ANEXO 002-A/17.02
        return await (await import('src/app/pages/formulario_002_17_2/presentation/pages/anexo002_b17_2/anexo002_b17_2.component')).Anexo002_b17_2_Component;

      case "FORM_007_12": //FORMULARIO 007/12
        return await (await import('src/app/pages/formulario_007_12/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_004_12NT": //FORMULARIO 004/12 NUEVO TUPA
        return await (await import('src/app/pages/formulario_004_12NT/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_005_12": //FORMULARIO 005/12 NUEVO TUPA
        return await (await import('src/app/pages/formulario_005_12/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_006_12": //FORMULARIO 006/12 NUEVO TUPA
        return await (await import('src/app/pages/formulario_006_12/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_001_12": //FORMULARIO 001/12 NUEVO TUPA
        return await (await import('src/app/pages/formulario_001_12/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_001_12_4": //FORMULARIO 001/12 NUEVO TUPA
        return await (await import('src/app/pages/formulario_001_12_4/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_012_17_3": //FORMULARIO 012/17.3 NUEVO TUPA
        return await (await import('src/app/pages/formulario_012_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;

      case "ANEXO_012_A17_3":
        return await (await import('src/app/pages/formulario_012_17_3/presentation/pages/anexo012_A17_3/anexo012_A17_3.component')).Anexo012_A17_3_Component;

      case "FORM_001_28NT": // FORMULARIO 001/28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_001_A28NT": // ANEXO 001/A28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_a28nt/anexo001_a28nt.component')).Anexo001_a28nt_Component;
      case "ANEXO_001_B28NT": // ANEXO 001/B28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_b28nt/anexo001_b28nt.component')).Anexo001_b28nt_Component;
      case "ANEXO_001_C28NT": // ANEXO 001/C28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_c28nt/anexo001_c28nt.component')).Anexo001_c28nt_Component;
      case "ANEXO_001_D28NT": // ANEXO 001/D28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_d28nt/anexo001_d28nt.component')).Anexo001_d28nt_Component;
      case "ANEXO_001_E28NT": // ANEXO 001/E28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_e28nt/anexo001_e28nt.component')).Anexo001_e28nt_Component;
      case "ANEXO_001_F28NT": // ANEXO 001/E28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_f28nt/anexo001_f28nt.component')).Anexo001_f28nt_Component;
      case "ANEXO_001_G28NT": // ANEXO 001/E28NT
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001_g28nt/anexo001_g28nt.component')).Anexo001_g28nt_Component;

      case "FORM_003_28NT": // FORMULARIO 003/28NT
        return await (await import('src/app/pages/formulario_003_28/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_003_A28NT": // ANEXO 003/A28NT
        return await (await import('src/app/pages/formulario_003_28/presentation/pages/anexo003_A28/anexo003_A28.component')).Anexo003_A28_Component;
      case "ANEXO_003_B28NT": // ANEXO 003/B28NT
        return await (await import('src/app/pages/formulario_003_28/presentation/pages/anexo003_B28/anexo003_B28.component')).Anexo003_B28_Component;

      case "FORM_001_16": //FORMULARIO 001/16
        return await (await import('src/app/pages/formulario_001_16/presentation/pages/formulario/formulario.component')).FormularioComponent;

      case "FORM_002_28NT": //FORMULARIO 002/28
        return await (await import('src/app/pages/formulario_002_28NT/components/formulario/formulario.component')).FormularioComponent;

      case "ANEXO_002_A28NT":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-a28/anexo002-a28.component')).Anexo002A28Component;
      case "ANEXO_002_B28":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-b28/anexo002-b28.component')).Anexo002B28Component;
      case "ANEXO_002_C28":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-c28/anexo002-c28.component')).Anexo002C28Component;
      case "ANEXO_002_D28":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-d28/anexo002-d28.component')).Anexo002D28Component;
      case "ANEXO_002_E28":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-e28/anexo002-e28.component')).Anexo002E28Component;

      case "FORM_001_03": //FORMULARIO 001/03
        return await (await import('src/app/pages/formulario_001_03/presentation/pages/formulario/formulario.component')).FormularioComponent;

      case "FORM_001_17_03": //FORMULARIO 001/17.03
        return await (await import('src/app/pages/formulario_001_17_03/presentation/pages/formulario/formulario.component')).FormularioComponent;


      case "ANEXO_001_A17_03": //ANEXO 001-A/17.03
        return await (await import('src/app/pages/formulario_001_17_03/presentation/pages/anexo001_A17_03/anexo001_A17_03.component')).Anexo001_A17_03_Component;

      case "ANEXO_002_F28NT":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-f28/anexo002-f28.component')).Anexo002F28Component;
      case "ANEXO_002_G28NT":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-g28/anexo002-g28.component')).Anexo002G28Component;
      case "ANEXO_002_H28":
        return await (await import('src/app/pages/formulario_002_28NT/components/anexos/anexo002-h28/anexo002-h28.component')).Anexo002H28Component;

      case "FORM_001_17_2": //FORMULARIO 001/17.2 DSTT
        return await (await import('src/app/pages/formulario_001_17_2/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_001_A17_2":
        return await (await import('src/app/pages/formulario_001_17_2/presentation/pages/anexo001_A17_2/anexo001_a17_2.component')).Anexo001_a17_2_Component;


      case "FORM_002_27": //FORMULARIO 002/27
        return await (await import('src/app/pages/formulario_002_27/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_002_A27NT": //ANEXO 002/A27
        return await (await import('src/app/pages/formulario_002_27/presentation/pages/anexo002_A27/anexo002_A27.component')).Anexo002_A27Component;
      case "ANEXO_002_B27NT": //ANEXO 002/B27
        return await (await import('src/app/pages/formulario_002_27/presentation/pages/anexo002_B27/anexo002_B27.component')).Anexo002_B27Component;
      case "ANEXO_002_C27": //ANEXO 001-C/27
        return await (await import('src/app/pages/formulario_002_27/presentation/pages/anexo002_C27/anexo002_C27.component')).Anexo002_C27Component;
      case "ANEXO_002_D27": //ANEXO 001-D/27
        return await (await import('src/app/pages/formulario_002_27/presentation/pages/anexo002_D27/anexo002_D27.component')).Anexo002_D27Component;
      case "ANEXO_002_E27": //ANEXO 001-E/27
        return await (await import('src/app/pages/formulario_002_27/presentation/pages/anexo002_E27/anexo002_E27.component')).Anexo002_E27Component;



      case "FORM_003_27": //FORMULARIO 003/27
        //return await (await import('src/app/pages/formulario_003_27/components/formulario/formulario.component')).FormularioComponent;
        return await (await import('src/app/pages/formulario_003_27/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_003_A27": //ANEXO 003-A/27
        //return await (await import('src/app/pages/formulario_003_27/components/anexos/anexo003-a27/anexo003_a27.component')).Anexo003_a27_Component;
        return await (await import('src/app/pages/formulario_003_27/presentation/pages/anexo003_A27/anexo003_A27.component')).Anexo003_A27_Component;


      case "FORM_001_19_1": //FORMULARIO 001/19.01
        return await (await import('src/app/pages/formulario_001_19_1/components/formulario/formulario.component')).FormularioComponent;

      case "FORM_002_17_3": //FORMULARIO 002/17.03
        return await (await import('src/app/pages/formulario_002_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;

      case "ANEXO_002_A17_3": //ANEXO 002-A/17.03
        return await (await import('src/app/pages/formulario_002_17_3/presentation/pages/anexo002_a17_3/anexo002_a17_3.component')).Anexo002_a17_3_Component;

      case "ANEXO_001_ABCDNT": //ANEXO 002-A/17.03
        return await (await import('src/app/pages/formulario_001_28NT/components/anexos/anexo001-abcdnt/anexo001-abcdnt.component')).Anexo001AbcdntComponent;

      case "FORM_001_04_2": //FORMULARIO 001/04.02
        return await (await import('src/app/pages/formulario_001_04_2/presentation/pages/formulario/formulario.component')).FormularioComponent;

      case "FORM_001_PVI": //FORMULARIO 001 PVI/13.07
        return await (await import('src/app/pages/formulario_001_PVI/presentation/pages/formulario.component')).FormularioComponent;

      case "FORM_003_17_3": //FORMULARIO 003/17.03
        return await (await import('src/app/pages/formulario_003_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_003_A17_3": //ANEXO 003-A/17.03
        return await (await import('src/app/pages/formulario_003_17_3/presentation/pages/anexo003_A17_3/anexo003_A17_3.component')).Anexo003_A17_3_Component;

      case "FORM_004_17_3": //FORMULARIO 004/17.03
        return await (await import('src/app/pages/formulario_004_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_004_A17_3": //ANEXO 004-A/17.03
        return await (await import('src/app/pages/formulario_004_17_3/presentation/pages/anexo004_A17_3/anexo004_A17_3.component')).Anexo004_A17_3_Component;

      case "FORM_005_17_3": //FORMULARIO 005/17.03
        return await (await import('src/app/pages/formulario_005_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_005_A17_3": //ANEXO 005-A/17.03
        return await (await import('src/app/pages/formulario_005_17_3/presentation/pages/anexo005_A17_3/anexo005_A17_3.component')).Anexo005_A17_3_Component;
      case "ANEXO_005_B17_3": //ANEXO 005-B/17.03
        return await (await import('src/app/pages/formulario_005_17_3/presentation/pages/anexo005_B17_3/anexo005_B17_3.component')).Anexo005_B17_3_Component;

      case "FORM_006_17_3": //FORMULARIO 006/17.03
        return await (await import('src/app/pages/formulario_006_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_006_A17_3": //ANEXO 006-A/17.03
        return await (await import('src/app/pages/formulario_006_17_3/presentation/pages/anexo006_A17_3/anexo006_A17_3.component')).Anexo006_A17_3_Component;
      case "ANEXO_006_B17_3": //ANEXO 006-B/17.03
        return await (await import('src/app/pages/formulario_006_17_3/presentation/pages/anexo006_B17_3/anexo006_B17_3.component')).Anexo006_B17_3_Component;

      case "FORM_007_17_3": //FORMULARIO 007/17.03
        return await (await import('src/app/pages/formulario_007_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_007_A17_3": //ANEXO 007-A/17.03
        return await (await import('src/app/pages/formulario_007_17_3/presentation/pages/anexo007_A17_3/anexo007_A17_3.component')).Anexo007_A17_3_Component;
      case "ANEXO_007_B17_3": //ANEXO 007-B/17.03
        return await (await import('src/app/pages/formulario_007_17_3/presentation/pages/anexo007_B17_3/anexo007_B17_3.component')).Anexo007_B17_3_Component;
      case "ANEXO_007_C17_3": //ANEXO 007-C/17.03
        return await (await import('src/app/pages/formulario_007_17_3/presentation/pages/anexo007_C17_3/anexo007_C17_3.component')).Anexo007_C17_3_Component;

      case "FORM_008_17_3": //FORMULARIO 008/17.03
        return await (await import('src/app/pages/formulario_008_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_008_A17_3": //ANEXO 008-A/17.03
        return await (await import('src/app/pages/formulario_008_17_3/presentation/pages/anexo008_A17_3/anexo008_A17_3.component')).Anexo008_A17_3_Component;

      case "FORM_009_17_3": //FORMULARIO 009/17.03
        return await (await import('src/app/pages/formulario_009_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_009_A17_3": //ANEXO 009-A/17.03
        return await (await import('src/app/pages/formulario_009_17_3/presentation/pages/anexo009_A17_3/anexo009_A17_3.component')).Anexo009_A17_3_Component;
      case "ANEXO_009_B17_3": //ANEXO 009-B/17.03
        return await (await import('src/app/pages/formulario_009_17_3/presentation/pages/anexo009_B17_3/anexo009_B17_3.component')).Anexo009_B17_3_Component;

      case "FORM_010_17_3": //FORMULARIO 008/17.03
        return await (await import('src/app/pages/formulario_010_17_3/presentation/pages/formulario/formulario.component')).FormularioComponent;
      case "ANEXO_010_A17_3": //ANEXO 008-A/17.03
        return await (await import('src/app/pages/formulario_010_17_3/presentation/pages/anexo010_A17_3/anexo010_A17_3.component')).Anexo010_A17_3_Component;
    }

  }


}
