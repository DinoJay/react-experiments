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

const QuotesAndNotesPage = ({data}) => {
  const gridStyle = {
    display: 'grid',
    gridGap: 10,
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    // grid-auto-flow: column
    gridAutoFlow: 'row',
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

  useEffect(() => {
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
  }, []);

  console.log('rowSpans', rowSpans);

  return (
    <div className="h-full w-full overflow-y-auto">
      <div ref={gridRef} className="m-2" style={gridStyle}>
        {data.reverse().map(d => (
          <div
            className="border-2 border p-2 overflow-hidden"
            ref={itemRefs[d.id]}
            style={
              rowSpans[d.id] !== null
                ? {
                  boxShadow: '4px 4px grey',
                  gridRow: `span ${rowSpans[d.id]}`
                }
                : {}
            }>
            <div ref={contentRefs[d.id]} className="overflow-hidden">
              <h3>{d.title}</h3>
              <div>{d.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesAndNotesPage;
