import {createSlice} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../store';

interface initialState {
    baseEndpoints: string[];
    loading: boolean;
    error: string;
    addBaseEndpointLoading: boolean;
}
interface addBaseEndpointPayload {
    type: string;
    payload: string;
}

interface initiateBaseEndpointPayload {
    type: string;
    payload: string[];
}

const baseEndpoints = createSlice({
    name: 'baseEndpoints',
    initialState: {
        baseEndpoints: [],
        loading: false,
        error: '',
        addBaseEndpointLoading: false,
    },
    reducers: {
        startLoading: (state: initialState, _?) => {
            state.loading = true;
        },
        endLoading: (state: initialState, _?) => {
            state.loading = false;
        },
        startAddEndpointLoading: (state: initialState, _?) => {
            state.addBaseEndpointLoading = true;
        },
        endAddEndpointLoading: (state: initialState, _?) => {
            state.addBaseEndpointLoading = false;
        },
        initiateBaseEndPoints: (state: initialState, action: initiateBaseEndpointPayload) => {
            state.baseEndpoints = action.payload;
        },
        _addBaseEndpoint: (state: initialState, action: addBaseEndpointPayload) => {
            if (state.baseEndpoints.indexOf(action.payload) === -1) {
                state.baseEndpoints.push(action.payload);
            }
        },
    },
});

export const {
    initiateBaseEndPoints,
    startLoading,
    endLoading,
    startAddEndpointLoading,
    endAddEndpointLoading,
} = baseEndpoints.actions;

export default baseEndpoints.reducer;

export const fillBaseEndpoints = (): AppThunk => (dispatch) => {
    dispatch(startLoading(null));
    setTimeout(() => {
        dispatch(initiateBaseEndPoints(['/pro']));
        dispatch(endLoading(null));
    }, 2000);
};

export const addBaseEndpoint = (payload: string): AppThunk => (dispatch) => {
    dispatch(baseEndpoints.actions.startAddEndpointLoading(null));
    setTimeout(() => {
        dispatch(baseEndpoints.actions._addBaseEndpoint(payload));
        dispatch(endAddEndpointLoading(null));
    }, 2000);
};

export const getBaseEndPoints = (state: RootState): initialState => state.baseEndpoints;
