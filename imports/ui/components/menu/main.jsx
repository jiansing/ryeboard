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

    componentDidMount(){

    }

    renderPreviews(){
        return previews.map(function(Elem){
            return (
                <Elem key={Math.random()}/>
            )
        })
    }

    renderMenu(){
        console.log(this.props.currentMenu)
        return this.props.currentMenu.map(function(elem){
            return (
                <div style={{textAlign: 'center'}} key={elem.title}>
                    <button onClick={()=>elem.fun()} onMouseDown={(event)=>event.preventDefault()}/>
                    <p style={{margin: '0'}}>{elem.title}</p>
                </div>
            )
        })
    }

    render() {

        console.log("SHOWING MENU FOR:", document.activeElement);

        return (
            <div style={{background: '#F2F2F2', marginTop: '50px', height: 'calc(100vh - 50px)', display: 'flex', position: 'fixed', top: 0,
                left: 0, width: '75px', zIndex: 4, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                {this.props.currentMenu === null ?
                    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {this.renderPreviews()}
                    </div> :
                    <div onMouseDown={(event)=>event.preventDefault()}
                         style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {this.renderMenu()}
                    </div>
                }
            </div>
        );
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        console.log(document.body, document.activeElement, document.activeElement === document.body);
        const nextResult = {
            currentMenu: nextState.boardLogic.selected && nextState.boardLogic.selected.data && document.body !== document.activeElement ?
                nextState.boardLogic.selected.data : null
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureMenu)