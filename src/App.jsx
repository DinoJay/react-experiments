// import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import cxx from './components/app.scss';

import Home from './components/Home';
import Collage from './components/Collage';
// import Bookmarks from './Bookmarks';
// import LongIslandGirls from './components/LongIslandGirls';
import RecordCollection from './components/RecordCollection';
import Projects from './components/Projects';
import CV from './components/CV';
import ScreenshotDiary from './components/ScreenshotDiary';
// import Nav from './components/Nav';
// import cxx from './components/cxx/nav.scss';
// import './global/annotation.scss';
// import './global/index.scss';

const SMALL_HEIGHT = 670;
const SMALL_WIDTH = 890;

const BIG_WIDTH = 1000;
const BIG_HEIGHT = 770;

const selectElement = (path, pr) => {
  switch (path) {
    case '/':
      return <Home {...pr} />;
    case '/CV':
      return <CV {...pr} />;
    case '/Collage':
      return <Collage {...pr} />;
    case '/RecordCollection':
      return <RecordCollection {...pr} />;
    case '/Projects':
      return <Projects {...pr} />;
    case '/ScreenshotDiary':
      return <ScreenshotDiary {...pr} />;
    default:
      return <div>Unknown path</div>;
  }
};

const resize = win => {
  let width;
  let height;
  let picDim = {pixelSize: 1};
  if (win.innerWidth > 1500) {
    width = BIG_WIDTH;
    height = BIG_HEIGHT;
    picDim = {...picDim, width: 108, height: 113, marginLeft: 50};
  } else {
    width = SMALL_WIDTH;
    height = SMALL_HEIGHT;
    picDim = {...picDim, width: 85, height: 90, marginLeft: 70};
  }
  return {width, height, picDim};
};

const Nav = ({clickHandler}) => (
  <div className={cxx.list}>
    <ul>
      <li>
        <a onClick={clickHandler} href="/">
          Home <small>(...is where I want to be)</small>
        </a>
      </li>
      <li>
        <a onClick={clickHandler} href="/CV">
          CV <small>(my so called adult life)</small>
        </a>
      </li>
      <li>
        <a onClick={clickHandler} href="/Collage">
          Collage <small>(friends and spaces)</small>
        </a>
      </li>
      <li>
        <a onClick={clickHandler} href="/RecordCollection">
          Record Collection
        </a>
      </li>
      <li>
        <a onClick={clickHandler} href="/ScreenshotDiary">
          Screenshot Diary{' '}
          <small>(my unfinished ramblings when the day is over)</small>
        </a>
      </li>
      <li className="hidden">
        <a onClick={clickHandler} href="/Projects">
          Blog <small>(projects, mixtapes and other stuff - unfinished)</small>
        </a>
      </li>
    </ul>
  </div>
);

class App extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  };

  static defaultProps = {
    path: '/'
  };

  constructor(props) {
    super(props);
    const {path} = props;
    this.clickHandler = this.clickHandler.bind(this);

    this.state = {
      path,
      oldPath: path,
      back: false,
      ...resize(window)
    };

    window.addEventListener('resize', () => {
      this.setState(resize(window));
    });
  }

  // componentWillReceiveProps({ path: newPath }) {
  //   this.setState({
  //     path: newPath,
  //     oldPath: this.props.path,
  //     back: !this.state.back
  //   });
  // }

  clickHandler(event) {
    event.preventDefault(); // Let's stop this event.
    event.stopPropagation(); // Really this time.
    const path = event.currentTarget.getAttribute('href');
    if (this.state.path !== path) {
      const currentPath = event.currentTarget.getAttribute('href');
      window.history.pushState(path, path, `#${currentPath}`);
      this.setState(oldState => ({
        path,
        oldPath: oldState.path,
        back: !oldState.back
      }));
    }
  }

  render() {
    const {width, height, picDim, path, oldPath, back} = this.state;
    const pathString = p => (p.substring(1) === '' ? 'Home' : p.substring(1));

    const pad = 20;

    const comProps = {
      width: width - pad * 2,
      height: height - pad * 2,
      picDim,
      lessData: width === SMALL_WIDTH
    };
    const ActiveElement = selectElement(path, comProps);
    const PassiveElement = selectElement(oldPath, comProps);
    const marginTop = 20;

    return (
      <div
        className="container m-4 flex w-screen h-screen"
        style={{marginTop: `${marginTop}px`}}>
        <div className={cxx.navCont}>
          <div className={`${cxx.nav} border-3`}>
            <div className={cxx.title}>
              <span>Jan Maushagen</span>&nbsp;/&nbsp; <br /> {pathString(path)}
            </div>
            <Nav clickHandler={this.clickHandler} />
          </div>
        </div>
        <div id={cxx.right} className={`${cxx.mainCont} flex flex-col`}>
          <div className={`${cxx.flipContainer} flex-grow flex flex-col`}>
            <div
              className={`${cxx.flipper} flex-grow flex flex-col`}
              style={{
                transformOrigin: `100% ${comProps.height / 2 + marginTop}px`,
                transform: back ? 'rotateX(180deg)' : null,
                zIndex: back ? 3 : null,
              }}>
              <div
                className={`${cxx.front} flex flex-col overflow-visible`}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  zIndex: back ? -1 : null,
                }}>
                <div>{!back ? ActiveElement : PassiveElement}</div>
              </div>
              <div
                className={`${cxx.back} flex flex-col overflow-visible`}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  // TODO
                  // zIndex: !back ? -1 : null
                }}>
                <div className={cxx.passiveElement}>
                  {back ? ActiveElement : PassiveElement}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
