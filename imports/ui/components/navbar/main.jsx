import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";

class PureNavBar extends Component {

    constructor(props){
        super(props);
    }

    render() {

        const style = {

        }

        return (
            <div style={{background: '#FFFFFF', height: '50px', display: 'flex', position: 'fixed',
                top: 0, left: 0, width: '100%', zIndex: 5, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                <div style={{flex: 1}} />
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flex: 2}}>
                    <input style={{textAlign: 'center', border: 'none', fontSize: '1.25rem', width: '100%'}} placeholder={'your title'}/>
                </div>
                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem'}}>
                    <button className={'btn-empty'}>
                        <img src={'/ph.svg'} height={25} width={25} style={{margin: '.5rem'}}/>
                    </button>
                    <button className={'btn-empty'}>
                        <img src={'/ph.svg'} height={25} width={25} style={{margin: '.5rem'}}/>
                    </button>
                </div>
            </div>
        );
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        const nextResult = {

        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureNavBar)