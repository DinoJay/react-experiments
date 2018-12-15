import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import prune from 'json-prune';

// import * as d3 from 'd3';
import {storageRef, dbRef} from 'Src/firebase';
import ScreenShotDiary from './ScreenshotsPage';

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

// const addFile = ({file, id}) => addFileToStorage({file, path: 'img', id});
//
// const addImgUrl = url => dbRef.doc('test').set({url});

const url =
  'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=3f71bcabaadd2b3ca8f517f9faf834f7&user_id=156337600%40N04&extras=description%2C+date_upload%2C+geo%2C+tags%2C+machine_tags%2C+o_dims%2C+views%2C+media%2C+path_alias%2C+url_sq%2C+url_t%2C+url_s%2C+url_q%2C+url_m%2C+url_n%2C+url_z%2C+url_c%2C+url_l%2C+url_o&format=json&nojsoncallback=1&auth_token=72157703186346261-e58eca2ba8a80b8e&api_sig=4922b6511df3c10bf88ad2ff8c5e77a9';

const ScreenshotDiaryContainer = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url, {mode: 'cors'})
      .then(response => response.json())
      .then(result => {
        const {photos} = result;
        const {photo} = photos;
        const newData = photo
          .filter(p => {
            const tags = p.tags.split(' ');
            return {...p, tags};
          })
          .filter(p => p.tags.includes('work'));

        console.log('newData', newData);
        setData(newData);
        // console.log(JSON.stringify(myJson));
      });
  }, []);

  return <ScreenShotDiary {...props} data={data} />;
};

export default ScreenshotDiaryContainer;
