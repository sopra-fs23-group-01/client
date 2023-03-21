import React, { Component } from 'react';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: ''
    };
    this.ws = new WebSocket('ws://localhost:8080/chat');

    this.ws.onopen = () => {
        alert('WebSocket连接已经打开');
      };
      

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.setState({ messages: [...this.state.messages, message] });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  handleSubmit(event) {
    event.preventDefault();
    const message = { sender: 'Me', text: this.state.text };
    this.ws.send(JSON.stringify(message));
    this.setState({ text: '' });
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.messages.map((message, index) =>
            <li key={index}>{message.sender}: {message.text}</li>
          )}
        </ul>
        <form onSubmit={(event) => this.handleSubmit(event)}>
          <input type="text" value={this.state.text} onChange={(event) => this.setState({ text: event.target.value })} />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default ChatRoom;
