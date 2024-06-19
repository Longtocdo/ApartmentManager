import axios from "axios";
import { BaseUrl } from "../../config/config";


export const BillApis = {

    getBill: function (params, token) {
        return axios.get(`${BaseUrl}/residents/get_residentfees/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: params
            }
        );
    },

    getBillById: function (id) {
        return axios.get(`${BaseUrl}/residentfee/${id}`);
    },

    updateProofById: function (id) {
        return axios.get(`${BaseUrl}/residentfee/${id}/upload_proof`, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params: params
        });
    },

    paymentBill: function (params) {
        return axios.post(`${BaseUrl}/momo/process_payment/`, params
        );
    },
};