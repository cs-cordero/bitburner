import { NS } from "@ns"

/**
 * Hamming Codes: Integer to Binary Encoded String
 */
export function hammingCodesIntegerToEncoded(ns: NS, input: any): string {
    const numberToEncode = parseInt(input as string)
    const asBinary = numberToEncode.toString(2).split("")

    const structure = determineHammingCodeStructure(numberToEncode)

    const encoding: number[] = new Array(structure.bitCount).fill(0)
    // set the data bits
    structure.dataBits.forEach((dataBit) => {
        const binNum = asBinary.shift()
        if (binNum === "1") {
            encoding[dataBit] = 1
        } else {
            encoding[dataBit] = 0
        }
    })

    // set the parity bits
    const parity = encoding
        .map((value, index) => [value, index])
        .filter(([value]) => value === 1)
        .map(([, index]) => index)
        .reduce((a, b) => a ^ b)
    const parityAsBinary = parity.toString(2).split("").reverse()
    structure.parityBits
        .filter((bit) => bit !== 0)
        .forEach((parityBit) => {
            const binNum = parityAsBinary.shift()
            if (binNum === "1") {
                encoding[parityBit] = 1
            } else {
                encoding[parityBit] = 0
            }
        })

    // set the extended parity
    encoding[0] = encoding.reduce((a, b) => a ^ b)

    return encoding.map((num) => num.toString()).join("")
}

interface HammingCodeStructure {
    bitCount: number
    parityBits: number[]
    dataBits: number[]
}

function determineHammingCodeStructure(num: number): HammingCodeStructure {
    const asBinary = num.toString(2)
    let dataBitsNeeded = asBinary.length
    let bitCount = 2 // always include 0 and 1
    const dataBits = []
    const parityBits = [0, 1]

    let nextMultiple = 2
    while (dataBitsNeeded > 0) {
        if (bitCount === nextMultiple) {
            parityBits.push(bitCount)
            nextMultiple *= 2
        } else {
            dataBits.push(bitCount)
            dataBitsNeeded -= 1
        }
        bitCount += 1
    }

    return { bitCount, dataBits, parityBits }
}
