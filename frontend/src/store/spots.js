import { del, get, post } from "./csrf";

const ADD_SPOT = "spots/addSpot";
const REMOVE_SPOT = "spots/removeSpot";
const GET_ALL_SPOTS = "spots/getAll";
const GET_SPOT_DETAILS = "spots/getSpot";

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    payload: spot,
  };
};

const getAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots,
  };
};

const getSpot = (spot) => {
  return {
    type: GET_SPOT_DETAILS,
    payload: spot,
  };
};

const removeSpot = (spotId) => {
  return {
    type: REMOVE_SPOT,
    payload: { spotId },
  };
};

export const createSpot = (spot) => async (dispatch) => {
  const [data, response] = await post("/spots", JSON.stringify(spot));
  dispatch(addSpot(data.user));
  return response;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await del(`/spots/${spotId}`);
  dispatch(removeSpot(spotId));
  return response[1];
};

export const getSpots = () => async (dispatch) => {
  const [spots, response] = await get("/spots");
  dispatch(getAllSpots(spots.Spots));
  return response;
};
export const getSpotDetails = (spotId) => async (dispatch) => {
  const [spot, response] = await get(`/spots/${spotId}`);
  dispatch(getSpot(spot));
  return response;
};

const initialState = { allSpots: [], spotDetails: {} };

const spotsReducer = (state = initialState, action) => {
  const spotDetails = { ...state.spotDetails };
  const updatedSpotDetails = { ...state.spotDetails };
  switch (action.type) {
    case GET_ALL_SPOTS:
      action.payload.forEach((spot) =>
        spotDetails[spot.id] ? null : (spotDetails[spot.id] = spot)
      );
      return { ...state, allSpots: action.payload, spotDetails };
    case GET_SPOT_DETAILS:
      return {
        ...state,
        spotDetails: { ...spotDetails, [action.payload.id]: action.payload },
      };
    case ADD_SPOT:
      spotDetails[action.payload.id] = action.payload;
      return { ...state, spotDetails };
    case REMOVE_SPOT:
      delete updatedSpotDetails[action.payload.spotId];
      return {
        allSpots: [...state.allSpots].filter(
          (spot) => spot.id !== action.payload.spotId
        ),
        spotDetails: updatedSpotDetails,
      };
    default:
      return state;
  }
};

export default spotsReducer;
