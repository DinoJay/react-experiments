import React, {useState, useEffect} from 'react';
import sortBy from 'lodash/sortBy';

import {wrapGrid} from 'animate-css-grid';

function resizeGridItem({grid, item}) {
  const rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'),
  );
  // console.log('rowHeight', rowHeight);
  const rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-row-gap'),
  );
  // console.log('item scrollHeight', item.scrollHeight);
  const rowSpan = Math.ceil(
    (item.scrollHeight + rowGap) / (rowHeight + rowGap),
  );
  // console.log('clientrect', content.getBoundingClientRect().height);
  // console.log('rowSpan', rowSpan);
  return rowSpan;
  // item.style.gridRowEnd = `span ${rowSpan}`;
}
// allItems = document.getElementsByClassName("item");
// for(x=0;x<allItems.length;x++){
//    imagesLoaded( allItems[x], resizeInstance);
// }

const MixtapesPage = ({data}) => {
  const [id, setId] = useState(null);
  const [scrollPos, setScrollPos] = useState(null);
  const gridStyle = {
    display: 'grid',
    gridGap: 15,
    gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
    gridAutoFlow: 'row dense',
    gridAutoRows: id === null ? 10 : null,
    gridTemplateRows: id !== null ? '1fr' : null,
    height: scrollPos > 0 && id === null ? scrollPos : null
  };

  const [rowSpans, setRowSpans] = useState(
    data.reduce((d, acc) => ({...acc, [d.id]: null}), {}),
  );
  const gridRef = React.createRef();
  const scrollRef = React.createRef();
  const contentRefs = data.reduce(
    (acc, d) => ({...acc, [d.id]: React.createRef()}),
    {},
  );
  const itemRefs = data.reduce(
    (acc, d) => ({...acc, [d.id]: React.createRef()}),
    {},
  );

  const filteredData =
    id !== null ? data.filter(d => d.id === id) : sortBy(data, d => d.id);

  console.log('data', data);
  useEffect(() => {
    wrapGrid(gridRef.current, {
      // easing: 'backOut',
      stagger: 10,
      duration: 100,
    });
  }, []);

  // const itemRef = React.createRef();

  useEffect(
    () => {
      const newRowSpans = filteredData.reduce(
        (acc, d) => ({
          ...acc,
          [d.id]: resizeGridItem({
            grid: gridRef.current,
            item: itemRefs[d.id].current
          }),
        }),
        {},
      );
      setRowSpans(newRowSpans);
    },
    [data.length],
  );

  useEffect(() => {
    scrollRef.current.scrollTop = scrollPos;
  });

  return (
    <div
      className="h-full w-full overflow-x-hidden overflow-y-auto"
      ref={scrollRef}>
      <div ref={gridRef} className="m-2 " style={gridStyle}>
        {filteredData.reverse().map(d => (
          <div
            key={d.id}
            onClick={() => {
              d.id === id ? setId(null) : setId(d.id);
              const tmpScrollTop = scrollRef.current.scrollTop;
              if (id === null) setScrollPos(tmpScrollTop);
            }}
            className="border border-grey p-5 overflow-hidden"
            ref={itemRefs[d.id]}
            style={{
              boxShadow: '4px 4px lightgrey',
              gridRow:
                id === null && rowSpans[d.id] && `span ${rowSpans[d.id]}`
            }}>
            <div className="relative">
              <div className="absolute">
                <div className="m-2 ">
                  <h3 className="p-1 bg-white">{d.name}</h3>
                </div>
              </div>
              <img
                className={`${id !== null ? 'hidden' : null}`}
                src={d.pictures.medium}
                style={{width: '100%', height: 200, objectFit: 'cover'}}
              />
              <img
                className={`${id === null ? 'hidden' : null}`}
                src={d.pictures.large}
                style={{width: '100%', height: 500, objectFit: 'cover'}}
              />
              {id !== null && (
                <iframe
                  width="100%"
                  height="60"
                  src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${
                    d.key
                  }`}
                  frameBorder="0"
                />
              )}
              <div className="m-1 overflow-hidden" style={{}}>
                {d.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MixtapesPage;
