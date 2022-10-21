import { CMD } from "../utils/cmd";

interface Log {
    log: string;
    timestamp: string;
}

export async function getPodLogs(podName: string, podNamespace: string): Promise<Log[]> {
    try {
        const logs = await CMD.exec(`kubectl logs pod/${podName} -n ${podNamespace}`);
        const jsonlogs = logs.split('\n').map((line) => {
            const endDateRange = line.indexOf(' ');
            const timestamp = line.slice(0, endDateRange);
            const log = line.slice(endDateRange, line.length);
            return {
                timestamp,
                log
            }
        });
        return jsonlogs.slice(0, jsonlogs.length - 1);
    } catch (error: any) {
        throw new Error(error);
    }
}
