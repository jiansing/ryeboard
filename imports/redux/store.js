import {createStore} from 'redux';
import reducer from './reducers/main'

const store = createStore(
    reducer
);

export default store;

