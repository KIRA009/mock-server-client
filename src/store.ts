import {configureStore, getDefaultMiddleware, Action} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import {ThunkAction} from 'redux-thunk';
// eslint-disable-next-line import/no-cycle
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer();
export type RootState = ReturnType<typeof rootReducer>;
const middleware = [...getDefaultMiddleware()];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(process.env.NODE_ENV || '');

if (shouldIncludeLogger) {
    const logger = createLogger({
        level: 'info',
        collapsed: true,
    });
    middleware.push(logger);
}

export const configuredStore = (initialState?: any) => {
    // Create Store
    const store = configureStore({
        reducer: rootReducer,
        middleware,
        preloadedState: initialState,
    });
    return store;
};
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
