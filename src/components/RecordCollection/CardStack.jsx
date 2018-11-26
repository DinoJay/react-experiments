import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
// import $ from 'jquery';

import TagCloud from '../Bookmarks/TagCloud';

import Stack from './Stack/Stack';
// import d3Sketchy from '../../lib/d3.sketchy';
// import SketchyCircle from './SketchyCircle';

import cxx from './CardStack.scss';

import VinylIcon from './styles/disc-vinyl-icon.png';

const isSubset = (t0, t1) => {
  const ret = intersection(t0, t1).length > 0;
  return ret;
};

// import Modal from '../utils/Modal';
const Record = ({
  title,
  tags,
  img,
  width,
  height,
  highlight,
  uri,
  style,
  ...rest
}) => (
  <div
    {...rest}
    style={{
      zIndex: 2,
      height: 140,
      background: `url(${VinylIcon}) center center no-repeat`,
      boxShadow:
        '0 5px 2px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.3)',
      ...style
    }}>
    <img src={img} alt="" style={{objectFit: 'cover', height: '100%'}} />
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
    .entries(spreadData);
}

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

function init({data, selectedIndex, frameOffset, width}) {
  const firstItems = layout({
    data: data.slice(0, data.length / 2),
    index: selectedIndex,
    frameOffset,
    width,
  }).map(d => {
    d.first = true;
    d.highlighted = true;
    return d;
  });
  const secItems = layout({
    data: data.slice(data.length / 2),
    index: selectedIndex,
    frameOffset,
    width,
  }).map(d => {
    d.first = false;
    d.highlighted = true;
    return d;
  });
  return {firstItems, secItems};
}

export default class MyRecordCollection extends React.Component {
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
    const selectedRecord = selectedIndex !== null ? data[selectedIndex] : null;
    const {tags: selectedTags} =
      selectedRecord !== null ? selectedRecord : {tags: []};

    const selectedData =
      selectedTags.length > 0
        ? data.filter(d => isSubset(d.tags, selectedTags))
        : data;

    const {firstItems, secItems} = init({
      data,
      index: selectedIndex,
      frameOffset: 2 * cardWidth,
      width,
    });

    const cloudHeight = height - 2 * cardHeight - 2 * pad;

    const tags = aggregateByTags(data).map(d => {
      const selected = isSubset([d.key], selectedTags);
      return {...d, selected, weight: d.values.length};
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
      padX: 5,
      padY: 5,
    });

    const onMouseOver = i => () =>
      selectedIndex !== i && this.setState({selectedIndex: i});

    const onMouseOut = i => () =>
      selectedIndex !== i && this.setState({selectedIndex: null});

    const onClick = i => () => this.setState({selectedIndex: i});

    const StackOne = (
      <Stack
        {...stackConf}
        data={firstItems}
        selectedIndex={selectedIndex < firstItems.length ? selectedIndex : null}
        centered={false}>
        {(ch, i) => (
          <Record
            key={i}
            onMouseOver={onMouseOver(i)}
            onMouseOut={onMouseOut(i)}
            onClick={onClick(i)}
            width={cardWidth}
            height={cardHeight}
            style={{height: cardHeight}}
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
        selectedIndex={selectedIndex > firstItems.length ? selectedIndex : null}
        unit="px"
        width={width}
        slotSize={150}
        data={secItems}>
        {(ch, i) => (
          <Record
            height={cardHeight}
            img={ch.thumb}
            onMouseOver={onMouseOver(i)}
            onMouseOut={onMouseOut(i)}
            onClick={onClick(i)}
            style={{height: cardHeight}}
            {...ch}
          />
        )}
      </Stack>
    );

    // const { width, height } = this.props;
    const stackDim = {height: cardHeight};

    const tagCloudStyle = {
      position: 'relative',
      height: cloudHeight,
      marginBottom: pad,
      marginTop: pad,
    };


    return (
      <div>
        <div style={stackDim}>{StackOne}</div>
        <div className="relative">
          <div style={tagCloudStyle}>
            <TagCloud
              data={treemapData}
              width={width}
              height={cloudHeight}
              padX={10}
              padY={10}
              onHover={d => console.log('yeah', d)}
              onClick={() => null}
            />
          </div>
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
