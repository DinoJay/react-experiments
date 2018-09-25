import React from 'react';
import * as d3 from 'd3';
import tsnejs from 'tsne';
import _ from 'lodash';

// import { bboxCollide } from '../utils/helper';
import tpStyle from './styles/tooltip.scss';

import { bboxCollide } from 'd3-bboxCollide';
import { forceSurface } from 'd3-force-surface';

import { Motion, spring } from 'react-motion';

// import getSets from './tagGraph';
// import rawBookmarks from './diigo.json';

// import iconStyle from './styles/fileicon.css';

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - (min + 1))) + min;
// }

class Bookmarks extends React.Component {
  static propTypes() {
    return {
      docWidth: React.PropTypes.array.isRequired,
      docHeight: React.PropTypes.array.isRequired,
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);

    const { data, width, height } = props;
    const nodes = data.map(d => ((d.x = width / 2), (d.y = height / 2), d));
    this.state = {
      dists: [],
      sets: [],
      nodes
    };
  }

  componentDidMount() {
    this.componentWillReceiveProps.bind(this)(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { data, width, height, docWidth, docHeight } = nextProps;
    const dists = data.map(a =>
      data.map(b => _.difference(a.tags, b.tags).length)
    );

    const nodes = data.map(d => ((d.x = width / 2), (d.y = height / 2), d));

    const padX = docWidth * 2;
    const padY = docHeight * 2;
    const bbox = [
      {
        from: { x: padX, y: padY },
        to: { x: padX, y: height - padY }
      },
      {
        from: { x: padX, y: height - padY },
        to: { x: width - padX, y: height - padY }
      },
      {
        from: { x: width - padX, y: height - padY },
        to: { x: width - padX, y: padY }
      },
      {
        from: { x: width - padX, y: padY },
        to: { x: padX, y: padY }
      }
    ];
    // [
    //         width / 2 - height / 2 + margin,
    //         width / 2 + height / 2 - margin
    //       ]
    const centerx = d3.scaleLinear().range([bbox[0].from.x, bbox[1].to.x]);
    const centery = d3.scaleLinear().range([bbox[0].from.y, bbox[1].to.y]);

    const model = new tsnejs.tSNE({
      dim: 2,
      perplexity: 100
      // epsilon: 20
    });

    // initialize data with pairwise distances
    model.initDataDist(dists);

    const forcetsne = d3
      .forceSimulation(nodes)
      .alphaDecay(0.01)
      .alpha(0.3)
      .force('tsne', alpha => {
        // every time you call this, solution gets better
        model.step();

        // Y is an array of 2-D points that you can plot
        const pos = model.getSolution();

        centerx.domain(d3.extent(pos.map(d => d[0])));
        centery.domain(d3.extent(pos.map(d => d[1])));

        forcetsne.nodes().forEach((d, i) => {
          d.x += alpha * (centerx(pos[i][0]) - d.x);
          d.y += alpha * (centery(pos[i][1]) - d.y);
        });
      })
      // .force('collide', d3.forceCollide().radius(docWidth / 2).strength(1))
      .force(
        'collide',
        bboxCollide(() => {
          const pad = 0;
          return [
            [-docWidth / 2 - pad, -docHeight / 2 - pad],
            [docWidth / 2 + pad / 2, docHeight / 2 + pad]
          ];
        }).strength(0.05)
      )
      .force(
        'container',
        forceSurface()
          .elasticity(0)
          .surfaces(bbox)
          .oneWay(true)
          .radius(docHeight)
      )
      // .strength(0.01)
      .on('end', () => {
        // const nodes = forcetsne.nodes();
        // const sets = getSets(nodes);
        // docHeight;
        // .sort((a, b) => d3.descending(a.values.length, b.values.length));

        this.setState({ nodes: forcetsne.nodes() });
      });

    // const node = d3.select('#front').node();
    // console.log('Front', node);
    // const bbox = node.getBoundingClientRect();
    // const width = bbox.width;
    // const height = bbox.height;
    this.setState({ nodes: forcetsne.nodes() });
  }
  componentDidUpdate() {}

  render() {
    const { nodes } = this.state;
    const { width, height, docWidth, docHeight, color, sets } = this.props;
    const style = {
      position: 'absolute',
      // background: 'blue'
      width: `${docWidth}px`,
      height: `${docHeight}px`
      // borderRadius: '50%',
      // backgroundImage: `url("${iconBackground}")`
    };
    const iconPadding = -2;
    const Docs = nodes.map(d =>
      <Motion
        defaultStyle={{ left: width / 2, top: height / 2 }}
        style={{
          left: spring(d.x + docWidth / 2),
          top: spring(d.y + docHeight / 2)
        }}
      >
        {({ left, top }) =>
          <div style={{ ...style, left: `${left}px`, top: `${top}px` }}>
            <div className={tpStyle.tooltip}>
              <i
                className="fa fa-file-text-o"
                style={{
                  fontSize: `${docHeight}px`,
                  fontWeight: 'bold',
                  transform: `translateY(${iconPadding}px)`
                  // paddingBottom: '20px'
                  // position: 'absolute',
                  // left: `${docWidth / 2}px`,
                  // top: `${-docHeight}px`
                }}
              />
              <span className={tpStyle.tooltiptext}>
                {d.tags.join(',')}
              </span>
            </div>
          </div>}
      </Motion>
    );
    const Bubbles = sets.map(s =>
      <g id={`bubble ${s.key}`}>
        {s.values.map(d =>
          (<Motion
            defaultStyle={{ left: width / 2, top: height / 2 }}
            style={{
              left: spring(d.x + docWidth),
              top: spring(d.y + docHeight)
            }}
          >
            {({ left, top }) =>
              <circle
                style={{ fill: color(s.key) }}
                onClick={() => console.log(d)}
                // opacity={0.9}
                r={docWidth}
                cx={left}
                cy={top}
              />}
          </Motion>)
        )}
      </g>
    );

    const Bubbles2 = sets.map(s =>
      <g id={`bubble ${s.key}`}>
        {s.values.map(d =>
          <circle
            style={{ fill: '#E5E4E2' }}
            r={docWidth * 2}
            cx={d.x + docWidth}
            cy={d.y + docHeight}
          />
        )}
      </g>
    );
    const svgStyle = {
      pointerEvents: 'none',
      width: `${width}px`,
      height: `${height}px`,
      position: 'absolute',
      left: 0,
      top: 0
    };

    return (
      <div>
        <svg style={svgStyle}>
          <defs>
            <filter id="gooeyCodeFilter">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                colorInterpolationFilters="sRGB"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="gooey"
              />
            </filter>
          </defs>

          <g style={{ filter: 'url( "#gooeyCodeFilter")' }}>
            {Bubbles2}
          </g>

          <g style={{ filter: 'url( "#gooeyCodeFilter")' }}>
            {Bubbles}
          </g>
        </svg>
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: 'black solid'
          }}
        >
          {Docs}
        </div>
      </div>
    );
  }
}

Bookmarks.defaultProps = {
  radius: 5,
  docWidth: 14,
  docHeight: 16,
  width: 400,
  height: 300
};

export default Bookmarks;

// WEBPACK FOOTER //
// ./src/components/Bookmarks/TagMap.jsx
