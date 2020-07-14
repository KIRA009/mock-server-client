import {makeStyles} from '@material-ui/core';

const styles = makeStyles((_) => ({
    root: {
        borderRight: '1px solid black',
        height: '100vh',
    },
    baseEndpoint: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 10,
        '& .MuiAccordionSummary-root': {
            flex: 4,
        },
        '&:hover': {
            '& .MuiAccordionSummary-expandIcon svg': {
                visibility: 'visible',
            },
        },
        '& .MuiAccordionSummary-content': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0,
        },
    },
    baseEndpointIcon: {
        visibility: 'hidden',
    },
    newBaseEndpointBtnDiv: {
        padding: 10,
    },
    btn: {
        display: 'block',
        margin: 'auto',
    },
    expanded: {
        '&.Mui-expanded': {
            margin: 0,
        },
        '& .MuiAccordionDetails-root': {
            padding: 0,
        },
    },
    emptyBaseEndpoints: {
        padding: 10,
    },
    newEndpointDialog: {
        width: 700,
        '& .MuiDialogContent-root': {
            display: 'flex',
            justifyContent: 'space-between',
            '& .MuiTextField-root': {
                width: 400,
            },
        },
    },
}));

export default styles;
