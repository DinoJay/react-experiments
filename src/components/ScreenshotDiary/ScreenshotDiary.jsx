import * as d3 from 'd3';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import {forceSurface} from 'd3-force-surface';
// import chroma from 'chroma-js';

import PhotoUpload from 'Src/components/PhotoUpload';
// import { bboxCollide } from 'd3-bboxCollide';

function ScreenshotDiary(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {width, height, data, addFile, addImgUrl} = props;

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
      <button type="button" onClick={() => setDialogOpen(!dialogOpen)}>
        dialog
      </button>
      <dialog className="z-50" open={dialogOpen}>
        <PhotoUpload
          onChange={({file, name}) => {
            console.log('file', file.file);
            addFile({file, id: name}).then(e => console.log('yeahh'));
          }}
        />
        <form className="mt-3 " onSubmit={e => e.preventDefault()}>
          <input className="text-lg m-2" placeholder="url" type="url" />
          <div className="flex items-center">
            <div className="border-2 m-2">
              <input className="text-lg m-2" placeholder="email" type="email" />
            </div>
            <div className="border-2">
              <input
                className="text-lg m-2"
                placeholder="password"
                type="password"
              />
            </div>
          </div>
          <div className="flex justify-end" />
        </form>
        <button
          className="text-xl btn border-2 m-2 p-2"
          onClick={() => addImgUrl('test').then(e => console.log('e',e))}>
          Upload
        </button>
      </dialog>
      {data.map(d => (
        <div
          style={{
            gridColumn: `span ${photoColSpan}`,
            gridRow: `span ${photoRowSpan}`,
            width: '130%',
            height: '120%',
            position: 'relative',
          }}>
          <img
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

ScreenshotDiary.defaultProps = {
  width: 550,
  height: 330,
  center: [290, 200]
};

export default ScreenshotDiary;
