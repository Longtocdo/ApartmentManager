
import axios from "axios";
import { BaseUrl } from "../../config/config";

const TIMEOUT = 5000; // 5 seconds timeout

export const SurveyAPIs = {

    getSurveyById: function (id) {
        return axios.get(`${BaseUrl}/survey/${id}`, {
            timeout: TIMEOUT
        });
    },

    getSurveyPending: function (token) {
        return axios.get(`${BaseUrl}/survey/pending/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
    getSurveyCompleted: function (token) {
        return axios.get(`${BaseUrl}/survey/completed/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
    

    postAnwser: function (id, params, token) {
        return axios.post(`${BaseUrl}/survey/${id}/response/`, params
            , {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },

            })
    },

};