import React, {useEffect, useState} from 'react';
import {
    Table
} from 'react-bootstrap';
import {t} from 'ttag';

export default function CardTable (props) {
    return <Table striped bordered hover>
        <thead>
        <tr>
            <th>#</th>
            <th>{t`Name`}</th>
            <th>{t`Phone`}</th>
            <th>{t`eMail`}</th>
            <th>{t`Type`}</th>
            <th>{t`Points`}</th>
        </tr>
        </thead>
        <tbody>
        {props.cards.map(card =>
            <tr>
                <td>{card.id}</td>
                <td>{card.name}</td>
                <td>{card.phone}</td>
                <td>{card.email}</td>
                <td>{card.type}</td>
                <td>{card.total ?? 0}</td>
            </tr>
        )}
        </tbody>
    </Table>
}
