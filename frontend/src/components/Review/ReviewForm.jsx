import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./ReviewForm.css";
import * as reviewActions from "../../store/reviews";

export default function ReviewForm({
  review: { review = "", stars = 0, id, spotId: storedId } = {},
  spotId,userId
}) {
  const [tempStars, setTempStars] = useState(stars || 0);
  const [newReview, setReview] = useState(review || "");
  const [reviewStars, setReviewStars] = useState(stars || 0);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  function handleSubmit() {
    if (newReview === review && stars === reviewStars) {
      closeModal();
    }

    if (id) {
      dispatch(
        reviewActions.updateReview( {
          id,
          spotId: spotId || storedId,
          review: newReview,
          stars: reviewStars,
          userId,
        })
      )
    } else {
      dispatch(
        reviewActions.createReview({
          review: newReview,
          stars: reviewStars,
          userId,
          spotId: spotId || storedId,
        })
      )
    }

    closeModal();
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
        <div
          className="stars"
          onMouseLeave={() => {
            setReviewStars(reviewStars || 0);
            setTempStars(reviewStars || 0);
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
          <button type="submit" disabled={!newReview || !reviewStars || newReview.length < 10}>
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}
