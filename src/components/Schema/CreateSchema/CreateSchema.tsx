import React from 'react';
import {Button, TextField} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';

import {changeName, getSelectedSchema} from '../../../reducers/schemaCreation';
import styles from './styles';
import {CreateResponse} from './components/CreateResponse';

import {save} from '../../../reducers/schemaCreation';

export const CreateSchema = () => {
    const classes = styles();
    const dispatch = useDispatch();

    var {selectedSchema, schema} = useSelector(getSelectedSchema);
    const saveSchema = () => {
        if (selectedSchema.isDirty) dispatch(save());
    };

    return (
        <>
            <div className={classes.root}>
                <div className={classes.header}>
                    <TextField
                        autoFocus
                        id="outlined-basic"
                        label="Schema name"
                        variant="outlined"
                        value={selectedSchema.name}
                        onChange={(e) => {
                            dispatch(changeName(e.target.value));
                        }}
                    />
                </div>
                <CreateResponse
                    schemaId={selectedSchema.id}
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
    );
};
