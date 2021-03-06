import React from 'react';
import './join-room.scss';
import {connect} from 'react-redux';
import { renderIf } from '../../lib/utils';
import { Redirect, Link } from 'react-router-dom';
import * as roomActions from '../../action/make-room';


class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;

    this.state = {
      code: '',
      nickname: '',
      isHost: false,
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.socket.emit('JOIN_ROOM', this.state.code.toUpperCase(), this.state.nickname.toUpperCase(), this.socket.id);

    this.socket.on('ERROR_JOIN_ROOM', message => {
      this.setState({'joinError': message});
    });

    this.socket.on('JOINED_ROOM', (maxPlayers) => {
      let code = this.state.code.toUpperCase();
      let nickname = this.state.nickname.toUpperCase();

      this.props.setRoom({
        roomCode: code,
        nickname: nickname,
        isHost: false,
        maxPlayers: maxPlayers,
      });

      this.setState({'redirect': true });
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="joinroom-wrapper">
          <header>
            <h1 className="joinroom-h1">Join Room</h1>
          </header>

          <form className="joinroom-form" onSubmit={this.handleSubmit}>

            <div className="joinroom-div">Room Code:</div>
            <input name="code" className="joinroom-input" id="joinroom-roomcode" type="text" placeholder="Room Code" onChange={this.handleChange} required />

            <div className="joinroom-div">Nickname:</div>
            <input name="nickname" className="joinroom-input" id="joinroom-nickname" type="text" placeholder="Name" onChange={this.handleChange} required />

            <button className="joinroom-button" type="submit">Join Room</button>
          </form>

          <div className="tooltip">{this.state.joinError}</div>

          {renderIf(this.state.redirect, <Redirect to="/waitingroom" />)}
        </div>
      </React.Fragment>
    );
  }
}

let mapStateToProps = state => ({
  room: state.room,
  socket: state.socket,
});
let mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom);
