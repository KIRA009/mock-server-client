import React, {useEffect, useState, useRef} from 'react';
import {Paper, Typography, Button, Dialog, DialogContent, DialogTitle, TextField} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';

import styles from './base-endpoint-css';
import {getBaseEndPoints, addBaseEndpoint} from '../../reducers/baseEndpoints';
import {Loader} from '../Loader';
import {SingleBaseEndpoint} from './singleBaseEndpoint';

export const BaseEndpoint = () => {
    const dispatch = useDispatch();
    const classes = styles();
    const newBaseEndpoint = useRef(null);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
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
                    {loading ? (
                        <Loader />
                    ) : baseEndpoints.length ? (
                        baseEndpoints.map((endpoint) => (
                            <SingleBaseEndpoint endpoint={endpoint} classes={classes} key={endpoint} />
                        ))
                    ) : (
                        <Typography className={classes.emptyBaseEndpoints}>No base endpoints added yet.</Typography>
                    )}
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
        </>
    );
};
