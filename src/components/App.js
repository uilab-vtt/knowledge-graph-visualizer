import React, { Component } from 'react';
import Header from './Header';
import GraphPlayer from './GraphPlayer';
import Config from '../config.json';
import { loadGraph } from '../lib/graph';
import './App.css';

export default class App extends Component {
  state = {
    videoUrl: null,
    graph: null,
  };

  componentDidMount() {
    this.setState({
      videoUrl: Config.video,
    });
    loadGraph(Config.graph)
      .then(graph => this.setState({ graph }))
      .catch(e => console.error(e));
  }

  renderGraphPlayer() {
    const { graph, videoUrl } = this.state;
    return graph === null ? '' : (
      <GraphPlayer
        videoUrl={videoUrl}
        graph={graph}
      />
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header-row">
          <Header />
        </header>
        <div className="App-content-row">
          <div className="App-content-container">
            {this.renderGraphPlayer()}
          </div>
        </div>
      </div>
    );
  }
}
