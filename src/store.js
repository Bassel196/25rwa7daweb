import { createStore,applyMiddleware } from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtool-extension"
import rootreducers from "./components/redux/reducers/main"

const middleware = [thunk];

const store = createStore(
    rootreducers,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store