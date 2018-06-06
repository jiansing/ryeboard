import React, {Component} from 'react';
import Modal from 'react-modal';
import Cropper from 'react-cropper';

const customStyles = {
    overlay: {
        zIndex: 10,
        display: 'flex'
    },
    content : {
        padding: 0,
    }
};

Modal.setAppElement(document.getElementById('render-target'));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            mode: 'default',
            image: this.props.image,
            flippedX: false,
            flippedY: false
        }
    }

    saveImage(){
        this.props.save(this.props.image, this.cropper.getCroppedCanvas().toDataURL("image/png", 1));
        this.closeModal();
    }

    reset(){
        this.setState({
            image: this.props.image,
            flippedX: false,
            flippedY: false,
            mode: 'default',
        })
        this.cropper.reset();
    }

    setUp(){
        this.cropper.setDragMode('move')
    }

    closeModal() {
        this.props.onClose();
    }

    startCrop(){
        this.cropper.crop();
        this.cropper.setDragMode('crop');
        this.setState({mode: 'crop'});
    }

    applyCrop(){
        this.setState({image: this.cropper.getCroppedCanvas().toDataURL("image/png", 1)});
        this.endCrop();
    }

    endCrop(){
        this.cropper.clear();
        this.cropper.setDragMode('move');
        this.setState({mode: 'default'});
    }
    
    flipX(){
        this.setState({flippedX: !this.state.flippedX});
        this.cropper.scaleX(this.state.flippedX ? 1 : -1)
    }

    flipY(){
        this.setState({flippedY: !this.state.flippedY});
        this.cropper.scaleY(this.state.flippedY ? 1 : -1)
    }


    mapTools(){
        let mode = this.state.mode;

        switch(mode){
            case 'crop':{
                return(
                    <div style={{height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <button className='btn-ghost' onClick={()=> this.endCrop()}>cancel</button>
                        <button className='btn-ghost' onClick={()=> this.cropper.clear()}>reset crop</button>
                        <button className='btn-ghost' onClick={()=> this.applyCrop()}>crop image</button>
                    </div>
                )
            }
            default :{
                return(
                    <div style={{height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <button className='btn-ghost' onClick={()=> this.reset()}>reset</button>
                        <button className='btn-ghost' onClick={()=> this.cropper.clear()}>reset crop</button>
                        <button className='btn-ghost' onClick={()=> this.cropper.rotate(-90)}>rotate left</button>
                        <button className='btn-ghost' onClick={()=> this.cropper.rotate(90)}>rotate right</button>
                        <button className='btn-ghost' onClick={()=> this.flipX()}>flip X</button>
                        <button className='btn-ghost' onClick={()=> this.flipY()}>flip Y</button>
                        <button className='btn-ghost' onClick={()=> this.startCrop()}>crop</button>
                    </div>
                )
            }
        }
    }

    render() {

        let tools = this.mapTools();

        return (
            <div>
                <Modal isOpen={true}
                       parentSelector={()=>document.getElementById('render-target')}
                       onRequestClose={() => this.closeModal()}
                       style={customStyles}
                       ariaHideApp={false}>
                    <div style={{padding: '15px', width: '100%', height: '100%'}} onClick={(event)=> event.stopPropagation()}>
                        <div style={{height: '50px'}}>
                            <button className='btn-ghost' onClick={()=> this.closeModal()}>exit</button>
                            <button className='btn-ghost' onClick={()=> this.saveImage()}>save</button>
                        </div>
                        <div style={{height: 'calc(100% - 100px)'}}>
                            <Cropper
                                ready={()=> this.setUp()}
                                ref={(c) => this.cropper = c}
                                src={this.state.image}
                                style={{height: '100%', width: '100%', position: 'relative'}}
                                // Cropper.js options
                                autoCropArea={.8}
                                viewMode={1}
                                autoCrop={false}
                                aspectRatio={null}
                                guides={true}/>
                        </div>
                        {tools}
                    </div>
                </Modal>

            </div>
        );
    }
}

export default App;