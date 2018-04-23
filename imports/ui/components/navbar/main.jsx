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
                <div style={{}}>
                    NavBar
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