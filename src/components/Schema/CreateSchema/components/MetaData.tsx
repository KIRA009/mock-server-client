import React, {useEffect} from 'react';
import {Switch, FormControlLabel, TextField, Tooltip} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {useDispatch} from 'react-redux';

import {metaData} from '../../../../reducers/relativeEndpoints';
import {updateMeta} from '../../../../reducers/selectedEndpoints';

interface Props {
    meta_data: metaData;
    classes: {
        [key: string]: string;
    };
}

export const MetaData = ({meta_data, classes}: Props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!meta_data.is_paginated && meta_data.num_records > 1) {
            dispatch(
                updateMeta({
                    key: 'num_records',
                    value: 1,
                })
            );
        }
    }, [dispatch, meta_data]);
    const handleIsPaginatedChange = (e: any) => {
        dispatch(
            updateMeta({
                key: 'is_paginated',
                value: e.target.checked,
            })
        );
    };
    const handleChange = (e: any, key: string) => {
        if (!meta_data.is_paginated) return;
        if (!e.target.value || e.target.value <= 0) return;
        dispatch(
            updateMeta({
                key,
                value: Number(e.target.value),
            })
        );
    };
    return (
        <div className={classes.metaDataDiv}>
            <div className={classes.paginateDiv}>
                <FormControlLabel
                    control={<Switch checked={meta_data.is_paginated} onChange={handleIsPaginatedChange} />}
                    label="Paginate results"
                />
                <Tooltip
                    title={<span>You need to have a 'pageNo' query parameter to access other pages</span>}
                    classes={{tooltip: classes.toolTip}}>
                    <HelpOutlineIcon />
                </Tooltip>
            </div>
            <TextField
                disabled={!meta_data.is_paginated}
                onChange={(e) => handleChange(e, 'num_records')}
                id="num_records"
                value={meta_data.num_records}
                label="Total number of records"
                variant="outlined"
            />
            <TextField
                disabled={!meta_data.is_paginated}
                onChange={(e) => handleChange(e, 'records_per_page')}
                id="records_per_page"
                value={meta_data.records_per_page}
                label="Records per page"
                variant="outlined"
            />
        </div>
    );
};
