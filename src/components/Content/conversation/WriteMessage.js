import React, { Component } from 'react';

class WriteMessage extends Component {
    constructor() {
        super();
        this.state = {
            chatText: ''
        };
    }
    handleChange = (e) => {
        this.setState({
            chatText: e.target.value
        });
    }
    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });
    submitMessage = (e) => {
        console.log(new Date());
        let { chatText } = this.state;
        // define the chat message
        let data = {
            time: new Date(),
            Body: chatText,
            senderId: this.props.userId,
            roomId: this.props.selectedRoomId,
            type: "text"
        }
        console.log('the message', data);
        // console.log('length of the message', data.msgBody.length);

        // emit the message

        this.props.socket.emit('send', data);
        this.setState({ chatText: '' });

    }
    render() {

        return (
            <div className="type_msg">
                <div className="row">
                    <div className="col-sm-8">
                        <input type="text"
                            placeholder="Type your message..."
                            value={this.state.chatText}
                            onChange={this.handleChange}
                            onKeyUp={(e) => this.userTyping(e)}
                            className="form-control box-text"
                        >
                        </input>
                    </div>
                    <div className="col-sm-4">
                        <button className="fa fa-paper-plane btn-type" onClick={this.submitMessage}></button>
                    </div>
                </div>

                
            </div>
        );
    }
}

export default WriteMessage;