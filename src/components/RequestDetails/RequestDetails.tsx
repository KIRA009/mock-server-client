import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, Button, TextField, Select, MenuItem, IconButton, Divider} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

import {getSelectedEndpoint} from '../../reducers/selectedEndpoints';
import styles from './styles';
import {CreateResponse} from './components/CreateResponse';
import {Headers} from './components/Headers';
import {MetaData} from './components/MetaData';
import {save, discard} from '../../reducers/selectedEndpoints';
import {methods, updateRelativeEndpoint, deleteRelativeEndpoint} from '../../reducers/relativeEndpoints';

export const RequestDetails = () => {
    const {selectedEndpoint} = useSelector(getSelectedEndpoint);
    const classes = styles();
    const dispatch = useDispatch();
    const [relativeEndpoint, setRelativeEndpoint] = useState('');
    const [method, setMethod] = useState('GET' as methods);

    useEffect(() => {
        if (selectedEndpoint) {
            setRelativeEndpoint(selectedEndpoint.endpoint);
            setMethod(selectedEndpoint.method);
        }
    }, [selectedEndpoint]);

    if (selectedEndpoint === undefined) {
        return <div className={classes.selectEndpointBanner}>Select an endpoint</div>;
    }
    const saveSchema = () => {
        if (selectedEndpoint.isDirty) dispatch(save());
    };
    const discardChanges = () => {
        dispatch(discard);
    };
    const handleChange = (e: any) => {
        setMethod(e.target.value);
    };
    const _updateRelativeEndpoint = () => {
        if (selectedEndpoint.method !== method || selectedEndpoint.endpoint !== relativeEndpoint) {
            dispatch(
                updateRelativeEndpoint({
                    ...selectedEndpoint,
                    base_endpoint: selectedEndpoint.base_endpoint,
                    endpoint: relativeEndpoint,
                    method,
                    id: selectedEndpoint.id,
                })
            );
        }
    };
    const _deleteRelativeEndpoint = () => {
        dispatch(
            deleteRelativeEndpoint({
                baseEndpointId: selectedEndpoint.base_endpoint,
                id: selectedEndpoint.id,
            })
        );
    };
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <TextField
                    autoFocus
                    id="outlined-basic"
                    label="Relative endpoint"
                    variant="outlined"
                    onChange={(e) => setRelativeEndpoint(e.target.value.slice(selectedEndpoint.baseEndpoint.length))}
                    value={selectedEndpoint.baseEndpoint + relativeEndpoint}
                />
                <FormControl>
                    <InputLabel id="endpoint-method-label">Method</InputLabel>
                    <Select labelId="endpoint-method-label" id="endpoint-method" value={method} onChange={handleChange}>
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                    </Select>
                </FormControl>
                <IconButton
                    className={classes.saveIcon}
                    disabled={selectedEndpoint.isUpdating}
                    onClick={_updateRelativeEndpoint}>
                    <SaveIcon />
                </IconButton>
                <IconButton onClick={_deleteRelativeEndpoint}>
                    <DeleteIcon />
                </IconButton>
            </div>
            <Headers classes={classes} fields={selectedEndpoint.headers} />
            <Divider className={classes.divider} />
            <CreateResponse
                url_params={selectedEndpoint.url_params}
                classes={classes}
                fields={selectedEndpoint.fields}
            />
            <Divider className={classes.divider} />

            <MetaData meta_data={selectedEndpoint.meta_data} classes={classes} />

            <div className={classes.saveBtn}>
                <Button disabled={!selectedEndpoint.isDirty} variant="contained" color="primary" onClick={saveSchema}>
                    Save
                </Button>
                <Button
                    disabled={!selectedEndpoint.isDirty}
                    variant="contained"
                    color="primary"
                    onClick={discardChanges}>
                    Discard
                </Button>
            </div>
        </div>
    );
};
