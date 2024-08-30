import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CreateSpot from "../CreateSpot/CreateSpot";

export default function UpdateSpot() {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  return <CreateSpot spot={spot} />;
}
