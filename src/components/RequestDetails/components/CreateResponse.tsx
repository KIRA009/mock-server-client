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
}

export const CreateResponse = ({classes, fields}: Props) => {
    const dispatch = useDispatch();
    const values = useSelector(getValues);
    const schemas = useSelector(getSchemas);
    // useEffect(() => {

    // }, [fields])
    const update = (e: any, type: string, index: number) => {
        dispatch(
            updateField({
                type: type as FieldProps,
                index,
                newValue: e.target.value,
            })
        );
    };
    const add = () => {
        dispatch(
            addField({
                key: 'key',
                value: 'string',
                type: 'value',
                id: 0,
                isChanged: false,
            })
        );
    };
    const del = (index: number) => {
        dispatch(deleteField(index));
    };
    return (
        <div className={classes.createResponseRoot}>
            <IconButton aria-label="" color="primary" className={classes.addFieldIcon} onClick={add}>
                <AddCircleIcon />
            </IconButton>
            <List component="nav" aria-label="fields">
                {fields.length ? (
                    fields.map(({key, type, value}, ind) => (
                        <ListItem key={`${key}-${ind}`} className={classes.listItem}>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    id={`field-key-${ind}`}
                                    label="Key"
                                    variant="outlined"
                                    value={key}
                                    onChange={(e) => update(e, 'key', ind)}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel id={`field-type-${ind}`}>Type</InputLabel>
                                <Select
                                    labelId={`field-type-${ind}`}
                                    id={`field-type-select-${ind}`}
                                    value={type}
                                    onChange={(e) => update(e, 'type', ind)}>
                                    <MenuItem value={'value'}>Value</MenuItem>
                                    <MenuItem value={'schema'}>Schema</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id={`field-value-${ind}`}>Value</InputLabel>
                                <Select
                                    labelId={`field-value-${ind}`}
                                    id={`field-value-select-${ind}`}
                                    value={''}
                                    onChange={(e) => update(e, 'value', ind)}>
                                    {type === 'schema'
                                        ? schemas.map((schema) => (
                                              <MenuItem key={schema.name} value={schema.name}>
                                                  <Tooltip
                                                      title={<pre>{JSON.stringify(schema.schema, null, 4)}</pre>}
                                                      classes={{tooltip: classes.toolTip}}>
                                                      <Typography className={classes.toolTipText}>
                                                          {schema.name}
                                                      </Typography>
                                                  </Tooltip>
                                              </MenuItem>
                                          ))
                                        : values.map((_val) => (
                                              <MenuItem key={_val} value={_val}>
                                                  {_val}
                                              </MenuItem>
                                          ))}
                                </Select>
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
                    <Typography>No fields added yet</Typography>
                )}
            </List>
        </div>
    );
};
