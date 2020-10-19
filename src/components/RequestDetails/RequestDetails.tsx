import React from 'react';
import {FormControl, InputLabel, Typography, Button} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';

import {getSelectedEndpoint} from '../../reducers/selectedEndpoints';
import styles from './styles';
import {CreateResponse} from './components/CreateResponse';
// import {Headers} from './components/Headers'
import {MetaData} from './components/MetaData'
import {save, discard} from '../../reducers/selectedEndpoints';

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
    const discardChanges = () => {
        dispatch(discard);
    }
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography>{selectedEndpoint.baseEndpoint + selectedEndpoint.endpoint}</Typography>
                <FormControl>
                    <InputLabel id="endpoint-method-label">Method</InputLabel>
                    <Typography>{selectedEndpoint.method}</Typography>
                </FormControl>
            </div>
            <CreateResponse url_params={selectedEndpoint.url_params} classes={classes} fields={selectedEndpoint.fields} />
            <pre className={classes.schema}>{schema}</pre>
            <MetaData meta_data={selectedEndpoint.meta_data} classes={classes} />
            <div className={classes.saveBtn}>
                <Button disabled={!isDirty} variant="contained" color="primary" onClick={saveSchema}>
                    Save
                </Button>
                <Button disabled={!isDirty} variant="contained" color="primary" onClick={discardChanges}>
                    Discard
                </Button>
            </div>
            {/* <Headers /> */}
        </div>
    );
};
