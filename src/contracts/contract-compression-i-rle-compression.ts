import { NS } from "@ns";

/**
 * Compression I: RLE Compression
 */
export function compressionIRleCompression(ns: NS, input: any): string {
    const uncompressed = (input as string).split("")

    let compressed = ""

    let count = 0
    let currentChar = "#"
    while (uncompressed.length) {
        const nextChar = uncompressed.shift()!
        if (nextChar !== currentChar || count === 9) {
            if (currentChar !== "#") {
                compressed += `${count}${currentChar}`
            }
            count = 1
            currentChar = nextChar
        } else {
            count += 1
        }
    }
    if (currentChar !== "#") {
        compressed += `${count}${currentChar}`
    }

    return compressed
}