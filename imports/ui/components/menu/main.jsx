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
                <div key={Math.random()} style={{margin: '1rem'}}>
                    <Elem />
                </div>
            )
        })
    }

    renderMenu(){

        let self = this;
        return this.props.currentMenu.map(function(elem){
            if(!elem.condition(self.props.currentContext.data)) {
                console.log(self.props.currentContext.data);
                return '';
            }
            return (
                <div style={{textAlign: 'center'}} key={elem.title(self.props.currentContext.data)}>
                    <button onClick={()=>{
                        elem.fun(self.props.currentContext.data);
                    }} onMouseDown={(event)=>event.preventDefault()}/>
                    <p style={{margin: '0'}}>{elem.title(self.props.currentContext.data)}</p>
                </div>
            )
        })
    }

    render() {

        //console.log(this.props.currentMenu);

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
        const nextResult = {
            currentMenu: nextState.boardLogic.selected && nextState.boardLogic.selected.data && document.body !== document.activeElement ?
                nextState.boardLogic.selected.data : null,
            currentContext: nextState.boardLogic.selected ? function(){
                let selectedWidget = nextState.boardLayout.findIndex((elem) => elem.id === nextState.boardLogic.selected.id);
                console.log(nextState.boardLayout[selectedWidget]);
                return  nextState.boardLayout[selectedWidget];
            }() : null,
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureMenu)