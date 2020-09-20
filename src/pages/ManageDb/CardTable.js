import React from 'react';
import {
    Table
} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';

import {t} from 'ttag';

export default function CardTable (props) {
    const history = useHistory();

    const navigateToCard = (id) => {
        history.push(`/app?id=${id}`);
    };

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
                    <tr key={card.id} style={{cursor: 'pointer'}} onClick={() => navigateToCard(card.id)}>
                        <td>{card.id}</td>
                        <td>{card.name}</td>
                        <td>{card.phone}</td>
                        <td>{card.email}</td>
                        <td>{card.type}</td>
                        <td>{card.total}</td>
                    </tr>
                )}
                </tbody>
            </Table>

}
