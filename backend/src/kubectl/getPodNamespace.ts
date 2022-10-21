import { getPods } from "./getPods";

export async function getPodNamespace(podName: string): Promise<string | undefined> {
    try {
        const pods = await getPods();
        return pods.find((pod) => pod.name == podName)?.namespace;
    } catch (error: any) {
        throw new Error(error);
    }
}
