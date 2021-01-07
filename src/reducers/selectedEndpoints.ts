import {createSlice} from '@reduxjs/toolkit';

import {endpointInterface} from './relativeEndpoints';
import {RootState, AppThunk} from '../store';
import {store} from '../index';
import {post, isError} from '../requests';
import {addNotif} from './notifications';
import { type } from 'os';
export type FieldProps = 'key' | 'value' | 'type';
<<<<<<< HEAD
export type HeaderFieldProps = 'key' | 'value';
=======
export type HeaderFieldProps= 'key' | 'value'
>>>>>>> feat(): Added Headers field

export interface Field {
    key: string;
    type: string;
    value: any;
    id: number;
    is_array: boolean;
    isChanged: boolean;
    oldValues?: any;
}
export interface HeaderField {
    key: string;
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
<<<<<<< HEAD
    schemaHeader: string;
=======
    schemaHeader:string;
>>>>>>> feat(): Added Headers field
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
interface updateHeaderFieldPayload {
    type: string;
    payload: {
        type: HeaderFieldProps;
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
interface addHeaderFieldPayload {
    type: string;
    payload: HeaderField;
}

interface deleteHeaderFieldPayload {
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
interface setHeaderFieldsPayload {
    type: string;
    payload: HeaderField[];
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
const matchHeaderField = (field1: HeaderField, field2: HeaderField): boolean => {
    return field1.key === field2.key;
};

const calculateSchema = (): any => {
    const state: RootState = store.getState();
    const selectedEndpointId: number = state.selectedEndpoints.selected;
    const selectedEndpoint = state.selectedEndpoints.endpoints.find((_) => _.id === selectedEndpointId);
    const fields = selectedEndpoint.fields;
    const schema: any = {};
    const schemaHeader: any = {};
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
        const paginatedSchema: any = {};
        paginatedSchema['items'] = Array(
            Object.keys(schema).length ? selectedEndpoint.meta_data.records_per_page : 0
        ).fill(schema);
        paginatedSchema['page_no'] = 1;
        paginatedSchema['total_pages'] = Math.ceil(
            Number(selectedEndpoint.meta_data.num_records) / Number(selectedEndpoint.meta_data.records_per_page)
        );
        return paginatedSchema;
    }
    return schema;
};
const calculateSchemaHeader = (): any => {
    const state: RootState = store.getState();
    const selectedEndpointId: number = state.selectedEndpoints.selected;
    const selectedEndpoint = state.selectedEndpoints.endpoints.find((_) => _.id === selectedEndpointId);
<<<<<<< HEAD
    const headerFields = selectedEndpoint.headerFields;
    const schemaHeader: any = {};

    for (let headerField of headerFields) {
        schemaHeader[headerField.key] = headerField.value;
=======
    const headerFields=selectedEndpoint.headerFields;
    const schemaHeader: any = {};
   
    for(let headerField of headerFields){
        schemaHeader[headerField.key]=headerField.value;
>>>>>>> feat(): Added Headers field
    }
    return schemaHeader;
};

const getSelected = (state: initialState) => state.endpoints.find((_) => _.id === state.selected);

const selectedEndpoints = createSlice({
    name: 'selectedEndpoints',
    initialState: {
        selected: 0,
        endpoints: [],
        schema: '{}',
        schemaHeader: '{}',
    } as initialState,
    reducers: {
        setSelectedEndpoint: (state: initialState, action: getEndpointPayload) => {
            const selected = action.payload;
            let endpoint = state.endpoints.find((_) => _.id === action.payload.id);
            if (!endpoint) {
                selected.changed = {};
                selected.isDirty = false;
                selected.deleted = [];
<<<<<<< HEAD
                selected.headerFields = []; //Now setting it default to empty array

=======
                selected.headerFields=[]; //Now setting it default to empty array
                
>>>>>>> feat(): Added Headers field
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
        updateHeaderField: (state: initialState, action: updateHeaderFieldPayload) => {
<<<<<<< HEAD
            const {index, type, newValue} = action.payload;
=======
            const {index,type,newValue} = action.payload;
>>>>>>> feat(): Added Headers field
            const selected = getSelected(state);
            const headerField = selected.headerFields[index];
            const oldValue = headerField[type];
            headerField[type] = newValue;
            if (headerField.id > 0 && !headerField.isChanged) {
                headerField.isChanged = true;
                headerField.oldValues = {};
            }
            if (headerField.id > 0 && !(type in headerField.oldValues)) headerField.oldValues[type] = oldValue;
            selected.isDirty = true;
<<<<<<< HEAD
=======

            
>>>>>>> feat(): Added Headers field
        },
        addField: (state: initialState, action: addFieldPayload) => {
            if (!getSelected(state).fields.some((_) => matchField(_, action.payload))) {
                const selected = getSelected(state);
                selected.fields.push(action.payload);
                selected.isDirty = true;
            }
        },
        addHeaderField: (state: initialState, action: addHeaderFieldPayload) => {
            if (!getSelected(state).headerFields?.some((_) => matchHeaderField(_, action.payload))) {
                const selected = getSelected(state);
                selected.headerFields?.push(action.payload);
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
        deleteHeaderField: (state: initialState, action: deleteHeaderFieldPayload) => {
            const endpoint = getSelected(state);
            const headerField: HeaderField = endpoint.headerFields.splice(action.payload, 1)[0];
            endpoint.isDirty = true;
            if (headerField.id === 0) return;
            endpoint.deletedHeader.push(headerField);
        },
<<<<<<< HEAD

=======
        
        
>>>>>>> feat(): Added Headers field
        updateSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schema = JSON.stringify(action.payload, null, 4);
        },
        updateSchemaHeader: (state: initialState, action: updateSchemaPayload) => {
            state.schemaHeader = JSON.stringify(action.payload, null, 4);
        },
        setFields: (state: initialState, action: setFieldsPayload) => {
            const selected = getSelected(state);
            selected.fields = action.payload;
            selected.isDirty = false;
        },
        setHeaderFields: (state: initialState, action: setHeaderFieldsPayload) => {
            const selected = getSelected(state);
            selected.headerFields = action.payload;
            selected.isDirty = false;
        },
        updateMeta: (state: initialState, action: metaDataPayload) => {
            const selected = getSelected(state);
            selected.isDirty = true;
            const {key, value} = action.payload;
            if (!(key in selected.changed)) {
                if (key === 'num_records') selected.changed[key] = selected.meta_data.num_records;
                else if (key === 'is_paginated') selected.changed[key] = selected.meta_data.is_paginated;
                else if (key === 'records_per_page') selected.changed[key] = selected.meta_data.records_per_page;
            }
            if (key === 'num_records' && (value as number) >= selected.meta_data.records_per_page)
                selected.meta_data.num_records = value as number;
            else if (key === 'is_paginated') selected.meta_data.is_paginated = value as boolean;
            else if (key === 'records_per_page' && (value as number) <= selected.meta_data.num_records)
                selected.meta_data.records_per_page = value as number;
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
                    if (key === 'num_records') selected.meta_data.num_records = selected.changed[key] as number;
                    else if (key === 'is_paginated') selected.meta_data.is_paginated = selected.changed[key] as boolean;
                    else if (key === 'records_per_page')
                        selected.meta_data.records_per_page = selected.changed[key] as number;
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
    dispatch(selectedEndpoints.actions.updateSchemaHeader(calculateSchemaHeader()));
<<<<<<< HEAD
=======
    
>>>>>>> feat(): Added Headers field
};

export const addField = (payload: Field): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.addField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};
export const addHeaderField = (payload: HeaderField): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.addHeaderField(payload));
    dispatch(selectedEndpoints.actions.updateSchemaHeader(calculateSchemaHeader()));
};

export const updateField = (payload: {type: FieldProps; newValue: string; index: number}): AppThunk => (
    dispatch: any
) => {
    dispatch(selectedEndpoints.actions.updateField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};
export const updateHeaderField = (payload: {type: HeaderFieldProps; newValue: string; index: number}): AppThunk => (
    dispatch: any
) => {
    dispatch(selectedEndpoints.actions.updateHeaderField(payload));
    dispatch(selectedEndpoints.actions.updateSchemaHeader(calculateSchemaHeader()));
};

export const deleteField = (payload: number): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.deleteField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};
export const deleteHeaderField = (payload: number): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.deleteHeaderField(payload));
    dispatch(selectedEndpoints.actions.updateSchemaHeader(calculateSchemaHeader()));
};

export const discard = (dispatch: any) => {
    dispatch(selectedEndpoints.actions.discardChanges(null));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

export const getSelectedEndpoint = (state: RootState) => ({
    selectedEndpoint: state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected),
    schema: state.selectedEndpoints.schema,
<<<<<<< HEAD
    schemaHeader: state.selectedEndpoints.schemaHeader,
=======
    schemaHeader:state.selectedEndpoints.schemaHeader,
>>>>>>> feat(): Added Headers field
});

export const save = (): AppThunk => async (dispatch) => {
    const state: RootState = store.getState();
    const selected = state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected);
    const resp = await post('update_schema/', dispatch, {
        fields: selected.fields,
<<<<<<< HEAD
        headerFields: selected.headerFields,
=======
        headerFields:selected.headerFields,
>>>>>>> feat(): Added Headers field
        id: selected.id,
        meta_data: selected.meta_data,
    });
    console.log(resp.headerFields);
    if (!isError(resp)) {
        dispatch(selectedEndpoints.actions.setFields(resp.fields));
        // dispatch(selectedEndpoints.actions.setHeaderFields(resp.headerFields))
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
    dispatch(selectedEndpoints.actions.updateSchemaHeader(calculateSchemaHeader()));
};
