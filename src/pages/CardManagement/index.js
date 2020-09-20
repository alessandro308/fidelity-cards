import React, {useState, useEffect, useRef} from 'react';
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
import {faPlus, faStar} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import CardChart from './CardChart';
import {appConfig} from '../../config/config';
import CardOperationTable from './CardOperationList';

export default function CardManagement () {

    let cardNumberInputRef = useRef(null);
    const [cardNumber, setCardNumber] = useState(undefined);
    const [card, setCard] = useState(null);
    const [operations, setOperations] = useState(null);
    const [cardDeleted, setCardDeleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showOperations, setShowOperations] = useState(false);
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
        let ref = db.ref('/operations/' + cardNumber);
        if(showOperations) {
            ref
            .on('value', (snapshot) => {
                if (snapshot.val()) {
                    setOperations(Object.values(snapshot.val())
                    .filter(e => e.value !== 0));
                }
            });
        }
        return () => ref.off();
    }, [db, cardNumber, showOperations]);

    const onCardNumberChange = (event) => {
        let number = event.target.value;
        setCardNumber(number);
        setCard(null);
        setCardDeleted(null);
        setShowOperations(false);
    };

    const updatePoint = (value) => {
        let newOperation = {
            date: moment(new Date())
            .format(),
            value: parseInt(value),
        };

        try {
            let newOperationRef = db.ref(`/operations/${cardNumber}`)
            .push();
            newOperation.key = newOperationRef.key;
            newOperationRef.set(newOperation);

            db.ref(`/cards/${cardNumber}/total`).set(parseInt(total ?? 0) + parseInt(value))
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

    const onShowOperationClick = () => {
        setShowOperations(true);
    };



    let total = card?.total;
    if(operations){
        total = operations.map(a => parseInt(a.value))
        .reduce((a, b) => a + b, 0);
    }

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
                                  onFocus={ () => onCardNumberChange({target: {value: ""}}) }
                                  onChange={(e) => onCardNumberChange(e)}/>
                </Form.Group>
            </Form>
            {card && card.id === cardNumber ?
                <Jumbotron>
                    <h1 style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>
                            {card.name} {card?.type === 'business' ? <Badge
                            variant="primary"><FontAwesomeIcon icon={faStar}></FontAwesomeIcon> Business</Badge> : <Badge variant="secondary">Standard</Badge>}
                        </span><Badge
                        variant="primary">{card == null ? <Spinner animation="border" /> : (total ?? card.total)}</Badge></h1>
                    <p>
                        <span>{card.email}</span>{card.email && card.phone ? <span> - </span> : null}<span>{card.phone}</span>
                    </p>
                    <p>
                        <span>{t`Creation Date`}: {moment(card.creationDate)
                        .format('DD-MM-YYYY')}</span>
                    </p>

                    {showOperations && operations ? <><CardChart operations={operations}/><CardOperationTable operations={operations} discountType={discountType}/></> : null }

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>{t`Delete`}</Button>
                            {!showOperations ? <Button variant="link" onClick={() => onShowOperationClick()}>{t`Show complete history`}</Button> : null}
                        </div>
                        <div>
                            <Button variant="info" disabled={!total || total < discountType.at} onClick={() => setDiscountModalOpen(true)}>
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
                <Modal.Title>{t`Apply discount to card #${cardNumber}?`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ToggleButtonGroup type="radio" value={discountToApply} name="discountToApply" onChange={(e) => setDiscountToApply(e)}>
                    {card?.total ? new Array(Math.floor(total / discountType.at)).fill(0)
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
