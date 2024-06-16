import axios from "axios";
import { BaseUrl } from "../../config/config";

export const ReportAPIs = {

    setReport: function (token,params) {
        return axios.post(`${BaseUrl}/residents/report/`,params,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    },
};