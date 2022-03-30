import { createStore } from 'react-hooks-global-state';
import { User } from 'firebase';

const initialState: IAppCtxState = {
    userSession: null,
    user: null
}

export interface IAppCtxState {
    userSession: string | null,
    user: User | null
}

export type IAppCtxActions =
    | { type: 'setUserSession', userSession: string }
    | { type: 'setUser', user: User | null }

const reducer = (state: IAppCtxState, action: IAppCtxActions) => {
    switch (action.type) {
        case 'setUserSession':
            return {
                ...state,
                userSession: action.userSession
            };
        case 'setUser': 
            return {
                ...state,
                user: action.user
            }    
        default:
            return state;
    }
};

export const { GlobalStateProvider, useGlobalState, getState, dispatch } = createStore(reducer, initialState);