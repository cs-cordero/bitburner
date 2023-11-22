import { NS } from "@ns"

/**
 * Find Largest Prime Factor
 */
export function findLargestPrimeFactor(ns: NS, input: any): string {
    const number = input as number
    const factors = findFactors(number, 1)

    let largestPrimeFactor = 1
    for (const factor of factors) {
        if (findFactors(factor, 2).length === 0) {
            largestPrimeFactor = Math.max(largestPrimeFactor, factor)
        }
    }

    return largestPrimeFactor.toString()
}

function findFactors(num: number, startDivisor: number): number[] {
    const factors = []
    for (let divisor = startDivisor; divisor < Math.floor(num / 2); divisor++) {
        if (num % divisor === 0) {
            factors.push(divisor)
            factors.push(num / divisor)
        }
    }
    return factors
}
