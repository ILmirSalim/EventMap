import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import { Root } from './components/Root';
import store from './redux/store/store'
import CreateEvent from './pages/CreateEvent/CreateEvent';
import DetailEvent from './pages/DetailEvent/DetailEvent';
import SearchEvent from './pages/SearchEvent/SearchEvent';
import UserProfile from './pages/UserProfile/UserProfile';
import { PostDetail } from './components/EventDetail';


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
        element: <PostDetail/>,
      },
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
