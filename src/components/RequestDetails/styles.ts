import {makeStyles} from '@material-ui/core';

const styles = makeStyles((theme) => ({
    root: {
        padding: 30,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        width: 500,
        margin: 'auto',
        '&>.MuiTypography-root': {
            border: '1px solid rgba(0, 0, 0, 0.5)',
            width: 350,
            padding: 10,
        },
        alignItems: 'center',
        '& div:nth-child(2), div:nth-child(3)': {
            alignSelf: 'start',
        },
        '& svg': {
            color: '#303f9f',
        },
    },
    listItem: {
        justifyContent: 'space-around',
        '&>div': {
            flex: 1,
            margin: '0 10px',
        },
        '&>div:nth-child(3)': {
            flex: 2,
        },
        padding: '8px 0',
    },
    addFieldIcon: {
        display: 'block',
        marginLeft: 'auto',
    },
    toolTip: {
        fontSize: 18,
    },
    toolTipText: {
        display: 'block',
        width: '100%',
    },
    schema: {
        margin: 'auto',
        width: 700,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 15,
    },
    saveBtn: {
        margin: 10,
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row-reverse',
    },
    metaDataDiv: {
        display: 'flex',
        justifyContent: 'space-around',
        margin: 20,
    },
    paginateDiv: {
        display: 'flex',
        alignItems: 'center',
    },
    selectEndpointBanner: {
        padding: 20,
    },
    saveIcon: {
        '&:disabled svg': {
            color: 'rgba(0, 0, 0, 0.3)',
        },
    },
    divider: {
        margin: '20px auto',
    },
    actions: {
        padding: 20,
    },
}));

export default styles;
