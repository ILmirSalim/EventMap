import React from 'react';
import App from './App';
import './index.css';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateEvent from './pages/CreateEvent/CreateEvent';
import DetailEvent from './pages/DetailEvent/DetailEvent';
import SearchEvent from './pages/SearchEvent/SearchEvent';
import UserProfile from './pages/UserProfile/UserProfile';
import { EventCard } from './components/EventCard/index';
import AuthComponent from './components/Auth';
import { Root } from './components/Root';
import store from './redux/store/store'
import UpdateEvent from './components/UpdateEvent';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/create-event",
        element: <CreateEvent />,
      },
      {
        path: "/detail-event",
        element: <DetailEvent />,
      },
      {
        path: "/search-event",
        element: <SearchEvent />,
      },
      {
        path: "/user-profile",
        element: <UserProfile />,
      },
      {
        path: "/event/:id",
        element: <EventCard />,
      },
      {
        path: "/authorization",
        element: <AuthComponent />,
      },
      {
        path: "/updateEvent/:id",
        element: <UpdateEvent />,
      }
    ],
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
