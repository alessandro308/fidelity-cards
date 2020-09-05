import React, {useState} from 'react';
import {sortBy} from 'lodash';
import {
    Container,
    Form,
    Jumbotron,
    Button,
    Table,
    Badge,
    Modal,
    FormControl,
    Alert,
    InputGroup,
} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export default function CardManagement () {
    const [cardNumber, setCardNumber] = useState(undefined);
    const [card, setCard] = useState(null);
    const [cardDeleted, setCardDeleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [allOperations, setAllOperations] = useState(false);
    const [addedPoint, setAddedPoint] = useState(0);

    const db = useDatabase();

    const searchCardNumber = (number) => {
        db.ref('/cards/' + number)
        .on('value', (snapshot) => {
            let cardResult = snapshot.val();
            if (cardResult) {
                cardResult.operations = Object.values(cardResult.operations);
                setCard(cardResult);
            }
        });
    };

    const onCardNumberChange = (event) => {
        let number = event.target.value;
        setCardNumber(number);
        setCardDeleted(null);
        if (number.length > 0) {
            searchCardNumber(number);
        }
    };

    const addPoint = () => {
        if (addedPoint === 0) {
            return;
        }

        let newOperation = {
            date: moment(new Date())
            .format(),
            value: parseInt(addedPoint),
        };
        try {
            let newOperationRef = db.ref(`/cards/${cardNumber}/operations`)
            .push();
            newOperation.key = newOperationRef.key;
            newOperationRef.set(newOperation);
        } catch (e) {
            console.log(e);
        }

        setModalOpen(false);
    };

    const onPointChange = (event) => {
        setAddedPoint(event.target.value);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const deleteCard = () => {
        setDeleteModalOpen(false);
        db.ref(`/cards/${cardNumber}/`).remove()
        .then(() => {
            setCardDeleted(true);
            setCard(null);
            setCardNumber(undefined);
        })
    };

    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');
    if (cardId && cardId !== cardNumber) {
        searchCardNumber(cardId);
        window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
    }

    let total = 0;
    if (card?.operations) {
        total = card?.operations.map(o => o.value)
        .reduce((a, b) => a + b, 0);
    }


    return <React.Fragment>
        <Container className="pageContainer">
            {cardDeleted ? <Alert variant="danger">
                {t`Card #${cardNumber} successfully deleted`}
            </Alert> : null}
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t`Insert Card Number`}</Form.Label>
                    <Form.Control value={cardNumber} placeholder="Card Number" onChange={onCardNumberChange}/>
                </Form.Group>
            </Form>
            {card && card.id === cardNumber ?
                <Jumbotron>
                    <h1 style={{display: 'flex', justifyContent: 'space-between'}}>{card.name} <Badge variant="primary">{total}</Badge></h1>
                    <p>
                        <span>{card.email}</span>{card.email && card.phone ? <span> - </span> : null}<span>{card.phone}</span>
                    </p>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>{t`Date`}</th>
                            <th>{t`Action`}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            sortBy(card.operations, [(e) => e.date])
                            .reverse()
                            .slice(0, !allOperations ? 10 : card.length)
                            .map((o) => <tr key={o.date + o.value + o.key}>
                                <td>{moment(o.date)
                                .format('YY-MM-DD - HH:MM')}</td>
                                <td>{o.value ? o.value : t`Card Creation`}</td>
                            </tr>)
                        }
                        </tbody>
                    </Table>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>{t`Delete`}</Button>
                            <Button variant="link" onClick={() => setAllOperations(!allOperations)}>{!allOperations
                                ? t`Show complete history`
                                : t`Show only latest entries`}</Button>
                        </div>
                        <div>
                            <Button variant="info" onClick={() => openModal()}>
                                {t`Use Discount`}
                            </Button>
                            {' '}
                            <Button variant="primary" style={{borderRadius: '100%'}} onClick={() => openModal()}>
                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </Button>
                        </div>
                    </div>
                </Jumbotron> : null}
        </Container>

        <Modal show={modalOpen} centered>
            <Modal.Header>
                <Modal.Title>{t`Add points`}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">+</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        onChange={onPointChange}
                        type="number"
                        placeholder={t`Point to add`}
                        aria-label={t`Point to add`}
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>{t`Close`}</Button>
                <Button variant="primary" onClick={() => addPoint()}>{t`Save changes`}</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={deleteModalOpen} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t`Do you want to delete the card #${cardNumber}?`}</Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>{t`Cancel`}</Button>
                <Button variant="danger" onClick={() => deleteCard(cardNumber)}>{t`Delete`}</Button>
            </Modal.Footer>
        </Modal>


    </React.Fragment>;
}
