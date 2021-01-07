import React from 'react';
import {
    List,
    ListItem,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    TextField,
    IconButton,
    Typography,
    FormControlLabel,
    Switch,
} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import {
    Field,
    updateField,
    FieldProps,
    addField,
    deleteField,
    getSelectedEndpoint,
} from '../../../reducers/selectedEndpoints';
import {ValueField} from './ValueField';

interface Props {
    classes: {
        [key: string]: string;
    };
    fields: Field[];
    url_params: string[];
}

export const CreateResponse = React.memo(({classes, fields, url_params}: Props) => {
    const {schema} = useSelector(getSelectedEndpoint);
    const dispatch = useDispatch();
    let debounce: NodeJS.Timeout;
    const update = (newValue: any, type: string, index: number) => {
        if (!newValue) return;
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
            dispatch(
                updateField({
                    type: type as FieldProps,
                    index,
                    newValue,
                })
            );
        }, 300);
    };
    const add = () => {
        dispatch(
            addField({
                key: new Date().getTime().toString(),
                value: 'string',
                type: 'value',
                id: 0,
                isChanged: false,
                is_array: false,
            })
        );
    };
    const del = (index: number) => {
        dispatch(deleteField(index));
    };
    return (
        <div>
            <Typography>Body</Typography>
            <IconButton aria-label="" color="primary" className={classes.addFieldIcon} onClick={add}>
                <AddCircleIcon />
            </IconButton>
            <List component="nav" aria-label="fields">
                {fields.length ? (
                    fields.map(({key, type, value, is_array}, ind) => (
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
                                <InputLabel id={`field-type-${ind}`}>Type</InputLabel>
                                <Select
                                    labelId={`field-type-${ind}`}
                                    id={`field-type-select-${ind}`}
                                    value={type}
                                    onChange={(e) => update(e.target.value, 'type', ind)}>
                                    <MenuItem value={'value'}>Value</MenuItem>
                                    <MenuItem value={'schema'}>Schema</MenuItem>
                                    <MenuItem value={'url_param'}>Url Param</MenuItem>
                                    <MenuItem value={'query_param'}>Query Param</MenuItem>
                                </Select>
                            </FormControl>
                            <ValueField key={ind} {...{type, value, update, ind, classes, url_params}} />
                            <FormControlLabel
                                control={
                                    <Switch checked={is_array} onChange={() => update(!is_array, 'is_array', ind)} />
                                }
                                label="(Is array)"
                            />
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
                    <Typography>No fields added yet</Typography>
                )}
            </List>
            <pre className={classes.schema}>{schema}</pre>
        </div>
    );
});
