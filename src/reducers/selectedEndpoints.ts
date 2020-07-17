import {createSlice} from '@reduxjs/toolkit';

import {endpointInterface} from './relativeEndpoints';
import {RootState, AppThunk} from '../store';
import {store} from '../index';
import {post, isError} from '../requests';
import {addNotif} from './notifications';

type FieldValues = string | number | boolean;
export type FieldProps = 'key' | 'value' | 'type';

export interface Field {
    key: string;
    type: string;
    value: FieldValues;
    id: number;
    isChanged: boolean;
}

interface initialState {
    selected: number;
    endpoints: endpointInterface[];
    schema: string;
    isDirty: boolean;
}

interface getEndpointPayload {
    type: string;
    payload: endpointInterface;
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

interface updateSchemaPayload {
    type: string;
    payload: any;
}

interface setFieldsPayload {
    type: string;
    payload: Field[];
}

const matchField = (field1: Field, field2: Field): boolean => {
    return field1.key === field2.key;
};

const calculateSchema = (): any => {
    const state: RootState = store.getState();
    const selectedEndpointId: number = state.selectedEndpoints.selected;
    const fields = state.selectedEndpoints.endpoints.find((_) => _.id === selectedEndpointId).fields;
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
        selected: 0,
        endpoints: [],
        schema: '{}',
        isDirty: false,
    } as initialState,
    reducers: {
        setSelectedEndpoint: (state: initialState, action: getEndpointPayload) => {
            const selected = action.payload;
            if (state.selected === selected.id) return;
            state.selected = selected.id;
            if (!state.endpoints.some((_) => _.id === action.payload.id)) {
                state.endpoints.push(selected);
                state.isDirty = false;
            }
        },
        updateField: (state: initialState, action: updateFieldPayload) => {
            const {index, type, newValue} = action.payload;
            const selected = state.endpoints.find((_) => _.id === state.selected);
            const field = selected.fields[index];
            field[type] = newValue;
            if (field.id > 0) field.isChanged = true;
            state.isDirty = true;
        },
        addField: (state: initialState, action: addFieldPayload) => {
            const endpointId = state.selected;
            if (!state.endpoints.find((_) => _.id === endpointId).fields.some((_) => matchField(_, action.payload))) {
                state.endpoints.find((_) => _.id === endpointId).fields.push(action.payload);
                state.isDirty = true;
            }
        },
        deleteField: (state: initialState, action: deleteFieldPayload) => {
            const endpointId = state.selected;
            state.endpoints.find((_) => _.id === endpointId).fields.splice(action.payload, 1);
            state.isDirty = true;
        },
        updateSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schema = JSON.stringify(action.payload, null, 4);
        },
        setFields: (state: initialState, action: setFieldsPayload) => {
            state.isDirty = false;
            const endpointId = state.selected;
            state.endpoints.find((_) => _.id === endpointId).fields = action.payload;
        },
    },
});

export default selectedEndpoints.reducer;

export const setSelectedEndpoint = (payload: endpointInterface): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.setSelectedEndpoint(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

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

export const getSelectedEndpoint = (state: RootState) => ({
    selectedEndpoint: state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected),
    schema: state.selectedEndpoints.schema,
    isDirty: state.selectedEndpoints.isDirty,
});

export const save = (): AppThunk => async (dispatch) => {
    const state: RootState = store.getState();
    const selected = state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected);
    const resp = await post('updateSchema/', dispatch, {
        fields: selected.fields,
        id: selected.id,
    });
    if (!isError(resp)) {
        dispatch(selectedEndpoints.actions.setFields(resp.fields));
        dispatch(
            addNotif({
                variant: 'success',
                text: 'Schema successfully saved',
            })
        );
    }
};
