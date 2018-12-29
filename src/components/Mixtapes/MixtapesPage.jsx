import React, {useState, useEffect} from 'react';

function resizeGridItem({grid, item, content}) {
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
  const gridStyle = {
    display: 'grid',
    gridGap: 30,
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridAutoFlow: 'row dense',
    gridAutoRows: 10
  };

  const [rowSpans, setRowSpans] = useState(
    data.reduce((d, acc) => ({...acc, [d.id]: null}), {}),
  );
  const gridRef = React.createRef();
  const contentRefs = data.reduce(
    (acc, d) => ({...acc, [d.id]: React.createRef()}),
    {},
  );
  const itemRefs = data.reduce(
    (acc, d) => ({...acc, [d.id]: React.createRef()}),
    {},
  );
  // const itemRef = React.createRef();

  useEffect(
    () => {
      const newRowSpans = data.reduce(
        (acc, d) => ({
          ...acc,
          [d.id]: resizeGridItem({
            grid: gridRef.current,
            item: itemRefs[d.id].current,
            content: contentRefs[d.id].current
          })
        }),
        {},
      );
      console.log('newRowSpans', newRowSpans);
      setRowSpans(newRowSpans);
    },
    [data.length],
  );

  console.log('rowSpans', rowSpans);

  return (
    <div className="h-full w-full overflow-y-auto">
      <div ref={gridRef} className="h-full m-2" style={gridStyle}>
        {data.reverse().map(d => (
          <div
            key={d.id}
            className="border border-grey p-5 overflow-hidden"
            ref={itemRefs[d.id]}
            style={{
              boxShadow: '4px 4px lightgrey',
              gridRow: rowSpans[d.id] && `span ${rowSpans[d.id]}`,
            }}>
            <div className="relative">
              <div className="absolute">
                <div className="m-2 ">
                  <h3 className="p-1 bg-white">{d.name}</h3>
                </div>
              </div>
              <img
                src={d.pictures.medium}
                style={{width: '100%', height: 200, objectFit: 'cover'}}
              />
            </div>
            <div className="overflow-hidden" style={{maxHeight: 200}}>
              {d.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MixtapesPage;
