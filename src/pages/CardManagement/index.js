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
    InputGroup,
} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export default function CardManagement () {
    const [cardNumber, setCardNumber] = useState(null);
    const [card, setCard] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [allOperations, setAllOperations] = useState(false);
    const [addedPoint, setAddedPoint] = useState(0);

    const db = useDatabase();
    const onCardNumberChange = (event) => {
        try{
            let number = event.target.value;
            if(number){
                setCardNumber(number);
                db.ref('/cards/' + number)
                .on('value', (snapshot) => {
                    let card = snapshot.val();
                    console.log('ne card', card);
                    if(card){
                        card.operations = Object.values(card.operations);
                        setCard(card);
                    }

                })
                .catch(err => {
                    console.err(err);
                });
            }
        } catch(e){}
    };

    const addPoint = () => {
        if(addedPoint === 0){
            return;
        }

        let newOperation = {
            date: moment(new Date).format(),
            value: parseInt(addedPoint),
        };
        try {
            let newOperationRef = db.ref(`/cards/${cardNumber}/operations`).push();
            newOperation.key = newOperationRef.key;
            newOperationRef.set(newOperation);
        } catch (e){
            console.log(e);
        }

        setModalOpen(false);
    };

    const onPointChange = (event) => {
        setAddedPoint(event.target.value);
    }

    const openModal = () => {
        setModalOpen(true);
    };

    let total = 0;
    if(card?.operations){
        total = card?.operations.map(o => o.value).reduce((a, b) => a+b, 0);
    }

    return <React.Fragment>
        <Container className="pageContainer">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t`Insert Card Number`}</Form.Label>
                    <Form.Control type="number" placeholder="Card Number" onChange={onCardNumberChange}/>
                </Form.Group>
            </Form>
            { card && card.id === cardNumber ?
                <Jumbotron>
                    <h1 style={{display: 'flex', justifyContent: 'space-between'}}>{card.name} <Badge variant="primary">{total}</Badge></h1>
                    <p>
                        <span>{card.email}</span>{card.email && card.phone ? <span> - </span> : null }<span>{card.phone}</span>
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
                                .map((o) => <tr key={o.date+o.value+o.key}>
                                    <td>{moment(o.date).format()/*.format('YY-MM-DD - HH:MM')*/}</td>
                                    <td>{o.value}</td>
                                </tr>)
                            }
                        </tbody>
                    </Table>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button variant="link" onClick={() => setAllOperations(!allOperations)}>{!allOperations ? t`Show all` : t`Show only latest entries`}</Button>

                        <Button variant="primary" style={{borderRadius: '100%'}} onClick={() => openModal()}>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </Button>
                    </div>
                </Jumbotron> : null}
        </Container>
        
        <Modal show={modalOpen} centered>
            <Modal.Header closeButton>
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
    </React.Fragment>
}
