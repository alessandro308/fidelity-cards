import React, {useContext, useEffect, useState} from 'react';
import {Alert, Container, FormControl, InputGroup, Spinner} from 'react-bootstrap';
import {t} from 'ttag';
import {useDatabase} from 'reactfire';
import {AppConfiguration} from '../../App';
import {useSmsStatus} from '../../SkebbyHandler';

export default function SmsConfiguration () {
    const {config, setConfig} = useContext(AppConfiguration);
    const [smsQuantity, setSmsQuantity] = useState();
    const db = useDatabase();

    function updateInput(val){
        if(val.length + config.smsText.length > 160) return;
        setConfig({...config, smsTextAppend: val});
        return db.ref(`/config/smsTextAppend`).set(val);
    }

    const smsStatus = useSmsStatus();

    useEffect(() => {
        smsStatus().then((status) => setSmsQuantity(status.sms.find(s => s.type === 'TI').quantity));
    }, []);


    return <Container className="pageContainer">
        <label htmlFor="basic-url">{t`SMS Text for points.`}</label>
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon3">
                    {config.smsText}
                </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="basic-url" value={config.smsTextAppend} type="text" onChange={(e) => updateInput(e.target.value)}/>
        </InputGroup>
        <Alert variant='primary'>
            { smsQuantity ? t`Still available ${smsQuantity} SMS` : <Spinner animation="border" /> }
        </Alert>
    </Container>
}
