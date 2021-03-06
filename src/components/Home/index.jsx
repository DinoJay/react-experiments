// import * as d3 from 'd3-jetpack/build/d3v4+jetpack';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import {timeFormat, timeParse, timeYear, timeMonth, timeDay} from 'd3';
// import _ from 'lodash';
import AboutVis from './AboutVis';
import style from '../styles/postcard.scss';
import cx from './home.scss';

import beerIcon from './pics/beer-icon.png';
import coffeeIcon from './pics/take-away.svg';
import jsLogo from './pics/js_logo.svg';
import reactLogo from './pics/react_logo.svg';
import d3Logo from './pics/d3_logo.svg';
import vinylIcon from './pics/music.svg';
import headphonesIcon from './pics/headphones.svg';
import astroIcon from './pics/astro.png';

import PixelPic from './PixelPic';

const ft = '%d/%m/%Y';
const formatTime = timeFormat(ft);
const parseTime = timeParse(ft);
const birthdate = parseTime('26/04/1988');
const todayDate = new Date();
const thisYearBdate = parseTime(`26/04/${new Date().getFullYear()}`);
const BelgiumArrivalDate = parseTime('22/09/2013');

const SocialMedia = () => (
  <ul className={style.socialMedia}>
    <li>
      <a href="">Email</a>
    </li>
    <li>
      <a href="">Facebook</a>
    </li>
    <li>
      <a href="">Twitter</a>
    </li>
  </ul>
);

class Dimensions extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = {width: 0, height: 0};

  componentDidMount() {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;
    this.setState({width, height});
  }

  render() {
    const {children, className} = this.props;
    const {width, height} = this.state;
    return (
      <div ref={n => (this.node = n)} className={`w-full h-full ${className}`}>
        {children(width, height)}
      </div>
    );
  }
}

class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
  };

  state = {textWidth: 0, textHeight: 0};

  render() {
    const {children, width, height, className, style} = this.props;
    const {textWidth, textHeight} = this.state;

    return (
      <div
        style={{fontFamily: 'kongtext', fontStyle: 'italic', ...style}}
        className={`${cx.balloon} ${cx['from-right']} p-2`}>
        Alright...
      </div>
    );
  }
}

const SomethingAboutMe = ({className}) => (
  <div className={className}>
    <h3 className="mb-2">Something about me</h3>
    <p className="text-lg">
      PhD student, orginally from Germany, (
      {timeYear.count(birthdate, timeYear.offset(todayDate, -1))} years{' and '}
      {timeMonth.count(timeYear.offset(thisYearBdate, -1), todayDate)} in
      Belgium for almost {timeYear.count(BelgiumArrivalDate, todayDate)} years
      now. Getting my head around research, programming and languages. Drinking
      cappucino in the morning, jogging and doing Diss-co music in the evening.
      As part of my day job I work on data visualization and educational games!
    </p>
  </div>
);

const MyTable = ({className}) => (
  <table className={className}>
    <tr>
      <th className="flex">
        <div>__Day__ </div>
        <span role="img" aria-label="emoji" className={cx.emoji}>
          🌇
        </span>
      </th>
      <th>
        **Night**{' '}
        <span role="img" aria-label="emoji" className={cx.emoji}>
          🌃
        </span>
      </th>
    </tr>
    <tr>
      <td>
        <div>Gazing at </div>
        <div role="img" aria-label="emoji" className={cx.emoji}>
          💻
        </div>
      </td>
      <td>
        <span role="img" aria-label="emoji" className={cx.emoji}>
          🏃
        </span>{' '}
        in park
      </td>
    </tr>
    <tr>
      <td>
        Visualizing data{' '}
        <span role="img" aria-label="emoji" className={cx.emoji}>
          📊
        </span>
      </td>
      <td className="flex items-center">
        <img
          alt="headphones"
          style={{width: '33px', height: '33px'}}
          src={headphonesIcon}
        />{' '}
        <img
          alt="mixing"
          style={{width: '33px', height: '33px'}}
          src={vinylIcon}
        />
        <div className="pl-1 pr-1">music</div>
        <span role="img" aria-label="emoji" className={cx.emoji}>
          😎
        </span>
      </td>
    </tr>
    <tr>
      <td>
        getting lost in hyperspace{' '}
        <img
          style={{width: '33px', height: '33px'}}
          alt="astro"
          src={astroIcon}
        />
      </td>
      <td>scratching my head about real life </td>
    </tr>
    <tr>
      <td>
        fiddling with{' '}
        <img
          alt="js"
          src={jsLogo}
          style={{
            width: '22px',
            height: '22px',
            verticalAlign: 'top'
          }}
        />
        {' ,'}
        <img
          alt="react"
          src={reactLogo}
          style={{
            width: '22px',
            height: '22px',
            verticalAlign: 'top'
          }}
        />{' '}
        and{' '}
        <img
          src={d3Logo}
          alt="d3"
          style={{
            width: '22px',
            height: '22px',
            verticalAlign: 'top',
          }}
        />
      </td>
      <td>learning French and Dutch, forgetting German</td>
    </tr>
    <tr>
      <td>
        <img
          style={{width: '33px', height: '33px'}}
          alt="coffee"
          src={coffeeIcon}
        />{' '}
        Bonjour
      </td>
      <td>
        <img
          style={{width: '33px', height: '33px'}}
          alt="beer"
          src={beerIcon}
        />{' '}
        Prost!
      </td>
    </tr>
  </table>
);
const Home = ({width, height, picDim}) => (
  <div className="flex-grow flex flex-col">
    <div className={cx.header}>
      <div className={`${cx.branding} font-mono p-10`}>
        <h3>Vrije Universiteit Brussel</h3>
        <h1 className="text-4xl">Jan Maushagen</h1>
        <SocialMedia />
      </div>
      <div
        style={{right: 0, paddingRight: 20}}
        className={`${cx.portrait} flex items-start absolute`}>
        <Tooltip style={{transform: 'translateY(0px)'}} />
        <div className={cx.polaroid}>
          <PixelPic
            width={picDim.width}
            height={picDim.height}
            pixelSize={picDim.pixelSize}
          />
        </div>
      </div>
    </div>
    <div className="flex flex-grow">
      <div className="flex-grow flex flex-col justify-between">
        <SomethingAboutMe className="text-base mb-5" />
        <MyTable className={`text-lg ${cx.myTable}`} />
      </div>
      <div className="flex-grow" id={style.interests} style={{flex: '0 0 50%'}}>
        <h3>Interests</h3>
        <Dimensions>{(w, h) => <AboutVis width={w} height={h} />}</Dimensions>
      </div>
    </div>
  </div>
);
export default Home;
