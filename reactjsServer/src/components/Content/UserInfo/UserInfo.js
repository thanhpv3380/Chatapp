import React, { Component } from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

//components
import imgBg from './../../../images/bg-login.jpg';
//css 
import './UserInfo.css';

class UserInfo extends Component {
    constructor(props) {
        super(props);
    }
    closeUserInfo = () => {
        this.props.showUserInfo = false;
    }
    render() {
        return (
            <Modal isOpen={this.props.showUserInfo}>
                <ModalHeader>User Information</ModalHeader>
                <ModalBody>
                    <div className="text-center"><img src={imgBg} className="img-circle text-center" alt="avatar" width="60px" height="60px" /></div>
                    <div className="modal-name">thanh</div>
                    <div className="">Total friend:       100</div>
                </ModalBody>
                <ModalFooter><Button class="secondary" onClick={this.closeUserInfo}>Cancel</Button></ModalFooter>
            </Modal>
        );
    }
}
export default UserInfo;