import React, { Component } from 'react';
import { Player } from 'video-react';
import './GraphView.css';

export default class GraphView extends Component {
  render() {
    const { videoUrl } = this.props;
    return (
      <div className="GraphView">
        <div className="GraphView-graph-row">
          <div className="GraphView-graph-container">
          
          </div>
        </div>
        <div className="GraphView-video-row">
          <Player>
            <source src={videoUrl} />
          </Player>
        </div>
        <div className="GraphView-controller-row">
        
        </div>
      </div>
    );
  }
}
