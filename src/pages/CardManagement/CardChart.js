import React from 'react';
import moment from 'moment';
import {sortBy} from 'lodash';
import {t} from 'ttag';
import {LineChart, Line, CartesianGrid, XAxis, YAxis} from 'recharts';

export default function CardChart (props) {
    let lastMonthPoint = props.operations
    .filter(e => moment().diff(moment(e.date), 'days') < 30 && e.value > 0)
    .map(op => op.value)
    .reduce((a, b) => a + b, 0);

    let reducedData = props.operations
    .filter(e => e.value > 0)
    .map(e => ({
        date: moment(e.date)
        .format('YYYY-MM'), value: e.value,
    }))
    .reduce((acc, val) => {
        if (acc[val.date]) {
            acc[val.date] += val.value;
        } else {
            acc[val.date] = val.value;
        }
        return acc;
    }, {});

    let data = sortBy(Object.entries(reducedData)
    .map(([date, value]) => ({date, value})), e => e.date);

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2>{t`In the last 30 days this card has earned ${lastMonthPoint} points`}</h2>
        <LineChart width={800} height={300} data={data}>
            <Line type="monotone" dataKey="value" stroke="#8884d8"/>
            <CartesianGrid stroke="#ccc"/>
            <XAxis dataKey="date"/>
            <YAxis/>
        </LineChart>
    </div>;

}
