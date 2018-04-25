import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import {previews} from '../widget/main';

class PureMenu extends Component {

    constructor(props){
        super(props);
    }

    renderPreviews(){
        return previews.map(function(Elem){
            return (
                <Elem key={Math.random()}/>
            )
        })
    }

    render() {

        return (
            <div style={{background: '#F2F2F2', marginTop: '50px', height: 'calc(100vh - 50px)', display: 'flex', position: 'fixed', top: 0,
                left: 0, width: '75px', zIndex: 4, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {this.renderPreviews()}
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

export default connectAdvanced(selector)(PureMenu)