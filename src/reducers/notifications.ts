import {createSlice} from '@reduxjs/toolkit';
import {RootState, AppThunk} from '../store';

export type VariantType = 'default' | 'error' | 'success' | 'warning' | 'info';

interface notif {
    text: string;
    variant: VariantType;
    id: number;
}

type initialState = {
    notifs: notif[];
};

interface addNotifPayload {
    type: string;
    payload: notif;
}

interface readNotifPayload {
    type: string;
    payload: number;
}

const notifs = createSlice({
    name: 'notifications',
    initialState: {
        notifs: [],
    },
    reducers: {
        addNotif: (state: initialState, action: addNotifPayload) => {
            state.notifs.push(action.payload);
        },
        readNotif: (state: initialState, action: readNotifPayload) => {
            state.notifs = state.notifs.filter((_) => _.id !== action.payload);
        },
    },
});

export const {readNotif} = notifs.actions;

export default notifs.reducer;

export const getNotifs = (state: RootState): notif[] => state.notifications.notifs;

export const addNotif = (payload: {variant: VariantType; text: string}): AppThunk => (dispatch) => {
    const id = Date.now();
    dispatch(notifs.actions.addNotif({...payload, id}));
};
