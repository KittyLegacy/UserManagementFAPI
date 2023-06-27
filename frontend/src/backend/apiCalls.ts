import httpService from "./httpService";

const registerApi = (values: any) => httpService.post(`/user/register`, values);

const loginApi = (values: any) => httpService.post(`/user/login`, values);

const updatePassword = (values: any) => httpService.post(`/changePassword`, values);

const getUsers = () => httpService.get(`/user/users`);

const deleteUserApi = (values: any) => httpService.delete(`/user/users/${values.id}`, values);

const updateUserApi = (values: any) => httpService.put(`/user/users/${values.id}`, values);

const addUserApi = (values: any) => httpService.post(`/user/users`, values);


export default {
    loginApi,
    registerApi,
    updatePassword,
    getUsers,
    deleteUserApi,
    updateUserApi,
    addUserApi
}