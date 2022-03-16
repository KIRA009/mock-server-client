import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './containers/Root';
import * as serviceWorker from './serviceWorker';
import {configuredStore} from './store';

export const store = configuredStore();

ReactDOM.render(
    <React.StrictMode>
        <Root store={store} />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
