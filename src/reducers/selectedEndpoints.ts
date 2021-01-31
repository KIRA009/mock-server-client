import {createSlice} from '@reduxjs/toolkit';

import {endpointInterface} from './relativeEndpoints';
import {RootState, AppThunk} from '../store';
import {store} from '../index';
import {post, isError} from '../requests';
import {addNotif} from './notifications';
export type FieldProps = 'key' | 'value' | 'type';
export type HeaderFieldProps = 'key' | 'value';

export interface Field {
    key: string;
    type: string;
    value: any;
    id: number;
    is_array: boolean;
    isChanged?: boolean;
    oldValues?: any;
}
export interface HeaderField {
    key: string;
    value: any;
    isChanged: boolean;
    oldValues?: any;
    isNew?: boolean;
}

interface toggleUpdateLoadingPayload {
    type: string;
    payload: boolean;
}

interface initialState {
    selected: number;
    selectedIndex: number;
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
    const selectedEndpoint = state.selectedEndpoints.endpoints.find((_) => _.id === selectedEndpointId).status_codes[
        state.selectedEndpoints.selectedIndex
    ];
    // const selectedIndex = state.selectedEndpoints.selectedIndex;
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
            console.log(field);
            schema[field.key] = `{{queryParam '${field.value}'}}`;
        } else {
            schema[field.key] = `{{postData '${field.value}'}}`;
        }
        if (field.is_array) {
            const temp = new Array(5).fill(schema[field.key]);
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

const getSelected = (state: initialState) =>
    state.endpoints.find((_) => _.id === state.selected).status_codes[state.selectedIndex];

const selectedEndpoints = createSlice({
    name: 'selectedEndpoints',
    initialState: {
        selected: 0,
        selectedIndex: 0,
        endpoints: [],
        schema: '{}',
    } as initialState,
    reducers: {
        setSelectedEndpoint: (state: initialState, action: getEndpointPayload) => {
            let selected = action.payload;
            let endpoint = state.endpoints.find((_) => _.id === selected.id);
            const selectedIndex = state.selectedIndex;
            if (!endpoint) {
                // if endpoint is selected for first time
                endpoint = JSON.parse(JSON.stringify(selected));
                endpoint.status_codes[selectedIndex].meta_data.oldValues = {};
                endpoint.status_codes[selectedIndex].isDirty = false;
                endpoint.status_codes[selectedIndex].deleted = [];
                endpoint.status_codes[selectedIndex].deletedHeaders = [];
                state.endpoints.push(endpoint);
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
            const {index, type, newValue} = action.payload;
            const selected = getSelected(state);
            const headerField = selected.headers[index];
            const oldValue = headerField[type];
            headerField[type] = newValue;
            if (!headerField.isChanged) {
                headerField.isChanged = true;
                headerField.oldValues = {};
            }
            if (!(type in headerField.oldValues)) headerField.oldValues[type] = oldValue;
            selected.isDirty = true;
        },
        addField: (state: initialState, action: addFieldPayload) => {
            if (!getSelected(state).fields.some((_) => matchField(_, action.payload))) {
                const selected = getSelected(state);
                selected.fields.push(action.payload);
                selected.isDirty = true;
            }
        },
        addHeaderField: (state: initialState, action: addHeaderFieldPayload) => {
            if (!getSelected(state).headers?.some((_) => matchHeaderField(_, action.payload))) {
                const selected = getSelected(state);
                selected.headers?.push(action.payload);
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
            const headerField: HeaderField = endpoint.headers.splice(action.payload, 1)[0];
            endpoint.isDirty = true;
            endpoint.deletedHeaders.push(headerField);
        },

        updateSchema: (state: initialState, action: updateSchemaPayload) => {
            state.schema = JSON.stringify(action.payload, null, 4);
        },
        setFields: (state: initialState, action: setFieldsPayload) => {
            const selected = getSelected(state);
            selected.fields = action.payload;
            selected.isDirty = false;
        },
        setHeaderFields: (state: initialState, action: setHeaderFieldsPayload) => {
            const selected = getSelected(state);
            selected.headers = action.payload;
            selected.isDirty = false;
        },
        updateMeta: (state: initialState, action: metaDataPayload) => {
            const selected = getSelected(state);
            selected.isDirty = true;
            const {key, value} = action.payload;
            if (!(key in selected.meta_data.oldValues)) {
                if (key === 'num_records') selected.meta_data.oldValues[key] = selected.meta_data.num_records;
                else if (key === 'is_paginated') selected.meta_data.oldValues[key] = selected.meta_data.is_paginated;
                else if (key === 'records_per_page')
                    selected.meta_data.oldValues[key] = selected.meta_data.records_per_page;
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
            selected.deleted = [];
            const fields = selected.fields;
            for (let field of fields) {
                if (field.isChanged) {
                    if ('key' in field.oldValues) field.key = field.oldValues.key;
                    if ('type' in field.oldValues) field.type = field.oldValues.type;
                    if ('value' in field.oldValues) field.value = field.oldValues.value;
                    if ('is_array' in field.oldValues) field.is_array = field.oldValues.is_array;
                    field.isChanged = false;
                    field.oldValues = {};
                }
            }

            selected.headers = selected.headers.filter((_) => !_.isNew);
            for (let header of selected.deletedHeaders) {
                selected.headers.push(header);
            }
            selected.deletedHeaders = [];
            for (let header of selected.headers) {
                if (header.isChanged) {
                    if ('key' in header.oldValues) header.key = header.oldValues.key;
                    if ('value' in header.oldValues) header.value = header.oldValues.value;
                    header.isChanged = false;
                    header.oldValues = {};
                }
            }

            if (selected.meta_data.oldValues) {
                for (let key in selected.meta_data.oldValues) {
                    if (key === 'num_records')
                        selected.meta_data.num_records = selected.meta_data.oldValues[key] as number;
                    else if (key === 'is_paginated')
                        selected.meta_data.is_paginated = selected.meta_data.oldValues[key] as boolean;
                    else if (key === 'records_per_page')
                        selected.meta_data.records_per_page = selected.meta_data.oldValues[key] as number;
                }
            }
            selected.meta_data.oldValues = {};

            selected.isDirty = false;
        },
        saveChanges: (state: initialState, action) => {
            const selected = getSelected(state);
            selected.meta_data.oldValues = {};
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
export const addHeaderField = (payload: HeaderField): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.addHeaderField(payload));
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
};

export const deleteField = (payload: number): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.deleteField(payload));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};
export const deleteHeaderField = (payload: number): AppThunk => (dispatch: any) => {
    dispatch(selectedEndpoints.actions.deleteHeaderField(payload));
};

export const discard = (dispatch: any) => {
    dispatch(selectedEndpoints.actions.discardChanges(null));
    dispatch(selectedEndpoints.actions.updateSchema(calculateSchema()));
};

export const getSelectedEndpoint = (state: RootState) => {
    const selectedEndpoint = state.selectedEndpoints.endpoints.find((_) => _.id === state.selectedEndpoints.selected);
    return {
        selectedEndpoint,
        selectedStatus: selectedEndpoint?.status_codes[state.selectedEndpoints.selectedIndex],
        schema: state.selectedEndpoints.schema,
    };
};

export const save = (): AppThunk => async (dispatch) => {
    const state: RootState = store.getState();
    const selected = getSelected(state.selectedEndpoints);
    const {oldValues, ...meta_data} = selected.meta_data;
    const resp = await post('relative-endpoint/schema/update/', dispatch, {
        fields: selected.fields,
        headers: selected.headers,
        id: selected.id,
        meta_data,
    });
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
};
