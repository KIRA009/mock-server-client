import React from 'react';
import {Grid} from '@material-ui/core';

import {BaseEndpoint} from '../components/BaseEndpoint';

export const HomePage = () => {
    return (
        <Grid container>
            <Grid item xs={3}>
                <BaseEndpoint />
            </Grid>
        </Grid>
    );
};
