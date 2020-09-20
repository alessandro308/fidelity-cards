import React, {useEffect, useState} from 'react';
import {
    Container,
    Button,
    Modal,
    Form,
    Spinner
} from 'react-bootstrap';
import {t} from 'ttag';
import {appConfig} from '../../config/config';
import {useDatabase} from 'reactfire';
import CardTable from './CardTable';

export default function ManageDb () {
    const [resetCardModal, setResetCardModal] = useState(false);
    const [resetAllCardModal, setResetAllCardModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const [filter, setFilter] = useState(null);
    const db = useDatabase();

    useEffect(() => {
        // Legacy property, no more used
        localStorage.removeItem('fidelityCardList');
        let ref = db.ref('/cards')
        ref.once('value')
        .then((snapshot) => {
            let cards = Object.values(snapshot.val());
            setCards(cards)
            setIsLoading(false);
        });
        return () => ref.off();
    }, [db]);

    const filterByName = (event) => {
        if(event.target.value){
            setFilter(event.target.value);
        } else {
            setFilter(null);
        }
    };

    const cleanCards = (minAmountToBeSaved) => {
        /* Downloading a backup file */
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards));
        const dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "backup_keep_it_safe.json");
        dlAnchorElem.click();

        for(let card of Object.values(cards)){
            if(minAmountToBeSaved) {
                if(card.total < minAmountToBeSaved) {
                    db.ref(`/operations/${card.id}`)
                    .remove();
                    db.ref(`/cards/${card.id}/total`).set(0);
                }
            } else {
                db.ref(`/operations/${card.id}`).remove();
                db.ref(`/cards/${card.id}/total`).set(0);
            }
        }

        setResetCardModal(false);
        setResetAllCardModal(false);
    };

    return <React.Fragment>
        <Container className="pageContainer">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {isLoading ?
                <Spinner animation="border" role="status">
                    <span className="sr-only">{t`Deleting`}</span>
                </Spinner>
                :
                <React.Fragment>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t`Filter by name`}</Form.Label>
                        <Form.Control type="name" placeholder={t`Customer Name`} onChange={(e) => filterByName(e)} />
                    </Form.Group>
                    <CardTable cards={cards.filter(c => filter ? c.name.toLowerCase().includes(filter.toLowerCase()) : true)}/>
                </React.Fragment>
            }
            </div>

            <Button onClick={() => setResetCardModal(true)} variant='danger'>{t`Reset Card under ${appConfig.minAmountAtEndOfTheYear}`}</Button>
            {' '}
            <Button onClick={() => setResetAllCardModal(true)} variant='danger'>{t`Reset All Card`}</Button>
        </Container>

        <a id="downloadAnchorElem" style={{display:'none'}}/>

        <Modal show={resetCardModal} onHide={() => setResetCardModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t`Do you want to reset cards under ${ appConfig.minAmountAtEndOfTheYear }pt?`}</Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setResetCardModal(false)}>{t`Cancel`}</Button>
                <Button variant="danger" onClick={() => cleanCards(appConfig.minAmountAtEndOfTheYear)}>{t`Delete`}</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={resetAllCardModal} onHide={() => setResetAllCardModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t`Do you want to reset ALL cards?`}</Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setResetAllCardModal(false)}>{t`Cancel`}</Button>
                <Button variant="danger" onClick={() => cleanCards()}>{t`Delete`}</Button>
            </Modal.Footer>
        </Modal>
    </React.Fragment>;
}
