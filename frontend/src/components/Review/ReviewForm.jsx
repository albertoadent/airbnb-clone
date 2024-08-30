import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./ReviewForm.css";
import * as reviewActions from "../../store/reviews";
import * as spotActions from "../../store/spots";

export default function ReviewForm({
  review: { review = "", stars = 5, id, spotId: storedId } = {},
  spotId,
}) {
  const [tempStars, setTempStars] = useState(stars || 5);
  const [newReview, setReview] = useState(review || "");
  const [reviewStars, setReviewStars] = useState(stars || 5);
  const { closeModal } = useModal();
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  function handleSubmit() {
    if (newReview === review && stars === reviewStars) {
      closeModal();
    }
    id
      ? dispatch(
          reviewActions.updateReview({
            id,
            spotId: spotId || storedId,
            review: newReview,
            stars: reviewStars,
            userId: user.id,
          })
        ).then(closeModal)
      : dispatch(
          spotActions.createSpotReview(spotId, {
            review: newReview,
            stars: reviewStars,
          })
        ).then(closeModal);
  }

  return (
    <div className="write-review" onSubmit={handleSubmit}>
      <div>
        <h2>How was your stay?</h2>
        <textarea
          name="review"
          placeholder="Leave your review here..."
          value={newReview}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="stars"
          onMouseLeave={() => {
            setReviewStars(reviewStars || 5);
            setTempStars(reviewStars || 5);
          }}
        >
          <div
            onMouseEnter={() => setTempStars(1)}
            onClick={() => setReviewStars(1)}
          >
            {tempStars >= 1 ? <FaStar /> : <FaRegStar />}
          </div>
          <div
            onMouseEnter={() => setTempStars(2)}
            onClick={() => setReviewStars(2)}
          >
            {tempStars >= 2 ? <FaStar /> : <FaRegStar />}
          </div>
          <div
            onMouseEnter={() => setTempStars(3)}
            onClick={() => setReviewStars(3)}
          >
            {tempStars >= 3 ? <FaStar /> : <FaRegStar />}
          </div>
          <div
            onMouseEnter={() => setTempStars(4)}
            onClick={() => setReviewStars(4)}
          >
            {tempStars >= 4 ? <FaStar /> : <FaRegStar />}
          </div>
          <div
            onMouseEnter={() => setTempStars(5)}
            onClick={() => setReviewStars(5)}
          >
            {tempStars >= 5 ? <FaStar /> : <FaRegStar />}
          </div>
          Stars
        </div>
        <form>
          <button type="submit" disabled={!newReview}>
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}
