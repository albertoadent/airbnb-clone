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
  const Reviews = useSelector((state) => state.reviews);
  const [spotReviews, setSpotReviews] = useState(
    Object.values(Reviews).filter((rev) => rev.spotId == spotId)
  );
  const [avgReviews, setAvgReviews] = useState("New");
  const { user } = useSelector((state) => state.session);
  const id = (user && user.id) || null;

  const getAvgReviews = () => {
    const revs = [...spotReviews];
    if (!revs[0]) {
      return "New";
    }
    let count = 0;
    const sum = revs?.reduce((sum, { stars }) => {
      count++;
      return sum + Number(stars);
    }, 0);
    return (sum / count).toFixed(1);
  };

  useEffect(() => {
    dispatch(spotActions.getSpotDetails(spotId));
  }, [dispatch]);

  useEffect(() => {
    setAvgReviews(getAvgReviews());
  }, [spotReviews]);

  useEffect(() => {
    setSpotReviews(
      Object.values({ ...Reviews }).filter(({ spotId: id }) => id == spotId)
    );
  }, [Reviews]);

  function ReviewDisplay({ className }) {
    if (!spot) return;
    return (
      <div className={className}>
        <FaStar /> {avgReviews}{" "}
        {spotReviews.length > 0 ? (
          <span style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              •{" "}
            </span>
            {spotReviews[1] ? `${spotReviews.length} Reviews` : "1 Review"}
          </span>
        ) : null}
      </div>
    );
  }

  let secondaryImages = spot?.SpotImages?.flatMap(({ preview, url }, i) =>
    !preview ? (
      <div key={i} className="image-wrapper">
        <img
          key={i}
          className="spot_image"
          src={url}
          alt={`Spot Image ${i}`}
          style={{ width: "100%", borderRadius: "5px" }}
        />
      </div>
    ) : (
      []
    )
  );

  if (Array.isArray(secondaryImages) && !secondaryImages[0]) {
    secondaryImages = undefined;
  }

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
          <img
            className="spot-preview-image"
            src={
              spot.previewImage ||
              "https://atlas-content-cdn.pixelsquid.com/stock-images/simple-house-NxE5a78-600.jpg"
            }
          />
        </div>
      </div>
      <div
        className="secondary-images"
        style={styleGrid({ secondHalf: true }, 3)}
      >
        {secondaryImages || <p>No additional images available</p>}
      </div>
      <div className="spot-info" style={styleGrid({ firstQuarters: true }, 4)}>
        <div style={{ display: "flex", justifyContent: "left" }}>
          <div
            style={{
              whiteSpace: "pre-wrap",
            }}
            className="rating-title"
          >
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName + " "}
            {user?.id === spot.ownerId && (
              <Link to={`/spots/${spotId}/edit`}>Edit My Spot</Link>
            )}
          </div>
        </div>

        <p className="spot-description">{spot.description}</p>
      </div>

      <div className="spot-price" style={styleGrid({ lastQuarters: true }, 4)}>
        {spot && (
          <div className="price-tag">
            <span>${spot?.price.toFixed(2)}</span> night
          </div>
        )}

        {spot && <ReviewDisplay key={"display"} className="rating" />}
        {spot && (
          <button
            key={"reserve"}
            className="reserve"
            onClick={() => alert("Feature coming soon")}
          >
            Reserve
          </button>
        )}
      </div>
      {user &&
        !spotReviews.filter((review) => review.userId === id)[0] &&
        Number(id) !== spot.id && (
          <div style={{ ...styleGrid({ firstHalf: true }, 5), width: "100%" }}>
            <OpenModalButton
              buttonText="Post Your Review"
              onModalClose={() => {}}
              modalComponent={<ReviewForm spotId={spot.id} />}
            />
          </div>
        )}
      <div className="spot-ratings">
        <ReviewDisplay className="rating rating-title" />
        {spotReviews[0]
          ? spotReviews
              .sort(({ createdAt: a }, { createdAt: b }) => {
                console.log(a);
                console.log(b);

                const [yearA, monthA, dayA, hourA, minuteA] = (a || "0-")
                  .split("-")
                  .map((e) => Number(e));
                const [yearB, monthB, dayB, hourB, minuteB] = (b || "0-")
                  .split("-")
                  .map((e) => Number(e));
                return (
                  yearB - yearA ||
                  monthB - monthA ||
                  dayB - dayA ||
                  hourB - hourA ||
                  minuteB - minuteA
                );
              })
              .map(
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
                              onModalClose={() => {}}
                              modalComponent={<DeleteReview reviewId={id} />}
                            />
                            <OpenModalButton
                              buttonText="EDIT"
                              onModalClose={() => {}}
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
              )
          : user && user.id != spot.id && <p>Be the first to post a review!</p>}
      </div>
    </div>
  );
}
