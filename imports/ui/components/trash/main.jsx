import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";

class PureNavBar extends Component {

    constructor(props){
        super(props);
        if(!this.props.naked){
            this.scrollDecorate = this.scrollDecorate.bind(this);
        }
    }

    scrollDecorate() {
        const pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (this.navBar) {
            if (pos === 0) {
                this.navBar.className = '';
            } else if (this.navBar.className !== 'active') {
                this.navBar.className = 'active';
            }
        }
    }

    componentDidMount() {
        if(!this.props.naked){
            const self = this;
            document.addEventListener('scroll', this.scrollDecorate, false);
        }
    }

    componentWillUnmount(){
        if(!this.props.naked){
            document.removeEventListener('scroll', this.scrollDecorate, false);
        }
    }

    routeTo(path){
        this.props.history.push(path);
    }

    constructContent(){

        let isLoggedIn = this.props.isLoggedIn;

        if(this.props.naked){
            return ""
        }
        else if(isLoggedIn){
            return([<div className="flex-filler" key='filler'/>,
                    <span className="navBar-content" key='content'>
                        <button onClick={()=> this.routeTo("/")} style={{margin: 0}} className='btn-text'>
                            Home
                        </button>
                        <button onClick={()=> this.props.actions.modifyTestParam({loggedIn: false})} style={{margin: 0}} className='btn-text'>
                            Log Out
                        </button>
                    </span>]
            )
        }
        else {
            return([<div className="flex-filler"  key='filler'/>,
                    <span className="navBar-content" key='content'>
                        {/*<button onClick={()=> this.routeTo("/login")} style={{margin: 0}} className='btn-text'>
                            Login
                        </button>*/}
                    </span>]
            )
        }

    }


    render() {

        let Content = this.constructContent();

        return (
            <div id="navBar" >
                <div className="" id="navBar-background" ref={(navBar) => { this.navBar = navBar; }}
                     style={this.props.transparent ? {background:'transparent'} : {}}>
                    <span onClick={()=> this.routeTo("/")} className="navBar-content serif" style={{fontSize: "1.75rem", cursor: 'default'}}>
                        Mondrian
                    </span>
                    {Content}
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
            actions: actions,
            isLoggedIn: nextState.testing.loggedIn,
            ...nextOwnProps
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureNavBar)