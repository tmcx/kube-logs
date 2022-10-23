export function groupByN(amount: number, data: Array<any>) {
    let result = [];
    for (let i = 0; i < data.length; i += amount) result.push(data.slice(i, i + amount));
    return result;
};