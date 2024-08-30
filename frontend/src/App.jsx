import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import SpotDetails from "./components/Spot/SpotDetails";
import MySpots from "./components/Spot/MySpots/MySpots";
import * as sessionActions from "./store/session";
import HomePage from "./components/HomePage";
import FeatureComingSoon from "./components/FeatureComingSoon";
import CreateSpot from "./components/Spot/CreateSpot/CreateSpot";
import UpdateSpot from "./components/Spot/UpdateSpot/UpdateSpot";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "comingSoon",
        element: <FeatureComingSoon />,
      },
      {
        path: "create-spot",
        element: <CreateSpot />,
      },
      {
        path: "spots",
        element: <Navigate to="/"></Navigate>,
      },
      {
        path: "my-spots",
        element: <MySpots />,
      },
      {
        path: "spots/:spotId",
        children: [
          {
            index: true,
            element: <SpotDetails />,
          },
          {
            path: "reserve",
            element: <FeatureComingSoon />,
          },
          {
            path: "edit",
            element: <UpdateSpot />,
          },
        ],
      },
      {
        path: "*",
        element: (
          <div>
            <h1 className="title">404 page not found</h1>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
