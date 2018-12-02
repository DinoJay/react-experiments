import React, {useState} from 'react';
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
      ...style
    }}>
    <img
      style={{
        boxShadow:
          '0 5px 2px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.3)'
      }}
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

const HookedColl = props => {
  const {cardHeight = 150, cardWidth = 150, width, height, pad, data} = props;
  const [selectedId, setSelectedId] = useState(null);

  const stackBorder = Math.ceil(data.length / 2);
  const selectedRecord = data.find(d => d.id === selectedId);
  const selectedTags = [];

  const selectedIndex = data.findIndex(d => d.id === selectedId);

  const firstIndex =
    selectedIndex !== -1 && selectedIndex < stackBorder ? selectedIndex : null;

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
    slotSize: cardWidth,
  };

  // const treemapData = makeTreemap({
  //   data: tags,
  //   width,
  //   height: cloudHeight,
  //   padX: 5,
  //   padY: 5,
  // });

  const onMouseOver = id => () => {
    setSelectedId(id);
  };

  const onMouseOut = () => setSelectedId(null);

  const onClick = id => () => null;

  const StackOne = (
    <Stack {...stackConf} data={firstItems} selectedIndex={firstIndex}>
      {ch => (
        <Record
          key={ch.id}
          onMouseOver={() => {
            console.log('yo', ch.id);
            setSelectedId(ch.id);
          }}
          onMouseOut={onMouseOut}
          style={{height: cardHeight, width: 160}}
          img={ch.thumb}
          {...ch}
        />
      )}
    </Stack>
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
};

export default HookedColl;
