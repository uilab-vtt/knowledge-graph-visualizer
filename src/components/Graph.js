import React, { Component } from 'react';
import { throttle } from 'throttle-debounce';
import * as d3 from 'd3';
import './Graph.css';

export default class Header extends Component {
  componentDidMount() {
    this.adjustViewBoxThr = throttle(500, this.adjustViewBox); 
    this.initGraph();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.adjustViewBoxThr();
  };

  adjustViewBox = () => {
    if (this.box && this.svg) {
      const boxWidth = this.box.clientWidth;
      const boxHeight = this.box.clientHeight;

      this.svg.attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('viewBox', [-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight])
    }
  };

  async initGraph() {
    const { graph } = this.props;

    const links = graph.links.map(d => Object.create(d));
    const nodes = graph.nodes.map(d => Object.create(d));

    const simulation = this.forceSimulation(nodes, links).on("tick", () => this.ticked());

    const boxWidth = this.box.clientWidth;
    const boxHeight = this.box.clientHeight;

    this.svg = d3.select(this.box)
      .append('svg:svg')
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('viewBox', [-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight]);

    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 9)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-2.5 L 5 ,0 L 0,2.5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    this.link = this.svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links, d => d.id)
      .enter().append('line')
      .style('stroke-dasharray', d => d.type === 'dotted' ? '3,3' : '3,0')
      .attr('marker-end', d => d.type === 'arrow' ? 'url(#arrowhead)' : '')
      .attr('stroke-width', d => Math.sqrt(d.value));

    this.node = this.svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes, d => d.id)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', d => `#${d.color}`)
      .call(this.drag(simulation));

    this.node.append('title')
      .text(d => d.label);

    return this.svg.node();
  }

  ticked() {
    this.link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  forceSimulation(nodes, links) {
    return d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY());
  }

  color() {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.group);
  }

  drag(simulation) {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  render() {
    return (
      <div className="Graph">
        <div 
          ref={e => (this.box = e)}
          className="Graph-box"
        >

        </div>
      </div>
    );
  }
}
