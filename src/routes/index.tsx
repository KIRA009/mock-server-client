/* eslint react/jsx-props-no-spreading: off */
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import {fillBaseEndpoints} from '../reducers/baseEndpoints';
import {routes} from './routes';
import {SnackbarProvider, withSnackbar} from 'notistack';
import {Notification} from '../components/Notification';

export default function Routes() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fillBaseEndpoints());
        return () => {
            // cleanup
        };
    }, [dispatch]);

    return (
        <SnackbarProvider>
            <Switch>
                {routes.map((route) => (
                    <Route key={route.url} path={route.url} component={withSnackbar(route.component)} />
                ))}
            </Switch>
            <Notification />
        </SnackbarProvider>
    );
}
