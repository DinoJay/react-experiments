import React, {useState, useEffect} from 'react';

import QuotesAndNotesPage from './QuotesNotesPage';
import defaultData from '../RecordCollection/dummyData';

export default () => (
  <QuotesAndNotesPage data={defaultData.map(d => ({...d, id: d.title}))} />
);
