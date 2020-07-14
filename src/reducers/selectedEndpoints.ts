import {createSlice} from '@reduxjs/toolkit';

import {methods} from './relativeEndpoints';
import {RootState, AppThunk} from '../store';
import {store} from '../index';

type FieldValues = string | number | boolean;
export type FieldProps = 'key' | 'value' | 'type';

export interface Field {
    key: string;
    type: string;
    value: FieldValues;
}

interface endpointInfo {
    baseEndpoint: string;
    endpoint: string;
    method: methods;
}

interface endpointWithFieldsInfo {
    baseEndpoint: string;
    endpoint: string;
    method: methods;
    fields: Field[];
    schema: any;
}

interface initialState {
    selected: endpointInfo;
    endpoints: endpointWithFieldsInfo[];
}

interface getEndpointPayload {
    type: string;
    payload: endpointInfo;
}

interface updateFieldPayload {
    type: string;
    payload: {
        type: FieldProps;
        newValue: string;
        index: number;
    };
}

interface addFieldPayload {
    type: string;
    payload: Field;
}

interface deleteFieldPayload {
    type: string;
    payload: number;
}

interface updateSchema {
    type: string;
    payload: any;
}

const match = (end1: endpointInfo, end2: endpointInfo) => {
    return end1.method === end2.method && end1.baseEndpoint === end2.baseEndpoint && end1.endpoint === end2.endpoint;
};

const calculateSchema = (): any => {
    const state: RootState = store.getState();
    const selectedEndpoint: endpointInfo = state.selectedEndpoints.selected;
    const fields = state.selectedEndpoints.endpoints.find((_) => match(_, selectedEndpoint)).fields;
    const schema: any = {};
    const schemas = state.possibleValues.schemas;
    for (let field of fields) {
        if (field.type === 'schema') {
            schema[field.key] = schemas.find((_) => _.name === field.value)?.schema;
        } else {
            schema[field.key] = field.value;
        }
    }
    return schema;
};

const selectedEndpoints = createSlice({
    name: 'selectedEndpoints',
    initialState: {
        selected: {
            baseEndpoint: '',
            endpoint: '',
            method: 'GET',
        },
        endpoints: [],
    } as initialState,
    reducers: {
        setSelectedEndpoint: (state: initialState, action: getEndpointPayload) => {
            state.selected = action.payload;
            if (state.endpoints.filter((_) => match(_, action.payload)).length === 0) {
                state.endpoints.push({
                    ...action.payload,
                    fields: [],
                    schema: '{}',
                });
            }
        },
        updateField: (state: initialState, action: updateFieldPayload) => {
            const {index, type, newValue} = action.payload;
            const endpoint = state.selected;
            state.endpoints.find((_) => match(_, endpoint)).fields[index][type] = newValue;
        },
        addField: (state: initialState, action: addFieldPayload) => {
            const endpoint = state.selected;
            state.endpoints.find((_) => match(_, endpoint)).fields.push(action.payload);
        },
        deleteField: (state: initialState, action: deleteFieldPayload) => {
            const endpoint = state.selected;
            state.endpoints.find((_) => match(_, endpoint)).fields.splice(action.payload, 1);
        },
        updateSchema: (state: initialState, action: updateSchema) => {
            const endpoint = state.selected;
            state.endpoints.find((_) => match(_, endpoint)).schema = JSON.stringify(action.payload, null, 4);
        },
    },
});

export default selectedEndpoints.reducer;
export const {setSelectedEndpoint} = selectedEndpoints.actions;

export const addField = (payload: Field): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.addField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

export const updateField = (payload: {type: FieldProps; newValue: string; index: number}): AppThunk => (
    dispatch: any
) => {
    dispatch(selectedEndpoints.actions.updateField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

export const deleteField = (payload: number): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.deleteField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

export const getSelectedEndpoint = (state: RootState) =>
    state.selectedEndpoints.endpoints.find((_) => match(_, state.selectedEndpoints.selected));
