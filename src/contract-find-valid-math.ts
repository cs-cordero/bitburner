import { NS } from "@ns";

/**
 * Find All Valid Math Expressions
 *
 * You are given the following string which contains only digits between 0 and 9:
 *
 * 92417469
 *
 * You are also given a target number of 33. Return all possible ways you can add the +(add), -(subtract), and *(multiply) operators to the string such that it evaluates to the target number. (Normal order of operations applies.)
 * The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:
 *
 * ["92417469", 33]
 *
 * NOTE: The order of evaluation expects script operator precedence NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:
 *
 * Input: digits = "123", target = 6
 * Output: [1+2+3, 1*2*3]
 *
 * Input: digits = "105", target = 5
 * Output: [1*0+5, 10-5]
 */
export async function main(ns: NS): Promise<void> {
    const input = [92417469, 33]
    // const input = [105, 5]
    const [numbers, target] = input
    const digits = numbers.toString().split("").map(digit => parseInt(digit))

    const chops: number[][] = []
    chopNumbers(ns, digits, 0, [], chops);

    const answer: string[] = []
    for (let i = 0; i < chops.length; i++) {
        ns.tprint(`On chop ${i + 1} out of ${chops.length}`)
        helper(ns, chops[i], target, 0, "", answer)
        await ns.sleep(100)
    }

    const dedupedAnswer = [...new Set(answer)]
    ns.tprint(`Answer: ${dedupedAnswer}`)
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