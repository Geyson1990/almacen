import { ActionReducerMap } from '@ngrx/store';
import { ProcedimientoState } from './procedimiento.state';
import { procedimientoReducer } from './reducers/procedimiento.reducer';

export interface PublicoAppState {
  procedimiento: ProcedimientoState;
}

export const ROOT_REDUCER: ActionReducerMap<PublicoAppState> = {
  procedimiento: procedimientoReducer,
};

export const APP_EFFECTS = [];
