import { NS } from "@ns"

/**
 * HammingCodes: Encoded Binary to Integer
 */
export function hammingCodesEncodedToInteger(ns: NS, input: any): string {
    const raw = input as string
    const structure = determineHammingCodeStructure(raw)
    const numbers = raw.split("").map((num) => parseInt(num))

    const parity = numbers
        .map((number, i) => [number, i])
        .filter(([number]) => number === 1)
        .map(([, i]) => i)
        .reduce((a, b) => a ^ b)

    if (parity > 0) {
        numbers[parity] = numbers[parity] === 1 ? 0 : 1
    }

    const dataAsBinary = numbers
        .filter((num, i) => structure.dataBits.includes(i))
        .map((num) => num.toString())
        .join("")
    const data = parseInt(dataAsBinary, 2)
    return data.toString()
}

interface HammingCodeStructure {
    bitCount: number
    parityBits: number[]
    dataBits: number[]
}

function determineHammingCodeStructure(
    binaryString: string
): HammingCodeStructure {
    const dataBits = []
    const parityBits = []

    let nextParityBit = 0
    for (let i = 0; i < binaryString.length; i++) {
        if (i === nextParityBit) {
            parityBits.push(i)
            nextParityBit = Math.max(1, nextParityBit * 2)
        } else {
            dataBits.push(i)
        }
    }

    return {
        bitCount: binaryString.length,
        parityBits,
        dataBits,
    }
}
