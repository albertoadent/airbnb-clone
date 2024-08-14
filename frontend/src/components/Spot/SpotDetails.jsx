import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";

export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(({ spots }) => spots.spotDetails[spotId]);

  useEffect(() => {
    dispatch(spotActions.getSpotDetails(spotId));
  }, [dispatch,spotId]);

  if (!spot) {
    return <h1>Spot not found</h1>;
  }

  return (
    <div
      className="spot_details"
      style={{ width: "100%", borderRadius: "5px" }}
    >
      {/* <h1 className="title">Welcome! to spot detail</h1> */}
      <h2 className="spot_name title">{spot.name}</h2>
      <h3>
        Location: {spot.city} {spot.state} {spot.country}
      </h3>
      <img
        className="spot_preview_image"
        src={spot.previewImage}
        style={{ width: "50%", borderRadius: "5px" }}
      />
      {spot.SpotImages?.length > 0 ? (
        spot.SpotImages.slice(0, 4).map((image, index) => (
          <img
            key={index}
            className="spot_image"
            src={image.url}
            alt={`Spot Image ${index}`}
            style={{ width: "50%", borderRadius: "5px" }}
          />
        ))
      ) : (
        <p>No additional images available</p>
      )}
      <text>
        Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
      </text>
      <p className="spot_description">{spot.description}</p>
      <div className="spot_price">{spot.price} per night</div>
      {/* <Link to={`/spots/${spotId}/reserve`}> */}
      <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      {/* </Link> */}
      <div className="spot_rating">Rating: {spot.avgRating}</div>
    </div>
  );
}
