import {createSlice} from '@reduxjs/toolkit';

import {endpointInterface} from './relativeEndpoints';
import {RootState, AppThunk} from '../store';
import {store} from '../index';
import {post, isError} from '../requests';
import {addNotif} from './notifications';
export type FieldProps = 'key' | 'value' | 'type';

export interface Field {
    key: string;
    type: string;
    value: any;
    id: number;
    is_array: boolean;
    isChanged: boolean;
    oldValues?: any;
}

interface toggleUpdateLoadingPayload {
    type: string;
    payload: boolean;
}

interface initialState {
    selected: number;
    endpoints: endpointInterface[];
    schema: string;
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

interface metaDataPayload {
    type: string;
    payload: {
        key: string;
        value: boolean | number;
    };
}

const matchField = (field1: Field, field2: Field): boolean => {
    return field1.key === field2.key;
};

const calculateSchema = (): any => {
    const state: RootState = store.getState();
    const selectedEndpointId: number = state.selectedEndpoints.selected;
    const selectedEndpoint = state.selectedEndpoints.endpoints.find((_) => _.id === selectedEndpointId);
    const fields = selectedEndpoint.fields;
    const schema: any = {};
    const schemas = state.possibleValues.schemas;
    for (let field of fields) {
        if (field.type === 'schema') {
            schema[field.key] = schemas.find((_) => _.name === field.value)?.schema;
        } else if (field.type === 'value') {
            schema[field.key] = field.value;
        } else if (field.type === 'url_param') {
            schema[field.key] = `{{urlParam '${field.value}'}}`;
        } else {
            schema[field.key] = `{{queryParam '${field.value}'}}`;
        }
        if (field.is_array) {
            const temp = new Array(5);
            temp.fill(schema[field.key], 0, 5);
            schema[field.key] = temp;
        }
    }
    if (selectedEndpoint.meta_data.is_paginated) {
        schema['page_num'] = 1;
        schema['total_pages'] = Number(selectedEndpoint.meta_data.num_pages);
    }
    return schema;
};

const getSelected = (state: initialState) => state.endpoints.find((_) => _.id === state.selected);

const selectedEndpoints = createSlice({
    name: 'selectedEndpoints',
    initialState: {
        selected: 0,
        endpoints: [],
        schema: '{}',
    } as initialState,
    reducers: {
        setSelectedEndpoint: (state: initialState, action: getEndpointPayload) => {
            const selected = action.payload;
            let endpoint = state.endpoints.find((_) => _.id === action.payload.id);
            if (!endpoint) {
                selected.changed = {};
                selected.isDirty = false;
                selected.deleted = [];
                state.endpoints.push(selected);
            } else {
                endpoint.method = action.payload.method;
                endpoint.endpoint = action.payload.endpoint;
            }
            if (state.selected === selected.id) return;
            state.selected = selected.id;
        },
        updateField: (state: initialState, action: updateFieldPayload) => {
            const {index, type, newValue} = action.payload;
            const selected = getSelected(state);
            const field = selected.fields[index];
            const oldValue = field[type];
            field[type] = newValue;
            if (field.id > 0 && !field.isChanged) {
                field.isChanged = true;
                field.oldValues = {};
            }
            if (field.id > 0 && !(type in field.oldValues)) field.oldValues[type] = oldValue;
            selected.isDirty = true;
        },
        addField: (state: initialState, action: addFieldPayload) => {
            if (!getSelected(state).fields.some((_) => matchField(_, action.payload))) {
                const selected = getSelected(state);
                selected.fields.push(action.payload);
                selected.isDirty = true;
            }
        },
        deleteField: (state: initialState, action: deleteFieldPayload) => {
            const endpoint = getSelected(state);
            const field: Field = endpoint.fields.splice(action.payload, 1)[0];
            endpoint.isDirty = true;
            if (field.id === 0) return;
            endpoint.deleted.push(field);
        },
        updateSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schema = JSON.stringify(action.payload, null, 4);
        },
        setFields: (state: initialState, action: setFieldsPayload) => {
            const selected = getSelected(state);
            selected.fields = action.payload;
            selected.isDirty = false;
        },
        updateMeta: (state: initialState, action: metaDataPayload) => {
            const selected = getSelected(state);
            selected.isDirty = true;
            const {key, value} = action.payload;
            if (!(key in selected.changed)) {
                if (key === 'num_pages') selected.changed[key] = selected.meta_data.num_pages;
                else if (key === 'is_paginated') selected.changed[key] = selected.meta_data.is_paginated;
            }
            if (key === 'num_pages') selected.meta_data.num_pages = value as number;
            else if (key === 'is_paginated') selected.meta_data.is_paginated = value as boolean;
        },
        toggleUpdateEndpointLoading: (state: initialState, action: toggleUpdateLoadingPayload) => {
            const selected = state.endpoints.find((_) => _.id === state.selected);
            selected.isUpdating = action.payload;
        },
        discardChanges: (state: initialState, action) => {
            const selected = getSelected(state);
            selected.fields = selected.fields.filter((_) => _.id > 0);
            for (let field of selected.deleted) {
                selected.fields.push(field);
            }
            if (selected.changed) {
                for (let key in selected.changed) {
                    if (key === 'num_pages') selected.meta_data.num_pages = selected.changed[key] as number;
                    else if (key === 'is_paginated') selected.meta_data.is_paginated = selected.changed[key] as boolean;
                }
            }
            selected.changed = {};
            const fields = selected.fields;
            for (let field of fields) {
                if (field.isChanged) {
                    if ('key' in field.oldValues) field.key = field.oldValues.key;
                    if ('type' in field.oldValues) field.type = field.oldValues.type;
                    if ('value' in field.oldValues) field.value = field.oldValues.value;
                    if ('is_array' in field.oldValues) field.is_array = field.oldValues.is_array;
                }
            }
            selected.deleted = [];
            selected.isDirty = false;
        },
        saveChanges: (state: initialState, action) => {
            const selected = state.endpoints.find((_) => _.id === state.selected);
            selected.changed = {};
        },
        resetSelectedEndpoint: (state: initialState, action) => {
            state.selected = 0;
        },
    },
});

export default selectedEndpoints.reducer;

export const {toggleUpdateEndpointLoading, resetSelectedEndpoint} = selectedEndpoints.actions;

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

export const discard = (dispatch: any) => {
    dispatch(selectedEndpoints.actions.discardChanges(null));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

export const getSelectedEndpoint = (state: RootState) => ({
    selectedEndpoint: state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected),
    schema: state.selectedEndpoints.schema,
});

export const save = (): AppThunk => async (dispatch) => {
    const state: RootState = store.getState();
    const selected = state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected);
    const resp = await post('update_schema/', dispatch, {
        fields: selected.fields,
        id: selected.id,
        meta_data: selected.meta_data,
    });
    if (!isError(resp)) {
        dispatch(selectedEndpoints.actions.setFields(resp.fields));
        dispatch(
            addNotif({
                variant: 'success',
                text: 'Schema successfully saved',
            })
        );
        dispatch(selectedEndpoints.actions.saveChanges(null));
    }
};

export const updateMeta = (payload: {key: string; value: number | boolean}): AppThunk => async (dispatch) => {
    const {key, value} = payload;
    dispatch(
        selectedEndpoints.actions.updateMeta({
            key,
            value,
        })
    );
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};
