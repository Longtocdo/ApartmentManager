import axios from "axios";

const ENDPOINT = "http://192.168.1.15:8000"

export const BillApis = {

    getBill: function (params={}, token) {
        return axios.get(`${ENDPOINT}/residents/get_residentfees/`,
      
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params:params,
            }
        );
    },

    getBillById: function (id,params) {
        return axios.get(`${ENDPOINT}/residentfee/${id}`,null);
    },

    updateProofById: function (id) {
        return axios.get(`${ENDPOINT}/residentfee/${id}/upload_proof`,{
            headers: {
                "Content-Type": "multipart/form-data",
              },
            params:params
        });
    },
};