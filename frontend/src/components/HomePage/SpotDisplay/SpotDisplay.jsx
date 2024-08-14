import { Link } from "react-router-dom";
import "./SpotDisplay.css";
import { FaStar } from "react-icons/fa";

export default function SpotDisplay({ spot }) {
  const convertDecimal = (num) => {
    const number = Number(num);
    const [beforeDecimal, afterDecimal = "00"] = number.toString().split(".");
    // console.log("beforeDecimal", beforeDecimal, "afterDecimal", afterDecimal);
    const result = beforeDecimal + "." + afterDecimal.padEnd(2, 0);
    // console.log(result);
    return result;
  };

  return (
    <Link className="spot_display" to={`/spots/${spot.id}`} title={spot.name}>
      <img className="spot_image" src={spot.previewImage} />
      <div className="spot_info">
        <div style={{ gridColumnStart: "1", textAlign: "left" }}>
          {spot.city}
        </div>
        <div
          style={{ gridColumnStart: "1", gridRowStart: "2", textAlign: "left" }}
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
            {convertDecimal(spot.avgRating)}
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
  );
}
