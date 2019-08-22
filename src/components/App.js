import React, { Component } from 'react';
import Header from './Header';
import GraphPlayer from './GraphPlayer';
import Config from '../config.json';
import { loadGraph } from '../lib/graph';
import { loadSentences } from '../lib/sentences';
import './App.css';

export default class App extends Component {
  state = {
    videoUrl: null,
    graph: null,
    sentences: null,
  };

  componentDidMount() {
    this.setState({
      videoUrl: Config.video,
    });
    loadGraph(Config.graph)
      .then(graph => this.setState({ graph }))
      .catch(e => console.error(e));
    loadSentences(Config.sentences)
      .then(sentences => this.setState({ sentences }))
      .catch(e => console.error(e));
  }

  renderGraphPlayer() {
    const { graph, sentences, videoUrl } = this.state;
    return graph && sentences ? (
      <GraphPlayer
        videoUrl={videoUrl}
        graph={graph}
        sentences={sentences}
      />
    ) : '';
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
