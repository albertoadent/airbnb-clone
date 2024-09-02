import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as spotActions from "../../../store/spots";
import "./CreateSpot.css";

export default function CreateSpot({ spot: storedSpot = {} }) {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const [spot, setSpot] = useState({
    ownerId: user?.id,
    address: storedSpot.address || "",
    city: storedSpot.city || "",
    state: storedSpot.state || "",
    country: storedSpot.country || "",
    lat: storedSpot.lat || 0,
    lng: storedSpot.lng || 0,
    name: storedSpot.name || "",
    description: storedSpot.description || "",
    price: storedSpot.price || 0,
    previewImage: storedSpot.previewImage || null,
    images:
      storedSpot?.SpotImages?.reduce(
        (arr, { url, preview }) => (preview ? arr : [...arr, url]),
        []
      ) || [],
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();

    dispatch(
      storedSpot.name
        ? spotActions.updateSpot({ ...spot, id: storedSpot.id })
        : spotActions.createSpot(spot)
    )
      .then((spot) => navigate(`/spots/${storedSpot.id || spot.id}`))
      .catch((err) => err.json())
      .then(({ errors }) => setErrors({ ...errors }));
  }

  function handleChange(e, fieldName) {
    const value = e.target.value;
    setSpot((prevSpot) => {
      if (fieldName === "images") {
        return { ...prevSpot, [fieldName]: [...prevSpot[fieldName], value] };
      }
      if (fieldName === "lat" || fieldName === "lng") {
        return { ...prevSpot, [fieldName]: Number(value) };
      }
      return { ...prevSpot, [fieldName]: value };
    });
  }

  return (
    <div className="create-spot-wrapper">
      {!storedSpot.id ? (
        <h1 className="title">Create a NEW Spot</h1>
      ) : (
        <h1 className="title">Update your Spot</h1>
      )}
      <h2>Where&apos;s your place located?</h2>
      <h3>
        Guests will only get your exact address once they booked a reservation
      </h3>
      <form action="create-spot" onSubmit={handleSubmit}>
        <div>
          <h2 htmlFor="country">
            Country{" "}
            <span
              style={{
                color: "red",
                fontSize: "small",
                textShadow: "black 0px 0px 10px",
              }}
            >
              {errors.country}
            </span>
          </h2>
          <input
            type="text"
            placeholder="Country"
            value={spot.country}
            onChange={(e) => handleChange(e, "country")}
          />
        </div>

        <div>
          <h2 htmlFor="address">
            Address{" "}
            <span
              style={{
                color: "red",
                fontSize: "small",
                textShadow: "black 0px 0px 10px",
              }}
            >
              {errors.address}
            </span>
          </h2>
          <input
            type="text"
            placeholder="Address"
            value={spot.address}
            onChange={(e) => handleChange(e, "address")}
          />
        </div>

        <div className="group">
          <div className="city">
            <h2 htmlFor="city">
              City{" "}
              <span
                style={{
                  color: "red",
                  fontSize: "small",
                  textShadow: "black 0px 0px 10px",
                }}
              >
                {errors.city}
              </span>
            </h2>
            <input
              type="text"
              placeholder="City"
              value={spot.city}
              onChange={(e) => handleChange(e, "city")}
            />
          </div>

          <div>
            <h2 htmlFor="state">
              State{" "}
              <span
                style={{
                  color: "red",
                  fontSize: "small",
                  textShadow: "black 0px 0px 10px",
                }}
              >
                {errors.state}
              </span>
            </h2>
            <input
              type="text"
              placeholder="State"
              value={spot.state}
              onChange={(e) => handleChange(e, "state")}
            />
          </div>
        </div>

        <div className="group">
          <div className="lat">
            <h2 htmlFor="lat">
              Latitude{" "}
              <span
                style={{
                  color: "red",
                  fontSize: "small",
                  textShadow: "black 0px 0px 10px",
                }}
              >
                {errors.lat}
              </span>
            </h2>
            <input
              type="number"
              placeholder="Latitude"
              value={spot.lat}
              onChange={(e) => handleChange(e, "lat")}
            />
          </div>

          <div>
            <h2 htmlFor="lng">
              Longitude{" "}
              <span
                style={{
                  color: "red",
                  fontSize: "small",
                  textShadow: "black 0px 0px 10px",
                }}
              >
                {errors.lng}
              </span>
            </h2>
            <input
              type="number"
              placeholder="Longitude"
              value={spot.lng}
              onChange={(e) => handleChange(e, "lng")}
            />
          </div>
        </div>

        <span>____________________________________________________</span>

        <div>
          <h2 htmlFor="description">
            Describe your place to guests{" "}
            <span
              style={{
                color: "red",
                fontSize: "small",
                textShadow: "black 0px 0px 10px",
              }}
            >
              {errors.description}
            </span>
          </h2>
          <h3>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood
          </h3>
          <textarea
            placeholder="Please write at least 30 characters"
            value={spot.description}
            onChange={(e) => handleChange(e, "description")}
          />
        </div>

        <span>____________________________________________________</span>

        <div>
          <h2 htmlFor="name">
            Create a title for your spot{" "}
            <span
              style={{
                color: "red",
                fontSize: "small",
                textShadow: "black 0px 0px 10px",
              }}
            >
              {errors.name}
            </span>
          </h2>
          <h3>
            Catch guests&apos; attention with a spot title that highlights what
            makes your place special
          </h3>
          <input
            type="text"
            placeholder="Name of your spot"
            value={spot.name}
            onChange={(e) => handleChange(e, "name")}
          />
        </div>

        <span>____________________________________________________</span>

        <div>
          <h2 htmlFor="price">
            Set a base price for your spot{" "}
            <span
              style={{
                color: "red",
                fontSize: "small",
                textShadow: "black 0px 0px 10px",
              }}
            >
              {errors.price}
            </span>
          </h2>
          <h3>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </h3>
          <label htmlFor="price">$</label>
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={spot.price}
            onChange={(e) => handleChange(e, "price")}
          />
        </div>

        <span>____________________________________________________</span>

        <div>
          <h2 htmlFor="previewImage">
            Liven up your spot with photos{" "}
            <span
              style={{
                color: "red",
                fontSize: "small",
                textShadow: "black 0px 0px 10px",
              }}
            >
              {errors.previewImage}
            </span>
          </h2>
          <h3>Submit a link to at least one photo to publish your spot</h3>
          <input
            type="text"
            placeholder="Preview Image URL"
            value={spot.previewImage || ""}
            onChange={(e) => handleChange(e, "previewImage")}
          />
        </div>

        {[...Array(4)].map((_, index) => (
          <div key={index}>
            <h2 htmlFor={`image-${index}`}>Image {index + 1} URL</h2>
            <input
              type="text"
              placeholder={`Image ${index + 1} URL`}
              value={spot.images[index] || ""}
              onChange={(e) => {
                const newImages = [...spot.images];
                newImages[index] = e.target.value;
                setSpot((prevSpot) => ({ ...prevSpot, images: newImages }));
              }}
            />
          </div>
        ))}

        <button type="submit">{!storedSpot.id ?"Create Spot":"Update Your spot"}</button>
      </form>
    </div>
  );
}
