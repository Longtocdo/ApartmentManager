import {combineReducers} from 'redux'

import infor from './inforReducer'
import config from './configReducer'


const reducers = combineReducers({
        personalInfor: infor,
        config: config,
});

export default (state, action) =>reducers(state,action)