import React from 'react';
import {FormControl, InputLabel, Typography} from '@material-ui/core';
import {useSelector} from 'react-redux';

import {getSelectedEndpoint} from '../../reducers/selectedEndpoints';
import styles from './styles';
import {CreateResponse} from './components/CreateResponse';

export const RequestDetails = () => {
    const selectedEndpoint = useSelector(getSelectedEndpoint);
    const classes = styles();
    if (selectedEndpoint === undefined) {
        return <div>Select an endpoint</div>;
    }
    return (
        <div>
            <div className={classes.header}>
                <Typography>{selectedEndpoint.baseEndpoint + selectedEndpoint.endpoint}</Typography>
                <FormControl>
                    <InputLabel id="endpoint-method-label">Method</InputLabel>
                    <Typography>{selectedEndpoint.method}</Typography>
                </FormControl>
            </div>
            <CreateResponse classes={classes} fields={selectedEndpoint.fields} />
            <pre className={classes.schema}>{selectedEndpoint.schema}</pre>
        </div>
    );
};
