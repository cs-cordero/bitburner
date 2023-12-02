import { NS } from "@ns"

/**
 * Generate IP Addresses
 */
export function generateIpAddresses(ns: NS, input: any): string {
    const numbers = (input as string).split("").map((value) => parseInt(value))
    const validIps = helper(ns, numbers, 0, [])
    return validIps.map((ip) => ip.map((subnet) => subnet.toString()).join(".")).toString()
}

function helper(ns: NS, numbers: number[], index: number, currentIp: number[]): number[][] {
    if (index >= numbers.length) {
        return [currentIp]
    }

    const nextNum = numbers[index]

    const result: number[][] = []

    // append to last subnet
    if (currentIp.length) {
        const ipWithoutLastSubnet = currentIp.slice(0, currentIp.length - 1)
        const lastSubnet = currentIp[currentIp.length - 1]

        const cannotAppend = lastSubnet === 0 && nextNum !== 0
        if (!cannotAppend) {
            const potentialSubnet = lastSubnet * 10 + nextNum
            if (potentialSubnet < 256) {
                const validIps = helper(ns, numbers, index + 1, [...ipWithoutLastSubnet, potentialSubnet])
                validIps.forEach((ip) => result.push(ip))
            }
        }
    }

    // add a new subnet
    if (currentIp.length < 4) {
        const validIps = helper(ns, numbers, index + 1, [...currentIp, nextNum])
        validIps.forEach((ip) => result.push(ip))
    }

    return result
}
