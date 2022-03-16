import {combineReducers} from 'redux';
// eslint-disable-next-line import/no-cycle
import baseEndpointReducer from './reducers/baseEndpoints';
import notifReducer from './reducers/notifications';
import relativeEndpointReducer from './reducers/relativeEndpoints';
import selectedEndpointReducer from './reducers/selectedEndpoints';
import possibleValuesReducer from './reducers/possibleValues';
import schemaCreationReducer from './reducers/schemaCreation';

export default function createRootReducer() {
    return combineReducers({
        baseEndpoints: baseEndpointReducer,
        notifications: notifReducer,
        relativeEndpoints: relativeEndpointReducer,
        selectedEndpoints: selectedEndpointReducer,
        possibleValues: possibleValuesReducer,
        schemaCreation: schemaCreationReducer,
    });
}
