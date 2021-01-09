import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {sortBy} from 'lodash';
import {t} from 'ttag';
import {LineChart, Line, CartesianGrid, XAxis, YAxis} from 'recharts';
import {Alert, Button} from 'react-bootstrap';
import {appConfig} from '../../config/config';
import {useDatabase} from 'reactfire';

function BusinessCardAlert(props) {
    const [show, setShow] = useState(true);
    const db = useDatabase();

    useEffect(() => {
        setShow(true);
    }, [props.card]);

    const snooze = function(){
        db.ref(`/cards/${props.card.id}/snoozedBusinessAlerts`).set(moment().toISOString());
        setShow(false);
    };

    const convertToStandard = function(){
        db.ref(`/cards/${props.card.id}/type`).set('standard');
        setShow(false);
    };

    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{t`This card is not eligible for Business programme!`}</Alert.Heading>
                <p>
                    {t`Do you want to convert it to standard?`}
                </p>
                <Button variant="secondary" onClick={() => snooze()}>{t`Snooze alert by 90 days`}</Button>
                {' '}
                <Button variant="primary" onClick={convertToStandard}>{t`Convert to standard`}</Button>
            </Alert>
        );
    }

    return null;
}

export default function CardChart (props) {

    let last3MonthPoints = props.operations ? props.operations
    .filter(e => moment().diff(moment(e.date), 'days') < 90 && e.value > 0)
    .map(op => op.value)
    .reduce((a, b) => a + b, 0) : 0;

    let reducedData = props.operations ? props.operations
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
    }, {}) : {};

    let data = sortBy(Object.entries(reducedData)
    .map(([date, value]) => ({date, value})), e => e.date);

    const showBusinessWarning =
        props.card.type === 'business' &&
        last3MonthPoints < appConfig.minPointsIn3MonthsToBeBusiness &&
        moment().diff(moment(props.card.creationDate), 'days') > 90 &&
        (!props.card.snoozedBusinessAlerts || (props.card.snoozedBusinessAlerts && moment().diff(moment(props.card.snoozedBusinessAlerts), 'days') > 90));

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h6>{t`In the last 90 days this card has earned ${last3MonthPoints} points`}</h6>
        {showBusinessWarning ?
            <BusinessCardAlert card={props.card}/>
        : null}
        { Object.keys(reducedData) > 1 ? <LineChart width={800} height={300} data={data}>
            <Line type="monotone" dataKey="value" stroke="#8884d8"/>
            <CartesianGrid stroke="#ccc"/>
            <XAxis dataKey="date"/>
            <YAxis/>
        </LineChart> : null }
    </div>;

}
