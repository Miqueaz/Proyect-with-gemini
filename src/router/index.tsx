import { createBrowserRouter } from 'react-router-dom';
import * as Pages from '../pages/index';
import * as MindVoice from '../../src_test';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Pages.Index />,
  },
  // {
  //   path: '/mindvoice',
  //   element: <MindVoice />,
  // },
  {
    path: '*',
    element: <h1>Not found</h1>,
  },
]);
