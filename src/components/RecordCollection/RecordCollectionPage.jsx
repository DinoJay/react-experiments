import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

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
    className={`${className} p-2`}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={{
      ...style
    }}>
    <img
      src={img}
      alt=""
      style={{
        background: `url(${VinylIcon}) center center no-repeat`,
        objectFit: 'cover',
        height: '100%',
        width: '100%'
      }}
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

const RecordStack = ({
  stackConf,
  data,
  selectedIndex,
  className,
  onMouseOver,
  onMouseOut,
  recHeight,
  recWidth
}) => (
  <div className="overflow-hidden">
    <Stack {...stackConf} data={data} selectedIndex={selectedIndex}>
      {ch => (
        <Record
          {...ch}
          key={ch.id}
          className={className}
          style={{
            height: recHeight,
            width: recWidth
          }}
          onMouseOver={onMouseOver(ch)}
          onMouseOut={onMouseOut}
          img={ch.thumb}
        />
      )}
    </Stack>
  </div>
);

const HookedColl = props => {
  const {
    recHeight = 170,
    recWidth = 170,
    width,
    height,
    pad,
    data,
    tags
  } = props;
  const [selectedId, setSelectedId] = useState(null);
  const [filterSet, setFilterSet] = useState([]);
  const relateTags = set =>
    uniq(
      data.reduce(
        (acc, d) => (isSubset(d.styles, set) ? [...acc, ...d.styles] : acc),
        [],
      ),
    );
  const relatedTags = relateTags(filterSet);

  const filterRecs = s =>
    data.filter(d => isSubset(s, d.styles) || s.length === 0);

  const filteredData = filterRecs(filterSet);

  const countMap = (filterSet.length > 0
    ? relatedTags
    : tags.map(d => d.key)
  ).reduce((acc, d) => {
    const plusNumRec =
      filterRecs([...filterSet, d]).length - filteredData.length;

    return {
      ...acc,
      [d]:
        filterSet.includes(d) || filterSet.length === 0
          ? filterRecs([d]).length
          : `Δ${plusNumRec}`,
    };
  }, {});

  console.log(
    'countMap',
    countMap,
    'filteredDatalen',
    filteredData.length,
    'relatedTags',
    relatedTags,
  );

  const stackBorder = Math.ceil(filteredData.length / 2);
  const selectedRecord = data.find(d => d.id === selectedId) || null;
  const highlightedTags = selectedRecord ? selectedRecord.styles : [];
  const selectedRecIds = filteredData
    .filter(d => isSubset(d.styles, highlightedTags))
    .map(d => d.id);

  const selectedIndex = filteredData.findIndex(d => d.id === selectedId);

  const firstIndex =
    selectedIndex !== -1 && selectedIndex < stackBorder ? selectedIndex : null;

  const secIndex =
    selectedIndex !== -1 && selectedIndex >= stackBorder
      ? selectedIndex - stackBorder
      : null;

  const firstItems = filteredData.slice(0, stackBorder);
  const secItems = filteredData.slice(stackBorder);

  const cloudHeight = height - 2 * recHeight - 2 * pad;

  const stackConf = {
    centered: false,
    duration: 400,
    width,
    unit: 'px',
    height: 200,
    slotSize: recWidth,
  };

  // const treemapData = makeTreemap({
  //   data: styles,
  //   width,
  //   height: cloudHeight,
  //   padX: 5,
  //   padY: 5,
  // });

  const onMouseOver = d => () => {
    if (firstItems.find(e => e.id === d.id)) {
      if (firstItems.length > 4) setSelectedId(d.id);
    }
    if (secItems.length > 4) setSelectedId(d.id);
  };

  const onMouseOut = () => {
    setSelectedId(null);
  };

  const imgFilterClass = chId =>
    selectedId !== chId ? 'sepia-img-filter' : 'sepia-img-filter-disabled';

  const highlight = chId =>
    selectedRecIds.includes(chId)
      ? 'sepia-img-filter'
      : 'sepia-img-filter-disabled';

  const sharedStackConf = {
    stackConf,
    selectedId,
    onMouseOver,
    onMouseOut,
    recHeight,
    recWidth
  };

  const StackOne = (
    <RecordStack
      data={firstItems}
      selectedIndex={firstIndex}
      {...sharedStackConf}
    />
  );

  const StackTwo = (
    <RecordStack
      data={secItems}
      selectedIndex={secIndex}
      {...sharedStackConf}
    />
  );

  const stackDim = {height: recHeight};

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
          onHover={d => console.log('yeah', d)}>
          {(d, i) => (
            <Tag
              count={countMap[d.key]}
              highlighted={
                isSubset([d.key], highlightedTags) ||
                isSubset(filterSet, [d.key])
              }
              visible={
                relatedTags.length === 0 || isSubset(relatedTags, [d.key])
              }
              onClick={() => {
                setFilterSet(
                  filterSet.includes(d.key)
                    ? filterSet.filter(k => k !== d.key)
                    : filterSet.concat(d.key),
                );
              }}
              onMouseEnter={() => {
                console.log('yeah');
              }}
              onMouseLeave={() => null}
              className={`border-${(i % 6) + 1}x`}
              {...d}
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
