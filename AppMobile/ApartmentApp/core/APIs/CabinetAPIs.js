import axios from "axios";
import { BaseUrl } from "../../config/config";

export const CabinetAPIs = {

    getItemByStatus: function (params,token) {
        return axios.get(`${BaseUrl}/electroniclocker/items/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params:params
            }
        );
    },

    setReceivedItem: function (id,token) {
        return axios.patch(`${BaseUrl}/item/${id}/received_item/`,null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    },
};