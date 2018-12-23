import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// import * as d3 from 'd3';
import ScreenShotDiary from './WorkInProgressGalleryPage';

const url = `https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${
  process.env.flickr
}&user_id=156337600%40N04&page=1&per_page=500&extras=description,date_upload,geo,tags,machine_tags,o_dims,views,media,path_alias,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o&format=json&nojsoncallback=1`;

const WorkInProgressGallery = props => {
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
      })
      .catch(err => console.log('err', err));
  }, []);

  return <ScreenShotDiary {...props} data={data} />;
};

export default WorkInProgressGallery;
