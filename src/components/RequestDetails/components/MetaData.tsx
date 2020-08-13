import React, {useEffect} from 'react'
import {Switch, FormControlLabel, TextField} from '@material-ui/core'
import {useDispatch} from 'react-redux'

import {metaData} from '../../../reducers/relativeEndpoints'
import {updateMeta} from '../../../reducers/selectedEndpoints'

interface Props {
    meta_data: metaData;
    classes: {
        [key: string]: string;
    };
}

export const MetaData = ({meta_data, classes}: Props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!meta_data.is_paginated && meta_data.num_pages > 1) {
            dispatch(updateMeta({
                key: 'num_pages',
                value: 1
            }))
        }
    }, [dispatch, meta_data])
    const handleIsPaginatedChange = (e: any) => {
        dispatch(updateMeta({
            key: "is_paginated",
            value: e.target.checked
        }))
    };
    const handleChange = (e: any, key: string) => {
        if (!meta_data.is_paginated && key === 'num_pages') return;
        dispatch(updateMeta({
            key,
            value: e.target.value
        }))
    };
    return (
        <div className={classes.metaDataDiv}>
            <FormControlLabel
                control={
                    <Switch
                        checked={meta_data.is_paginated}
                        onChange={handleIsPaginatedChange}
                    />
                }
                label="Paginate results"
            />
            <TextField disabled={!meta_data.is_paginated} onChange={e => handleChange(e, 'num_pages')} id="num_pages" value={meta_data.num_pages} label="Number of pages" variant="outlined" />
            <TextField onChange={e => handleChange(e, 'records_per_page')} id="records_per_page" value={meta_data.records_per_page} label="Records per page" variant="outlined" />
        </div>
    )
}
