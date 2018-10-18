import React from 'react';
import {AppContainer} from 'react-hot-loader';
import ReactDOM from 'react-dom';

import WebFont from 'webfontloader';
// import WebfontLoader from '@dr-kobros/react-webfont-loader';

// import 'bootstrap/dist/css/bootstrap.min.css';
//
// // import 'papercss/dist/paper.css';
// import 'papercss/src/styles.less';
// // import 'papercss/src/fonts.less';
// // import 'papercss/src/tables.less';
// // import 'papercss/src/buttons.less';
// // import 'papercss/src/colors.less';
// // import 'papercss/src/forms.less';
// // import 'papercss/src/borders.less';
//
// import 'font-awesome/css/font-awesome.css';
//
// import './styles/global/annotation.scss';
// import './styles/global/index.scss';
import Routes from './Routes';

// import Routes from './Routes';

import './styles/tailwind.css';
import './styles/index.scss';
// import CV from './components/CV';

const WebFontConfig = {
  // custom: {
  //   families: [ 'young', 'typeWriter'],
  //   urls: ['./styles/font.css']
  // },
  google: {
    families: ['Frijole', 'Concert One', 'Slackey', 'Bowlby One SC']
  }
};

WebFont.load(WebFontConfig);

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
};

if (module.hot) {
  module.hot.accept('./Routes', () => {
    console.log('hot');
    render(Routes);
  });
}
render(Routes);

// console.log('module ', module.hot ? 'hot' : 'cold');
//
// if (module.hot) {
//   module.hot.accept('./Routes', () => {
//     render(Routes);
//   });
// }
