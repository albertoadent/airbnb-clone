import { useDispatch, useSelector } from "react-redux";
import SpotDisplay from "./SpotDisplay/SpotDisplay";
import { useEffect } from "react";
import * as spotActions from "../../store/spots";
import "./HomePage.css";

function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(spotActions.getSpots());
  }, [dispatch]);

  const spots = useSelector((state) => state.spots);
  return (
    <div className="display-container">
      <div className="spot_display_wrapper" style={{}}>
        {Object.values(spots).map((spot) => (
          <SpotDisplay key={spot?.id} spot={spot}></SpotDisplay>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
