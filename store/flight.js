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
    try {
      const flights = await axios({
        url: "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/SFO-sky/ORD-sky/2019-05-01?inboundpartialdate=2019-06-01",
        method: 'GET',
        headers: {"X-RapidAPI-Key": "909373ee33msh904e78720ba25e4p140105jsn1dd6200f19d9"}
      })
      dispatch(getFlights(flights.data))
    } catch (error) {
      console.log(error)
    }
  }
}
// REDUCER
export default (state = {}, action) => {
  switch(action.type) {
    case GET_FLIGHTS:
      return action.flights
    default:
      return state;
  }
};
