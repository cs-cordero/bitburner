import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const numbers = [2, 2, -7, -1, 9, -7, 3, 8]

    let maxSum = 0;

    // brute force, N^2
    for (let left = 0; left < numbers.length; left++) {
        let sum = 0
        for (let right = left; right < numbers.length; right++) {
            sum += numbers[right]
            if (sum >= maxSum) {
                maxSum = sum
            }
        }
    }

    ns.tprint(maxSum);
}