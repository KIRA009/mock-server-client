import {createSlice} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../store';
import {store} from '../index';

import {Field, FieldProps} from './selectedEndpoints'
import {methods,metaData} from './relativeEndpoints'
import {addNotif} from './notifications';
import {post, isError} from '../requests';
import { stat } from 'fs';


export interface schemaInterface {
    // endpoint: string;
    name: string;
    // regex_endpoint: string;
    method: methods;
    // base_endpoint: number;
    id: number;
    fields: Field[];
    // baseEndpoint: string;
    meta_data: metaData;
    changed?: any;
    url_params: string[];
    isUpdating?: boolean;
    isDirty?: boolean;
    deleted?: Field[];
}

interface initialState {
    addSchemaLoading: boolean,
    schema:schemaInterface,
    schemaAsText:string
}

interface changeNamePayload {
    type: string;
    payload: string;
}

interface addFieldPayload {
    type: string;
    payload: Field;
}

interface deleteFieldPayload {
    type: string;
    payload: number;
}

interface updateFieldPayload {
    type: string;
    payload: {
        type: FieldProps;
        newValue: string;
        index: number;
    };
}

interface updateSchemaPayload {
    type: string;
    payload: any;
}

interface setFieldsPayload {
    type: string;
    payload: Field[];
}

const calculateSchema = (): any => {
    const state: RootState = store.getState();
    const selectedEndpointName: string = state.schemaCreation.schema.name;
    const selectedEndpoint = state.schemaCreation.schema;
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


const schemaCreation = createSlice({
    name: 'counter',
    initialState: {
        addSchemaLoading:false,
        schema:{
            fields: [],
            meta_data: {is_paginated:false},
            isDirty:false,
            name: "New schema"
        }
    } as initialState,
    reducers: {
        changeName: (state: initialState, action: changeNamePayload )=>{
            state.schema.name=action.payload;
        },
        addField: (state: initialState, action: addFieldPayload )=>{
            state.schema.fields.push(action.payload);
        },
        deleteField: (state: initialState, action: deleteFieldPayload) => {
            const field: Field = state.schema.fields.splice(action.payload, 1)[0];
            state.schema.isDirty = true;
            if (field.id === 0) return;
            state.schema.deleted.push(field);
        },
        updateField: (state: initialState, action: updateFieldPayload) => {
            const {index, type, newValue} = action.payload;
            const selected = state.schema;
            console.log(selected);
            
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
        updateSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schemaAsText = JSON.stringify(action.payload, null, 4);
        },
        saveChanges: (state: initialState, action) => {
            const selected = state.schema;

            selected.changed = {};
        },
        discardChanges: (state: initialState, action) => {
            const selected = state.schema;
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
        setFields: (state: initialState, action: setFieldsPayload) => {
            const selected = state.schema;
            
            selected.fields = action.payload;
            selected.isDirty = false;
        },
        
    },
});

export default schemaCreation.reducer; 

export const changeName = (payload: string): AppThunk => (dispatch: any) => {
    dispatch(schemaCreation.actions.changeName(payload));
    dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
};

export const addField = (payload: Field): AppThunk => (dispatch: any) => {
    dispatch(schemaCreation.actions.addField(payload));
    dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
};

export const deleteField = (payload: number): AppThunk => (dispatch: any) => {
    dispatch(schemaCreation.actions.deleteField(payload));
    dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
};

export const getSelectedSchema = (state: RootState) => ({
    selectedSchema: state.schemaCreation.schema,
    schema: (state.schemaCreation.schemaAsText) ? state.schemaCreation.schemaAsText : '{}',
});

export const save = (): AppThunk => async (dispatch) => {
    const state: RootState = store.getState();
    const selected = state.schemaCreation.schema;
    console.log(selected);
   
    const resp = await post('schema/add/', dispatch, {name:selected.name,fields:selected.fields});
    if (!isError(resp)) {
        dispatch(
            addNotif({
                variant: 'success',
                text: 'Schema successfully saved',
            })
        );
        dispatch(schemaCreation.actions.saveChanges(null));
    }
};

export const updateField = (payload: {type: FieldProps; newValue: string; index: number}): AppThunk => (
    dispatch: any
) => {
    dispatch(schemaCreation.actions.updateField(payload));
    dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
};

export const discard = (dispatch: any) => {
    dispatch(schemaCreation.actions.discardChanges(null));
    dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
};


