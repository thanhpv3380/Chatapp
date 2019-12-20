import React, { Component } from 'react'

class RoomInfo extends Component {
    render() {
        let {room, activeRoomId} = this.props;
        return (
            <div className='chat_list'>
                <div className="chat_people">
                    <div className="chat_img"> <img src="#" className="img-circle" alt="avatar user" width="40px" height="40px" /> </div>
                    <div className="chat_ib">
                        <h5>{room.name}<span className="chat_date">{room.roomId}</span></h5>
                        {(JSON.stringify(room.lastMessage.keys("Body")))}
                    </div>
                </div>
            </div>
        )
    }
}
export default RoomInfo;
