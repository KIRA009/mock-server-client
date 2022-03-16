import React, {useState, useEffect, useRef, MouseEvent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    InputLabel,
    Select,
    FormControl,
    MenuItem,
    DialogActions,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import {
    fillRelativeEndpoints,
    getRelativeEndPoints,
    addRelativeEndpoint,
    methods,
} from '../../reducers/relativeEndpoints';
import {RelativeEndpoint} from '../RelativeEndpoint';

interface Props {
    endpoint: string;
    classes: {
        [key: string]: string;
    };
    endpointId: number;
}

export const SingleBaseEndpoint = ({endpoint, classes, endpointId}: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [method, setMethod] = useState('GET' as methods);
    const relativeEndpoint = useRef(null);
    const dispatch = useDispatch();
    const {endpoints, loading, addEndpointLoading} = useSelector(getRelativeEndPoints(endpointId));
    useEffect(() => {
        if (expanded) dispatch(fillRelativeEndpoints(endpointId));
        return () => {
            // cleanup
        };
    }, [expanded, dispatch, endpoint, endpointId]);
    useEffect(() => {
        if (!addEndpointLoading) handleClose();
    }, [addEndpointLoading]);

    const addEndpoint = () => {
        if (addEndpointLoading) return;
        let _relativeEndpoint: string = relativeEndpoint.current.value;
        if (_relativeEndpoint === '') return;
        if (_relativeEndpoint[0] !== '/') _relativeEndpoint = '/' + _relativeEndpoint;
        dispatch(
            addRelativeEndpoint({
                endpoint: _relativeEndpoint,
                method,
                base_endpoint: endpointId,
                id: 0,
                status_codes: [
                    {
                        id: 0,
                        status_code: 200,
                        fields: [],
                        headers: [],
                        meta_data: {
                            num_records: 1,
                            records_per_page: 1,
                            is_paginated: false,
                        },
                    },
                ],
                baseEndpoint: endpoint,
                regex_endpoint: '',
                url_params: [],
                active_status_code: 200,
            })
        );
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = (e: MouseEvent) => {
        if (addEndpointLoading) return;
        setOpen(true);
    };
    const handleChange = (e: any) => {
        setMethod(e.target.value);
    };
    const handleExpanded = () => {
        setExpanded(!expanded);
    };
    return (
        <>
            <Accordion key={endpoint} classes={{root: classes.expanded}} expanded={expanded}>
                <div className={classes.baseEndpoint}>
                    <IconButton aria-label="" color="primary" onClick={handleOpen} edge="start">
                        <AddCircleIcon />
                    </IconButton>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon className={classes.baseEndpointIcon} />}
                        aria-controls={`${endpoint}-content`}
                        id={`${endpoint}-header`}
                        onClick={handleExpanded}
                    >
                        <Typography>{endpoint}</Typography>
                    </AccordionSummary>
                </div>
                <AccordionDetails>
                    <RelativeEndpoint baseEndpoint={endpoint} endpoints={endpoints} loading={loading} />
                </AccordionDetails>
            </Accordion>
            {open && (
                <Dialog open={open} onClose={handleClose} classes={{paper: classes.newEndpointDialog}}>
                    <DialogTitle id="alert-dialog-slide-title">New relative endpoint</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            id="outlined-basic"
                            label="Relative endpoint"
                            variant="outlined"
                            inputRef={relativeEndpoint}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="endpoint-method-label">Method</InputLabel>
                            <Select
                                labelId="endpoint-method-label"
                                id="endpoint-method"
                                value={method}
                                onChange={handleChange}
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className={classes.btn}
                            color="primary"
                            variant="contained"
                            onClick={addEndpoint}
                            disabled={addEndpointLoading}
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};
