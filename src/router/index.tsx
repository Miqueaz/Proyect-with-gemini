import { createBrowserRouter } from 'react-router-dom';
import * as Pages from '../pages/index';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Pages.Index/>,
  },
  {
    path: '*',
    element: <h1>Not found</h1>,
  },
]);
