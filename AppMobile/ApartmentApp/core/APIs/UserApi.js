import axios from "axios";
import { BaseUrl } from "../../config/config";

export const UserApi = {

    getToken: function (params) {
        return axios.post(`${BaseUrl}/o/token/`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
    },

    getUser: function (token){
        return axios.get(`${BaseUrl}/users/current-user/`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
    },

    uploadAvatar: function (id,formData,token){
        return axios.patch(`${BaseUrl}/residents/${id}/upload_avatar/`,formData,{
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`,
            },
           
        })
    },


    changePassword: function (params,token) {
        return axios.patch(`${BaseUrl}/users/update_password/`,
            params,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
    },
    updateInfor: function (id,params,token) {
        return axios.patch(`${BaseUrl}/residents/${id}/update_infor/`,
            params,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
    },

};