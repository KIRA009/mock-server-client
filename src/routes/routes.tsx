import {FunctionComponent} from 'react';

import {HomePage} from '../containers/HomePage';

interface route {
    url: string;
    component: FunctionComponent;
}

export const routes: route[] = [
    {
        url: '/',
        component: HomePage,
    },
];
