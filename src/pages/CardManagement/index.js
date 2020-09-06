import React, {useState, useEffect} from 'react';
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
    ToggleButton,
    ToggleButtonGroup,
} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import CardChart from './CardChart';
import {appConfig} from '../../config/config';

export default function CardManagement () {
    const [cardNumber, setCardNumber] = useState(undefined);
    const [card, setCard] = useState(null);
    const [operations, setOperations] = useState([]);
    const [cardDeleted, setCardDeleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [allOperations, setAllOperations] = useState(false);
    const [addedPoint, setAddedPoint] = useState(0);
    const [showPointEarnChart, setShowPointEarnChart] = useState(false);
    const [discountToApply, setDiscountToApply] = useState(null);

    const db = useDatabase();

    const searchCardNumber = (number) => {
        db.ref('/cards/' + number)
        .on('value', (snapshot) => {
            let cardResult = snapshot.val();
            if (cardResult) {
                setCard(cardResult);
            }
        });
        getOperations(number);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cardId = urlParams.get('id');
        if (cardId && cardId !== cardNumber) {
            setCardNumber(cardId);
            searchCardNumber(cardId);
        }
    }, [cardNumber, searchCardNumber]);


    const getOperations = (number) => {
        db.ref('/operations/' + number)
        .on('value', (snapshot) => {
            if (snapshot.val()) {
                setOperations(Object.values(snapshot.val())
                .filter(e => e.value !== 0));
            }
        });
    };

    const onCardNumberChange = (event) => {
        let number = event.target.value;
        setCardNumber(number);
        setCardDeleted(null);
        setShowPointEarnChart(false);
        setAllOperations(false);
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
            let newOperationRef = db.ref(`/operations/${cardNumber}`)
            .push();
            newOperation.key = newOperationRef.key;
            newOperationRef.set(newOperation);

            db.ref(`/cards/${cardNumber}/total`).set(parseInt(total) + parseInt(addedPoint))
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
        db.ref(`/cards/${cardNumber}/`)
        .remove()
        .then(() => {
            setCardDeleted(true);
            setCard(null);
            setCardNumber(undefined);
        });
    };

    const toggleAllOperations = (newVal) => {
        setAllOperations(newVal);
    };

    const applyDiscount = () => {
        let newOperation = {
            date: moment(new Date()).format(),
            value: -discountToApply,
        };
        try {
            let newOperationRef = db.ref(`/operations/${cardNumber}`)
            .push();
            newOperation.key = newOperationRef.key;
            newOperationRef.set(newOperation);
        } catch (e) {
            console.log(e);
        }

        setDiscountModalOpen(false);
    };

    const total = operations.map(a => parseInt(a.value))
    .reduce((a, b) => a + b, 0);

    const discountType = appConfig.discounts[card?.type];

    return <React.Fragment>
        <Container className="pageContainer">
            {cardDeleted ? <Alert variant="danger">
                {t`Card #${cardNumber} successfully deleted`}
            </Alert> : null}
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t`Card Number`}</Form.Label>
                    <Form.Control value={cardNumber} placeholder="Scan the card code" onChange={onCardNumberChange}/>
                </Form.Group>
            </Form>
            {card && card.id === cardNumber ?
                <Jumbotron>
                    <h1 style={{display: 'flex', justifyContent: 'space-between'}}>{card.name} <Badge
                        variant="primary">{total}</Badge></h1>
                    <p>
                        <span>{card.email}</span>{card.email && card.phone ? <span> - </span> : null}<span>{card.phone}</span>
                    </p>
                    <p>
                        <span>{t`Creation Date`}: {moment(card.creationDate)
                        .format('DD-MM-YYYY')}</span>
                    </p>

                    {showPointEarnChart ?
                        <CardChart operations={operations}/> :
                        <Button style={{marginBottom: "10px"}} variant="info" onClick={() => setShowPointEarnChart(true)}>{t`See card trend`}</Button>
                    }

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>{t`Date`}</th>
                            <th>{t`Action`}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            sortBy(operations, [(e) => e.date])
                            .reverse()
                            .slice(0, !allOperations ? 10 : card.length)
                            .map((o) => <tr key={o.date + o.value + o.key}>
                                <td>{moment(o.date)
                                .format('YY-MM-DD - HH:MM')}</td>
                                <td>{o.value !== 0 ? ((o.value < 0) ?
                                    <Badge variant="primary">{t`Applied Discount`} - {Math.abs(o.value)/(discountType.at/discountType.value)}€</Badge> : o.value) : t`Card Creation`}</td>
                            </tr>)
                        }
                        </tbody>
                    </Table>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>{t`Delete`}</Button>
                            <Button variant="link" onClick={() => toggleAllOperations(!allOperations)}>{!allOperations
                                ? t`Show complete history`
                                : t`Show only latest entries`}</Button>
                        </div>
                        <div>
                            <Button variant="info" disabled={total < discountType.at} onClick={() => setDiscountModalOpen(true)}>
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
                <Button variant="primary" onClick={() => addPoint()}>{t`Add point`}</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t`Do you want to delete the card #${cardNumber}?`}</Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>{t`Cancel`}</Button>
                <Button variant="danger" onClick={() => deleteCard(cardNumber)}>{t`Delete`}</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={discountModalOpen} onHide={() => setDiscountModalOpen(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t`Apply discount to card #${cardNumber}?`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ToggleButtonGroup type="radio" value={discountToApply} name="discountToApply" onChange={(e) => setDiscountToApply(e)}>
                    {card ? new Array(Math.floor(total / discountType.at)).fill(0)
                    .map((_, idx) => {
                        const value = discountType.at*(idx+1);
                        return <ToggleButton
                            key={idx}
                            variant={discountToApply === value ? 'primary' : 'secondary'}
                            name="discountToApply"
                            value={value}
                            checked={discountToApply === value}
                            onChange={(e) => setDiscountToApply(e.currentTarget.value)}
                        >
                            {discountType.value*(idx+1)}€
                        </ToggleButton>;
                    }) : null}
                </ToggleButtonGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setDiscountModalOpen(false)}>{t`Cancel`}</Button>
                <Button variant="primary" onClick={() => applyDiscount()}>{t`Use`}</Button>
            </Modal.Footer>
        </Modal>


    </React.Fragment>;
}
