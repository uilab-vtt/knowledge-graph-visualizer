import React, { Component } from 'react';
import './BoxPlayer.css';

export default class BoxPlayer extends Component {
  state = {
    boxes: [],
  };
  prevUpdateTime = 0;

  componentDidMount() {
    this.updateBoxes();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTime, boxes } = this.props;
    if (prevProps.boxes !== boxes) {
      this.updateBoxes();
    }
    if (Math.abs(this.prevUpdateTime - currentTime) > 0.5) {
      this.updateBoxes();
    }
  }

  updateBoxes() {
    const { boxes, currentTime } = this.props;
    if (boxes) {
      const visibleBoxes = boxes
        .filter(box => (currentTime >= box.timeStart && currentTime <= box.timeEnd));
      this.prevUpdateTime = currentTime;
      this.setState({ boxes: visibleBoxes });
    }
  }

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
    const { boxes } = this.state;
    return boxes
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
