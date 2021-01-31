import React, {useState} from 'react';
import {Tabs, Tab, Dialog, DialogContent, Box} from '@material-ui/core';
import {useDispatch} from 'react-redux';

import {CreateSchema} from './CreateSchema';
import {ListSchema} from './ListSchema';
import styles from './styles';
import {fetchSchemaDetails, clearSchema} from '../../reducers/schemaCreation';

interface Props {
    openSchema: boolean;
    handleClose: any;
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

interface TabPanelProps {
    value: number;
    index: number;
    children: React.ReactElement;
}

const TabPanel = ({value, index, children}: TabPanelProps) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`schema-tabpanel-${index}`}
            aria-labelledby={`schema-tab-${index}`}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

export const Schema = ({openSchema, handleClose}: Props) => {
    const [tab, setTab] = useState(0);
    const classes = styles();
    const handleChange = (_: any, newVal: number) => {
        if (newVal === 1) dispatch(clearSchema(null));
        setTab(newVal);
    };
    const dispatch = useDispatch();
    const loadSchema = (name: string) => {
        dispatch(fetchSchemaDetails(name));
        setTab(0);
    };
    return (
        <Dialog maxWidth="xl" open={openSchema} onClose={handleClose}>
            <Tabs value={tab} onChange={handleChange} aria-label="schema tabs" classes={{flexContainer: classes.tabs}}>
                <Tab label="Create Schema" {...a11yProps(0)} />
                <Tab label="List schemas" {...a11yProps(1)} />
            </Tabs>
            <DialogContent className={classes.schemaDialog}>
                <TabPanel value={tab} index={0}>
                    <CreateSchema />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <ListSchema loadSchema={loadSchema} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
};
