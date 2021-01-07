import React from 'react';

import {FormControl, List, ListItem, Typography, TextField, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {useDispatch} from 'react-redux';
import {
    HeaderField,
    updateHeaderField,
    HeaderFieldProps,
    addHeaderField,
    deleteHeaderField,
} from '../../../reducers/selectedEndpoints';
import {useSelector} from 'react-redux';
import {getSelectedEndpoint} from '../../../reducers/selectedEndpoints';

interface Props {
    classes: {
        [key: string]: string;
    };
    fields: HeaderField[];
    url_params: string[];
}

export const Headers = ({classes, fields, url_params}: Props) => {
    const {schemaHeader} = useSelector(getSelectedEndpoint);
    const dispatch = useDispatch();
    let debounce: NodeJS.Timeout;
    const update = (newValue: any, type: string, index: number) => {
        if (!newValue) return;
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
            dispatch(
                updateHeaderField({
                    type: type as HeaderFieldProps,
                    index,
                    newValue,
                })
            );
        }, 300);
    };
    const add = () => {
        dispatch(
            addHeaderField({
                key: new Date().getTime().toString(),
                value: new Date().getTime().toString(),
                id: 0,
                isChanged: false,
                is_array: false,
            })
        );
    };
    const del = (index: number) => {
        dispatch(deleteHeaderField(index));
    };
    return (
        <div>
            <br></br>
            <div>Headers:</div>
            <IconButton aria-label="" color="primary" className={classes.addFieldIcon} onClick={add}>
                <AddCircleIcon />
            </IconButton>
            <List component="nav" aria-label="fields">
                {fields?.length ? (
                    fields.map(({key, value, is_array}, ind) => (
                        <ListItem key={`${key}-${ind}`} className={classes.listItem}>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    id={`field-key-${ind}`}
                                    label="Key"
                                    variant="outlined"
                                    defaultValue={key}
                                    onChange={(e) => update(e.target.value, 'key', ind)}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    id={`field-key-${ind}`}
                                    label="Value"
                                    variant="outlined"
                                    defaultValue={value}
                                    onChange={(e) => update(e.target.value, 'value', ind)}
                                />
                            </FormControl>

                            <IconButton
                                aria-label=""
                                color="primary"
                                className={classes.addFieldIcon}
                                onClick={() => del(ind)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography>No headers added yet</Typography>
                )}
            </List>
            <pre className={classes.schema}>{schemaHeader}</pre>
        </div>
    );
};
