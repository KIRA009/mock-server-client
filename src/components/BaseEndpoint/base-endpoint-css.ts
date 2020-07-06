import { makeStyles } from '@material-ui/core';


const styles = makeStyles(_ => ({
    root: {
        borderRight: '1px solid black',
        height: '100vh'
    },
    baseEndpoint: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        '&:hover': {
            '& .MuiAccordionSummary-expandIcon svg': {
                visibility: 'visible'
            }
        },
    },
    baseEndpointIcon: {
        visibility: 'hidden'
    },
    newBaseEndpointBtnDiv: {
        padding: 10,
    },
    btn: {
        display: 'block',
        margin: 'auto'
    },
    expanded: {
        '&.Mui-expanded': {
            margin: 0
        }
    },
    emptyBaseEndpoints: {
        padding: 10
    }
}))

export default styles;