import { createReducer, on } from '@ngrx/store';
import { uncollapseProced } from '../actions/procedimiento.actions';
import { ProcedimientoState } from '../procedimiento.state';

export const initialState: ProcedimientoState = {
  idProcUncollapse: null,
};

export const procedimientoReducer = createReducer(
  initialState,
  on(uncollapseProced, (state, { idProcUncollapse }) => {
    return {
      ...state,
      idProcUncollapse,
    };
  })
);
