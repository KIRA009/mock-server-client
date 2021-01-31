import React, {useState} from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from '@material-ui/core';
import {useSelector} from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {getSchemas, schema as schemaInterface} from '../../../reducers/possibleValues';
import styles from './styles';

interface Props {
    loadSchema: any;
}

interface ControlledAccordionProps {
    classes: {
        [key: string]: string;
    };
    loadSchema: any;
    schema: schemaInterface;
}

const ControlledAccordion = ({classes, loadSchema, schema}: ControlledAccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpen = () => setIsOpen(!isOpen);
    return (
        <Accordion onChange={toggleIsOpen} className={classes.accordion}>
            <AccordionSummary classes={{content: classes.accordionSummary}}>
                <ListItemText>{schema.name}</ListItemText>
                <IconButton onClick={() => loadSchema(schema.name)} color="primary">
                    <EditIcon />{' '}
                </IconButton>
                <IconButton color="secondary">
                    <DeleteIcon />{' '}
                </IconButton>
            </AccordionSummary>
            {isOpen && (
                <AccordionDetails>
                    <pre className={classes.schemaBg}>{JSON.stringify(schema.schema, null, 4)}</pre>
                </AccordionDetails>
            )}
        </Accordion>
    );
};

export const ListSchema = ({loadSchema}: Props) => {
    const schemas = useSelector(getSchemas);
    const classes = styles();
    return (
        <List>
            {schemas.length ? (
                schemas.map((schema) => (
                    <ListItem key={schema.name}>
                        <ControlledAccordion {...{classes, loadSchema, schema}} />
                    </ListItem>
                ))
            ) : (
                <Typography>No schemas have been created yet</Typography>
            )}
        </List>
    );
};
