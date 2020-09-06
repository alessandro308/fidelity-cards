import React, {useEffect, useState} from 'react';
import {
    Container,
    Button,
    Modal,
    Spinner
} from 'react-bootstrap';
import {t} from 'ttag';
import {appConfig} from '../../config/config';
import {useDatabase} from 'reactfire';
import CardTable from './CardTable';

export default function ManageDb () {
    const [resetCardModal, setResetCardModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [cards, setCards] = useState([]);
    const db = useDatabase();

    useEffect(() => {
        db.ref('/cards').once('value')
        .then((snapshot) => {
            setCards(snapshot.val())
        });
    });

    const cleanCards = () => {
        setIsDeleting(true);
        for(let card of Object.values(cards)){
            if(card.total < appConfig.minAmountAtEndOfTheYear) {
                db.ref(`/operations/${card.id}`)
                .remove();
            }
        }

        setIsDeleting(false)
        setResetCardModal(false);
    };

    return <React.Fragment>
        <Container className="pageContainer">
            {isDeleting ?
                <Spinner animation="border" role="status">
                    <span className="sr-only">{t`Deleting`}</span>
                </Spinner>
                : null
            }
            <CardTable cards={cards}/>
            <Button onClick={() => setResetCardModal(true)}>{t`Reset Card under ${appConfig.minAmountAtEndOfTheYear}`}</Button>
        </Container>

        <Modal show={resetCardModal} onHide={() => setResetCardModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t`Do you want to reset cards under 200pt?`}</Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setResetCardModal(false)}>{t`Cancel`}</Button>
                <Button variant="danger" onClick={() => cleanCards()}>{t`Delete`}</Button>
            </Modal.Footer>
        </Modal>
    </React.Fragment>;
}
