import React, {useState} from 'react';
import {Container, Form, Jumbotron, Button, Table, Badge} from 'react-bootstrap';
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

    const db = useDatabase();
    const onCardNumberChange = (event) => {
        try{
            let number = event.target.value;
            setCardNumber(number);
            db.ref('/cards/' + number).once('value')
            .then(snapshot => {
                setCard(snapshot.val());
            })
            .catch(err => {
                console.err(err);
            })
        } catch(e){}
    };

    const openModal = () => {
        setModalOpen(true);
    };
    let total = 0;
    if(card?.operations){
        total = card?.operations.map(o => o.value).reduce((a, b) => a+b, 0);
    }
    return <Container className="pageContainer">
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
                {(card.operations ? card.operations : card.operations.slice(0, 10))
                    .map((o, index) => <tr key={o.date+o.value}>
                        <td>{moment(o.date).format('YY-MM-DD - HH:MM')}</td>
                        <td>{o.value}</td>
                    </tr>)}
                </tbody>
            </Table>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="link" onClick={() => setAllOperations(true)}>{t`Show all operations`}</Button>

                <Button variant="primary" style={{borderRadius: '100%'}} onClick={() => openModal()}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </Button>
            </div>
        </Jumbotron> : null}
    </Container>
}
