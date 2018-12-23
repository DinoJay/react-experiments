import React, {useState} from 'react';
import PropTypes from 'prop-types';
// import $ from 'jquery';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

import cxx from './styles/collage.scss';

// import DotDotDot from '../utils/DotDotDot';

const textShadow = (rYP, rXP) =>
  `${+rYP / 10}px ${rXP / 80}px tomato, ${rYP / 20}px ${rXP /
    20}px gold, ${rXP / 70}px ${rYP / 12}px rgba(0,159,227,.7)`;

const Title = props => {
  const {children, style, className, x = 0, y = 0} = props;
  const pad = 7;
  return (
    <div
      className={`${
        cxx.title
      } child-borders flex flex-col justify-center items-center ${className}`}
      style={{
        ...style,
        width: '110%',
        transform: 'translateX(-5%) rotate(-3deg)',
      }}>
      <div className="flex-grow flex flex-col justify-center items-center ">
        <h1
          className={cxx.text}
          style={{
            textShadow: textShadow(200, 200),
          }}>
          {children}
        </h1>
      </div>
    </div>
  );
};

Title.propTypes = {
  children: PropTypes.object.isRequired,
  style: PropTypes.object,
};

Title.defaultProps = {
  style: {},
};

function Collage(props) {
  const {width, height, data} = props;
  const [mouseXY, setMouseXY] = useState([0, 0]);

  const stampNodes = data.filter(d => !d.header).slice(0, 40);

  const colNumber = 9;
  const rowNumber = 5;
  const photoColSpan = 1;
  const photoRowSpan = 1;
  const titleColSpan = 5;
  const titleRowSpan = 1;

  // const rowSpan = 1;
  return (
    <div
      onMouseMove={e => setMouseXY([e.clientX, e.clientY])}
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
        className="z-10 bg-white border-4 border-black text-black"
        x={mouseXY[0]}
        y={mouseXY[1]}
        style={{
          gridColumn: `${3} / span ${titleColSpan}`,
          gridRow: `${Math.ceil(rowNumber / 2)}/ span ${titleRowSpan}`,
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
            position: 'relative',
          }}>
          <img
            className="img-filter"
            src={d.src}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ))}
    </div>
  );
}

Collage.defaultProps = {
  width: 550,
  height: 330,
  center: [290, 200]
};

Collage.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Collage;
