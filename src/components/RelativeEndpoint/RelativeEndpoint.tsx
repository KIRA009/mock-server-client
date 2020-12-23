import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';

import {Loader} from '../Loader';
import {endpointInterface} from '../../reducers/relativeEndpoints';
import {setSelectedEndpoint, getSelectedEndpoint} from '../../reducers/selectedEndpoints';
import styles from './styles';

interface Props {
    endpoints: endpointInterface[];
    loading: boolean;
    baseEndpoint: string;
}

export const RelativeEndpoint = ({endpoints, loading, baseEndpoint}: Props) => {
    const dispatch = useDispatch();
    const selectedEndpoint = useSelector(getSelectedEndpoint);

    const setEndpoint = (endpoint: endpointInterface) => {
        dispatch(
            setSelectedEndpoint({
                ...endpoint,
                baseEndpoint,
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
                        onClick={() => setEndpoint(_endpoint)}
                        key={`${_endpoint.endpoint}-${_endpoint.method}`}
                        container
                        className={`endpointContainer${
                            selectedEndpoint.selectedEndpoint
                                ? selectedEndpoint.selectedEndpoint.id === _endpoint.id
                                    ? ` ${classes.selected}`
                                    : ''
                                : ''
                        }`}>
                        <Grid item xs={3} className={`method-${_endpoint.method}`}>
                            {_endpoint.method}
                        </Grid>
                        <Grid item xs={9}>
                            {baseEndpoint}
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
