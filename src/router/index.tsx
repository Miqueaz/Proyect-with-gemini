import { createBrowserRouter } from 'react-router-dom';
import * as Pages from '../pages/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Pages.Index />,
  },
  {
    path: '/mind-voice',
    element: <Pages.MindVoiceDashboard />,
  },
  {
    path: '/mind-voice/doc',
    element: <Pages.MindVoiceDocument />,
  },
  {
    path: '*',
    element: <h1>Not found</h1>,
  },
]);
