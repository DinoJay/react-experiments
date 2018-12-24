import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';

// import prune from 'json-prune';
// import superagent from 'superagent';
// import $ from 'jquery';
// import prune from 'json-prune';

// import getData from './discogsData';

// import $ from 'jquery';
import RecordCollectionPage from './RecordCollectionPage.jsx';
import DotDotDot from '../utils/DotDotDot';

// import getData from './discogsData';
// import dummyData from './dummyData';
// import postcardStyle from '../styles/postcard.scss';

import defaultData from './collection.json';

defaultData.forEach((d, i) => {
  d.tags = d.styles;
  d.key = i;
  d.id = i;
});

const keys = `&key=${process.env.discogsKey}&secret=${
  process.env.discogsSecret
}`;

const url = `https://api.discogs.com/users/anarcho123/collection/folders/0/releases?sort=added&sort_order=desc${keys}`;

// console.log('defaultData', defaultData);

// const wait = ms =>
//   new Promise(resolve =>
//     setTimeout(() => {
//       console.log('wait', ms);
//       resolve();
//     }, ms)
//   );

export default props => {
  useEffect(() => {
    fetch(url, {mode: 'cors'})
      .then(response => response.json())
      .then(result => {
        console.log('result', result);
        result.releases.map(rec => {
          fetch(`${rec.basic_information.resource_url}?${keys}`, {mode: 'cors'})
            .then(response => response.json())
            .then(extRec => {
              console.log('extRec', extRec);
            });
        });
      });
  }, []);
  return <RecordCollectionPage {...props} pad={30} data={defaultData} />;
};
