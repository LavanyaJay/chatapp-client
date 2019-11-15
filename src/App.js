import React from "react";
import { Component } from "react";
import superagent from "superagent";

export default class App extends Component {
  stream = new EventSource("http://localhost:4000/stream");
  state = {
    messages: [],
    value: ""
  };
  onChange = event => {
    const { value } = event.target;
    this.setState({ value });
  };
  onSubmit = event => {
    event.preventDefault();
    const value = this.state.value;

    const url = "http://localhost:4000/message";
    superagent
      .post(url)
      .send({ message: value })
      .then(res => {
        console.log("testing response: ", res);
      });
  };
  componentDidMount = () => {
    //Destructure data that was passed to stream.send
    this.stream.onmessage = event => {
      const { data } = event;
      //Convert serilaize string to JSON string
      const parsed = JSON.parse(data);
      //Check if sent data is array ? assume all messages,replace full list in state : assume single msg,add the new msg to list in state
      if (Array.isArray(parsed)) {
        this.setState({ messages: parsed });
      } else {
        const messages = [...this.state.messages, parsed];
        this.setState({ messages });
      }

      console.log("data test: ", data);
    };
  };
  reset = () => {
    this.setState({ value: "" });
  };
  render() {
    const list = this.state.messages.map((message, index) => (
      <p key={index}>{message}</p>
    ));
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            onChange={this.onChange}
            value={this.state.value}
          />
          <button>Submit</button>
          <button onClick={this.reset}>Reset</button>
        </form>
        {list}
      </div>
    );
  }
}
