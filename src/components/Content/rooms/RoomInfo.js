import React, { Component } from 'react'
import imBg from './../../../images/bg-login.jpg';
// Constants
import Constants from './../../Constants';
class RoomInfo extends Component {

    constructor(props) {
        super(props);
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    render() {
        let allConstants = this.allConstants;
        let { room, activeRoomId } = this.props;
        let lastMessage = room.lastMessage !== null ? room.lastMessage : { "Body": "", "time": "" };
        let time =  allConstants.formatDates(lastMessage.time);
        return (
            <div className="chat_people">
                <div className="chat_img"> <img src={imBg} className="img-circle" alt="avatar user" width="40px" height="40px" /> </div>
                <div className="chat_ib">
                    <h5>{room.name}<span className="chat_date">{time}</span></h5>
                    <p>{lastMessage.Body}</p>
                </div>
            </div>
            
        )
    }
}
export default RoomInfo;
