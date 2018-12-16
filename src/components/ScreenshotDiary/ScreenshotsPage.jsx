import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {wrapGrid} from 'animate-css-grid';

// import $ from 'jquery';
// import chroma from 'chroma-js';

// import { bboxCollide } from 'd3-bboxCollide';

function ScreenshotDiary(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {width, height, data, addFile, addImgUrl} = props;
  const [id, select] = useState(null);

  const filteredData = id !== null ? data.filter(d => d.id === id) : data;

  const gridRef = React.createRef();
  const forceAnim = null;
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
      className="w-full h-full overflow-y-auto"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
        // gridTemplateRows: 'minmax(1fr, 20rem)',
        gridAutoRows: '1fr',
        gridGap: '16px',
        // gridAutoFlow: 'dense',
      }}>
      {filteredData.map(d => (
        <div
          key={d.id}
          className={`border-black border-2 border-2x flex flex-col overflow-hidden ${
            // dummy class to trigger upd
            id === d.id ? 'animate' : null
          }`}
          style={{
            gridColumn: id === d.id ? 'span 4' : null,
            gridRow: id === d.id ? 'span 4' : null
          }}
          onClick={() => (d.id !== id ? select(d.id) : select(null))}>
          <img
            className="h-full"
            src={d.url_c}
            style={{
              objectFit: 'contain',
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
