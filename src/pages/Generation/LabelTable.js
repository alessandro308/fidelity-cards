import React from 'react';
import JsBarcode from 'jsbarcode';

class Barcode extends React.Component{

    componentDidMount(){
        let value = this.props.value.toString().padStart(4, '0');

        JsBarcode(this.canvasRef, value, {
            height: 50,
            valid: () => {},
        });
    }

    render () {
        return <div style={{width: this.props.labelWidth + 'mm', height: '33mm' , display: 'flex', justifyContent: 'center'}}>
            <canvas ref={ref => this.canvasRef = ref}/>
        </div>;
    }
}

export default class LabelTable extends React.Component{

    render(){
        return <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            paddingTop: '10mm',
            paddingBottom: '10mm',
            paddingLeft: this.props.paddingSide + 'mm',
            paddingRight: this.props.paddingSide + 'mm',
            width: '100%'
        }}>
            {this.props.labels.map(val => <Barcode labelWidth={this.props.labelWidth} key={val} value={val}/>)}
        </div>;
    }
}
