import { NS } from "@ns"

interface PartialCompression {
    compressed: string
    compressionLength: number
    cycles: number
}

/**
 * Compression III: LZ Compression
 */
export function compressionIIILzCompression(ns: NS, input: any): string {
    const uncompressed = input as string

    const completedCompressions: string[] = []

    let circuitBreaker = 0

    const queue: PartialCompression[] = [
        { compressed: "", compressionLength: 0, cycles: 0 },
    ]
    while (queue.length) {
        if (circuitBreaker++ > 50000) {
            ns.tprint(`Circuit Breaker tripped on ${uncompressed}`)
            ns.tprint(`${queue.length} items in the queue`)

            const dedupedLength = [...new Set(queue.map((v) => v.compressed))]
                .length
            ns.tprint(`${dedupedLength} deduped items in the queue`)

            const maxLength = queue
                .map((v) => v.compressed.length)
                .reduce((a, b) => Math.max(a, b))
            ns.tprint(
                `Longest compression ${maxLength} Original: ${uncompressed.length}`
            )

            const maxCycles = queue
                .map((v) => v.cycles)
                .reduce((a, b) => Math.max(a, b))
            ns.tprint(`Most cycles ${maxCycles}`)
            break
        }

        const current = queue.shift()!
        if (current.cycles > Math.floor(uncompressed.length / 9)) {
            continue
        }

        // type 1 compression
        const type1CompressionCandidates: string[] = []
        for (let i = 0; i <= 9; i++) {
            const sliceStart = current.compressionLength
            const sliceEnd = current.compressionLength + i

            if (sliceEnd > uncompressed.length) {
                break
            }
            if (i === 0) {
                if (!current.compressed.endsWith("0")) {
                    // avoid infinitely appending 0.
                    type1CompressionCandidates.push("0")
                }
            } else {
                type1CompressionCandidates.push(
                    `${i}${uncompressed.slice(sliceStart, sliceEnd)}`
                )
            }
        }

        // type 2 compression
        let longestType2Length = -Infinity
        let combinedCandidates: PartialCompression[] = []
        for (const type1Candidate of type1CompressionCandidates) {
            const type1CompressedLength =
                current.compressionLength + parseInt(type1Candidate.charAt(0))
            if (type1CompressedLength >= uncompressed.length) {
                completedCompressions.push(
                    `${current.compressed}${type1Candidate}`
                )
                continue
            }

            const type2Candidates = determineBestType2Compression(
                uncompressed,
                type1CompressedLength
            )
            if (type2Candidates.length) {
                for (const type2Candidate of type2Candidates) {
                    const type2CompressedLength = parseInt(
                        type2Candidate.charAt(0)
                    )
                    const compressed = `${current.compressed}${type1Candidate}${type2Candidate}`

                    if (
                        type1CompressedLength + type2CompressedLength >=
                        uncompressed.length
                    ) {
                        completedCompressions.push(compressed)
                    } else {
                        const newCompression: PartialCompression = {
                            compressed,
                            compressionLength:
                                type1CompressedLength + type2CompressedLength,
                            cycles: current.cycles + 1,
                        }

                        if (type2CompressedLength > longestType2Length) {
                            longestType2Length = type2CompressedLength
                            combinedCandidates = [newCompression]
                        } else if (
                            type2CompressedLength === longestType2Length
                        ) {
                            combinedCandidates.push(newCompression)
                        }
                    }
                }
            } else {
                const newCompression: PartialCompression = {
                    compressed: `${current.compressed}${type1Candidate}0`,
                    compressionLength: type1CompressedLength,
                    cycles: current.cycles + 1,
                }
                if (0 > longestType2Length) {
                    longestType2Length = 0
                    combinedCandidates = [newCompression]
                } else if (0 === longestType2Length) {
                    combinedCandidates.push(newCompression)
                }
            }
        }

        combinedCandidates.forEach((candidate) => {
            if (candidate.compressed.length <= uncompressed.length + 10) {
                queue.push(candidate)
            }
        })
    }

    if (completedCompressions.length) {
        const smallestCompression = completedCompressions
            .map((compression) => compression.length)
            .reduce((a, b) => Math.min(a, b))
        const result = completedCompressions.filter(
            (compression) => compression.length === smallestCompression
        )

        return result[0]
    } else {
        return ""
    }
}

function determineBestType2Compression(
    uncompressed: string,
    type2RightIndex: number
) {
    if (type2RightIndex === 0) {
        return []
    }

    let longestCompressed = -Infinity
    let candidates: string[] = []
    const rightLimit = Math.min(type2RightIndex + 9, uncompressed.length)
    for (let leftStart = 1; leftStart <= type2RightIndex; leftStart++) {
        let left = type2RightIndex - leftStart
        let right = type2RightIndex
        let length = 0
        while (
            uncompressed.charAt(left) === uncompressed.charAt(right) &&
            right < rightLimit
        ) {
            left += 1
            right += 1
            length += 1
        }

        if (length > 0) {
            if (length > longestCompressed) {
                longestCompressed = length
                candidates = [`${length}${leftStart}`]
            } else if (length === longestCompressed) {
                candidates.push(`${length}${leftStart}`)
            }
        }
    }
    return candidates
}
