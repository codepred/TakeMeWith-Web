import axios, { AxiosResponse } from 'axios';

interface FormObject {
    name: string;
    lastname: string;
    password: string;
    email: string;
    phoneNumber: number | null;
}

interface RideData {
    start: string,
    destination: string,
    startDate: Date | string,
    startHour: string
}

class UserService {

    async loginUser(phoneNumber: number | null, password: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'customer/sign-in',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    phoneNumber: phoneNumber,
                    password: password
                }
            });

            return response.data;
        }
        catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async registerUser(formData: FormObject): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'customer/sign-up',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    name: formData.name,
                    lastname: formData.lastname
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async verifyAccount(phoneNumber: number | null, code: number | null): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'customer/verify-user',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    phoneNumber: phoneNumber,
                    code: code
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async resetPassword(phoneNumber: number | null): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'customer/request-new-password',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    phoneNumber: phoneNumber
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async setNewPassword(phoneNumber: number | null, code: number | null, password: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'customer/set-new-password',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    phoneNumber: phoneNumber,
                    code: code,
                    password: password
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async getUserData() {
        try {
            const response: AxiosResponse = await axios({
                method: 'GET',
                url: window.CLIENT_API_BASE_URL + 'customer/get-user-data',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async sendTextToBackend(searchText: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'customer/search-address',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    text: searchText
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async submitRide(rideData: RideData): Promise<any> {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'ride/submit-ride',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    start: rideData.start,
                    destination: rideData.destination,
                    startDate: rideData.startDate,
                    startHour: rideData.startHour,
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async getNumberOfPagesInRideList() {
        try {
            const response: AxiosResponse = await axios({
                method: 'GET',
                url: window.CLIENT_API_BASE_URL + 'customer/number-of-pages',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }

    async getRideList(rideData: any[], selectedPage: number) {
        try {
            const response: AxiosResponse = await axios({
                method: 'POST',
                url: window.CLIENT_API_BASE_URL + 'ride/ride-list/' + selectedPage,
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                },
                data: {
                    start: rideData[0],
                    destination: rideData[1],
                    startDate: rideData[2],
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }

    }

    async getLoginCheck() {
        try {
            const response: AxiosResponse = await axios({
                method: 'GET',
                url: window.CLIENT_API_BASE_URL + 'customer/login-check',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('takemewith-token')}`
                }
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            }
            throw error;
        }
    }


}

export default new UserService();