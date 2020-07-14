import React, {useEffect, useState, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import {SnackbarProvider, withSnackbar} from 'notistack';

import {fillBaseEndpoints} from '../reducers/baseEndpoints';
import {routes} from './routes';
import {loadSchemas} from '../reducers/possibleValues';
import {Notification} from '../components/Notification';
import {get} from '../requests';

export default function Routes() {
    const [isServerRunning, setIsServerRunning] = useState(false);
    const dispatch = useDispatch();
    const pinging = useRef(null);
    useEffect(() => {
        if (!isServerRunning) {
            pinging.current = setInterval(() => {
                get('', dispatch)
                    .then((resp) => {
                        setIsServerRunning(true);
                        clearInterval(pinging.current);
                    })
                    .catch((err) => err);
            }, 2000);
        }
        if (isServerRunning) {
            dispatch(fillBaseEndpoints());
            dispatch(loadSchemas());
        }
    }, [dispatch, isServerRunning]);

    return isServerRunning ? (
        <SnackbarProvider>
            <Switch>
                {routes.map((route) => (
                    <Route key={route.url} path={route.url} component={withSnackbar(route.component)} />
                ))}
            </Switch>
            <Notification />
        </SnackbarProvider>
    ) : (
        <h1>Please ensure that server is running on http://localhost:8000</h1>
    );
}
