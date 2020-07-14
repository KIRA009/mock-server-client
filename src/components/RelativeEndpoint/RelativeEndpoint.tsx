import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import {useDispatch} from 'react-redux';

import {Loader} from '../Loader';
import {endpointInterface, methods} from '../../reducers/relativeEndpoints';
import {setSelectedEndpoint} from '../../reducers/selectedEndpoints';
import styles from './styles';

interface Props {
    endpoints: endpointInterface[];
    loading: boolean;
    endpoint: string;
}

export const RelativeEndpoint = ({endpoints, loading, endpoint}: Props) => {
    const dispatch = useDispatch();
    const setEndpoint = (baseEndpoint: string, endpoint: string, method: methods) => {
        dispatch(
            setSelectedEndpoint({
                baseEndpoint,
                endpoint,
                method,
            })
        );
    };
    const classes = styles();
    return loading ? (
        <Loader />
    ) : (
        <div className={classes.root}>
            {endpoints.length ? (
                endpoints.map((_endpoint) => (
                    <Grid
                        onClick={() => setEndpoint(endpoint, _endpoint.endpoint, _endpoint.method)}
                        key={`${_endpoint.endpoint}-${_endpoint.method}`}
                        container
                        className="endpointContainer">
                        <Grid item xs={3} className={`method-${_endpoint.method}`}>
                            {_endpoint.method}
                        </Grid>
                        <Grid item xs={9}>
                            {endpoint}
                            {_endpoint.endpoint}
                        </Grid>
                    </Grid>
                ))
            ) : (
                <Typography>No endpoints added yet.</Typography>
            )}
        </div>
    );
};
