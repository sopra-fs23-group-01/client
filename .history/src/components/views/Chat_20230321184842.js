import React, { Component } from 'react';
import SockJsClient from 'react-stomp';
import './ChatRoom.css';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      message: '',
      messages: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const message = {
      username: this.state.username,
      message: this.state.message
    };
    this.setState({ message: '' });
    this.clientRef.sendMessage('/app/chat', JSON.stringify(message));
  }

  render() {
    return (
      <div className="chat-room">
        <h2>Chat Room</h2>
        <div className="chat-box">
          <ul className="messages">
            {this.state.messages.map((message, index) =>
              <li key={index}><b>{message.username}</b>: {message.message}</li>
            )}
          </ul>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} required />
          <input type="text" name="message" placeholder="Type your message here" value={this.state.message} onChange={this.handleChange} required />
          <button type="submit">Send</button>
        </form>
        <SockJsClient url={'http://localhost:8080/ws-chat'} topics={['/topic/messages']} onMessage={(message) => {
          this.setState({ messages: [...this.state.messages, message] });
        }} ref={(client) => { this.clientRef = client; }} />
      </div>
    );
  }
}

export default ChatRoom;
