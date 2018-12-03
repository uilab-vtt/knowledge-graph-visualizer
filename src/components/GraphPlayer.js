import React, { Component } from 'react';
import { Player, ControlBar } from 'video-react';
import Slider from 'rc-slider';
import Graph from './Graph';
import './GraphPlayer.css';

export default class GraphPlayer extends Component {
  state = {
    duration: 0,
    paused: true,
    currentTime: 0,
  };

  componentDidMount() {
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }
  
  handleStop() {
    this.player.pause();
    this.player.seek(0);
  }

  handleStateChange(state, prevState) {
    this.setState({
      player: state,
      duration: state.duration,
      paused: state.paused,
      currentTime: state.currentTime,
    });
  }

  renderPlayButton() {
    const { paused } = this.state;
    return paused ? (
      <button className="button" onClick={() => this.player.play()}>
        <i className="fa fa-play" />
      </button>
    ) : (
      <button className="button" onClick={() => this.player.pause()}>
        <i className="fa fa-pause" />
      </button>
    );
  }
  
  render() {
    const { graph, videoUrl } = this.props;
    const {
      duration,
      currentTime,
    } = this.state;
    return (
      <div className="GraphPlayer">
        <div className="GraphPlayer-graph-row">
          <div className="GraphPlayer-graph-container">
            <Graph 
              graph={graph} 
              currentTime={currentTime}
            />
          </div>
          <div className="GraphPlayer-video-container">
            <Player
              ref={e => (this.player = e)}
              className="GraphPlayer-player"
            >
              <source src={videoUrl} />
              <ControlBar disableCompletely />
            </Player>
          </div>
        </div>
        <div className="GraphPlayer-controller-row">
          <div className="GraphPlayer-buttons-container">
            <div className="buttons has-addons is-centered">
              {this.renderPlayButton()}
              <button className="button" onClick={() => this.handleStop()}>
                <i className="fa fa-stop" />
              </button>
            </div>
          </div>
          <div className="GraphPlayer-status-container">
            <span>{currentTime.toFixed(1)}</span>
          </div>
          <div className="GraphPlayer-slider-container">
            <Slider
              min={0}
              max={duration}
              value={currentTime}
              onChange={v => this.player.seek(v)}
              step={0.1}
            />
          </div>
        </div>
      </div>
    );
  }
}
