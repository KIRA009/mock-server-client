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
    Tooltip,
    FormControlLabel,
    Switch,
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import {Field, updateField, FieldProps, addField, deleteField} from '../../../reducers/selectedEndpoints';
import {getValues, getSchemas} from '../../../reducers/possibleValues';

interface Props {
    classes: {
        [key: string]: string;
    };
    fields: Field[];
    url_params: string[];
}

export const CreateResponse = ({classes, fields, url_params}: Props) => {
    const dispatch = useDispatch();
    const values = useSelector(getValues);
    const schemas = useSelector(getSchemas);
    const update = (newValue: any, type: string, index: number) => {
        if (!newValue) return;
        dispatch(
            updateField({
                type: type as FieldProps,
                index,
                newValue,
            })
        );
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
                                    value={key}
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
                            <FormControl>
                                {type === 'query_param' ? (
                                    <TextField
                                        label="Name"
                                        value={value}
                                        variant="outlined"
                                        onChange={(e: any) => update(e.target.value, 'value', ind)}
                                    />
                                ) : (
                                    <>
                                        <InputLabel id={`field-value-${ind}`}>Value</InputLabel>
                                        <Select
                                            labelId={`field-value-${ind}`}
                                            id={`field-value-select-${ind}`}
                                            value={value}
                                            onChange={(e) => update(e.target.value, 'value', ind)}>
                                            {type === 'schema'
                                                ? schemas.map((schema) => (
                                                      <MenuItem key={schema.name} value={schema.name}>
                                                          <Tooltip
                                                              title={
                                                                  <pre>{JSON.stringify(schema.schema, null, 4)}</pre>
                                                              }
                                                              classes={{tooltip: classes.toolTip}}>
                                                              <Typography className={classes.toolTipText}>
                                                                  {schema.name}
                                                              </Typography>
                                                          </Tooltip>
                                                      </MenuItem>
                                                  ))
                                                : type === 'value'
                                                ? values.map((_val) => (
                                                      <MenuItem key={_val} value={_val}>
                                                          {_val}
                                                      </MenuItem>
                                                  ))
                                                : url_params.map((_val) => (
                                                      <MenuItem key={_val} value={_val}>
                                                          {_val}
                                                      </MenuItem>
                                                  ))}
                                        </Select>
                                    </>
                                )}
                            </FormControl>
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
        </div>
    );
};
