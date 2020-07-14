import React from 'react';
import {CircularProgress} from '@material-ui/core';

import styles from './styles';

export const Loader = () => {
    const classes = styles();
    return <CircularProgress className={classes.root} color="primary" />;
};
