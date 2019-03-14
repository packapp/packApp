import axios from 'axios'

// ACTION TYPES
export const GET_FLIGHTS = 'GET_FLIGHTS'
// INITIAL STATE
const initialState = {
  flights: []
};

// ACTION CREATORS
export const getFlights = (flights) => {
  return {
    type: GET_FLIGHTS,
    flights
  }
}
// THUNK CREATORS
export const fetchFlights = () => {
  return async (dispatch) => {
    const flights = await axios.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/USD/en-US/SFO-sky/LAX-sky/2019-01-01?inboundpartialdate=2019-01-01")
    .header("X-RapidAPI-Key", "909373ee33msh904e78720ba25e4p140105jsn1dd6200f19d9")
    dispatch(flights)
  }
}
// REDUCER
export default (state = [], action) => {
  switch(action.type) {
    case GET_FLIGHTS:
      return action.flights
    default:
      return state;
  }
};
