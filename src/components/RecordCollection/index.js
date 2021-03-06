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

const url =
  'https://us-central1-homepage-9c225.cloudfunctions.net/fetchRecords';

export default props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url, {mode: 'cors'})
      .then(response => response.json())
      .then(result => {
        const formattedData = result
          .map(d => ({
            ...d,
            milliseconds: Date.parse(d.dateAdded)
          }))
          .sort((a, b) => b.milliseconds - a.milliseconds);
        setData(formattedData);
      });
  }, []);
  return (
    <RecordCollectionPage
      {...props}
      pad={30}
      data={data.reverse().slice(0, 40)}
    />
  );
};
