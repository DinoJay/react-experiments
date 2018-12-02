import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
// import $ from 'jquery';

import TagCloud, {Tag} from '../Bookmarks/TagCloud';

import Stack from './Stack/Stack';
// import d3Sketchy from '../../lib/d3.sketchy';
// import SketchyCircle from './SketchyCircle';

// import cxx from './CardStack.scss';

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
  onMouseOver,
  onMouseOut,
  ...rest
}) => (
  <div
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={{
      zIndex: 2,
      background: `url(${VinylIcon}) center center no-repeat`,
      boxShadow:
        '0 5px 2px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.3)',
      ...style
    }}>
    <img
      src={img}
      alt=""
      style={{objectFit: 'cover', height: '100%', width: '100%'}}
    />
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

  state = {selectedId: null, mode: null};

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

    const stackBorder = Math.ceil(data.length / 2);
    const {selectedId} = this.state;
    const selectedRecord = data.find(d => d.id === selectedId) || {tags: []};

    const {tags: selectedTags} =
      selectedRecord !== null ? selectedRecord : {tags: []};

    console.log('selectedTags', selectedTags);
    const selectedIndex = data.findIndex(d => d.id === selectedId);

    const firstIndex =
      selectedIndex !== -1 && selectedIndex < stackBorder
        ? selectedIndex
        : null;

    const secIndex =
      selectedIndex !== -1 && selectedIndex >= stackBorder
        ? selectedIndex - stackBorder
        : null;

    const firstItems = data.slice(0, stackBorder);
    const secItems = data.slice(stackBorder);

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

    // const treemapData = makeTreemap({
    //   data: tags,
    //   width,
    //   height: cloudHeight,
    //   padX: 5,
    //   padY: 5,
    // });

    const onMouseOver = id => () => {
      this.setState({
        selectedId: id,
        selectedTags: data.find(d => d.id === id).tags
      });
    };

    const onMouseOut = () => false && this.setState({selectedId: null});

    const onClick = id => () => null;

    const StackOne = (
      <Stack {...stackConf} data={firstItems} selectedIndex={firstIndex}>
        {ch => (
          <Record
            key={ch.id}
            onMouseOver={onMouseOver(ch.id)}
            onMouseOut={onMouseOut}
            style={{height: cardHeight, width: cardWidth}}
            img={ch.thumb}
            {...ch}
          />
        )}
      </Stack>
    );

    console.log(
      'selectedIndex',
      selectedIndex,
      'firstIems len',
      firstItems.length,
    );
    const StackTwo = (
      <Stack {...stackConf} data={secItems} selectedIndex={secIndex}>
        {(ch, i) => (
          <Record
            key={ch.id}
            onMouseOver={onMouseOver(ch.id)}
            onMouseOut={onMouseOut}
            onClick={onClick(i)}
            style={{height: cardHeight, width: cardWidth}}
            img={ch.thumb}
            {...ch}
          />
        )}
      </Stack>
    );

    // const { width, height } = this.props;
    const stackDim = {height: cardHeight};

    return (
      <div>
        <div style={stackDim}>{StackOne}</div>
        <div className="relative">
          <TagCloud
            style={{
              position: 'relative',
              height: cloudHeight,
              marginBottom: pad,
              marginTop: pad,
            }}
            data={tags}
            width={width}
            height={cloudHeight}
            padX={10}
            padY={10}
            onHover={d => console.log('yeah', d)}
            onClick={() => null}>
            {d => (
              <Tag
                {...d}
                style={{background: isSubset(d.tags, selectedTags && 'black')}}
              />
            )}
          </TagCloud>
        </div>
        <div style={stackDim}>{StackTwo}</div>
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
