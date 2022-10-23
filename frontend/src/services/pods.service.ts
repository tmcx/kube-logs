import axios from 'axios';

export interface Pod {
    namespace: string;
    name: string;
    containers: {
        restarts_count: string;
        started_at: string;
        status: string;
        name: string;
    }[];
}

export class PodsService {
    baseUrl = 'http://localhost:3000/pods';

    public async get(): Promise<Pod[]> {
        return (await axios.get(this.baseUrl)).data;
    }
}