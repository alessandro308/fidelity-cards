import React, {useRef} from 'react';
import ReactToPrint from 'react-to-print';
import {Container, Button, InputGroup, FormControl} from 'react-bootstrap';
import LabelTable from './LabelTable';
import {t} from 'ttag';

export default class Generate extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            startingValue: 1,
            marginTop: 13,
            marginLeft: 7,
            labelHeight: 34,
        };
        this.onStartingValueChange = this.onStartingValueChange.bind(this);
        this.onParamsChange = this.onParamsChange.bind(this);
    }

    onParamsChange(e){
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onStartingValueChange(event){
        let number = 1;
        try {
            number = parseInt(event.target.value);
        } catch(e){}
        if(isNaN(number)){
            number = 1;
        }

        this.setState({
            startingValue: number,
        });
    }

    render(){
        return <Container className="pageContainer" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">{t`Starting Generation Value`}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    aria-label={t`Staring Value`}
                    value={this.state.startingValue}
                    onChange={this.onStartingValueChange}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">{t`Margine sopra e sotto`}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    name="marginTop"
                    aria-label={t`Staring Value`}
                    value={this.state.marginTop}
                    onChange={this.onParamsChange}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">{t`Margine laterali`}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    name="marginLeft"
                    aria-label={t`Staring Value`}
                    value={this.state.marginLeft}
                    onChange={this.onParamsChange}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">{t`Altezza label`}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    name="labelHeight"
                    aria-label={t`Staring Value`}
                    value={this.state.labelHeight}
                    onChange={this.onParamsChange}
                />
            </InputGroup>

            <ReactToPrint
                trigger={() => {
                    return <Button>{t`Print labels!`}</Button>;
                }}
                content={() => this.refContainer}
            />
            <LabelTable labelHeight={this.state.labelHeight} marginTop={this.state.marginTop} marginLeft={this.state.marginLeft}
                labels={Array.from({length: 60}, (_, i) => i + this.state.startingValue)} ref={ref => this.refContainer = ref} />
        </Container>
    }
}
