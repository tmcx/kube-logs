export function groupByN<T>(amount: number, data: Array<T>): Array<Array<T>> {
    let result = [];
    for (let i = 0; i < data.length; i += amount) result.push(data.slice(i, i + amount));
    return result;
};