// import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';

import PropTypes from 'prop-types';
import cxx from './components/app.scss';
import {
  INDEX,
  CV,
  COLLAGE,
  RECORDCOLLECTION,
  PROJECTS,
  SCREENSHOTS,
  QUOTES_AND_NOTES,
  MIXTAPES
} from './routePaths';

const SMALL_HEIGHT = 690;
const SMALL_WIDTH = 990;

const BIG_WIDTH = 1100;
const BIG_HEIGHT = 720;

const selectElement = (path, pr) => {
  switch (path) {
    case INDEX.path:
      return <INDEX.Comp {...pr} />;
    case CV.path:
      return <CV.Comp {...pr} />;
    case COLLAGE.path:
      return <COLLAGE.Comp {...pr} />;
    case RECORDCOLLECTION.path:
      return <RECORDCOLLECTION.Comp {...pr} />;
    case PROJECTS.path:
      return <PROJECTS.Comp {...pr} />;
    case SCREENSHOTS.path:
      return <SCREENSHOTS.Comp {...pr} />;
    case QUOTES_AND_NOTES.path:
      return <QUOTES_AND_NOTES.Comp {...pr} />;
    case MIXTAPES.path:
      return <MIXTAPES.Comp {...pr} />;
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

const Nav = ({clickHandler, path, className}) => {
  const pathString = p => (p.substring(1) === '' ? 'Home' : p.substring(1));
  return (
    <div className={className}>
      <div className="mb-12 text-2xl">
        <h3 className="">Jan Maushagen</h3>
        <div className="text-xl">/ {pathString(path)}</div>
      </div>
      <div className={`${cxx.list} text-xl`}>
        <ul>
          <li>
            <a onClick={clickHandler} className="" href={INDEX.path}>
              Home <small className="hidden">(...is where I want to be)</small>
            </a>
          </li>
          <li>
            <a onClick={clickHandler} href={CV.path}>
              CV <small className="hidden">(my so called adult life)</small>
            </a>
          </li>
          <li>
            <a onClick={clickHandler} href={COLLAGE.path}>
              Collage <small className="hidden">(friends and spaces)</small>
            </a>
          </li>
          <li>
            <a onClick={clickHandler} href={RECORDCOLLECTION.path}>
              Record Collection
            </a>
          </li>
          <li>
            <a onClick={clickHandler} href={SCREENSHOTS.path}>
              Work in Progress{' '}
              <small className="hidden">
                (my unfinished ramblings when the day is over)
              </small>
            </a>
          </li>
          <li className="">
            <a onClick={clickHandler} href={QUOTES_AND_NOTES.path}>
              Blog{' '}
            </a>
          </li>
          <li className="">
            <a onClick={clickHandler} href={MIXTAPES.path}>
              Mixtapes{' '}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

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
        <div>
          <Nav
            className={`${cxx.nav} p-8 mr-10 font-mono`}
            path={path}
            clickHandler={this.clickHandler}
          />
        </div>
        <div style={{width, height}}>
          <div className={`${cxx.flipContainer}`} style={{width}}>
            <div
              className={`${cxx.flipper} w-full`}
              style={{
                transformOrigin: `100% ${comProps.height / 2 + marginTop}px`,
                width,
                height,
                transform: back ? 'rotateX(180deg)' : null,
                zIndex: back ? 3 : null,
              }}>
              <div
                className={`${cxx.front} w-full`}
                style={{zIndex: back ? -1 : null, width, height}}>
                {!back ? ActiveElement : PassiveElement}
              </div>
              <div className={`${cxx.back} w-full`} style={{width, height}}>
                {back ? ActiveElement : PassiveElement}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// function Example() {
//   // Declare a new state variable, which we'll call "count"
//   const [count, setCount] = useState(0);
//
//   return (
//     <div>
//       <p>You clicked {count} times</p>
//       <button onClick={() => setCount(count + 1)}>Click me</button>
//     </div>
//   );
// }

export default App;
