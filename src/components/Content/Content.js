import React, { Component } from "react";
import io from 'socket.io-client';
// component
import Header from './Header/Header';
import RoomPanel from './rooms/RoomPanel';
import MessagesPanel from './conversation/MessagesPanel';
import Welcome from './Welcome/Welcome';
// css
import './Content.css';
// Constants
import Constants from './../Constants';

class Content extends Component {
    constructor(props) {
        super(props);
        this.socket = io('http://localhost:3002');
        this.state = {
            //onlineRooms có dạng ["room": ["userId-1","userId-2",....]]
            onlineRooms: {},
            socket: '',
            onNewMessageArrival: '',
            selectedRoomId:'',
            showMessagePanel: false
        };
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    setSelectedRoomId = (id) => {
        console.log('id here in content: ', id);
        this.setState({
            selectedRoomId: id,
            showMessagePanel: true
        });
    }
    componentDidMount() {
        this.socket.on("welcome", (msg) => {
            this.socket.emit("userId", this.props.userId);
        });
        this.socket.on("iAmOnline",({userId,roomId}) =>{
            let onlineRooms=this.state.onlineRooms
            if (onlineRooms.hasOwnProperty(roomId)){
                onlineRooms[roomId].push(userId)
            }else{
                onlineRooms[roomId]=[userId]
            }
            this.setState({
                onlineRooms
            })
        });
        this.socket.on("message", (data) => {
            console.log('data value ', data);
            // send the newly incoming message to the parent component 
            this.setState({
                onNewMessageArrival: data
            });
        });
    }
    render() {
        let { userId } = this.props;
        let { selectedRoomId, onNewMessageArrival, onlineRooms, showMessagePanel} = this.state;
        let socket = this.socket;
        return (
            <div>
                <Header userId={userId} />

                <div className="container-fluid p-0">
                    <div className="content">
                        <div className="row m-0">
                            <div className='col-sm-3 p-0 content-left'>
                                <RoomPanel
                                    userId={userId}
                                    onlineRooms={onlineRooms}
                                    onNewMessageArrival={onNewMessageArrival}
                                    setSelectedRoomId={this.setSelectedRoomId}
                                />
                            </div>
                            <div className='col-sm-6 p-0 content-mid'>
                                {showMessagePanel ?
                                    <MessagesPanel
                                        userId={userId}
                                        socket={socket}
                                        selectedRoomId={selectedRoomId}
                                        onNewMessageArrival={onNewMessageArrival}
                                    />
                                    :
                                    <Welcome/>
                                }   
                            </div>
                            <div className='col-sm-3 p-0 content-right'>
                                Hello
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Content;
