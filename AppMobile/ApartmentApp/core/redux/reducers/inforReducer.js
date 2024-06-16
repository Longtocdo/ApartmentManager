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
    username: 'Nguyen Minh Sang',
    role: '',
    email: '',
    avatar: '',
    phone:'',

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
                avatar: payload?.data?.avatar ?? state.avatar,
                phone: payload?.data?.phone ?? state.phone,
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
                phone:'',
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
            "client_id":"sTC0ix5fSQ12R6Pa4323TrbWxIPmYA4vLO40CdFv",
            "client_secret": "NQkMojPVrvjMN0MIoBfEd0bPE9cu1XlShzNgddncNOE9iSm2PesAtP9oNZP50YjkH70VfmL1EQFHCfCo4tAK8yOhjB1nSXB6GN0uE9fASWrYw5xu4kKd4IOmxN1QOQOT"
            ,
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
        return Promise.resolve(data.access_token)
        

    } catch (error) {
        console.log('Error:', error);
        return Promise.reject(error);
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

