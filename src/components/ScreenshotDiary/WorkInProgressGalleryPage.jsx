import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {wrapGrid} from 'animate-css-grid';

// import $ from 'jquery';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

function ScreenshotDiary(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {width, height, data, addFile, addImgUrl} = props;
  const [id, setId] = useState(null);

  const filteredData = id !== null ? data.filter(d => d.id === id) : data;

  const gridRef = React.createRef();

  useEffect(() => {
    wrapGrid(gridRef.current, {
      // easing: 'backOut',
      stagger: 10,
      duration: 400
    });
  }, []);

  // useEffect(
  //   () => {
  //     forceAnim();
  //   },
  //   [id],
  // );

  // const rowSpan = 1;
  return (
    <div
      ref={gridRef}
      className="w-full h-full overflow-y-auto pb-3"
      style={{
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, auto))',
        // gridTemplateRows: 'minmax(1fr, 20rem)',
        gridAutoRows: '1fr',
        gridGap: '16px',
        // gridAutoFlow: 'dense',
      }}>
      {filteredData.map((d, i) => (
        <div
          key={d.id}
          className={`cursor-pointer border-black border-2 border-${i %
            3}x bg-white p-2 flex flex-col
          overflow-hidden ${
  // dummy class to trigger upd
            id === d.id ? 'animate' : null
          }`}
          style={{
            boxShadow: '0 0.5rem 0.5rem rgba(0,0,0,0.3)'

            // gridColumn: id === d.id ? 'span 2' : null,
            // gridRow: id === d.id ? 'span 2' : null
          }}
          onClick={() => (d.id !== id ? setId(d.id) : setId(null))}>
          <img
            className="h-full img-filter"
            src={d.url_c}
            style={{
              transition: 'filter 0.3s',
              objectFit: id !== null ? 'contain' : 'cover',
              // width: '10rem',
              // height: '10rem'
            }}
          />
        </div>
      ))}
    </div>
  );
}

ScreenshotDiary.defaultProps = {
  width: 550,
  height: 330,
  center: [290, 200]
};

export default ScreenshotDiary;
