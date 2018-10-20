import React, { Component } from 'react';
import PropTypes from 'prop-types';
import prune from 'json-prune';

import * as d3 from 'd3';
import Collage from './Collage';

import imgData from './collagePics';


class CollageContainer extends Component {
  static propTypes = {
    lessData: PropTypes.bool
  };

  static defaultProps = { lessData: false };

  constructor(props) {
    super(props);
    this.state = { data: [], loadingText: 'Loading Images' };
  }

  componentDidMount() {
  }

  render() {

    return <Collage {...this.props} data={imgData} />;
  }
}

export default CollageContainer;
