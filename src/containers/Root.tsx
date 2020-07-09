import React from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {History} from 'history';
import {Store} from '../store';
import Routes from '../routes/index';

type Props = {
    store: Store;
    history: History;
};

const Root = ({store, history}: Props) => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Routes />
            </ConnectedRouter>
        </Provider>
    );
};

export default Root;
