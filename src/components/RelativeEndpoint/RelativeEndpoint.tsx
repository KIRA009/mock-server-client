import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import {Loader} from '../Loader';
import {endpointInterface} from '../../reducers/relativeEndpoints';
import styles from './relative-endpoint-css';

interface Props {
    endpoints: endpointInterface[];
    loading: boolean;
    endpoint: string;
}

export const RelativeEndpoint = ({endpoints, loading, endpoint}: Props) => {
    const classes = styles();
    return loading ? (
        <Loader />
    ) : (
        <div className={classes.root}>
            {endpoints.length ? (
                endpoints.map((_endpoint) => (
                    <Grid key={`${_endpoint.endpoint}-${_endpoint.method}`} container className="endpointContainer">
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
