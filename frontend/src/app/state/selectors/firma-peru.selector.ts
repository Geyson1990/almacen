import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectFeature = createSelector(
  createFeatureSelector('AppState'),
  (state: AppState) => state.firmaPeru
);

export const selectActividadExtraMineduList = createSelector(
  selectFeature,
  (state) => state.loading
);
