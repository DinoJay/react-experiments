import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import tsnejs from 'tsne';
import _ from 'lodash';

// import ReactDom from 'react-dom';
// import sketchy from '../utils/d3.sketchy';

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

export class Tag extends React.Component {
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
      selected,
      style,
      className, textStyle
    } = this.props;

    return (
      <div
        className={`${
          cxx.tag
        } flex border-1 flex-col items-center justify-center text-xl ${className}`}
        style={{
          left,
          top,
          width,
          height,
          transition: 'all 400ms',
          ...style
          // wordBreak: 'break-all'
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <div
          className="m-2"
          ref={el => (this.node = el)}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap', ...textStyle
          }}>
          {data.key}
        </div>
      </div>
    );
  }
}

function makeTreemap({data, width, height, padX, padY}) {
  const ratio = 4;
  const sorted = data.sort((a, b) => b.weight - a.weight);
  const treemap = d3
    .treemap()
    .size([width / ratio, height])
    .paddingInner(0)
    .round(true)
    .tile(d3.treemapResquarify.ratio(1));

  const size = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.weight))
    .range([30, 100]);

  const first = {name: 'root', children: sorted};
  const root = d3.hierarchy(first).sum(d => size(d.weight));
  treemap(root);
  if (!root.children) return [];
  root.children.forEach(d => {
    d.left = padX / 2 + Math.round(d.x0 * ratio);
    d.top = padY / 2 + Math.round(d.y0);

    d.width = Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - padX / 2;
    d.height = Math.round(d.y1) - Math.round(d.y0) - padY / 2;
  });

  return root.children;
  // const padY = 10;
  // const padX = 20;
}

export default function TagCloud({className, style, children, ...props}) {
  const treemapData = makeTreemap(props);

  return (
    <div className={className} style={style}>
      {treemapData.map((d, i) => children({...d, ...d.data}, i))}
    </div>
  );
}
