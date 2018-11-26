import React from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';
// import tsnejs from 'tsne';
import _ from 'lodash';

import ReactDom from 'react-dom';
// import sketchy from '../utils/d3.sketchy';

import fitty from 'fitty';
import cxx from './TagCloud.scss';

// const setChildrenToInheritFontSize = el => {
//   el.style.fontSize = 'inherit';
//   console.log('children', el.children);
//   _.each(el.children, child => {
//     setChildrenToInheritFontSize(child);
//   });
// };
function autoSizeText(container, attempts = 200, width, height) {
  const resizeText = el => {
    attempts--;
    let elNewFontSize;
    if (
      el.style.fontSize === '' ||
      el.style.fontSize === 'inherit' ||
      el.style.fontSize === 'NaN'
    ) {
      elNewFontSize = '60px'; // largest font to start with
    } else {
      elNewFontSize = `${parseInt(el.style.fontSize.slice(0, -2), 10) - 1}px`;
    }
    el.style.fontSize = elNewFontSize;

    // this function can crash the app, so we need to limit it
    if (attempts <= 0) {
      return;
    }

    if (el.scrollWidth > width || el.scrollHeight > height) {
      resizeText(el);
    }
  };
  // setChildrenToInheritFontSize(container);
  resizeText(container);
}

class Tag extends React.Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    width: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    top: PropTypes.number.isRequired,
    padding: PropTypes.number.isRequired
  };

  static defaultProps = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    children: 0,
    color: 'blue',
    fill: 'white',
    padding: 10,
    clickHandler: () => null
  };

  componentDidMount() {
    const {width, height, padding} = this.props;

    // fitty(this.node);
    autoSizeText(this.node, 100, width - padding, height - padding);
    // autoSizeText(node, 10, width - 2 * 10, height - 2 * 10);
  }

  componentDidUpdate(prevProps, prevState) {
    // const {width, height, padding} = this.props;
    // autoSizeText(this.node, 100, width - padding, height - padding);
    // fitty(this.node, {maxSize: 80});
    // fitty(this.node, {maxSize: 80});
    // const node = ReactDom.findDOMNode(this.node);
    // const {width, height, padding} = this.props;
    // if (prevProps.width !== width || prevProps.height !== height) {
    //   autoSizeText(node, 100, width - 2 * padding, height - 2 * padding);
    // }
  }

  render() {
    const {
      left,
      top,
      width,
      height,
      color,
      fill,
      data,
      onMouseEnter,
      onMouseLeave,
      padding,
      selected
    } = this.props;

    const st = {
      left,
      top,
      width,
      height,
      transition: 'all 400ms',
      // wordBreak: 'break-all'
    };

    return (
      <div
        className={`${cxx.tag} ${
          selected ? 'bg-brown' : 'bg-white'
        } flex flex-col items-center justify-center text-xl `}
        style={st}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <div
          className="m-2"
          ref={el => (this.node = el)}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}>
          {data.key}
        </div>
      </div>
    );
  }
}

class TagCloud extends React.Component {
  static propTypes = {
    docWidth: PropTypes.array.isRequired,
    docHeight: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padX: PropTypes.number.isRequired,
    padY: PropTypes.number.isRequired
  };

  render() {
    const {color, data, onHover} = this.props;

    const treemap = data.map((d, i) => (
      <Tag
        {...d}
        color={color(d.data.key)}
        padding={10}
        index={i}
        onMouseEnter={() => onHover(d.data.key)}
        onMouseLeave={() => onHover(null)}
      />
    ));
    return <div className="child-borders">{treemap}</div>;
  }
}

TagCloud.defaultProps = {
  width: 800,
  height: 400,
  padX: 0,
  padY: 0,
  clickHandler: () => null,
  color: () => 'red',
  getCoords: d => d
};

export default TagCloud;
