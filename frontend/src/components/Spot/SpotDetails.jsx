import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import { FaStar } from "react-icons/fa";
import "./SpotDetails.css";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../Review/ReviewForm";
import DeleteReview from "../Review/DeleteReview";

const numColumns = 6;
const ratio = 2 / 3;

const gridLayout = new Array(numColumns).fill("1fr").join(" ");
const spanFistHalf = { gridColumn: `1/${numColumns / 2 + 1}` };
const spanSecondHalf = {
  gridColumn: `${numColumns / 2 + 1}/${numColumns + 1}`,
};
const span3Quarts = {
  gridColumn: `1/${Math.ceil(ratio * numColumns) + 1}`,
};
const spanLastQuart = {
  gridColumn: `${Math.ceil(ratio * numColumns) + 1}/${numColumns + 1}`,
};

const styleGrid = (
  { firstHalf, secondHalf, firstQuarters, lastQuarters },
  row
) => {
  if (firstHalf) return { ...spanFistHalf, gridRowStart: row };
  if (secondHalf) return { ...spanSecondHalf, gridRowStart: row };
  if (firstQuarters) return { ...span3Quarts, gridRowStart: row };
  if (lastQuarters) return { ...spanLastQuart, gridRowStart: row };
};

const MONTHS = [
  "UNDEFINED",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SpotDetails() {
  const { spotId } = useParams();
  let dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);
  const { user } = useSelector((state) => state.session);
  const id = (user && user.id) || undefined;
  const [refresh, setRefresh] = useState(0);

  function ReviewDisplay({ className }) {
    if (!spot) return;
    return (
      <div className={className}>
        <FaStar /> {(spot?.avgRating && spot?.avgRating.toFixed(1)) || "New"}{" "}
        {spot?.Reviews?.length > 0 ? (
          <span style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              •{" "}
            </span>
            {spot.Reviews[1] ? `${spot?.Reviews?.length} Reviews` : "1 Review"}
          </span>
        ) : null}
      </div>
    );
  }
  useEffect(() => {
    console.log("refreshed");
    dispatch(spotActions.getSpotDetails(spotId));
  }, [dispatch, spotId, refresh]);

  if (!spot) {
    return <h1>Spot not found</h1>;
  }

  return (
    <div className="spot-details" style={{ gridTemplateColumns: gridLayout }}>
      <h2 className="spot-name" style={styleGrid({ firstHalf: true }, 1)}>
        {spot.name}
      </h2>
      <div></div>
      <h3 className="location" style={styleGrid({ firstHalf: true }, 2)}>
        {spot.city}, {spot.state}, {spot.country}
      </h3>
      <div></div>
      <div className="primary-image" style={styleGrid({ firstHalf: true }, 3)}>
        <div className="image-wrapper">
          <img className="spot-preview-image" src={spot.previewImage} />
        </div>
      </div>
      <div
        className="secondary-images"
        style={styleGrid({ secondHalf: true }, 3)}
      >
        {spot.SpotImages?.length > 1 ? (
          spot.SpotImages.slice(1, 5).map((image, index) => (
            <div key={index} className="image-wrapper">
              <img
                key={index}
                className="spot_image"
                src={image.url}
                alt={`Spot Image ${index}`}
                style={{ width: "100%", borderRadius: "5px" }}
              />
            </div>
          ))
        ) : (
          <p>No additional images available</p>
        )}
      </div>

      <div className="spot-info" style={styleGrid({ firstQuarters: true }, 4)}>
        {user && user.id === spot.ownerId ? (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <text
              style={{
                whiteSpace: "pre-wrap",
              }}
              className="rating-title"
            >
              Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName + " "}
              <Link to={`/spots/${spotId}/edit`}>Edit My Spot</Link>
            </text>
          </div>
        ) : (
          <text className="title">
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </text>
        )}

        <p className="spot-description">{spot.description}</p>
      </div>

      <div className="spot-price" style={styleGrid({ lastQuarters: true }, 4)}>
        {[
          spot && (
            <div className="price-tag">
              <span>${spot?.price.toFixed(2)}</span> night
            </div>
          ),
          <ReviewDisplay key={"display"} className="rating" />,
          <button
            key={"reserve"}
            className="reserve"
            onClick={() => alert("Feature coming soon")}
          >
            Reserve
          </button>,
        ]}
      </div>
      {user &&
        !spot.Reviews?.filter((review) => review.userId === id)[0] &&
        Number(id) !== spot.id && (
          <div style={{ ...styleGrid({ firstHalf: true }, 5), width: "100%" }}>
            <OpenModalButton
              buttonText="Post Your Review"
              onModalClose={() => setRefresh((p) => ++p)}
              modalComponent={<ReviewForm spotId={spot.id} />}
            />
          </div>
        )}
      <div className="spot-ratings">
        <ReviewDisplay className="rating rating-title" />
        {spot.Reviews?.[0] &&
          spot.Reviews.map(
            (
              {
                id,
                review,
                stars,
                createdAt,
                userId,
                User: { firstName = "" } = {},
              },
              index
            ) => {
              console.log(createdAt);
              const [year, month] = (createdAt || "0-").split("-");
              return (
                <div key={index} className="review-display">
                  <h3
                    className="star-rating"
                    style={{ whiteSpace: "pre-wrap" }}
                  >{`${firstName || user?.firstName}\n${
                    MONTHS[Number(month)]
                  } ${year}`}</h3>
                  <p className="review">{review}</p>
                  <div>
                    {(firstName === user?.firstName || !firstName) && (
                      <div>
                        <OpenModalButton
                          buttonText="DELETE"
                          onModalClose={() => setRefresh((p) => ++p)}
                          modalComponent={<DeleteReview reviewId={id} />}
                        />
                        <OpenModalButton
                          buttonText="EDIT"
                          onModalClose={() => setRefresh((p) => ++p)}
                          modalComponent={
                            <ReviewForm
                              spotId={spot.id}
                              review={{ id, review, stars, userId }}
                            />
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}
