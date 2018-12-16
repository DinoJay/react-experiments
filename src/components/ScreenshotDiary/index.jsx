import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// import * as d3 from 'd3';
import ScreenShotDiary from './ScreenshotsPage';

const url2 = `https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=${
  process.env.flickr
}&user_id=156337600%40N04&extras=description%2C+date_upload%2C+geo%2C+tags%2C+machine_tags%2C+o_dims%2C+views%2C+media%2C+path_alias%2C+url_sq%2C+url_t%2C+url_s%2C+url_q%2C+url_m%2C+url_n%2C+url_z%2C+url_c%2C+url_l%2C+url_o&format=json&nojsoncallback=1`;

const ScreenshotDiaryContainer = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url2, {mode: 'cors'})
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
      })
      .catch(err => console.log('err', err));
  }, []);

  return <ScreenShotDiary {...props} data={data} />;
};

export default ScreenshotDiaryContainer;
