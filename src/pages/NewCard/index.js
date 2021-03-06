import React, {useState} from 'react';
import {
    Button,
    Container,
    Jumbotron,
    Form,
    ToggleButtonGroup,
    ToggleButton,
    Modal,
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
    const [referrer, setReferrer] = useState('');
    const [cardType, setCardType] = useState('business');
    const [redirect, setRedirect] = useState(false);
    const [showCardExistErrorModal, setShowCardExistErrorModal] = useState(false);
    const [showCardExistError, setShowCardExistError] = useState(false);

    const db = useDatabase();

    const checkCardExist = (cardNumber) => {
        if(!cardNumber){
            return Promise.resolve(false);
        }
        return db.ref('/cards/' + cardNumber)
        .once('value')
        .then(snap => {
            return snap.val();
        });
    };

    const onFormSubmit = (event) => {
        if(!cardNumber){
            return;
        }
        event.preventDefault();
        db.ref('/cards/' + cardNumber)
        .once('value')
        .then(snap => {
            if(snap.val() === null) {
                setShowCardExistError(false);
                Promise.all([
                    db.ref('cards')
                    .update({
                        [cardNumber]: {
                            email,
                            name,
                            phone,
                            referrer,
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
            } else {
                setShowCardExistErrorModal(true);
                setShowCardExistError(true);
            }
        });

    };

    const referralHandler = (event) => {
        let referral = event.target.value;

        setReferrer(referral);
    };

    return <Container className="pageContainer">
        {redirect ? <Redirect to={`/app?id=${cardNumber}`}/> : null}
        <Jumbotron>
            <h1 style={{display: 'flex', justifyContent: 'space-between'}}>{t`Create a new card`}</h1>

            <Form onSubmit={onFormSubmit}>
                <Form.Group controlId="formBasicText">
                    <Form.Label>{t`Name`}</Form.Label>
                    <Form.Control type="text"
                                  required
                                  placeholder={t`Name and Last Name`}
                                  onChange={(event) => setName(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t`Email`}</Form.Label>
                    <Form.Control type="email" placeholder={t`Enter email`} onChange={(event) => setEmail(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>{t`Phone`}</Form.Label>
                    <Form.Control type="text"
                                  required
                                  placeholder={t`Phone`}
                                  onChange={(event) => setPhone(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label><strong>{t`Card Number`}</strong></Form.Label>
                    <Form.Control type="text"
                                  placeholder={t`12345678 - Required`}
                                  required
                                  onChange={event => setCardNumber(event.target.value)}
                                  isInvalid={showCardExistError}
                        />
                    <Form.Control.Feedback type="invalid">
                        {t`Card number does not exists`}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>{t`Referral`}</Form.Label>
                    <Form.Control type="text"
                                  placeholder="12345678"
                                  onChange={referralHandler}
                        />
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
        <Modal show={showCardExistErrorModal} onHide={() => setShowCardExistErrorModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t`Card already exists`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t`Delete the previous card before to create a new card with the same Card Number`}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowCardExistErrorModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </Container>;
}
