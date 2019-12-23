import React, { Component } from 'react';
import axios from 'axios';

// component
import Message from './Message';
import WriteMessage from './WriteMessage';

// Constants
import Constants from './../../Constants';

class MessagesPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentDidMount() {
        console.log("didmount");
        if (this.props.selectedRoomId !== '')
            this.loadConversation(this.props.selectedRoomId);
        this.scrollToBottom();
    }
    componentDidUpdate(prevProps) {
        if (this.props.selectedRoomId !== prevProps.selectedRoomId) {
            console.log("change roomId", prevProps.selectedRoomId);
            this.loadConversation(prevProps.selectedRoomId);
        }
        if (prevProps.onNewMessageArrival.roomId === this.props.selectedRoomId) {
            this.setState({ messages: [...this.state.messages, { ...prevProps.onNewMessageArrival.Body }] });
        }
        this.scrollToBottom();
    }

    scrollToBottom() {
        console.log("scroll");
        this.messageEnd.scrollIntoView({ behavior: 'smooth' });
    }
    // load the conversation of the selected friend
    loadConversation(id) {
        let selectedRoomId = (id) ? id : '' // this.props.selectedRoomId ||
        console.log('IN MESSAGE PANEL : selected friend id in ', selectedRoomId)
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.getConversation,
            data: {
                roomId: this.props.selectedRoomId,
                limit: 10,
                time: new Date()
            }
        }).then((res) => {
            //console.log('conversation is now: ', res.data);
            if (res.data.status) {
                // set the messages field of the state with the data
                let newRooms = res.data.messages;
                newRooms = newRooms.sort((a, b) => {
                    return new Date(a.time) - new Date(b.time);
                })
                this.setState({
                    messages: newRooms
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
    render() {
        let { messages } = this.state;
        let { userId, selectedRoomId, socket } = this.props;

        return (
            <div>
                <div className="user-current" >
                    <div className="user-img" >
                        <img src="" className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                    </div>
                    <div className="user-name"> {selectedRoomId} </div>
                    <div className="user-status"></div>
                </div>
                <div className="mesgs" id="mesgs">
                    <Message
                        messages={messages}
                        userId={userId}
                    />
                    <div style={{ float: "left", clear: "both" }} ref={(el) => { this.messageEnd = el; }}></div>
                </div>
                <WriteMessage
                    userId={userId}
                    selectedRoomId={selectedRoomId}
                    socket={socket}
                />
            </div>

        );
    }
}
export default MessagesPanel;