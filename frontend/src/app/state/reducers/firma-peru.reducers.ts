import { createReducer, on } from '@ngrx/store';
import { loadActividadExtra } from '../actions/firma-peru.actions';
import { FirmaPeruState } from '../firma-peru.state';

export const initialState: FirmaPeruState = {
  loading: false,
};

export const firmaPeruReducer = createReducer(
  initialState,
  on(loadActividadExtra, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
);
