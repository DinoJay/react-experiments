import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {wrapGrid} from 'animate-css-grid';

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
  const ref = React.createRef();

  // useEffect(() => {
  //   const cur = ref.current;
  //   // cur.setAttribute('style', 'transform: translateX(-5%) rotate(-3deg)');
  //   console.log('ref cur', cur);
  // });

  return (
    <div
      ref={ref}
      className={`${
        cxx.title
      } child-borders flex flex-col justify-center items-center ${className}`}
      style={{
        ...style,
        width: '110%',
        // transform: 'translateX(-5%) rotate(-3deg)',
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
  const [id, setId] = useState(null);

  const filteredData = id !== null ? data.filter(d => d.id === id) : data;

  const gridRef = React.createRef();

  useEffect(() => {
    wrapGrid(gridRef.current, {
      // easing: 'backOut',
      stagger: 10,
      duration: 300
    });
  }, []);

  const colNumber = 9;
  const rowNumber = 5;
  const photoColSpan = 1;
  const photoRowSpan = 1;
  const titleColSpan = 5;
  const titleRowSpan = 1;

  // const rowSpan = 1;
  return (
    <div
      ref={gridRef}
      className="flex-grow pr-8 pb-6"
      style={{
        // width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${id === null ? colNumber : 1}, 1fr)`,
        gridTemplateRows: `repeat( ${id === null ? rowNumber : 1}, 1fr)`,
        gridGap: 10,

        // justifyContent: 'center',
        // gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, auto))',
        // gridTemplateRows: 'minmax(1fr, 20rem)',
        // gridAutoRows: '1fr',
      }}>
      <Title
        className="z-10 bg-white border-4 border-black text-black"
        style={{
          display: id !== null && 'none',
          gridColumn: `${3} / span ${titleColSpan}`,
          gridRow: `${Math.ceil(rowNumber / 2)}/ span ${titleRowSpan}`,
        }}>
        Brussels
      </Title>

      {filteredData.map(d => (
        <img
          className={cxx.stamp}
          key={d.id}
          onClick={() => (d.id === id ? setId(null) : setId(d.id))}
          src={d.url_c}
          style={{
            width: id !== null ? '100%' : 0,
            height: id !== null ? '100%' : 0,
            minWidth: id === null ? '120%' : 0,
            minHeight: id === null ? '120%' : 0,
            // objectFit: 'cover',
          }}
        />
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
