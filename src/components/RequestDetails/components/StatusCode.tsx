import React, {useState} from 'react';
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

import {endpointInterface} from '../../../reducers/relativeEndpoints';

interface Props {
    classes: {
        [key: string]: string;
    };
    selectedStatusCode: number;
    handleChange: any;
    selectedEndpoint: endpointInterface;
}

export const StatusCode = ({classes, selectedStatusCode, handleChange, selectedEndpoint}: Props) => {
    const [openDelete, setOpenDelete] = useState(false);
    const [edit, setEdit] = useState(false);
    const toggleOpenDelete = () => setOpenDelete(!openDelete);
    const toggleEdit = () => setEdit(!edit);
    const save = () => {
        if (!edit) return;
        /**
         * TODO: Make an action to save the new status code
         */
        toggleEdit();
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
                    <TextField variant="outlined" defaultValue={selectedStatusCode} />
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
                            onChange={handleChange}>
                            {selectedEndpoint.status_codes.map((status_code) => (
                                <MenuItem key={status_code.status_code} value={status_code.status_code}>
                                    {status_code.status_code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton color="primary" onClick={toggleEdit}>
                        <EditIcon />
                    </IconButton>
                </>
            )}
            <IconButton color="primary" onClick={save}>
                <SaveIcon />
            </IconButton>
            <IconButton color="secondary" onClick={toggleOpenDelete}>
                <DeleteIcon />
            </IconButton>
            {openDelete && (
                <Dialog
                    open={openDelete}
                    onClose={toggleOpenDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this means deleting the response alongwith it, which cannot be recovered by any
                            means
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleOpenDelete} color="primary" variant="contained">
                            No, don't delete
                        </Button>
                        <Button onClick={toggleOpenDelete} color="secondary" autoFocus variant="contained">
                            Yes, go ahead
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};
