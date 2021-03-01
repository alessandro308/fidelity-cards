import React, {useState} from 'react';
import {Button, FormControl, InputGroup, Modal} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSms} from '@fortawesome/free-solid-svg-icons';
import { useSmsSender } from '../../SkebbyHandler';

export function SmsSendAll({recipients}){
    const smsSender = useSmsSender();
    const [showModal, setShowModal] = useState(false);
    const [textToSend, setTextToSend] = useState('');

    const sendSmsTotal = (text) => {
        smsSender(recipients, text)
        .then(res => alert('SMS Inviato'))
        .catch(res => alert(`Errore ${JSON.stringify(res)}`))
    };

    return <>
        <Button variant='outline-primary' onClick={() => setShowModal(true)}><FontAwesomeIcon size="lg" icon={faSms}></FontAwesomeIcon></Button>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Che messaggio vuoi mandare ai tuoi clienti?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <FormControl as="textarea" maxLength={160} value={textToSend} onChange={(e) => setTextToSend(e.target.value)}/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendSmsTotal}>
                    Invia {recipients.length} SMS
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}
