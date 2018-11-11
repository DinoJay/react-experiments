import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import flatten from 'lodash/flatten';
// import $ from 'jquery';

import TagCloud from '../Bookmarks/TagCloud';

import Stack from './Stack/Stack';
// import d3Sketchy from '../../lib/d3.sketchy';
// import SketchyCircle from './SketchyCircle';

import cxx from './CardStack.scss';

import VinylIcon from './styles/disc-vinyl-icon.png';

// import Modal from '../utils/Modal';
const Record = ({title, tags, img, width, height, highlight, uri, ...rest}) => (
  <div
    {...rest}
    style={{
      zIndex: 2,
      background: `url(${VinylIcon}) center center no-repeat`,
      boxShadow:
        '0 5px 2px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.3)'
    }}>
    <img src={img} alt="" width="100%" height="100%" />
  </div>
);

// <a target="_blank" href={uri}>
// function delay(milliseconds) {
//   return function(result) {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(result);
//       }, milliseconds);
//     });
//   };
// }

// wait(100000).then(() => console.log('four', 4));

function makeTreemap({data, width, height, padX, padY}) {
  const ratio = 4;
  const sorted = data.sort((a, b) => b.count - a.count);
  const treemap = d3
    .treemap()
    .size([width / ratio, height])
    .paddingInner(0)
    .round(true)
    .tile(d3.treemapSquarify.ratio(1));

  const size = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.count))
    .range([20, 50]);

  const first = {name: 'root', children: sorted};
  const root = d3.hierarchy(first).sum(d => size(d.count));
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

const drawPath = d3.line().curve(d3.curveStepAfter);

function resetState({tags, firstItems, secItems}) {
  return {
    tags: tags.map(d => {
      d.hover = false;
      return d;
    }),
    firstItems: firstItems.map(d => {
      d.highlighted = true;
      d.hovered = false;
      return d;
    }),
    secItems: secItems.map(d => {
      d.highlighted = true;
      d.hovered = false;
      return d;
    }),
  };
}

function aggregateByTags(data) {
  const spreadData = flatten(
    data.map(d =>
      d.tags.map(t => {
        const copy = _.cloneDeep(d);
        copy.key = t;
        return copy;
      }),
    ),
  );
  return d3
    .nest()
    .key(d => d.key)
    .entries(spreadData)
    .map(d => {
      d.count = d.values.length;
      return d;
    });
}

const Frame = ({
  highlighted,
  hovered,
  position,
  onMouseEnter,
  onMouseLeave,
  onMouseOut,
  children,
}) => (
  <div
    className="absolute"
    style={{
      opacity: highlighted ? 1 : 0.1,
      pointerEvents: 'auto',
      position: 'absolute',
      zIndex: hovered ? 1000 : null,
      transition: `0.2s left, 0.2s background-position, 0.1s border-color, 0.2s opacity, 0.5s transform`,
      transform: hovered ? 'scale(1.2)' : null,

      ...position,
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}>
    {children}
  </div>
);

Frame.propTypes = {
  position: PropTypes.string,
  // hoverHandler: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  highlighted: PropTypes.bool,
  hovered: PropTypes.bool,
  // index: PropTypes.number.isRequired
};

Frame.defaultProps = {
  hovered: false,
  position: null,
  pos: 0,
  highlighted: false,
  children: <Record />,
};

function layout({index = null, data, frameOffset, width}) {
  const scale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width - frameOffset / 2]);

  if (index === null || index < 0) {
    return data.map((c, i) => ({...c, hovered: false, pos: scale(i)}));
  }

  const xFirstLeft = d3
    .scaleLinear()
    .domain([0, index - 1])
    .range([0, d3.max([scale(index) - frameOffset / 2, 0])]);

  const xFirstRight = d3
    .scaleLinear()
    .domain([index + 1, data.length - 1])
    .range([
      d3.min([scale(index) + frameOffset / 2, width - frameOffset / 2]),
      width - frameOffset / 2,
    ]);

  return data.map((c, i) => {
    if (index < i) {
      return {...c, hovered: false, pos: xFirstRight(i)};
    }
    if (index > i) {
      return {...c, hovered: false, pos: xFirstLeft(i)};
    }
    if (index === i) {
      c.hovered = true;
      c.pos = scale(i);
      return {...c, hovered: true, pos: scale(i)};
    }
    return c;
  });
}

