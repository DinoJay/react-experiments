import React, {Component} from 'react';
import PropTypes from 'prop-types';
import prune from 'json-prune';

// import * as d3 from 'd3';
import ScreenShotDiary from './ScreenshotDiary';

import screenshotData from './screenshotData';

'https://api.mixcloud.com/deli-jay/cloudcasts/'

class ScreenshotDiaryContainer extends Component {
  static propTypes = {
    lessData: PropTypes.bool
  };

  static defaultProps = {lessData: false};

  constructor(props) {
    super(props);
    this.state = {data: [], loadingText: 'Loading Images'};
  }

  componentDidMount() {}

  render() {
    return <ScreenShotDiary {...this.props} data={screenshotData} />;
  }
}

export default ScreenshotDiaryContainer;
