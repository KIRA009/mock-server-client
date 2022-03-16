import React from 'react';
import {Provider} from 'react-redux';
import {Store} from '../store';
import {SnackbarProvider, withSnackbar} from 'notistack';
import {HomePage} from '../containers/HomePage';
import {Notification} from '../components/Notification';

type Props = {
    store: Store;
};

const Root = ({store}: Props) => {
    const WithNotifPage = withSnackbar(HomePage);
    return (
        <Provider store={store}>
            <SnackbarProvider>
                <WithNotifPage />
                <Notification />
            </SnackbarProvider>
        </Provider>
    );
};

export default Root;
