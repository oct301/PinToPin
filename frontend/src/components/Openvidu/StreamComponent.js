import React, { Component } from "react";
// import "./StreamComponent.css";
import OvVideoComponent from "./OvVideo";

import MicOff from "@mui/icons-material/MicOff";
import VideocamOff from "@mui/icons-material/VideocamOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
// import FormControl from "@material-ui/core/FormControl";
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@mui/material/IconButton";
// import HighlightOff from "@material-ui/icons/HighlightOff";
// import FormHelperText from "@material-ui/core/FormHelperText";

export default class StreamComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: this.props.user.getNickname(),
      showForm: false,
      mutedSound: false,
      isFormValid: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePressKey = this.handlePressKey.bind(this);
    this.toggleNicknameForm = this.toggleNicknameForm.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
  }

  handleChange(event) {
    this.setState({ nickname: event.target.value });
    event.preventDefault();
  }

  toggleNicknameForm() {
    if (this.props.user.isLocal()) {
      this.setState({ showForm: !this.state.showForm });
    }
  }

  toggleSound() {
    this.setState({ mutedSound: !this.state.mutedSound });
  }

  handlePressKey(event) {
    if (event.key === "Enter") {
      console.log(this.state.nickname);
      if (this.state.nickname.length >= 3 && this.state.nickname.length <= 20) {
        this.props.handleNickname(this.state.nickname);
        this.toggleNicknameForm();
        this.setState({ isFormValid: true });
      } else {
        this.setState({ isFormValid: false });
      }
    }
  }

  render() {
    return (
      // <div className="OT_widget-container">
      <div>
        {/* <div className="pointer nickname">
                    {this.state.showForm ? (
                        <FormControl id="nicknameForm">
                            <IconButton color="inherit" id="closeButton" onClick={this.toggleNicknameForm}>
                                <HighlightOff />
                            </IconButton>
                            <InputLabel htmlFor="name-simple" id="label">
                                Nickname
                            </InputLabel>
                            <Input
                                color="inherit"
                                id="input"
                                value={this.state.nickname}
                                onChange={this.handleChange}
                                onKeyPress={this.handlePressKey}
                                required
                            />
                            {!this.state.isFormValid && this.state.nickname.length <= 3 && (
                                <FormHelperText id="name-error-text">Nickname is too short!</FormHelperText>
                            )}
                            {!this.state.isFormValid && this.state.nickname.length >= 20 && (
                                <FormHelperText id="name-error-text">Nickname is too long!</FormHelperText>
                            )}
                        </FormControl>
                    ) : (
                        <div onClick={this.toggleNicknameForm}>
                            <span id="nickname">{this.props.user.getNickname()}</span>
                            {this.props.user.isLocal() && <span id=""> (edit)</span>}
                        </div>
                    )}
                </div> */}

        {this.props.user !== undefined &&
        this.props.user.getStreamManager() !== undefined ? (
          // <div className="streamComponent">
          <div className="OvVideoComponent-Icon">
            <OvVideoComponent
              user={this.props.user}
              mutedSound={this.state.mutedSound}
            />
            <div className="statusIcons">
              {/* {!this.props.user.isVideoActive() ? (
                <div className="statusIcons-videocam-off">
                  <VideocamOff/>
                </div>
              ) : null} */}

              {/* {!this.props.user.isAudioActive() ? (
                <div className="statusIcons-mic-off">
                  <MicOff />
                </div>
              ) : null} */}
            </div>
            <div>
              {!this.props.user.isLocal() && (
                <IconButton className="statusIcons-volumn" onClick={this.toggleSound}>
                  {this.state.mutedSound ? (
                    <VolumeOff className="statusIcons-volumn-off" />
                  ) : (
                    <VolumeUp className="statusIcons-volumn-on"/>
                  )}
                </IconButton>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}