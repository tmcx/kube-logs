import axios from 'axios';

export interface Pod {
    namespace: string;
    name: string;
    containers: {
        names: string[];
        count: string;
    }
    status: string;
    restarts: string;
    age: string;
}

export class PodsService {
    baseUrl = 'http://localhost:3000/pods';

    public async get(): Promise<Pod[]> {
        return (await axios.get(this.baseUrl)).data;
    }
}