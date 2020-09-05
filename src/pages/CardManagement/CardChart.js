import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {sortBy} from 'lodash';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

import {useDatabase} from 'reactfire';

export default function CardChart (props) {
    const db = useDatabase();
    let [operations, setOperations] = useState([]);


    useEffect(() => {
        db.ref('/operations/' + props.cardNumber)
        .on('value', (snapshot) => {
            if(snapshot.val()){
                setOperations(Object.values(snapshot.val()).filter(e => e.value !== 0));
            }
        });
    }, []);

    let reducedData = operations
    .map(e => ({date: moment(e.date).format('YYYY-MM'), value: e.value}))
    .reduce((acc, val) => {
        if(acc[val.date]){
            acc[val.date] += val.value;
        } else {
            acc[val.date] = val.value;
        }
        return acc;
    }, {});

    let data = sortBy(Object.entries(reducedData).map(([date, value]) => ({date, value})), e => e.date);

    return <LineChart width={800} height={300} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
    </LineChart>
}
