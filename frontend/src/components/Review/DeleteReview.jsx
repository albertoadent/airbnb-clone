import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from "../../store/reviews";
import "./DeleteReview.css";

export default function DeleteReview({ reviewId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  function handleDelete() {
    dispatch(reviewActions.deleteReview(reviewId)).then(closeModal);
  }
  return (
    <div className="delete-review" onSubmit={handleDelete}>
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to delete this review?</h2>
      <form>
        <button className="delete" type="submit">
          {"Yes (Delete review)"}
        </button>
        <button className="keep" onClick={closeModal}>
          {"No (Keep review)"}
        </button>
      </form>
    </div>
  );
}