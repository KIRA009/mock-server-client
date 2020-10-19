import {createSlice} from '@reduxjs/toolkit';

import {RootState, AppThunk} from '../store';
import {get, post, isError} from '../requests';
import {Field} from './selectedEndpoints';

export type methods = 'GET' | 'POST' | 'PUT';

export interface metaData {
    num_pages: number;
    is_paginated: boolean;
}

export interface endpointInterface {
    endpoint: string;
    regex_endpoint: string;
    method: methods;
    base_endpoint: number;
    id: number;
    fields: Field[];
    baseEndpoint: string;
    meta_data: metaData;
    changed?: any;
    url_params: string[];
}

interface initialState {
    endpoints: {
        [key: number]: {
            endpoints: endpointInterface[];
            loading: boolean;
            addEndpointLoading: boolean;
        };
    };
    addEndpointLoading: boolean;
}

interface toggleLoadingPayload {
    type: string;
    payload: number;
}

interface getEndpointsPayload {
    type: string;
    payload: {
        baseEndpointId: number;
        endpoints: endpointInterface[];
    };
}

interface addEndpointPayload {
    type: string;
    payload: {
        baseEndpointId: number;
        endpoint: endpointInterface;
    };
}

const relativeEndpoints = createSlice({
    name: 'relativeEndpoints',
    initialState: {
        endpoints: {},
        addEndpointLoading: false,
    } as initialState,
    reducers: {
        startInitialLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpointId: number = action.payload;
            state.endpoints[baseEndpointId] = {
                endpoints: [],
                loading: true,
                addEndpointLoading: false,
            };
        },
        endInitialLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpointId: number = action.payload;
            state.endpoints[baseEndpointId].loading = false;
            state.endpoints[baseEndpointId].addEndpointLoading = false;
        },
        initiateRelativeEndpoints: (state: initialState, action: getEndpointsPayload) => {
            const {baseEndpointId, endpoints} = action.payload;
            if (baseEndpointId in state.endpoints) state.endpoints[baseEndpointId].endpoints = endpoints;
        },
        addRelativeEndpoint: (state: initialState, action: addEndpointPayload) => {
            const {baseEndpointId, endpoint} = action.payload;
            if (baseEndpointId in state.endpoints) {
                let _endpoint = state.endpoints[baseEndpointId].endpoints.find((_) => _.endpoint === endpoint.endpoint);
                if (!!!_endpoint || _endpoint.method !== endpoint.method)
                    state.endpoints[baseEndpointId].endpoints.push(endpoint);
            }
        },
        startAddEndpointLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpointId: number = action.payload;
            if (baseEndpointId in state.endpoints) state.endpoints[baseEndpointId].addEndpointLoading = true;
        },
        endAddEndpointLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpointId: number = action.payload;
            if (baseEndpointId in state.endpoints) state.endpoints[baseEndpointId].addEndpointLoading = false;
        },
    },
});

export const {initiateRelativeEndpoints, startAddEndpointLoading, endAddEndpointLoading} = relativeEndpoints.actions;

export default relativeEndpoints.reducer;

export const fillRelativeEndpoints = (baseEndpointId: number): AppThunk => async (dispatch: any) => {
    dispatch(relativeEndpoints.actions.startInitialLoading(baseEndpointId));
    let resp = await get(`relative-endpoints/get/${baseEndpointId}/`, dispatch);
    if (!isError(resp)) {
        dispatch(
            initiateRelativeEndpoints({
                baseEndpointId,
                endpoints: resp.relativeEndpoints,
            })
        );
        dispatch(relativeEndpoints.actions.endInitialLoading(baseEndpointId));
    }
};

export const addRelativeEndpoint = (payload: endpointInterface): AppThunk => async (dispatch: any) => {
    const baseEndpointId: number = payload.base_endpoint;
    dispatch(startAddEndpointLoading(baseEndpointId));
    delete payload['id'];
    const resp = await post(`relative-endpoints/add/`, dispatch, {
        id: baseEndpointId,
        endpoint: payload.endpoint,
        method: payload.method,
    });
    if (!isError(resp)) {
        dispatch(
            relativeEndpoints.actions.addRelativeEndpoint({
                baseEndpointId,
                endpoint: {
                    ...payload,
                    id: resp.id,
                    regex_endpoint: resp.regex_endpoint,
                    url_params: resp.url_params
                },
            })
        );
        dispatch(endAddEndpointLoading(baseEndpointId));
    }
};

export const getRelativeEndPoints = (baseEndpointId: number) => (
    state: RootState
): {
    endpoints: endpointInterface[];
    loading: boolean;
    addEndpointLoading: boolean;
} => {
    if (baseEndpointId in state.relativeEndpoints.endpoints) return state.relativeEndpoints.endpoints[baseEndpointId];
    return {
        endpoints: [],
        loading: false,
        addEndpointLoading: false,
    };
};
