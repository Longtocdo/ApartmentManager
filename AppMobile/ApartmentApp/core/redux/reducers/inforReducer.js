import axios from "axios";
import { UserApi, ENDPOINT } from "../../APIs/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const UPDATE_PROFILE = 'Update profile';
export const UPDATE_USERNAME = 'Update username';
export const LOGOUT = 'LOGOUT';







const initialState = {
    id: '',
    first_name: '',
    last_name: '',
    username: '  Nguyen Minh Sang',
    role: '',
    email: '',
    avatar: '',
}

export default function actionInforReducer(state = initialState, payload) {
    switch (payload.type) {
        case UPDATE_USERNAME:
            return {
                ...state,
                username: payload.username,
            }
        case UPDATE_PROFILE:
            return {
                id: payload?.data?.id ?? state.id,
                first_name: payload?.data?.first_name ?? state.first_name,
                last_name: payload?.data?.last_name ?? state.last_name,
                username: payload?.data?.username ?? state.username,
                role: payload?.data?.role ?? state.role,
                email: payload?.data?.email ?? state.email,
            }
        case LOGOUT:
            return {
                id: '',
                first_name: '',
                last_name: '',
                username: '',
                role: '',
                email: '',
                avatar: '',
            }
        default:
            return state
    }

}

export const login = (username, password) => async dispatch => {
    try {
        const response = await UserApi.getToken({
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id": "WItk43G2WXhYgKd5aYYydNjuxXAnWPgAN83ATDhy",
            "client_secret": "EeW4ucZ73inoxLIPk8isMHVWJi8tpc0o0Ck4q3zXN0wcqwtD3hcqBHDhk2nbf7s25ycdWWTMgmvV2kiWWRWZpWd8HQdTtxOEsA3DBmdBVUI1loF8OZrEV2GYQPUJhbhO",
        });

        const data = response.data;
        await AsyncStorage.setItem("token", data.access_token);

        setTimeout(async () => {
            const userReponse = await UserApi.getUser(data.access_token)

            console.log(userReponse.data)
            await dispatch({
                type: UPDATE_PROFILE,
                data: userReponse.data
            })
        }, 100)

    } catch (error) {
        console.log('Error:', error);
    }
    finally {

    }
};

export const logout = () => async dispatch => {
    try {


        await AsyncStorage.removeItem("token");

        dispatch({
            type:LOGOUT,
        })


    } catch (error) {
        console.log('Error:', error);
    }
    finally {

    }
};



export const userActions = {
    login,
    logout
};

