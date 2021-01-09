import React from 'react';
import {sortBy} from 'lodash';
import {
    Table,
    Badge,
} from 'react-bootstrap';
import {t} from 'ttag';
import moment from 'moment';

export default function CardOperationTable (props) {
    return <Table striped bordered hover>
            <thead>
            <tr>
                <th>{t`Date`}</th>
                <th>{t`Action`}</th>
            </tr>
            </thead>
            <tbody>
            {
                sortBy(props.operations, [(e) => e.date])
                .reverse()
                .map((o) => <tr key={o.date + o.value + o.key}>
                    <td>{moment(o.date)
                    .format('DD-MM-YYYY - HH:MM')}</td>
                    <td>{o.value !== 0
                        ? (
                            (o.value < 0)
                                ? <Badge variant="primary">{t`Applied Discount`} - {Math.abs(o.value)/(props.discountType.at/props.discountType.value)}€</Badge>
                                : o.origin === 'referrer' ? o.value + ' - Referral Bonus' : o.value)
                        : t`Card Creation`}</td>
                </tr>)
            }
            </tbody>
        </Table>;
}
