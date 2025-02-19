import { createAction, props } from '@ngrx/store';

export const uncollapseProced = createAction(
  '[Publico] Uncollapse Procedimiento',
  props<{
    idProcUncollapse: number | null;
  }>()
);
