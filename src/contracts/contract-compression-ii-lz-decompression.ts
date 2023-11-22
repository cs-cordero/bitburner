import { NS } from "@ns"

/**
 * Compression II: LZ Decompression
 */
export function compressionIILzDecompression(ns: NS, input: any): string {
    const compressed = (input as string).split("")
    let uncompressed = ""

    let chunkIsTypeA = true
    while (compressed.length) {
        if (chunkIsTypeA) {
            const l = parseInt(compressed.shift()!)
            if (l === 0) {
                compressed.shift()
            } else {
                for (let i = 0; i < l; i++) {
                    uncompressed += compressed.shift()!
                }
            }
        } else {
            const l = parseInt(compressed.shift()!)
            if (l !== 0) {
                const z = parseInt(compressed.shift()!)
                if (z !== 0) {
                    for (let i = 0; i < l; i++) {
                        uncompressed += uncompressed.charAt(
                            uncompressed.length - z
                        )
                    }
                }
            }
        }

        chunkIsTypeA = !chunkIsTypeA
    }

    return uncompressed
}
