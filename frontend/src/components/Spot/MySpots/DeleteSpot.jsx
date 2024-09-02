import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import * as spotActions from "../../../store/spots";

export default function DeleteSpot({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  function handleDelete() {
    dispatch(spotActions.deleteSpot(spotId))
    closeModal();
  }
  return (
    <div className="delete-spot">
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this spot from the listings?</h2>
      <form action="delete"></form>
      <button className="delete" onClick={handleDelete}>
        {"Yes (Delete Spot)"}
      </button>
      <button className="keep" onClick={closeModal}>
        {"No (Keep Spot)"}
      </button>
    </div>
  );
}
