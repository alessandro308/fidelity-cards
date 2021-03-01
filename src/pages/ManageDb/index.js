import React, {useEffect, useState} from 'react';
import {
    Container,
    Form,
    Spinner
} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import CardTable from './CardTable';
import {SmsSendAll} from './SmsSendAll';

export default function ManageDb () {
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

    return <React.Fragment>
        <Container className="pageContainer">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {isLoading ?
                <Spinner animation="border" role="status">
                    <span className="sr-only">{t`Deleting`}</span>
                </Spinner>
                :
                <React.Fragment>
                    <div style={{display: 'flex', width: '100%', justifyContent: "space-between", alignItems: 'center'}}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>{t`Filter by name`}</Form.Label>
                            <Form.Control type="name" placeholder={t`Customer Name`} onChange={(e) => filterByName(e)} />
                        </Form.Group>
                        <SmsSendAll recipients={cards.filter(c => c.phone).map(c => '+39'+c.phone)}/>
                    </div>
                    <CardTable cards={cards.filter(c => filter ? c.name.toLowerCase().includes(filter.toLowerCase()) : true)}/>
                </React.Fragment>
            }
            </div>

        </Container>
    </React.Fragment>;
}
