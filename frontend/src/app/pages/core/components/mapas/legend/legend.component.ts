
import { Component, OnInit, inject } from '@angular/core';
import { MapValueService } from '../../../../../core/services/mapas/map-values.service';
import { Legend } from '../../../../../core/models/Mapas/data.interface';
@Component({
  selector: 'lots-legend',
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss'
})
export class LegendComponent implements OnInit {

  public legendGroup: Legend[] = [];

  // servicio map values service
  private mapValuesService = inject(MapValueService);

  ngOnInit(): void {
    this.mapValuesService.getLegendGroup().subscribe((legendGroup) => {
      debugger;
      if(this.legendGroup.length === 0){
        this.legendGroup = legendGroup;
      }      
    });
  }

  getShapeClass(shape: any): string {
    if (shape.geometry === 'POLYGON') {
      return shape.contornoColor ? 'square dashed-border' : 'square';
    } else if (shape.geometry === 'POINT') {
      return 'point';
    } else {
      return 'square';
    }
  }

  getBackgroundColor(shape: any): string {
    if (shape.geometry === 'POINT') {
      return shape.color || '#000000'; // Color del punto
    }else{
    
     if (shape.geometry === 'POLYGON') {
      if(shape.capa === 'PUNTO CENTRAL'){
        console.log('contorno');
      }
  
     }
    }
    return shape.color || '#FFFFFF'; // Color de fondo por defecto
  }

  getBorderStyle(shape: any): string {
    if (shape.geometry === 'POLYGON' && shape.contornoColor) {
      return `2px solid ${shape.contornoColor}`;
    }
    return 'none';
  }
}

