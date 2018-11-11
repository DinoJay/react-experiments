import React from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';

// import prune from 'json-prune';
// import superagent from 'superagent';
// import $ from 'jquery';
// import prune from 'json-prune';

import getData from './discogsData';

// import $ from 'jquery';
import CardStack from './CardStack';
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

// console.log('defaultData', defaultData);

// const wait = ms =>
//   new Promise(resolve =>
//     setTimeout(() => {
//       console.log('wait', ms);
//       resolve();
//     }, ms)
//   );

class RecordCollection extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  state = {loadingText: 'loading image data', data: []};

  // componentDidMount() {
  // this.setState({data: defaultData})
  // }

  // componentWillReceiveProps() {
  //   this.setState(setInitialState(collectionData));
  // }

  render() {
    const {height} = this.props;

    // return null;
    return <CardStack {...this.props} pad={40} data={defaultData} />;
  }
}

RecordCollection.defaultProps = {
  width: 860,
  height: 640
};

export default RecordCollection;
