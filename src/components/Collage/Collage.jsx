import * as d3 from 'd3';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import {forceSurface} from 'd3-force-surface';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

import cxx from './styles/collage.scss';

import DotDotDot from '../utils/DotDotDot';

import {rectCollide, bounds} from '../utils/helper';

class Title extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    const {children, style, className} = this.props;
    const pad = 7;
    return (
      <div
        className={`${
          cxx.title
        } child-borders flex flex-col justify-center items-center ${className}`}
        style={{
          ...style,
          width: '130%',
          transform: 'translateX(-10%)',

          textShadow: `${1 + pad}px ${1 + pad}px #fe4902, ${2 + pad}px ${2 +
            pad}px #fe4902, ${3 + pad}px ${3 + pad}px #fe4902`
        }}>
        <div className="flex-grow flex flex-col justify-center items-center ">
          <h1 className={cxx.text}>{children}</h1>
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

    const stampNodes = data.filter(d => !d.header).slice(0, 40);

    console.log('titleNode', data);

    console.log('nodes', data);
    const colNumber = 9;
    const rowNumber = 5;
    const photoColSpan = 1;
    const photoRowSpan = 1;
    const titleColSpan = 5;
    const titleRowSpan = 1;
    // const rowSpan = 1;
    return (
      <div
        className="flex-grow pr-8 pb-6"
        style={{
          // width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
          gridTemplateRows: `repeat( ${rowNumber}, 1fr)`,
        }}>
        <Title
          className="z-10 bg-white border"
          style={{
            gridColumn: `${3} / span ${titleColSpan}`,
            gridRow: `${Math.ceil(rowNumber / 2)}/ span ${titleRowSpan}`
          }}>
          Brussels
        </Title>

        {stampNodes.map(d => (
          <div
            className={cxx.stamp}
            style={{
              gridColumn: `span ${photoColSpan}`,
              gridRow: `span ${photoRowSpan}`,
              width: '130%',
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
