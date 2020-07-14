import React from 'react';
import {Grid} from '@material-ui/core';

import {BaseEndpoint} from '../components/BaseEndpoint';
import {RequestDetails} from '../components/RequestDetails';

export const HomePage = () => {
    return (
        <Grid container>
            <Grid item xs={2}>
                <BaseEndpoint />
            </Grid>
            <Grid item xs={10}>
                <RequestDetails />
            </Grid>
        </Grid>
    );
};
