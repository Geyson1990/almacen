import { ActionReducerMap } from '@ngrx/store';
import { FirmaPeruState } from './firma-peru.state';
import { firmaPeruReducer } from './reducers/firma-peru.reducers';

export interface AppState {
  firmaPeru: FirmaPeruState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    firmaPeru: firmaPeruReducer,
};

export const ROOT_EFFECTS: any[] = [];
