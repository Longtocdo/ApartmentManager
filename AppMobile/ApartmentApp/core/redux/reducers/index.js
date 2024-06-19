import {combineReducers} from 'redux'

import infor from './inforReducer'
import loadingReducer from './configReducer';


const reducers = combineReducers({
        personalInfor: infor,
        loading: loadingReducer,
});

export default (state, action) =>reducers(state,action)