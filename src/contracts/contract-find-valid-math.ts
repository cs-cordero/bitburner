import { NS } from "@ns";

/**
 * Find All Valid Math Expressions
 */
export function findValidMath(ns: NS, input: any): string {
    const [numbers, target] = input as [string, number]
    const digits = numbers.split("").map(digit => parseInt(digit))

    const chops: number[][] = []
    chopNumbers(ns, digits, 0, [], chops);

    const answer: string[] = []
    for (let i = 0; i < chops.length; i++) {
        helper(ns, chops[i], target, 0, "", answer)
    }

    const dedupedAnswer = [...new Set(answer)]
    return `[${dedupedAnswer}]`
}

function chopNumbers(ns: NS, digits: number[], index: number, currentChop: number[], result: number[][]): void {
    if (index >= digits.length) {
        result.push(currentChop)
        return
    }

    const nextDigit = digits[index]

    // we can either append the next digit to the chop
    chopNumbers(ns, digits, index + 1, [...currentChop, nextDigit], result)

    // or use the digit to adjust the last number
    if (currentChop.length) {
        const newChop = [...currentChop]
        let lastNumber = newChop.pop()!
        if (lastNumber === 0) {
            return
        }
        lastNumber *= 10
        lastNumber += nextDigit
        newChop.push(lastNumber)

        chopNumbers(ns, digits, index + 1, newChop, result)
    }
}

function helper(ns: NS, numbers: number[], target: number, index: number, current: string, result: string[]) {
    if (index >= numbers.length) {
        const value = eval(current)
        if (value === target) {
            result.push(current)
        }
        return
    }

    const nextNumber = numbers[index]
    if (current === "") {
        helper(ns, numbers, target, index + 1, `${nextNumber}`, result)
    } else {
        helper(ns, numbers, target, index + 1, `${current}+${nextNumber}`, result)
        helper(ns, numbers, target, index + 1, `${current}-${nextNumber}`, result)
        helper(ns, numbers, target, index + 1, `${current}*${nextNumber}`, result)
    }
}