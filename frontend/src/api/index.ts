import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const getMatches = async (page = 1, limit = 10) => {
    const response = await api.get(`/matches?page=${page}&limit=${limit}`);
    return response.data;
};

export const getTeams = async () => {
    const response = await api.get('/teams');
    return response.data;
};

export const getStandings = async () => {
    const response = await api.get('/standings');
    return response.data;
};

export const getPlayers = async (page = 1, limit = 20, teamId?: number) => {
    const url = teamId
        ? `/players?page=${page}&limit=${limit}&teamId=${teamId}`
        : `/players?page=${page}&limit=${limit}`;
    const response = await api.get(url);
    return response.data;
};

export default api;
