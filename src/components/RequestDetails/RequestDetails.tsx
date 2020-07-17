import React from 'react';
import {FormControl, InputLabel, Typography, Button} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';

import {getSelectedEndpoint} from '../../reducers/selectedEndpoints';
import styles from './styles';
import {CreateResponse} from './components/CreateResponse';
import {save} from '../../reducers/selectedEndpoints';

export const RequestDetails = () => {
    const {selectedEndpoint, schema, isDirty} = useSelector(getSelectedEndpoint);
    const classes = styles();
    const dispatch = useDispatch();
    if (selectedEndpoint === undefined) {
        return <div>Select an endpoint</div>;
    }
    const saveSchema = () => {
        if (isDirty) dispatch(save());
    };
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
            <pre className={classes.schema}>{schema}</pre>
            <Button disabled={!isDirty} variant="contained" color="primary" onClick={saveSchema}>
                Save
            </Button>
        </div>
    );
};
