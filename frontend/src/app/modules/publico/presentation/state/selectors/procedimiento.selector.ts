import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PublicoAppState } from '../app.state';

export const selectFeature = createSelector(
  createFeatureSelector('PublicoAppState'),
  (state: PublicoAppState) => state.procedimiento
);

export const selectIdProcUncollapse = createSelector(
  selectFeature,
  (state) => state.idProcUncollapse
);
