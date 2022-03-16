import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Grid} from '@material-ui/core';

import {BaseEndpoint} from '../components/BaseEndpoint';
import {RequestDetails} from '../components/RequestDetails';
import {fillBaseEndpoints} from '../reducers/baseEndpoints';
import {loadSchemas} from '../reducers/possibleValues';
import {get} from '../requests';

export const HomePage = () => {
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
        <Grid container>
            <Grid item xs={2}>
                <BaseEndpoint />
            </Grid>
            <Grid item xs={10}>
                <RequestDetails />
            </Grid>
        </Grid>
    ) : (
        <h1>Please ensure that server is running on http://localhost:8000</h1>
    );
};
