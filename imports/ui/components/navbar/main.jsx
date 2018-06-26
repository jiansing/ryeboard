import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import Modal from 'react-modal';
import * as Actions from "/imports/redux/actions/main";
import { withTracker } from 'meteor/react-meteor-data';
import store from '/imports/redux/store';

/**
 * Navbar at top
 *
 * Houses login/logout menu for now but will add other stuff later (such as go to board list)
 * Also has title input area
 */

console.log('setting modal');
Modal.setAppElement(document.getElementById('board'));

class PureNavBar extends Component {

    constructor(props){
        super(props);

        this.state = {
            modalOpen: false
        }

        this.globalClickListener = this.globalClickListener.bind(this);

    }

    globalClickListener(event){
        if(event.path.findIndex((element) => element.className === 'ReactModal__Content ReactModal__Content--after-open') === -1){
            this.closeModal();
        }

    }

    openModal(){
        this.setState({modalOpen: true});
        window.addEventListener('mouseup', this.globalClickListener, true)
    }

    closeModal(){
        this.setState({modalOpen: false});
        window.removeEventListener('mouseup', this.globalClickListener, true)
    }

    login(){
        this.props.history.push({
            pathname: '/login',
            state: {
                returnUrl: '/'
            }
        })
    }

    logout(){
        Meteor.logout();
    }

    handleTitleEdit(event){
        this.props.actions.modifySettingsParam({title: event.target.value});
    }

    //only save when element is blurred
    saveTitle(event){
        this.props.actions.modifySettingsParam({title: event.target.value});
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    renderMenu(){
        console.log('checking user:', this.props.currentUser);
        if(this.props.currentUser){
            return(
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={'/icons/profile.svg'} height={35} width={35} onClickCapture={() => this.openModal()}/>
                    <Modal isOpen={this.state.modalOpen}
                           parentSelector={()=>document.getElementById('render-target')}
                           onRequestClose={() => this.closeModal()}
                           shouldCloseOnOverlayClick={true}
                           ariaHideApp={false}
                           style={{
                               overlay: {
                                   zIndex: 10,
                                   background: 'transparent',
                                   display: 'flex',
                                   width: '100vw',
                                   top: 0,
                                   left: 0,
                                   right: 'auto',
                                   bottom: 'auto',
                                   position: 'fixed'
                               },
                               content : {
                                   right: '15px',
                                   left: 'auto',
                                   bottom: 'auto',
                                   height: 'auto',
                                   width: 'auto',
                                   padding: 0
                               }
                           }}>
                        <div style={{display: 'flex', flexDirection: 'column', padding: '25px', justifyContent: 'left',
                            boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                            <label><strong>{this.props.currentUser.services.google.name}</strong></label>
                            <p style={{opacity: .5, marginTop: '3px'}}>{this.props.currentUser.services.google.email}</p>
                            <hr/>
                            <button className='btn-empty' style={{textAlign: 'left', marginTop: '5px', marginBottom: '5px'}}
                                    onClick={()=> this.logout()}>Account Settings</button>
                            <hr/>
                            <button className='btn-empty' style={{textAlign: 'left', marginTop: '5px', marginBottom: '5px'}}
                                    onClick={()=> this.logout()}>Logout</button>
                        </div>
                    </Modal>
                </div>
            )
        }
        else return(
            <div>
                <button className='btn-default' onClick={()=> this.login()}>
                    Login
                </button>
            </div>
        )
    }

    render() {

        let Menu = this.renderMenu();

        return (
            <div style={{background: '#FFFFFF', height: '50px', display: 'flex', position: 'fixed',
                top: 0, left: 0, width: '100%', zIndex: 5, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                <div style={{flex: 1}} >

                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flex: 2}}>
                    <input style={{textAlign: 'center', border: 'none', fontSize: '1.25rem', width: '100%', fontWeight: 700}}
                           value={this.props.title}
                           onChange={(event)=>this.handleTitleEdit(event)}
                           onBlur={(event)=> this.saveTitle(event)}
                           placeholder={'your title'} tabIndex={-1}/>
                </div>
                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem'}}>
                    {Menu}
                </div>
            </div>
        );
    }
}

let TrackedNavBar = withTracker(() => {

    const handle = Meteor.subscribe('userData');

    return {
        currentUser: handle.ready() ? Meteor.user() : null
    };
})(PureNavBar);

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        const nextResult = {
            title: nextState.settings.title || '',
            actions: actions,
            ...nextOwnProps
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(TrackedNavBar)