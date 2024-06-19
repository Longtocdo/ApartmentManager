import axios from "axios";
import { BaseUrl } from "../../config/config";


export const BillApis = {

    getBill: function (params, token,page=1) {
        return axios.get(`${BaseUrl}/residents/get_residentfees/?page=${page}`,
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

    updateProofById: function (id,params) {
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