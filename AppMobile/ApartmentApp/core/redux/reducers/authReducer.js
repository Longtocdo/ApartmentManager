import { UserApi } from "../../APIs/UserApi";



export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';


const initialState = {
    token: '',
    refreshToken: '',
    typeLogin: '',
}

export default function actionAuthReducer(state = initialState, payload) {
    switch (payload.type) {
        case LOGIN:
            return {
                ...state,
                token: payload.token,
                refreshToken: payload.refreshToken,
                typeLogin: payload.typeLogin,
            }
        case LOGIN:
            return {
                ...state,
                token : '',
                refreshToken : '',
                typeLogin:'',
            }
        default:
            return state
    }
}

export const loginSucess = () => async dispatch => {
    try {
        const res = await UserApi.get();
        console.log(res.data)
        await dispatch({
            type: UPDATE_PROFILE,
            data: res.data.user_info,
        })
    } catch (error) {
    }

}

export const login = (username, password) => async dispatch => {
    try {
        // const data = await UserApi.get(); getAccess token
        await dispatch(
            loginSuccess({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                authType: 'email',
            }),
        );
        console.log(res.data)
        await dispatch({
            type: UPDATE_PROFILE,
            data: res.data.user_info,
        })
    } catch (error) {
    }

}


export const configActions = {
};