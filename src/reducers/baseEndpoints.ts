import {createSlice} from '@reduxjs/toolkit';

import {AppThunk, RootState} from '../store';
import {get, post} from '../requests';

interface baseEndpoint {
    endpoint: string;
    id: number;
}

interface initialState {
    baseEndpoints: baseEndpoint[];
    loading: boolean;
    error: string;
    addBaseEndpointLoading: boolean;
}
interface addBaseEndpointPayload {
    type: string;
    payload: baseEndpoint;
}

interface initiateBaseEndpointPayload {
    type: string;
    payload: baseEndpoint[];
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
            if (!state.baseEndpoints.some((_) => _.id === action.payload.id)) {
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

export const fillBaseEndpoints = (): AppThunk => async (dispatch: any) => {
    dispatch(startLoading(null));
    const baseEndpoints = await get('base-endpoints/get/', dispatch);
    if (!('error' in baseEndpoints)) {
        dispatch(initiateBaseEndPoints(baseEndpoints.baseEndpoints));
        dispatch(endLoading(null));
    }
};

export const addBaseEndpoint = (payload: string): AppThunk => async (dispatch: any) => {
    dispatch(baseEndpoints.actions.startAddEndpointLoading(null));
    const resp = await post('base-endpoint/add/', dispatch, {
        endpoint: payload,
    });
    if (!('error' in resp)) {
        dispatch(
            baseEndpoints.actions._addBaseEndpoint({
                endpoint: payload,
                id: resp.id,
            })
        );
        dispatch(endAddEndpointLoading(null));
    }
};

export const getBaseEndPoints = (state: RootState): initialState => state.baseEndpoints;
