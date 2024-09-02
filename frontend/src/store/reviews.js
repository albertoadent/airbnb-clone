import { get, del, post, put } from "./csrf";

const UPDATE_REVIEW = "UPDATE_REVIEW";
const ADD_REVIEW = "ADD_REVIEW";
const DELETE_REVIEW = "DELETE_REVIEW";

export const updateRev = (REVIEW) => {
  return {
    type: UPDATE_REVIEW,
    payload: REVIEW,
  };
};
const addRev = (REVIEW) => {
  return {
    type: ADD_REVIEW,
    payload: REVIEW,
  };
};
const deleteRev = (id) => {
  return {
    type: DELETE_REVIEW,
    payload: { id },
  };
};

export const createReview = (Review) => async (dispatch) => {
  const [data, response] = await post(
    "/spots/" + Review.spotId + "/reviews",
    JSON.stringify(Review)
  );
  if (!data.errors) {
    dispatch(addRev(data));
  }
  return response;
};
export const updateReview =
  ({ id, ...Review }) =>
  async (dispatch) => {
    const [data, response] = await put(
      "/reviews/" + id,
      JSON.stringify(Review)
    );
    if (!data.errors) {
      dispatch(updateRev({ ...data, Review }));
    }
    return response;
  };
export const getReviewDetails = (id) => async (dispatch) => {
  const [data, response] = await get("/reviews/" + id);
  dispatch(updateRev(data));
  return response;
};
export const getReviews = () => async (dispatch) => {
  const [data, response] = await get("/reviews");
  data.Reviews.forEach((Review) => {
    dispatch(updateRev(Review));
  });
  return response;
};

export const deleteReview = (reviewId) => async (dispatch, getState) => {
  const { reviews: state } = getState();
  if (state[reviewId]) {
    dispatch(deleteRev(reviewId));
  }
  const response = await del("/reviews/" + reviewId);
  return response[1];
};

const initialState = {};
const reviewsReducer = (state = initialState, { type, payload }) => {
  const { id } = payload || {};
  const { [id]: REVIEW, ...rest } = state;
  switch (type) {
    case UPDATE_REVIEW:
      if (REVIEW)
        return {
          ...state,
          [id]: { ...REVIEW, ...payload },
        };
      else {
        return {
          ...state,
          [id]: payload,
        };
      }
    case ADD_REVIEW:
      return {
        ...state,
        [id]: payload,
      };
    case DELETE_REVIEW:
      return rest;
    default:
      return state;
  }
};

export default reviewsReducer;
