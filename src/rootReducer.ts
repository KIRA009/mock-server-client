import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import {History} from 'history';
// eslint-disable-next-line import/no-cycle
import baseEndpointReducer from './reducers/baseEndpoints';
import notifReducer from './reducers/notifications';
import relativeEndpointReducer from './reducers/relativeEndpoints';
import selectedEndpointReducer from './reducers/selectedEndpoints';
import possibleValuesReducer from './reducers/possibleValues';
import schemaCreationReducer from './reducers/schemaCreation';

export default function createRootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        baseEndpoints: baseEndpointReducer,
        notifications: notifReducer,
        relativeEndpoints: relativeEndpointReducer,
        selectedEndpoints: selectedEndpointReducer,
        possibleValues: possibleValuesReducer,
        schemaCreation: schemaCreationReducer
    });
}
