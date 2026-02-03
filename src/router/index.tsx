import { createBrowserRouter, RouterProvider } from 'react-router';
import App from '../App';
import Game from '../pages/Game';
import Stats from '../pages/Stats';
import Achievements from '../pages/Achievements';

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { index: true, element: <Game /> },
    { path: 'stats', element: <Stats /> },
    { path: 'achievements', element: <Achievements /> }
  ]
}]);

export default function Router() { return <RouterProvider router={router} />; }
