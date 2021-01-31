import {createSlice} from '@reduxjs/toolkit';

import {RootState, AppThunk} from '../store';
import {get} from '../requests';

export interface schema {
    id: number;
    name: string;
    schema: {
        [key: string]: any;
    };
}

interface initialState {
    values: ('string' | 'number' | 'boolean')[];
    schemas: schema[];
}

interface addOrUpdateSchemaPayload {
    type: string;
    payload: schema;
}

const possibleValues = createSlice({
    name: 'possibleValues',
    initialState: {
        values: ['string', 'number', 'boolean'],
        schemas: [],
    } as initialState,
    reducers: {
        initiateSchemas: (
            state: initialState,
            action: {
                type: string;
                payload: schema[];
            }
        ) => {
            state.schemas = action.payload;
        },
        addSchema: (state: initialState, action: addOrUpdateSchemaPayload) => {
            state.schemas.push(action.payload);
        },
        updateSchema: (state: initialState, action: addOrUpdateSchemaPayload) => {
            const schema = state.schemas.find((_) => _.id === action.payload.id);
            schema.name = action.payload.name;
            schema.schema = action.payload.schema;
        },
    },
});

export default possibleValues.reducer;
export const {addSchema, updateSchema} = possibleValues.actions;

export const loadSchemas = (): AppThunk => async (dispatch: any) => {
    const resp = await get('schemas/get/', dispatch);
    if (!('error' in resp)) {
        dispatch(possibleValues.actions.initiateSchemas(resp.schemas));
    }
};

export const getValues = (state: RootState) => state.possibleValues.values;
export const getSchemas = (state: RootState) => state.possibleValues.schemas;
