import axios from "axios";

export type ConsultFields = {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
};

export type ConsultResponse = {
    success: boolean;
    id: string;
};

export const api = axios.create({
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    },
});

export const Enquiry = async (
    data: ConsultFields
): Promise<ConsultResponse> => {
    const response = await api.post<ConsultResponse>(
        "/api/consult",
        data
    );

    return response.data;
};
