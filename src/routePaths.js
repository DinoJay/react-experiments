import Home from './components/Home';
import Collage from './components/Collage';

import RecordCollection from './components/RecordCollection';
import Projects from './components/Projects';
import Cv from './components/CV';
import ScreenshotDiary from './components/ScreenshotDiary';

export const INDEX = {path: '/', Comp: Home};
export const CV = {path: '/cv', Comp: Cv};
export const COLLAGE = {path: '/collage', Comp: Collage};
export const RECORDCOLLECTION = {
  path: '/record-collection',
  Comp: RecordCollection
};
export const PROJECTS = {path: '/projects', Comp: Projects};
export const SCREENSHOTS = {path: '/screenshot-diary', Comp: ScreenshotDiary};
