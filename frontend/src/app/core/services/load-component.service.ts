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

 



}
