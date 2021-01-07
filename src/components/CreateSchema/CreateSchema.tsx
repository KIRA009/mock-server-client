import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, Button, TextField, Select, MenuItem, IconButton} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

import {changeName, getSelectedSchema} from '../../reducers/schemaCreation';
import styles from './styles';
import {CreateResponse} from './components/CreateResponse';

import {save} from '../../reducers/schemaCreation';

export const CreateSchema=()=> {
    const classes = styles();
    const dispatch = useDispatch();

    var {selectedSchema,schema}=useSelector(getSelectedSchema);
    const saveSchema = () => {
        if (selectedSchema.isDirty) dispatch(save());
    };
    console.log(selectedSchema);
    
    return (
        <>
            <div className={classes.root}>
            <div className={classes.header}>
                <TextField
                    autoFocus
                    id="outlined-basic"
                    label="Schema name"
                    variant="outlined"
                    onChange={(e) => {
                        dispatch(changeName(e.target.value))}
                    }
                />
                
            </div>
            <CreateResponse
                url_params={['name']}
                classes={classes}
                fields={selectedSchema.fields}
            />
            <pre className={classes.schema}>{schema}</pre>
            <div className={classes.saveBtn}>
                <Button disabled={!selectedSchema.isDirty} variant="contained" color="primary" onClick={saveSchema}>
                    Save
                </Button>
            </div>
        </div>
        </>
    )
}


