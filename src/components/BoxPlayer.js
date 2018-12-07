import React, { Component } from 'react';
import './BoxPlayer.css';

export default class BoxPlayer extends Component {
  getStyle(x, y, w, h) {
    const { videoWidth, videoHeight } = this.props;
    return {
      left: `${x * 100 / videoWidth}%`,
      top: `${y * 100 / videoHeight}%`,
      width: `${w * 100 / videoWidth}%`,
      height: `${h * 100 / videoHeight}%`,
    };
  }

  renderBoxes() {
    const { 
      boxes, 
      currentTime,
    } = this.props;
    return boxes
      .filter(box => (currentTime >= box.timeStart && currentTime <= box.timeEnd))
      .map(box => (
        <div 
          className="BoxPlayer-box"
          key={box.id}
          style={this.getStyle(box.x, box.y, box.w, box.h)}
        />
      ));
  }

  render() {
    return (
      <div className="BoxPlayer">
        {this.renderBoxes()}
      </div>
    );
  }
}
