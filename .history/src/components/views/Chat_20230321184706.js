import React, { Component } from 'react';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.ws = new WebSocket('ws://localhost:3001/chat');
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.setState({ messages: [...this.state.messages, message] });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.messages.map((message, index) =>
            <li key={index}>{message.sender}: {message.text}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default ChatRoom;
