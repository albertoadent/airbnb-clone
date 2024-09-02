import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotActions from "../../../store/spots";
import "../../HomePage/HomePage.css";
import { Link } from "react-router-dom";
import "../../HomePage/SpotDisplay/SpotDisplay.css";
import { FaStar } from "react-icons/fa";
import "./MySpots.css";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpot from "./DeleteSpot";

function SpotDisplay({ spot }) {
  return (
    <div>
      <Link className="spot_display" to={`/spots/${spot.id}`} title={spot.name}>
        <img
          className="spot_image"
          src={
            spot.previewImage ||
            "https://atlas-content-cdn.pixelsquid.com/stock-images/simple-house-NxE5a78-600.jpg"
          }
        />
        <div className="spot_info">
          <div style={{ gridColumnStart: "1", textAlign: "left" }}>
            {spot.city}
          </div>
          <div
            style={{
              gridColumnStart: "1",
              gridRowStart: "2",
              textAlign: "left",
            }}
          >
            {spot.state}
          </div>
          <div
            style={{ gridColumn: "2", textAlign: "center", fontWeight: "bold" }}
          >
            ${spot.price}
            <span className="price-label">/night</span>
          </div>
          {(spot.avgRating && (
            <div
              style={{
                gridRow: "2",
                gridColumn: "2",
                textAlign: "center",
                color: "rgb(55, 55, 107)",
                fontWeight: "bold",
              }}
            >
              <FaStar />
              {spot.avgRating}
            </div>
          )) || (
            <div
              style={{
                gridRow: "2",
                gridColumn: "2",
                textAlign: "center",
                color: "rgb(55, 55, 107)",
                fontWeight: "bold",
              }}
            >
              New
            </div>
          )}
        </div>
      </Link>
      <div
        className="actions"
        style={{ display: "flex", alignSelf: "baseline" }}
      >
        <Link to={`/spots/${spot.id}/edit`}>Update</Link>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteSpot spotId={spot.id} />}
        ></OpenModalButton>
      </div>
    </div>
  );
}

function MySpots() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(spotActions.getMySpots());
  }, [dispatch]);

  const spots = useSelector((state) => state.spots);
  const user = useSelector((state) => state.session.user);
  const mySpots = Object.values(spots)
    .filter((spot) => spot?.ownerId === user.id)
    .map((spot) => <SpotDisplay key={spot.id} spot={spot}></SpotDisplay>);
  return (
    <div>
      <h1 className="title">Manage Spots</h1>
      <div className="spot_display_wrapper" style={{}}>
        {user && mySpots.length ? (
          mySpots
        ) : (
          <div className="actions">
            <Link to={"/create-spot"}>Create a New Spot</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MySpots;
