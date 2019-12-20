import React, { Component } from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import axios from 'axios';

// components 
import imgBg from './../../../images/bg-login.jpg';
// Constants
import Constants from './../../Constants';
//css
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            showUserInfo: false,
            name:'',
            avatar:''
        };
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    onToggleLogout = () => {
        this.setState({
            showInfo: !this.state.showInfo
        });
    }
    OpenUserInfo = () => {
        this.setState({
            showUserInfo: true
        });
    }
    closeEditUserInfo = () => {
        this.setState({
            showUserInfo: false
        });
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }
    EditUserInfo = (event) => {
        let {name, avatar} = this.state;
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.editUser,
            data: {
                userId : this.props.userId,
                name: name,
                avatar: avatar
            }
        }).then(res => {
            var data = res.data;
            if (data.success) {
                alert("login successful");
            } else {      
                alert("login failed");
            }
        }).catch(err => {
            console.log(err);
        });
        event.preventDefault();
    }
    componentDidMount(){
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.getUser,
            data: {
                userId : this.props.userId
            }
        }).then(res => {
            var data = res.data;
            if (data.status){
                this.setState({
                    name: data.name,
                    avatar: data.avatar
                });
            }
        }).catch(err => {
            console.log(err);   
        });
    }
    render() {
        
        let { name, avatar, showInfo, showUserInfo } = this.state;
        return (
            <div className="container-fluid p-30">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3" >
                            <div className="logo text-white">
                                WEBCHAT... <i className="fa fa-comments"></i>
                            </div>
                        </div>
                        <div className="col-sm-6 text-center iconheader">
                            {/* notification add friend
                            {/* <div className="notif n1">1</div> */}
                            {/* <Link className="iconbtn fa fa-users" to='/add'></Link> */}
                            {/* notification message */}
                            {/* <div className="notif n2">2</div> */}
                            {/* <Link className="iconbtn fa fa-comment" to='/chat'></Link> */}
                            {/* notification */}
                            {/* <div className="notif n3">3</div> */}
                            {/* <Link className="iconbtn fa fa-bell"></Link> */}

                        </div>
                        <div className="col-sm-3 iconuser">
                            <span>{name}</span>
                            <div className="avatar" onClick={this.onToggleLogout}>
                                <img src={imgBg} className="img-circle" alt="avatar" width="40px" height="40px" />
                            </div>
                            {showInfo ?
                                
                                <div className="edituser">
                                    <div className="box-edituser" onClick={this.OpenUserInfo}>Update Information</div>
                                    <hr/>
                                    <div className="box-edituser" onClick={this.handleLogout}>Logout</div>
                                </div>
                                // <button className="btn-logout" onClick={this.handleLogout}>Logout</button>

                                :
                                ''
                            }
                            
                        </div>
                        <div className="switchmode">
                            <input type="checkbox" />
                        </div>
                    </div>
                </div>
                <Modal isOpen={showUserInfo}>
                    <ModalHeader>User Information</ModalHeader>
                    <ModalBody>                       
                        <div className="text-center img-user-info"><img src={imgBg} className="img-circle text-center" alt="avatar" width="60px" height="60px" /></div>
                        <span>Name: </span>
                        <div className="modal-name"><input type="text" className="form-control" required name="name" onChange={this.onChange} value={name}/></div>
                        {/* <span>Avatar: </span>
                        <div className="modal-name"><input type="file" className="form-control" required name="avatar" onChange={this.onChange} /></div>     */}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.EditUserInfo}>Edit</Button>
                        <Button color="secondary" onClick={this.closeEditUserInfo}>Cancel</Button>

                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default Header;