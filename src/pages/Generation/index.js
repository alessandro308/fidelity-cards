import React from 'react';
import ReactToPrint from 'react-to-print';
import {Container, Button, InputGroup, FormControl} from 'react-bootstrap';
import LabelTable from './LabelTable';
import {t} from 'ttag';

export default class Generate extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            startingValue: 1,
            labelCount: 60,
            labelWidth: 58,
            paddingSide: 1,
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
        let isCorrectStartingValue = true;
        if(isNaN(number)){
            isCorrectStartingValue = false;
            number = event.target.value;
        }

        this.setState({
            startingValue: number,
            isCorrectStartingValue,
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
                    <InputGroup.Text id="basic-addon1">{t`Label Count`}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    name="labelCount"
                    aria-label={t`Label Count`}
                    value={this.state.labelCount}
                    onChange={this.onParamsChange}
                />
            </InputGroup>

            <ReactToPrint
                trigger={() => {
                    return <Button>{t`Print labels!`}</Button>;
                }}
                content={() => this.refContainer}
            />
            <LabelTable labelWidth={this.state.labelWidth} paddingSide={this.state.paddingSide}
                labels={Array.from({length: this.state.labelCount}, (_, i) => i + (this.state.isCorrectStartingValue ? this.state.startingValue : 1))}
                ref={ref => this.refContainer = ref} />
        </Container>
    }
}
