import React from 'react';
import JsBarcode from 'jsbarcode';

class Barcode extends React.Component{
    constructor (props) {
        super(props);
    }


    componentDidMount(){
        let value = this.props.value.toString().padStart(4, '0');

        JsBarcode(this.canvasRef, value, {
            height: 50,
            valid: () => {},
        });
    }

    render () {
        return <div style={{width: '50mm', height: (this.props.labelHeight ?? 38)+'mm' , display: 'flex', justifyContent: 'center'}}>
            <canvas ref={ref => this.canvasRef = ref}/>
        </div>;
    }
}

export default class LabelTable extends React.Component{

    render(){
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            paddingTop: (this.props.marginTop ?? 0) + 'mm',
            paddingBottom: (this.props.marginTop ?? 0) + 'mm',
            paddingLeft: (this.props.marginLeft ?? 0) + 'mm',
            paddingRight: (this.props.marginLeft ?? 0) + 'mm',
            width: '100%'
        }}>
            {this.props.labels.map(val => <Barcode labelHeight={this.props.labelHeight} key={val} value={val}/>)}
        </div>;
    }
}
