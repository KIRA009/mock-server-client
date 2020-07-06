import React from 'react'
import { CircularProgress } from '@material-ui/core'

import styles from './Loader-css';

export default function Loader() {
    const classes = styles();
    return (
        <CircularProgress className={classes.root} color="primary" />
    )
}
