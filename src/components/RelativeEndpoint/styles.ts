import {makeStyles} from '@material-ui/core';

const styles = makeStyles((_) => ({
    root: {
        width: '100%',
        '& .endpointContainer': {
            padding: '8px 16px 16px',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                cursor: 'pointer',
                color: 'white',
                '& .method-POST': {
                    color: 'lightgreen',
                },
                '& .method-PUT': {
                    color: 'lightblue',
                },
            },
        },
        "& div[class*='method-']": {
            fontWeight: 'bolder',
        },
        '& .method-GET': {
            color: '#FF0099',
        },
        '& .method-POST': {
            color: 'green',
        },
        '& .method-PUT': {
            color: 'darkblue',
        },
    },
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        cursor: 'pointer',
        color: 'white',
        '& .method-POST': {
            color: 'lightgreen',
        },
        '& .method-PUT': {
            color: 'lightblue',
        },
    },
}));

export default styles;
