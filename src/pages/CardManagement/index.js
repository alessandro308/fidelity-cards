import React, {useState, useEffect, useRef} from 'react';
import {SmsSender} from './SmsSender';
import {
    Container,
    Form,
    Jumbotron,
    Button,
    Badge,
    Modal,
    FormControl,
    Alert,
    InputGroup,
    ToggleButton,
    ToggleButtonGroup,
    Spinner,
} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faStar, faGift} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import CardChart from './CardChart';
import {appConfig} from '../../config/config';
import CardOperationTable from './CardOperationList';
import firebase from 'firebase';

export default function CardManagement () {

    let cardNumberInputRef = useRef(null);
    const [cardNumber, setCardNumber] = useState(undefined);
    const [card, setCard] = useState(null);
    const [operations, setOperations] = useState(null);
    const [cardDeleted, setCardDeleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addedPoint, setAddedPoint] = useState(0);
    const [discountToApply, setDiscountToApply] = useState(null);

    const db = useDatabase();

    useEffect(() => {
        if(!cardNumber || cardNumber.length === 0){
            return;
        }

        let newRef = db.ref('/cards/' + cardNumber);
        newRef.on('value', (snapshot) => {
            let cardResult = snapshot.val();
            if (cardResult) {
                setCard(cardResult);
            }
        });
        return () => newRef.off();
    }, [db, cardNumber]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        window.history.replaceState({}, document.title, window.location.pathname);
        const cardId = urlParams.get('id');
        if (cardId) {
            setCardNumber(cardId);
        }
    }, [db, card]);

    useEffect(() => {
        if(!cardNumber){
            setOperations([]);
            return;
        }

        let ref = db.ref('/operations/' + cardNumber);
        ref.on('value', (snapshot) => {
            if (snapshot.val()) {
                setOperations(Object.values(snapshot.val())
                .filter(e => e.value !== 0));
            } else {
                setOperations([]);
            }
        });
        return () => ref.off();
    }, [db, cardNumber]);

    const onCardNumberChange = (event) => {
        let number = event.target.value;
        setCardNumber(number);
        setCard(null);
        setCardDeleted(null);
    };

    const updatePoint = (value) => {
        let newOperation = {
            date: moment(new Date())
            .format(),
            value: parseInt(value),
        };

        try {
            if(operations.length === 0 && card.referrer){
                let newOperationRef = db.ref(`/operations/${card.referrer}`).push();
                newOperation.key = newOperationRef.key;
                newOperationRef.set({
                    ...newOperation,
                    origin: 'referrer',
                });
                db.ref(`/cards/${card.referrer}/total`).set(firebase.database.ServerValue.increment(newOperation.value));
            }
            let newOperationRef = db.ref(`/operations/${cardNumber}`).push();
            newOperation.key = newOperationRef.key;
            newOperationRef.set(newOperation);

            db.ref(`/cards/${cardNumber}/total`).set(firebase.database.ServerValue.increment(newOperation.value));
        } catch(e){
            alert(t`Something went wrong. Refresh the page and retry`, e);
        }
    };

    const addPoint = () => {
        if (addedPoint === 0) {
            return;
        }
        updatePoint(addedPoint);

        setModalOpen(false);
    };

    const applyDiscount = () => {
        updatePoint(-discountToApply);

        setDiscountModalOpen(false);
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

    const total = operations ? operations.map(a => parseInt(a.value)).reduce((a, b) => a + b, 0) : 0;

    const discountType = appConfig.discounts[card?.type ?? 'business'];

    return <React.Fragment>
        <Container className="pageContainer">

            {cardDeleted ? <Alert variant="danger">
                {t`Card successfully deleted`}
            </Alert> : null}

            <Form onSubmit={(e) => {e.preventDefault(); setCardNumber(cardNumberInputRef.current?.value ?? cardNumber)}}>
                <Form.Group controlId="formCardNumber">
                    <Form.Label>{t`Card Number`}</Form.Label>
                    <Form.Control value={cardNumber} placeholder={t`Scan the card code`}
                                  ref={cardNumberInputRef}
                                  autoFocus
                                  onFocus={() => onCardNumberChange({target: {value: ""}}) }
                                  onChange={(e) => onCardNumberChange(e)}/>
                </Form.Group>
            </Form>

            {card && card.id === cardNumber ?
                <Jumbotron>
                    <h1 style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>
                            {card.name} {card?.type === 'business' ?
                            <Badge variant="primary"><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> Business</Badge> :
                            card?.type === 'gift' ? <Badge variant="success"><FontAwesomeIcon icon={faGift}></FontAwesomeIcon> Gift Card</Badge> : <Badge variant="secondary">Standard</Badge>}
                            {' '}
                            { card?.phone ? <SmsSender phone={card.phone} cardNumber={cardNumber} total={total}/> : null }
                        </span><Badge
                        variant="primary">{card == null ? <Spinner animation="border" /> : total}</Badge></h1>
                    <p>
                        <span>{card.email}</span>{card.email && card.phone ? <span> - </span> : null}<span>{card.phone}</span>
                        { card?.referrer ? ' - ' + t`Referred By: ` + card.referrer : null }
                    </p>
                    <p>
                        <span>{t`Creation Date`}: {moment(card.creationDate)
                        .format('DD-MM-YYYY')}</span>
                    </p>

                    { card?.type !== 'gift' ? <CardChart card={card} operations={operations}/> : null}
                    <CardOperationTable operations={operations} discountType={discountType}/>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>{t`Delete`}</Button>
                        </div>
                        <div>
                            <Button variant="info" disabled={card?.type !== 'gift' && (!total || total < discountType?.at)} onClick={() => setDiscountModalOpen(true)}>
                                {card?.type === 'gift' ? t`Use gift points`: t`Use Discount`}
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
                <Button variant="primary" onClick={() => addPoint()}>{t`Add points`}</Button>
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
                <Modal.Title>{card?.type === 'gift' ? t`Use Gift Points` : t`Apply discount to card #${cardNumber}?`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    Math.floor(total / discountType.at) < 11 ?
                        <ToggleButtonGroup type="radio" value={discountToApply} name="discountToApply" onChange={(e) => setDiscountToApply(e)}>
                            {total ? new Array(Math.floor(total / discountType.at)).fill(0)
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
                        :
                        <InputGroup className="mb-3">
                            <FormControl
                                onChange={(e) => setDiscountToApply(e.currentTarget.value)}
                                type="number"
                                placeholder={t`Gift Point to use`}
                                aria-label={t`Gift Point to use`}
                                aria-describedby="basic-addon1"
                                isInvalid={discountToApply > total}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t`There are no enough points available`}
                            </Form.Control.Feedback>
                        </InputGroup>
                }

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setDiscountModalOpen(false)}>{t`Cancel`}</Button>
                <Button variant="primary" disabled={discountToApply > total} onClick={() => applyDiscount()}>{t`Use`}</Button>
            </Modal.Footer>
        </Modal>


    </React.Fragment>;
}
