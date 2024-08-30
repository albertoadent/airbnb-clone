import { Link } from "react-router-dom";
import "./SpotDisplay.css";
import { FaStar } from "react-icons/fa";

export default function SpotDisplay({ spot }) {
  return (
    <Link className="spot_display" to={`/spots/${spot?.id}`} title={spot?.name}>
      <img
        className="spot_image"
        src={spot?.previewImage}
        alt="https://atlas-content-cdn.pixelsquid.com/stock-images/simple-house-NxE5a78-600.jpg"
      />
      <div className="spot_info">
        <div style={{ gridColumnStart: "1", textAlign: "left" }}>
          {spot?.city}, {spot?.state}
        </div>
        <div
          style={{
            gridColumnStart: "1",
            gridRowStart: "2",
            textAlign: "left",
            fontWeight: "600",
            whiteSpace: "pre-wrap",
          }}
        >
          ${spot?.price + " "}
          <span className="price-label">night</span>
        </div>
        <div
          style={{ gridColumn: "2", textAlign: "center", fontWeight: "bold" }}
        >
          {(spot?.avgRating && (
            <div
              style={{
                gridRow: "2",
                gridColumn: "2",
                textAlign: "right",
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
                textAlign: "right",
                color: "rgb(55, 55, 107)",
                fontWeight: "bold",
              }}
            >
              New
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
