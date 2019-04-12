import React from 'react';
import * as d3 from 'd3';
import Physics from '../utils/physics';
import mouseImage from './mouse_small.png';
import maxKappa from './maxkappa.png'
import knucklePuck from './knucklepuck.png';
import smallMax from './smallmax.jpg';
import bounce from './bounce.png';
import partridge from './partridge.png';
import jeebs from './jeebsSquare.jpg';

const images = [
  { id: 'mouse', name: 'Rat', image: mouseImage },
  { id: 'maxkappa', name: 'MaxKappa', image: maxKappa },
  { id: 'knucklepuck', name: 'KnucklePuck', image: knucklePuck },
  { id: 'smallmax', name: 'SmallMax', image: smallMax },
  { id: 'bounce', name: 'Bounce', image: bounce },
  { id: 'partridge', name: 'Partridge', image: partridge },
  { id: 'jeebs', name: 'Jeebs', image: jeebs },
];

let circles = [];
const dimensions = { x: window.innerWidth, y: window.innerHeight }
const tickRate = 10;

const randColour = () => (Math.random() * 215) + 100;
const randSpeed = () => (Math.random() * 200) - 100;
const randSize = () => (Math.random() * 20) + 20;

class Workspace extends React.Component {
  state = {
    selectedCircle: null,
    interval: null,
    mouseDown: false,
    trails: false,
    ballValue: 'Ball',
  }

  getBallFill = (d) => {
    const img = images.find(image => image.name === this.state.ballValue)
    if (img) {
      return `url(#${img.id})`;
    }
    return d.color;
  }

  componentDidMount() {
    d3.select('#workspace-canvas')
      .on('mousedown', () => this.setState({ mouseDown: true }))
      .on('mouseup', () => this.setState({ mouseDown: false }))
      .on('mousemove', this.mouseMove)
      .on('touchstart', () => this.setState({ mouseDown: true }))
      .on('touchend', this.setState({ mouseDown: false }))
      .on('touchmove', this.mouseMove)

    this.togglePhys();
  }

  addCircles = () => {
    d3.select('#workspace-canvas')
      .selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('class', 'string-node')
      .attr('id', (d, i) => `circle${i}`)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', randSize)
      .attr('fill', d => this.getBallFill(d))
  }

  mouseMove = () => {
    if (this.state.mouseDown) {
      this.addNewCircle();
    }
  }

  updateCircles = () => {
    circles = Physics.checkBounds(circles, dimensions);
    d3.selectAll('circle')
      .data(circles)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => this.getBallFill(d))

    if (this.state.trails) {
      circles.forEach(circle => {
        d3.select('#workspace-canvas')
          .append('rect')
          .attr('width', 2)
          .attr('height', 2)
          .attr('x', circle.x)
          .attr('y', circle.y)
          .attr('fill', 'white')
          .transition()
          .duration(1000)
          .style('opacity', 0)
          .remove();
      })
    }
  }

  addNewCircle = () => {
    let coords;
    if (d3.event.type === 'touchmove') {
      coords = d3.touches(d3.event.target)[0];
    } else {
      coords = d3.mouse(d3.event.target);
    }
    circles.push({
      x: coords[0],
      y: coords[1],
      vel: {
        x: randSpeed(),
        y: randSpeed(),
      },
      color: `rgb(${randColour()}, ${randColour()}, ${randColour()})`,
    });
    this.addCircles();
  }

  step = () => {
    circles = Physics.doTick(circles);
    this.updateCircles();
  }

  togglePhys = () => {
    if (!this.state.interval) {
      const interval = setInterval(() => {
        this.step();
      }, tickRate)
      this.setState({ interval });
    } else {
      this.pausePhys();
    }
  }

  pausePhys = () => {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  }

  clear = () => {
    d3.selectAll('.string-node').remove();
    circles = [];
  }

  shake = () => {
    circles = circles.map((circle) => ({
      ...circle,
      vel: {
        x: randSpeed() * 1.5,
        y: randSpeed() * 1.5,
      },
    }));
  }

  changeBalls = (e) => this.setState({ ballValue: e.target.value }, () => this.updateCircles());

  render() {
    return (
      <div>
        <svg
          id="workspace-canvas"
          width={dimensions.x}
          height={dimensions.y}
          fill="black"
        >
          <defs>
            {images.map(image =>
              <pattern id={image.id} height="100%" width="100%" patternContentUnits="objectBoundingBox">
                <image xlinkHref={image.image} preserveAspectRatio="none" width="1" height="1" />
              </pattern>
            )}
          </defs>
        </svg>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <button onClick={this.togglePhys}>{this.state.interval ? 'pause' : 'start'}</button>
          <button onClick={() => this.setState({ trails: !this.state.trails })}>trails</button>
          <button onClick={this.clear}>clear</button>
          <button onClick={this.shake}>shake</button>
          <select onChange={this.changeBalls}>
            <option>Ball</option>
            {images.map((image) => <option>{image.name}</option>)}
          </select>
        </div>
      </div>
    )
  }
}

export default Workspace;