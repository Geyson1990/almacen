export class Seccion1 {
  empresa: string
  servicio: string
  modalidad: string
}

export class Seccion2 {
  planAnual: PlanCoberturaAnual
  planAcumulado: PlanCoberturaAcumulado

  constructor(){
    this.planAnual = new PlanCoberturaAnual()
    this.planAcumulado = new PlanCoberturaAcumulado()
  }
}

export class Seccion3 {
  planAnual: PlanCoberturaAnual
  planAcumulado: PlanCoberturaAcumulado

  constructor(){
    this.planAnual = new PlanCoberturaAnual()
    this.planAcumulado = new PlanCoberturaAcumulado()
  }
}
export class PlanCoberturaAnual {
  anio1: string
  anio2: string
  anio3: string
  anio4: string
  anio5: string
}

export class PlanCoberturaAcumulado {
  anio1: string
  anio2: string
  anio3: string
  anio4: string
  anio5: string
}
