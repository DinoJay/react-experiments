import * as d3 from 'd3';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import {forceSurface} from 'd3-force-surface';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

import cxx from './styles/collage.scss';

import DotDotDot from '../utils/DotDotDot';
// import postcardStyle from '../cxx/postcard.scss';

// import pics from './collagePics';

import {rectCollide, bounds} from '../utils/helper';

const boundingBox = (width, height, padX = 0, padY = 0) => [
  {
    from: {x: padX, y: padY},
    to: {x: padX, y: height - padY}
  },
  {
    from: {x: padX, y: height - padY},
    to: {x: width, y: height - padY}
  },
  {
    from: {x: width, y: height - padY},
    to: {x: width, y: padY}
  },
  {
    from: {x: width, y: padY},
    to: {x: padX, y: padY}
  }
];

class Title extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    const {children, style} = this.props;
    return (
      <div
        className={`${
          cxx.title
        } child-borders flex flex-col justify-center items-center`}
        style={{
          pointerEvents: 'none',
          display: 'flex',
          zIndex: 2,
          ...style
        }}>
        <div className="border flex-grow flex flex-col justify-center items-center bg-white">
          <h1 style={{fontSize: '4rem'}}>{children}</h1>
        </div>
      </div>
    );
  }
}

class Collage extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  render() {
    const {width, height, data} = this.props;

    const stampNodes = data.filter(d => !d.header).slice(0, 32);

    console.log('titleNode', data);

    console.log('nodes', data);
    const colNumber = 7;
    const rowNumber = 5;
    return (
      <div
        className="flex-grow"
        style={{
          // width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
          gridTemplateRows: `repeat( ${rowNumber}, 1fr)`,
        }}>
        <Title
          style={{
            gridColumn: `${Math.floor(colNumber / 2)} / span 3`,
            gridRow: `${Math.ceil(rowNumber / 2)}/ span 1`
          }}>
          Brussels
        </Title>
        {stampNodes.map(d => (
          <div
            className={cxx.stamp}
            style={{
              gridColumn: 'span 1',
              gridRow: 'span 1',
              width: '120%',
              height: '120%',
              background: 'gold'
            }}>
            test
          </div>
        ))}
      </div>
    );
  }
}

Collage.defaultProps = {
  width: 550,
  height: 330,
  center: [290, 200]
};

export default Collage;
