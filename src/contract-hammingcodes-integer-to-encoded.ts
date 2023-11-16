import { NS } from "@ns";

/**
 * Hamming Codes: Integer to Binary Encoded String
 *
 * You are given the following decimal Value:
 * 6
 *
 * Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:
 * Value 8 is expressed in binary as '1000', which will be encoded with the pattern 'pppdpddd',
 * where p is a parity bit and d a data bit. The encoding of 8 is 11110000. As another example,
 * '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
 *
 * pppdpdddpd
 * 1001101011
 *
 * The answer should be given as a string containing only 1s and 0s.
 * NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.
 * NOTE: The bit at index zero is the overall parity bit, this should be set last.
 * NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding,
 * including the first index parity bit mentioned in the previous note.
 *
 * Extra rule for encoding:
 * There should be no leading zeros in the 'data bit' section
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
    const numberToEncode = 29
    const asBinary = numberToEncode.toString(2).split("")

    const structure = determineHammingCodeStructure(numberToEncode)

    const encoding: number[] = new Array(structure.bitCount).fill(0)
    // set the data bits
    structure.dataBits
        .forEach(dataBit => {
            const binNum = asBinary.shift()
            if (binNum === "1") {
                encoding[dataBit] = 1
            } else {
                encoding[dataBit] = 0
            }
        })
    ns.tprint(encoding)

    // set the parity bits
    const parity = encoding
        .map((value, index) => [value, index])
        .filter(([value]) => value === 1)
        .map(([, index]) => index)
        .reduce((a, b) => a ^ b)
    const parityAsBinary = parity.toString(2).split("").reverse()
    ns.tprint(parityAsBinary)
    structure.parityBits
        .filter(bit => bit !== 0)
        .forEach(parityBit => {
            const binNum = parityAsBinary.shift()
            if (binNum === "1") {
                encoding[parityBit] = 1
            } else {
                encoding[parityBit] = 0
            }
        })
    ns.tprint(encoding)

    // set the extended parity
    encoding[0] = encoding.reduce((a, b) => a ^ b)

    const result = encoding.map(num => num.toString()).join("")

    ns.tprint(result)
}

interface HammingCodeStructure {
    bitCount: number
    parityBits: number[]
    dataBits: number[]
}

function determineHammingCodeStructure(num: number): HammingCodeStructure {
    const asBinary = num.toString(2)
    let dataBitsNeeded = asBinary.length;
    let bitCount = 2 // always include 0 and 1
    const dataBits = []
    const parityBits = [0, 1]

    let nextMultiple = 2;
    while(dataBitsNeeded > 0) {
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