import {addNotif} from './reducers/notifications';

const BASE_URL = 'http://localhost:3000/api/';

const createRequest = async (url: string, method: string, dispatch: any, data: any = null) => {
    let options: any = {
        method,
    };
    if (method !== 'GET') {
        options.headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        if (data !== null) {
            options.body = JSON.stringify(data);
        }
    }
    const resp = await fetch(`${BASE_URL}${url}`, options);
    const json = await resp.json();
    if (!resp.ok) {
        dispatch(
            addNotif({
                variant: 'error',
                text: json.error,
            })
        );
    }
    return json;
};

export const get = (url: string, dispatch: any) => createRequest(url, 'GET', dispatch);
export const post = (url: string, dispatch: any, data: any) => createRequest(url, 'POST', dispatch, data);
export const isError = (data: any): boolean => 'error' in data;
