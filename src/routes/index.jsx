import { lazy } from 'react';
import Incident from '../page/Incidents';
// import Login from '../page/Login';

// Lazy load pages
const App = lazy(() => import('../App'));
const Dashboard = lazy(() => import('../page/Dashboard'));
const Login = lazy(() => import('../page/Login'));


export const routes = [
  {
    path: '',
    private: false,
    element: <Login />,
  },
  {
    path: '/chat',
    private: false,
    element: <Dashboard />,
  },
  {
    path: '/home',
    private: false,
    element: <App />,
  },
  {
    path: '/incidents',
    private: false,
    element: <Incident />,
  },
  {
    path: '*',
    element: <div className='h-[100vh] w-[100vw] flex flex-col items-center justify-center'>
      <h1 className='text-6xl font-bold'>
        404
      </h1>
      <h5 className='text-3xl'>
        Page Not Found.
      </h5>
    </div>,
  }
];
