import axios from "axios";

const ENDPOINT = "http://192.168.1.15:8000"

export const UserApi = {

    getToken: function (params) {
        return axios.post(`${ENDPOINT}/o/token/`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
    },

    getUser: function (token){
        return axios.get(`${ENDPOINT}/users/current-user/`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
    },

    uploadAvatar: function (formData){
        return axios.get(`${ENDPOINT}/users/2/upload_avatar/`,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params:formData
        })
    },

};