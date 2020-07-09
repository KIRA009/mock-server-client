import {createSlice} from '@reduxjs/toolkit';
import {RootState, AppThunk} from '../store';

export type methods = 'GET' | 'POST' | 'PUT';

export interface endpointInterface {
    endpoint: string;
    method: methods;
}

interface initialState {
    endpoints: {
        [key: string]: {
            endpoints: endpointInterface[];
            loading: boolean;
            addEndpointLoading: boolean;
        };
    };
    addEndpointLoading: boolean;
}

interface toggleLoadingPayload {
    type: string;
    payload: string;
}

interface getEndpointsPayload {
    type: string;
    payload: {
        baseEndpoint: string;
        endpoints: endpointInterface[];
    };
}

interface addEndpointPayload {
    type: string;
    payload: {
        baseEndpoint: string;
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
            const baseEndpoint: string = action.payload;
            state.endpoints[baseEndpoint] = {
                endpoints: [],
                loading: true,
                addEndpointLoading: false,
            };
        },
        endInitialLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpoint: string = action.payload;
            state.endpoints[baseEndpoint].loading = false;
            state.endpoints[baseEndpoint].addEndpointLoading = false;
        },
        initiateRelativeEndpoints: (state: initialState, action: getEndpointsPayload) => {
            const {baseEndpoint, endpoints} = action.payload;
            if (baseEndpoint in state.endpoints) state.endpoints[baseEndpoint].endpoints = endpoints;
        },
        addRelativeEndpoint: (state: initialState, action: addEndpointPayload) => {
            const {baseEndpoint, endpoint} = action.payload;
            if (baseEndpoint in state.endpoints) {
                let _endpoint = state.endpoints[baseEndpoint].endpoints.find((_) => _.endpoint === endpoint.endpoint);
                if (!!!_endpoint || _endpoint.method !== endpoint.method)
                    state.endpoints[baseEndpoint].endpoints.push(endpoint);
            }
        },
        startAddEndpointLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpoint = action.payload;
            if (baseEndpoint in state.endpoints) state.endpoints[baseEndpoint].addEndpointLoading = true;
        },
        endAddEndpointLoading: (state: initialState, action: toggleLoadingPayload) => {
            const baseEndpoint = action.payload;
            if (baseEndpoint in state.endpoints) state.endpoints[baseEndpoint].addEndpointLoading = false;
        },
    },
});

export const {initiateRelativeEndpoints, startAddEndpointLoading, endAddEndpointLoading} = relativeEndpoints.actions;

export default relativeEndpoints.reducer;

export const fillRelativeEndpoints = (baseEndpoint: string): AppThunk => (dispatch) => {
    dispatch(relativeEndpoints.actions.startInitialLoading(baseEndpoint));
    setTimeout(() => {
        dispatch(
            initiateRelativeEndpoints({
                baseEndpoint,
                endpoints: [
                    {
                        endpoint: '/feature',
                        method: 'GET',
                    },
                    {
                        endpoint: '/feature',
                        method: 'POST',
                    },
                    {
                        endpoint: '/feature',
                        method: 'PUT',
                    },
                ],
            })
        );
        dispatch(relativeEndpoints.actions.endInitialLoading(baseEndpoint));
    }, 2000);
};

export const addRelativeEndpoint = (payload: {baseEndpoint: string; endpoint: endpointInterface}): AppThunk => (
    dispatch
) => {
    dispatch(startAddEndpointLoading(payload.baseEndpoint));
    setTimeout(() => {
        dispatch(relativeEndpoints.actions.addRelativeEndpoint(payload));
        dispatch(endAddEndpointLoading(payload.baseEndpoint));
    }, 2000);
};

export const getRelativeEndPoints = (baseEndpoint: string) => (
    state: RootState
): {
    endpoints: endpointInterface[];
    loading: boolean;
    addEndpointLoading: boolean;
} => {
    if (baseEndpoint in state.relativeEndpoints.endpoints) return state.relativeEndpoints.endpoints[baseEndpoint];
    return {
        endpoints: [],
        loading: false,
        addEndpointLoading: false,
    };
};
