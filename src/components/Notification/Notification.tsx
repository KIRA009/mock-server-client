import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getNotifs, readNotif} from '../../reducers/notifications';
import {useSnackbar} from 'notistack';

export const Notification = () => {
    const notifications = useSelector(getNotifs);
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    useEffect(() => {
        for (let notif of notifications) {
            enqueueSnackbar(Date.now(), {
                variant: notif.variant,
                autoHideDuration: 2000,
            });
            dispatch(readNotif(notif.id));
        }
    }, [notifications, enqueueSnackbar, dispatch]);
    return <></>;
};
