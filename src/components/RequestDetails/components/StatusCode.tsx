import React, {useState, useRef} from 'react';
import {
    Box,
    Typography,
    FormControl,
    Select,
    Button,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {useDispatch} from 'react-redux';

import {endpointInterface} from '../../../reducers/relativeEndpoints';
import {changeStatusCode, setStatusCode, deleteStatusCode, addStatusCode} from '../../../reducers/selectedEndpoints';

interface Props {
    classes: {
        [key: string]: string;
    };
    selectedStatusCode: number;
    selectedEndpoint: endpointInterface;
}

export const StatusCode = ({classes, selectedStatusCode, selectedEndpoint}: Props) => {
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const newStatusCode = useRef(null);
    const toggleOpenDelete = () => setOpenDelete(!openDelete);
    const toggleOpenAdd = () => setOpenAdd(!openAdd);
    const toggleEdit = () => setEdit(!edit);
    const handleChange = (e: any) => {
        dispatch(setStatusCode(e.target.value));
    };
    const del = () => {
        dispatch(deleteStatusCode({status_code: selectedStatusCode, cb: toggleOpenDelete}));
    };
    const save = () => {
        if (!edit) return;
        dispatch(changeStatusCode({status_code: newStatusCode.current.value, cb: toggleEdit}));
    };
    const add = () => {
        dispatch(addStatusCode({status_code: newStatusCode.current.value, cb: toggleOpenAdd}));
    };
    return (
        <Box display="flex" justifyContent="space-around" alignItems="center" className={classes.divider}>
            <Typography>
                Select the active status code
                <br />
                <small>(you will be receiving response with this status code)</small>
            </Typography>
            {edit ? (
                <>
                    <TextField inputRef={newStatusCode} variant="outlined" defaultValue={selectedStatusCode} />
                    <IconButton color="primary" onClick={toggleEdit}>
                        <CancelIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <FormControl>
                        <Select
                            labelId="endpoint-status-label"
                            id="endpoint-status"
                            value={selectedStatusCode}
                            onChange={handleChange}
                        >
                            {selectedEndpoint.status_codes.map((status_code) => (
                                <MenuItem key={status_code.status_code} value={status_code.status_code}>
                                    {status_code.status_code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton disabled={edit} color="primary" onClick={toggleEdit}>
                        <EditIcon />
                    </IconButton>
                </>
            )}
            <IconButton color="primary" disabled={!edit} onClick={save}>
                <SaveIcon />
            </IconButton>
            <IconButton color="secondary" onClick={toggleOpenDelete}>
                <DeleteIcon />
            </IconButton>
            <IconButton color="primary" disabled={edit} onClick={toggleOpenAdd}>
                <AddCircleIcon />
            </IconButton>
            {openDelete && (
                <Dialog
                    open={openDelete}
                    onClose={toggleOpenDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this means deleting the response alongwith it, which cannot be recovered by any
                            means
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Button onClick={toggleOpenDelete} color="primary" variant="contained">
                            No, don't delete
                        </Button>
                        <Button onClick={del} color="secondary" autoFocus variant="contained">
                            Yes, go ahead
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {openAdd && (
                <Dialog
                    open={openAdd}
                    onClose={toggleOpenAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Enter new status code</DialogTitle>
                    <DialogContent>
                        <TextField inputRef={newStatusCode} variant="outlined" />
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Button onClick={add} color="secondary" autoFocus variant="contained">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};
