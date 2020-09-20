import React, {useState} from 'react';
import {
    Button,
    Container,
    Jumbotron,
    Form,
    ToggleButtonGroup,
    ToggleButton,
} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import {Redirect} from 'react-router-dom';
import moment from 'moment';

export default function NewCard () {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('business');
    const [redirect, setRedirect] = useState(false);

    const db = useDatabase();

    const onFormSubmit = (event) => {
        if(!cardNumber){
            return;
        }
        event.preventDefault();
        Promise.all([
            db.ref('cards')
            .update({
                [cardNumber]: {
                    email,
                    name,
                    phone,
                    type: cardType,
                    id: cardNumber,
                    creationDate: moment(new Date())
                    .format(),
                },
            }),
            db.ref('operations')
            .update({
                [cardNumber]: [
                    {
                        date: moment(new Date())
                        .format(), value: 0,
                    },
                ],
            }),
        ])
        .then(res => {
            setRedirect(true);
        });
    };

    return <Container className="pageContainer">
        {redirect ? <Redirect to={`/app?id=${cardNumber}`}/> : null}
        <Jumbotron>
            <h1 style={{display: 'flex', justifyContent: 'space-between'}}>{t`Create a new card`}</h1>

            <Form onSubmit={onFormSubmit}>
                <Form.Group controlId="formBasicText">
                    <Form.Label>{t`Name`}</Form.Label>
                    <Form.Control type="text" placeholder={t`Name and Last Name`} onChange={(event) => setName(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t`Email`}</Form.Label>
                    <Form.Control type="email" placeholder={t`Enter email`} onChange={(event) => setEmail(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>{t`Phone`}</Form.Label>
                    <Form.Control type="text" placeholder={t`Phone`} onChange={(event) => setPhone(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>{t`Card Number`}</Form.Label>
                    <Form.Control type="text" placeholder={t`12345678 - Required`} onChange={(event) => setCardNumber(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <ToggleButtonGroup type="radio" name="card-type" value={cardType} onChange={setCardType}>
                        <ToggleButton variant="secondary" value="business">{t`Business`}</ToggleButton>
                        <ToggleButton variant="secondary" value="standard">{t`Standard`}</ToggleButton>
                        <ToggleButton variant="secondary" value="gift">{t`Gift Card`}</ToggleButton>
                    </ToggleButtonGroup>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {t`Create`}
                </Button>
            </Form>
        </Jumbotron>
    </Container>;
}
