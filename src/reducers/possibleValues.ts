import {createSlice} from '@reduxjs/toolkit';

import {RootState, AppThunk} from '../store';
import {get} from '../requests';

interface schema {
    name: string;
    schema: {
        [key: string]: any;
    };
}

interface initialState {
    values: ('string' | 'number' | 'boolean')[];
    schemas: schema[];
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
    },
});

export default possibleValues.reducer;

export const loadSchemas = (): AppThunk => async (dispatch: any) => {
    const resp = await get('schemas/get/', dispatch);
    if (!('error' in resp)) {
        dispatch(possibleValues.actions.initiateSchemas(resp.schemas));
    }
};

export const getValues = (state: RootState) => state.possibleValues.values;
export const getSchemas = (state: RootState) => state.possibleValues.schemas;
