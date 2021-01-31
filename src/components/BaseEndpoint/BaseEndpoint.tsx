import React, {useEffect, useState, useRef} from 'react';
import {Paper, Typography, Button, Dialog, DialogContent, DialogTitle, TextField, Input} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';

import styles from './styles';
import {getBaseEndPoints, addBaseEndpoint} from '../../reducers/baseEndpoints';
import {Loader} from '../Loader';
import {SingleBaseEndpoint} from './singleBaseEndpoint';
import {Schema} from '../Schema';
import {get, post, isError} from '../../requests';
import {addNotif} from '../../reducers/notifications';

export const BaseEndpoint = () => {
    const dispatch = useDispatch();
    const classes = styles();
    const newBaseEndpoint = useRef(null);
    const importFile = useRef(null);

    const [open, setOpen] = useState(false);
    const [openSchema, setOpenSchema] = useState(false);
    const [openImport, setOpenImport] = useState(false);
    const handleClose = () => {
        setOpen(false);
        setOpenSchema(false);
        setOpenImport(false);
    };
    const {baseEndpoints, loading, addBaseEndpointLoading} = useSelector(getBaseEndPoints);

    useEffect(() => {
        if (!addBaseEndpointLoading) {
            handleClose();
        }
    }, [addBaseEndpointLoading]);

    const addNewBaseEndpoint = () => {
        let endpoint: string = newBaseEndpoint.current.value;
        if (endpoint === '') endpoint = '/';
        if (endpoint[0] !== '/') endpoint = '/' + endpoint;
        dispatch(addBaseEndpoint(endpoint));
    };
    const exportData = async () => {
        const resp = await get('data/export/', dispatch);
        if (!isError(resp)) {
            // https://stackoverflow.com/a/30800715
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resp));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', 'mock-server-data.json');
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            dispatch(
                addNotif({
                    variant: 'success',
                    text: 'json file successfully downloaded',
                })
            );
        }
    };
    const importData = () => {
        const file = importFile.current.files.length > 0 ? importFile.current.files[0] : null;
        if (!file) {
            dispatch(
                addNotif({
                    variant: 'error',
                    text: 'Upload a .json file',
                })
            );
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result as string);
            const _ = async () => {
                const resp = await post('data/import/', dispatch, data);
                if (!isError(resp)) {
                    dispatch(
                        addNotif({
                            variant: 'success',
                            text: 'Import succesfull, reloading ....',
                        })
                    );
                    window.location.reload();
                }
            };
            _();
        };
        reader.readAsText(file);
    };
    return (
        <>
            <Paper elevation={3} className={classes.root}>
                <div>
                    <div className={classes.newBaseEndpointBtnDiv}>
                        <Button
                            className={classes.btn}
                            color="primary"
                            variant="contained"
                            onClick={() => setOpen(true)}>
                            Add new base endpoint
                        </Button>
                    </div>
                    <div className={classes.newBaseEndpointBtnDiv}>
                        <Button
                            className={classes.btn}
                            color="primary"
                            variant="contained"
                            onClick={() => setOpenSchema(true)}>
                            Schemas
                        </Button>
                    </div>
                    {loading ? (
                        <Loader />
                    ) : baseEndpoints.length ? (
                        baseEndpoints.map((endpoint) => (
                            <SingleBaseEndpoint
                                endpointId={endpoint.id}
                                endpoint={endpoint.endpoint}
                                classes={classes}
                                key={endpoint.id}
                            />
                        ))
                    ) : (
                        <Typography className={classes.emptyBaseEndpoints}>No base endpoints added yet.</Typography>
                    )}
                    <div className={classes.newBaseEndpointBtnDiv}>
                        <Button className={classes.btn} color="primary" variant="contained" onClick={exportData}>
                            Export data
                        </Button>
                        <Button
                            className={classes.btn}
                            color="primary"
                            variant="contained"
                            onClick={() => setOpenImport(true)}>
                            Import data
                        </Button>
                    </div>
                </div>
            </Paper>
            {open && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle id="alert-dialog-slide-title">New base endpoint</DialogTitle>
                    <DialogContent>
                        <div>
                            <TextField
                                autoFocus
                                id="outlined-basic"
                                label="Base endpoint"
                                variant="outlined"
                                inputRef={newBaseEndpoint}
                            />
                        </div>
                        <br />
                        <Button
                            className={classes.btn}
                            color="primary"
                            variant="contained"
                            onClick={addNewBaseEndpoint}
                            disabled={addBaseEndpointLoading}>
                            Add
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
            {openSchema && <Schema openSchema={openSchema} handleClose={handleClose} />}
            {openImport && (
                <Dialog open={openImport} onClose={handleClose}>
                    <DialogTitle id="alert-dialog-slide-title">Import data</DialogTitle>
                    <DialogContent>
                        <Input inputRef={importFile} type="file" inputProps={{accept: '.json'}} />
                        <Button className={classes.btn} color="primary" variant="contained" onClick={importData}>
                            Import
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};
