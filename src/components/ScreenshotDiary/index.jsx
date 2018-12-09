import React, {Component} from 'react';
import PropTypes from 'prop-types';
import prune from 'json-prune';

// import * as d3 from 'd3';
import {storageRef, dbRef} from 'Src/firebase';
import ScreenShotDiary from './ScreenshotDiary';

import screenshotData from './screenshotData';

const addFileToStorage = ({file, path, id}) => {
  const metadata = {contentType: 'img'};
  const imgRef = storageRef.child(`${path}/${id}`);
  return imgRef
    .put(file)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())))
    .catch(err => {
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

const addFile = ({file, id}) => addFileToStorage({file, path: 'img', id});

const addImgUrl = url =>
  dbRef
    .doc('test')
    .set({url});

class ScreenshotDiaryContainer extends Component {
  static propTypes = {
    lessData: PropTypes.bool
  };

  static defaultProps = {lessData: false};

  render() {
    return (
      <ScreenShotDiary
        {...this.props}
        data={screenshotData}
        addImgUrl={addImgUrl}
        addFile={addFile}
      />
    );
  }
}

export default ScreenshotDiaryContainer;
