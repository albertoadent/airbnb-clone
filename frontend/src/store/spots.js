import { get, del, post, put } from "./csrf";
import * as reviewActions from "./reviews";

const UPDATE_SPOT = "UPDATE_SPOT";
const ADD_SPOT = "ADD_SPOT";
const DELETE_SPOT = "DELETE_SPOT";

const updateSpt = (Spot) => {
  return {
    type: UPDATE_SPOT,
    payload: Spot,
  };
};

const addSpt = (Spot) => {
  return {
    type: ADD_SPOT,
    payload: Spot,
  };
};
const deleteSpt = (id) => {
  return {
    type: DELETE_SPOT,
    payload: { id },
  };
};

export const createSpot = (spot) => async (dispatch) => {
  const [data, response] = await post("/spots", JSON.stringify(spot));
  if (data.errors) {
    return response;
  }
  dispatch(addSpt(data));
  return data;
};
export const updateSpot = (spot) => async (dispatch) => {
  const [data, response] = await put("/spots/" + spot.id, JSON.stringify(spot));
  if (data.errors) {
    return response;
  }
  dispatch(updateSpt(data));
  return data;
};
export const getSpotDetails = (id) => async (dispatch) => {
  const [data, response] = await get("/spots/" + id);
  const [{ Reviews }] = await get("/spots/" + id + "/reviews");
  dispatch(updateSpt({ ...data, Reviews }));
  Reviews.forEach((Review) => {
    dispatch(reviewActions.updateRev(Review));
  });
  return response;
};
export const getSpots = () => async (dispatch) => {
  const [data, response] = await get("/spots");
  if (data.errors) return response;
  data.Spots.forEach((Spot) => {
    dispatch(updateSpt(Spot));
  });
  return response;
};

export const getMySpots = () => async (dispatch) => {
  const [data, response] = await get("/spots/current");
  data.Spots.forEach((Spot) => {
    dispatch(updateSpt(Spot));
  });
  return response;
};

export const createSpotReview =
  (spotId, review) => async (dispatch, getState) => {
    const {
      spots: {
        [spotId]: { Reviews = [], ...spot },
      },
    } = getState();
    const [data, response] = await post(
      "/spots/" + spotId + "/reviews",
      JSON.stringify(review)
    );
    if (data.errors) return response;
    Reviews.push(data);
    dispatch(updateSpt({ ...spot, Reviews }));
    reviewActions.updateReview(data);
    return response;
  };
export const updateSpotReview =
  (spotId, review) => async (dispatch, getState) => {
    const {
      spots: {
        [spotId]: { Reviews = [], ...spot },
      },
    } = getState();
    const [data, response] = await put(
      "/reviews/" + review.id,
      JSON.stringify(review)
    );
    Reviews.push(data);
    dispatch(updateSpt({ ...spot, Reviews }));
    reviewActions.updateReview(data);
    return response;
  };

export const deleteSpot = (spotId) => async (dispatch, getState) => {
  const { spots: state } = getState();
  if (state[spotId]) {
    dispatch(deleteSpt(spotId));
  }
  const response = await del("/spots/" + spotId);
  return response[1];
};

const initialState = {};
const spotsReducer = (state = initialState, { type, payload }) => {
  const { id } = payload || {};
  const { [id]: spot, ...rest } = state;
  switch (type) {
    case UPDATE_SPOT:
      if (spot)
        return {
          ...state,
          [id]: { ...spot, ...payload },
        };
      else {
        return {
          ...state,
          [id]: payload,
        };
      }
    case ADD_SPOT:
      return {
        ...state,
        [id]: payload,
      };
    case DELETE_SPOT:
      return rest;
    default:
      return state;
  }
};

export default spotsReducer;
