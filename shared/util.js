export function pipe(value, ...fns) {
    let acc = value;
    for (const fn of fns) {
        acc = fn(acc);
    }
    return acc;
}