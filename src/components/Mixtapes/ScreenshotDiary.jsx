import * as d3 from 'd3';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import {forceSurface} from 'd3-force-surface';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

class ScreenshotDiary extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  render() {
    const {width, height, data} = this.props;

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
        {data.map(d => (
          <div
            style={{
              gridColumn: `span ${photoColSpan}`,
              gridRow: `span ${photoRowSpan}`,
              width: '130%',
              height: '120%',
              position: 'relative'
            }}>
            <img
              src={d.src}
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}

ScreenshotDiary.defaultProps = {
  width: 550,
  height: 330,
  center: [290, 200]
};

export default ScreenshotDiary;
