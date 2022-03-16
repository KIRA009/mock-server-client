import {createSlice} from '@reduxjs/toolkit';
import {AppThunk, RootState} from '../store';
import {store} from '../index';

import {Field, FieldProps} from './selectedEndpoints';
import {addNotif} from './notifications';
import {get, post, isError} from '../requests';
import {addSchema, updateSchema} from './possibleValues';

export interface schemaInterface {
    name: string;
    id: number;
    fields: Field[];
    isDirty: boolean;
}

interface initialState {
    addSchemaLoading: boolean;
    schema: schemaInterface;
    schemaAsText: string;
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

interface loadSchemaPayload {
    type: string;
    payload: schemaInterface;
}

const calculateSchema = (): any => {
    const state: RootState = store.getState();
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
        } else if (field.type === 'query_param') {
            schema[field.key] = `{{queryParam '${field.value}'}}`;
        } else {
            schema[field.key] = `{{postData '${field.value}'}}`;
        }
        if (field.is_array) {
            const temp = new Array(5);
            temp.fill(schema[field.key], 0, 5);
            schema[field.key] = temp;
        }
    }

    return schema;
};

const schemaCreation = createSlice({
    name: 'schemaCreation',
    initialState: {
        addSchemaLoading: false,
        schema: {
            fields: [],
            id: 0,
            name: 'New schema',
        },
    } as initialState,
    reducers: {
        changeName: (state: initialState, action: changeNamePayload) => {
            state.schema.name = action.payload;
            state.schema.isDirty = state.schema.name.length > 0 && state.schema.fields.length > 0;
        },
        addField: (state: initialState, action: addFieldPayload) => {
            state.schema.fields.push(action.payload);
            state.schema.isDirty = state.schema.name.length > 0 && state.schema.fields.length > 0;
        },
        deleteField: (state: initialState, action: deleteFieldPayload) => {
            state.schema.fields.splice(action.payload, 1);
            state.schema.isDirty = state.schema.name.length > 0 && state.schema.fields.length > 0;
        },
        updateField: (state: initialState, action: updateFieldPayload) => {
            const {index, type, newValue} = action.payload;
            const selected = state.schema;

            const field = selected.fields[index];
            const oldValue = field[type];
            field[type] = newValue;
            if (field.id > 0 && !field.isChanged) {
                field.isChanged = true;
                field.oldValues = {};
            }
            if (field.id > 0 && !(type in field.oldValues)) field.oldValues[type] = oldValue;
            state.schema.isDirty = state.schema.name.length > 0 && state.schema.fields.length > 0;
        },
        updateSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schemaAsText = JSON.stringify(action.payload, null, 4);
        },
        loadSchema: (state: initialState, action: loadSchemaPayload) => {
            state.schema = action.payload;
        },
        clearSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schema = {
                fields: [],
                id: 0,
                name: 'New schema',
            } as schemaInterface;
            state.schemaAsText = '{}';
        },
    },
});

export const {clearSchema} = schemaCreation.actions;

export default schemaCreation.reducer;

export const changeName =
    (payload: string): AppThunk =>
    (dispatch: any) => {
        dispatch(schemaCreation.actions.changeName(payload));
        dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
    };

export const addField =
    (payload: Field): AppThunk =>
    (dispatch: any) => {
        dispatch(schemaCreation.actions.addField(payload));
        dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
    };

export const deleteField =
    (payload: number): AppThunk =>
    (dispatch: any) => {
        dispatch(schemaCreation.actions.deleteField(payload));
        dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
    };

export const getSelectedSchema = (state: RootState) => ({
    selectedSchema: state.schemaCreation.schema,
    schema: state.schemaCreation.schemaAsText ? state.schemaCreation.schemaAsText : '{}',
});

export const save = (): AppThunk => async (dispatch) => {
    const state: RootState = store.getState();
    const selected = state.schemaCreation.schema;

    const data = {
        name: selected.name,
        fields: selected.fields.map((item) => {
            const {oldValues, ...newItem} = item;
            return newItem;
        }),
    } as any;

    const isNew: boolean = selected.id === 0;
    const url: string = isNew ? 'schema/add/' : 'schema/update/';

    if (!isNew) data.id = selected.id;

    const resp = await post(url, dispatch, data);
    if (!isError(resp)) {
        if (isNew) dispatch(addSchema(resp.schema));
        else
            dispatch(
                updateSchema({
                    id: selected.id,
                    name: selected.name,
                    schema: calculateSchema(),
                })
            );
        dispatch(clearSchema(null));
        dispatch(
            addNotif({
                variant: 'success',
                text: 'Schema successfully saved',
            })
        );
    }
};

export const updateField =
    (payload: {type: FieldProps; newValue: string; index: number}): AppThunk =>
    (dispatch: any) => {
        dispatch(schemaCreation.actions.updateField(payload));
        dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
    };

export const fetchSchemaDetails =
    (name: string): AppThunk =>
    async (dispatch: any) => {
        const resp = await get(`schema/get/${name}/`, dispatch);
        if (!isError(resp)) {
            dispatch(schemaCreation.actions.loadSchema(resp));
            dispatch(schemaCreation.actions.updateSchema(calculateSchema()));
        }
    };
