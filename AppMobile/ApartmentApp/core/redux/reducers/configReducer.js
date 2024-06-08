import { UserApi } from "../../APIs/UserApi";



export const UPDATE_NOTIFY = 'Update notify';
export const UPDADATE_LOADING = 'Update loading';


const initialState = {
    notifyAmount : 0,
    isLoading : false,
}

export default function actionConfigReducer(state = initialState, payload) {
    switch (payload.type) {
        case UPDATE_NOTIFY:
            return {
                ...state,
                notifyAmount: payload.data.notifyAmount,
            }
        case UPDADATE_LOADING:
            return {
                ...state,
                isLoading:payload.data.isLoading
            }
        default:
            return state
    }

}

export const setLoading = (isLoading) => async dispatch => {
try {
    dispatch({
        type:UPDADATE_LOADING,
        data:isLoading,
    })
    
} catch (error) {
    
}
}





export const configActions = {
    setLoading,
};