function init({data, frameOffset, width}) {
  const firstItems = layout({
    data: data.slice(0, data.length / 2),
    frameOffset,
    width,
  }).map(d => {
    d.first = true;
    d.highlighted = true;
    return d;
  });
  const secItems = layout({
    data: data.slice(data.length / 2),
    frameOffset,
    width,
  }).map(d => {
    d.first = false;
    d.highlighted = true;
    return d;
  });
  return {firstItems, secItems};
}

export default class MyRecordColl extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array.isRequired,
    frameOffset: PropTypes.number,
    cardWidth: PropTypes.number,
  };

  static defaultProps = {
    width: 800,
    height: 600,
    cardWidth: 150,
    cardHeight: 150,
    frameOffset: 200,
    offsetY: 20,
  };

  state = {selectedIndex: null, mode: null};
  // hoverHandler = focussedFrame => {
  //   const {data, cardWidth, width} = this.props;
  //   const {treemapData: oldTreemapData} = this.state;
  //   const frameOffset = cardWidth * 2;
  //
  //   const highlight = d => {
  //     d.highlighted = _.intersection(d.tags, focussedFrame.tags).length > 0;
  //     return d;
  //   };
  //
  //   if (focussedFrame === null) {
  //     const treemapData = oldTreemapData.map(t => {
  //       t.highlighted = false;
  //       return t;
  //     });
  //     this.setState({...init({data, frameOffset, width}), treemapData});
  //     return;
  //   }
  //   //
  //   // const treemapData = oldTreemapData.map(t => {
  //   //   t.highlighted = focussedFrame.tags.includes(t.data.key);
  //   //   return t;
  //   // });
  //
  //   const treemapData = oldTreemapData.map(t => {
  //     t.highlighted = focussedFrame.tags.includes(t.data.key);
  //     return t;
  //   });
  //
  //   const selectedIndex = data.findIndex(d => d.uri === focussedFrame.uri);
  //
  //   // this.setState({selectedIndex, hovered: true, treemapData});
  // };
  // shouldComponentUpdate() {
  //   return false;
  // }

  // enterTag = key => {
  //   if (key === null) this.setState(resetState);
  //
  //   const {tags, firstItems, secItems} = resetState(this.state);
  //
  //   const clonedTags = _.cloneDeep(tags).map(d => {
  //     d.hover = d.key === key;
  //     return d;
  //   });
  //   const highlight = d => {
  //     d.highlighted = d.tags.includes(key);
  //     return d;
  //   };
  //   const updFirstItems = firstItems.map(highlight);
  //   const updSecItems = secItems.map(highlight);
  //
  //   this.setState({
  //     tags: clonedTags,
  //     firstItems: updFirstItems,
  //     secItems: updSecItems,
  //   });
  // };

  leaveTag = () => {
    this.setState(resetState);
  };

  render() {
    const {
      cardHeight,
      cardWidth,
      width,
      height,
      pad,
      offsetY,
      data
    } = this.props;

    const {selectedIndex, clicked} = this.state;
    console.log('selectedIndex', selectedIndex);

    const {firstItems, secItems} = init({
      data,
      frameOffset: 2 * cardWidth,
      width,
    });

    const cloudHeight = height - 2 * cardHeight - 2 * pad;

    const tags = aggregateByTags(data).map(d => {
      // TODO: check;
      d.r = 25 + d.values.length;
      d.width = d.r * 2;
      d.height = d.r * 2;
      d.highlighted = false;
      d.x = (width - d.r) / 2;
      d.y = height / 2;
      return d;
    });

    const stackConf = {
      centered: false,
      duration: 400,
      width,
      unit: 'px',
      height: 100,
      slotSize: 150,
    };

    const treemapData = makeTreemap({
      data: tags,
      width,
      height: cloudHeight,
      padX: 20,
      padY: 20,
    });

    const StackOne = (
      <Stack
        {...stackConf}
        data={firstItems}
        selectedIndex={selectedIndex}
        centered={clicked}>
        {(ch, i) => (
          <Record
            onMouseOver={() =>
              selectedIndex !== i && this.setState({selectedIndex: i, clicked: false})
            }
            onMouseOut={() =>
              selectedIndex !== i && this.setState({selectedIndex: null, clicked: false})
            }
            onClick={() => this.setState({selectedIndex: i, clicked: true})}
            width={cardWidth}
            height={cardHeight}
            img={ch.thumb}
            {...ch}
          />
        )}
      </Stack>
    );

    const StackTwo = (
      <Stack
        centered={false}
        duration={400}
        selectedIndex={selectedIndex}
        unit="px"
        width={width}
        height={100}
        slotSize={150}
        data={secItems}>
        {(ch, i) => (
          <Record
            width={cardWidth}
            height={cardHeight}
            img={ch.thumb}
            {...ch}
          />
        )}
      </Stack>
    );

    // const { width, height } = this.props;
    const stackDim = {height: cardHeight};

    const tagCloudStyle = {
      position: 'relative',
      height: `${cloudHeight}px`,
      marginBottom: `${pad}px`,
      marginTop: `${pad}px`,
    };

    const linksTop = flatten(
      firstItems.map(c => {
        const targets = treemapData.filter(t => c.tags.includes(t.data.key));
        const l = targets.map(t => ({
          order: c.first,
          source: c,
          target: t,
        }));
        return l;
      }),
    );
    const PathsTop = linksTop.map(d => {
      const source = {
        x: d.source.pos + cardWidth / 2,
        y: cardHeight,
      };
      const cp = [source.x, source.y + offsetY];
      const target = [
        d.target.left + d.target.width / 2,
        cardHeight + pad + d.target.top,
      ];
      return (
        <path
          className={cxx.link}
          d={drawPath([[source.x, source.y], cp, target])}
        />
      );
    });

    const linksBottom = flatten(
      secItems.map(c => {
        const targets = treemapData.filter(t => c.tags.includes(t.data.key));
        const l = targets.map(t => ({
          order: c.first,
          source: c,
          target: t,
        }));
        return l;
      }),
    );

    const PathsBottom = linksBottom.map(d => {
      const source = {
        x: d.source.pos + cardWidth / 2,
        y: height - cardHeight,
      };
      const cp = [source.x, source.y - offsetY];
      const target = [
        d.target.left + d.target.width / 2,
        cardHeight + pad + d.target.top + d.target.height,
      ];
      return (
        <path
          className={cxx.link}
          d={drawPath([[source.x, source.y], cp, target])}
        />
      );
    });

    return (
      <div className="relative">
        <svg
          className="absolute"
          style={{
            pointerEvents: 'none',
            width: `${width}px`,
            height: `${height}px`,
            left: 0,
            top: 0,
          }}>
          <defs />
          <g>{PathsTop}</g>
          <g>{PathsBottom}</g>
        </svg>
        <div style={stackDim}>{StackOne}</div>
        <div style={tagCloudStyle}>
          <TagCloud
            data={treemapData}
            width={width}
            height={cloudHeight}
            padX={0}
            padY={0}
            onHover={d => console.log('yeah', d)}
          />
        </div>
        <div style={stackDim}>
          <div className={`row ${cxx.stack}`}>{StackTwo}</div>
        </div>
      </div>
    );
  }

  // <text
  //   textAnchor="middle"
  //   stroke="#51c5cf"
  //   strokeWidth="1px"
  //   dy=".3em"
  //   style={{ fontSize: '15px', stroke: 'black' }}
  // >
  //   {t.key}
  // </text>
}
