import { createAction, props } from '@ngrx/store';

export const loadActividadExtra = createAction(
  '[Actividad Extra Minedu List] Load Actividades',
  props<{ idAnio: number }>()
);
