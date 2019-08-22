import React, { Component } from 'react';
import './SentencePlayer.css';

const MIN_INTERVAL = 0.2;

export default class SentencePlayer extends Component {
  state = {
    currSentences: [],
  };
  prevUpdateTime = 0;

  componentDidMount() {
    this.updateSentences();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTime, sentences } = this.props;
    if (prevProps.sentences !== sentences) {
      this.updateSentences();
    }
    if (Math.abs(this.prevUpdateTime - currentTime) > MIN_INTERVAL) {
      this.updateSentences();
    }
  }

  updateSentences() {
    const { currentTime, sentences } = this.props;
    this.prevUpdateTime = currentTime;
    this.setState({ currSentences: sentences.filter(s => (s.time_start <= currentTime) && (currentTime <= s.time_end)) });
  }

  renderSentences() {
    const { currSentences } = this.state;
    return currSentences.map(sentence => (
      <div className="SentencePlayer-sentence">
        {sentence.content}
      </div>
    ))
  }

  render() {
    return (
      <div className="SentencePlayer">
        {this.renderSentences()}
      </div>
    );
  }
}