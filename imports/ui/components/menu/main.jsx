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
                <div className='draggable-widgets' key={Math.random()} style={{padding: '5px', width: '100%'}}>
                    <Elem />
                </div>
            )
        })
    }

    renderMenu(){

        let self = this;
        return this.props.currentMenu.map(function(elem){
            let selected = false;
            if(!elem.condition(self.props.currentContext.data)) return '';
            if(elem.selected) {
                selected = elem.selected(self.props.currentContext.data);
            }
            return (
                <div style={{textAlign: 'center', width: '100%', padding: '5px'}}
                     key={elem.title(self.props.currentContext.data)}
                     onClick={()=>{
                         elem.fun(self.props.currentContext.data);
                     }}>
                    <img src={elem.icon} height={20} width={20}/>
                    <p style={{margin: '0', fontSize: '.85rem'}}>{elem.title(self.props.currentContext.data)}</p>
                </div>
            )
        })
    }

    render() {

        return (
            <div style={{background: '#F2F2F2', marginTop: '50px', height: 'calc(100vh - 50px)', display: 'flex', position: 'fixed', top: 0,
                left: 0, width: '75px', zIndex: 4, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                {this.props.currentMenu === null || typeof this.props.currentMenu === 'undefined' ?
                    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
                        {this.renderPreviews()}
                    </div> :
                    <div onMouseDown={(event)=>event.preventDefault()}
                         style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
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

        nextState = nextState.undoable.present;

        const nextResult = {
            currentMenu: function(){
                if(Array.isArray(nextState.boardLogic.selected)) {
                    return null;
                }
                let menu = nextState.boardLogic.selected && nextState.boardLogic.selected.data ?
                    nextState.boardLogic.selected.data.menu : null;
                return menu;
            }(),
            currentContext: nextState.boardLogic.selected ? function(){
                if(Array.isArray(nextState.boardLogic.selected)) return null;
                let selectedWidget = nextState.boardLayout.findIndex((elem) => elem.id === nextState.boardLogic.selected.id);
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