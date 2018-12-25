import React, {useState, useEffect} from 'react';
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

import VinylIcon from './styles/disc-vinyl-icon.png';

const isSubset = (t0, t1) => {
  const ret = intersection(t0, t1).length > 0;
  return ret;
};

// import Modal from '../utils/Modal';
const Record = ({
  title,
  styles,
  img,
  width,
  height,
  highlight,
  uri,
  style,
  onMouseOver,
  onMouseOut,
  className,
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
      className={className}
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
      d.styles.map(t => {
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
  const {
    cardHeight = 150,
    cardWidth = 150,
    width,
    height,
    pad,
    data,
    tags
  } = props;
  const [selectedId, setSelectedId] = useState(null);

  const stackBorder = Math.ceil(data.length / 2);
  const selectedRecord = data.find(d => d.id === selectedId) || null;
  const selectedTags = selectedRecord ? selectedRecord.styles : [];
  const selectedRecIds = data
    .filter(d => isSubset(d.styles, selectedTags))
    .map(d => d.id);

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

  const stackConf = {
    centered: false,
    duration: 400,
    width,
    unit: 'px',
    height: 100,
    slotSize: cardWidth,
  };

  // const treemapData = makeTreemap({
  //   data: styles,
  //   width,
  //   height: cloudHeight,
  //   padX: 5,
  //   padY: 5,
  // });

  const onMouseOver = d => () => {
    setSelectedId(d.id);
  };

  const onMouseOut = () => {
    setSelectedId(null);
  };

  const onClick = id => () => null;

  const imgFilterClass = chId =>
    selectedId !== chId ? 'sepia-img-filter' : 'sepia-img-filter-disabled';

  const highlight = chId =>
    selectedRecIds.includes(chId)
      ? 'sepia-img-filter'
      : 'sepia-img-filter-disabled';

  const StackOne = (
    <Stack {...stackConf} data={firstItems} selectedIndex={firstIndex}>
      {ch => (
        <Record
          key={ch.id}
          className={highlight(ch.id)}
          onMouseOver={onMouseOver(ch)}
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
          className={highlight(ch.id)}
          onMouseOver={onMouseOver(ch)}
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
  console.log('selectedTags', selectedTags, 'selectedCards', selectedRecIds);

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
          {(d, i) => (
            <Tag
              className={`border-${(i % 6) + 1}x ${isSubset(
                [d.key],
                selectedTags,
              ) && 'bg-black'}`}
              {...d}
              textStyle={{color: isSubset([d.key], selectedTags) && 'white'}}
            />
          )}
        </TagCloud>
      </div>
      <div style={stackDim}>{StackTwo}</div>
    </div>
  );
};

const RecordCollectionWrapper = ({data, ...rest}) => {
  const tags = aggregateByTags(data).map(d => ({
    ...d,
    weight: d.values.length,
  }));

  return <HookedColl {...rest} data={data} tags={tags} />;
};

export default RecordCollectionWrapper;
