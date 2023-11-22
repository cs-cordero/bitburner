import { NS } from "@ns"
import { algorithmicStockTraderI } from "/contracts/contract-algorithmic-stock-i"
import { algorithmicStockTraderII } from "/contracts/contract-algorithmic-stock-ii"
import { algorithmicStockTraderIII } from "/contracts/contract-algorithmic-stock-iii"
import { algorithmicStockTraderIV } from "/contracts/contract-algorithmic-stock-iv"
import { arrayJumpingGameI } from "/contracts/contract-array-jumping-game-i"
import { arrayJumpingGameII } from "/contracts/contract-array-jumping-game-ii"
import { compressionIIILzCompression } from "/contracts/contract-compression-iii-lz-compression"
import { compressionIILzDecompression } from "/contracts/contract-compression-ii-lz-decompression"
import { compressionIRleCompression } from "/contracts/contract-compression-i-rle-compression"
import { encryptionICaesarCipher } from "/contracts/contract-encryption-i-caesar-cipher"
import { encryptionIIVigenereCypher } from "/contracts/contract-encryption-ii-vigenere"
import { findLargestPrimeFactor } from "/contracts/contract-find-largest-prime-factor"
import { findValidMath } from "/contracts/contract-find-valid-math"
import { getAllServers } from "/lib/util"
import { hammingCodesEncodedToInteger } from "/contracts/contract-hammingcodes-encoded-to-integer"
import { hammingCodesIntegerToEncoded } from "/contracts/contract-hammingcodes-integer-to-encoded"
import { mergeOverlappingIntervals } from "/contracts/contract-merge-overlapping-intervals"
import { minPathSumInTriangle } from "/contracts/contract-min-path-sum-in-triangle"
import { proper2ColoringOfGraph } from "/contracts/contract-proper-2color-graph"
import { sanitizeParentheses } from "/contracts/contract-sanitize-parentheses"
import { shortestPathInAGrid } from "/contracts/contract-shortest-path-in-a-grid"
import { spiralizeMatrix } from "/contracts/contract-spiralize-matrix"
import { subarrayWithMaximumSum } from "/contracts/contract-subarray-with-maximum-sum"
import { totalWaysToSumII } from "/contracts/contract-total-ways-to-sum-ii"
import { uniquePathsInAGridI } from "/contracts/contract-unique-paths-in-a-grid-i"
import { uniquePathsInAGridII } from "/contracts/contract-unique-paths-in-a-grid-ii"

const CONTRACT_TYPE_TO_SCRIPT: {
    [contractType: string]: ((ns: NS, input: any) => string) | undefined
} = {
    "Find Largest Prime Factor": findLargestPrimeFactor,
    "Subarray with Maximum Sum": subarrayWithMaximumSum,
    "Total Ways to Sum": undefined,
    "Total Ways to Sum II": totalWaysToSumII,
    "Spiralize Matrix": spiralizeMatrix,
    "Array Jumping Game": arrayJumpingGameI,
    "Array Jumping Game II": arrayJumpingGameII,
    "Merge Overlapping Intervals": mergeOverlappingIntervals,
    "Generate IP Addresses": undefined,
    "Algorithmic Stock Trader I": algorithmicStockTraderI,
    "Algorithmic Stock Trader II": algorithmicStockTraderII,
    "Algorithmic Stock Trader III": algorithmicStockTraderIII,
    "Algorithmic Stock Trader IV": algorithmicStockTraderIV,
    "Minimum Path Sum in a Triangle": minPathSumInTriangle,
    "Unique Paths in a Grid I": uniquePathsInAGridI,
    "Unique Paths in a Grid II": uniquePathsInAGridII,
    "Shortest Path in a Grid": shortestPathInAGrid,
    "Sanitize Parentheses in Expression": sanitizeParentheses,
    "Find All Valid Math Expressions": findValidMath,
    "HammingCodes: Integer to Encoded Binary": hammingCodesIntegerToEncoded,
    "HammingCodes: Encoded Binary to Integer": hammingCodesEncodedToInteger,
    "Proper 2-Coloring of a Graph": proper2ColoringOfGraph,
    "Compression I: RLE Compression": compressionIRleCompression,
    "Compression II: LZ Decompression": compressionIILzDecompression,
    "Compression III: LZ Compression": compressionIIILzCompression,
    "Encryption I: Caesar Cipher": encryptionICaesarCipher,
    "Encryption II: Vigenère Cipher": encryptionIIVigenereCypher,
}

/**
 * Executes solvers for contracts across every server across the entire game.
 */
export async function main(ns: NS): Promise<void> {
    const contractsToServer = getAllServers(ns).flatMap((hostname) =>
        ns
            .ls(hostname)
            .filter((filename) => filename.endsWith(".cct"))
            .map((filename) => [filename, hostname] as [string, string])
    )

    for (const [contract, server] of contractsToServer) {
        const contractType = ns.codingcontract.getContractType(contract, server)
        const input = ns.codingcontract.getData(contract, server)
        const solver = CONTRACT_TYPE_TO_SCRIPT[contractType]

        if (solver !== undefined) {
            const answer = solver(ns, input)

            if (ns.args.includes("--submit")) {
                const result = ns.codingcontract.attempt(
                    answer,
                    contract,
                    server
                )
                if (result === "") {
                    ns.tprint(`Attempt with ${answer} failed.`)
                } else {
                    ns.tprint(
                        `Successful contract execution on ${contract}@${server}: ${result}`
                    )
                }
            } else {
                ns.tprint(`\t${contract}@${server} Answer: ${answer}`)
            }
        } else {
            ns.tprint(
                `${contract}@${server}: New contract type: "${contractType}"`
            )
            if (ns.args.includes("--show")) {
                ns.tprint(ns.codingcontract.getDescription(contract, server))
                ns.tprint(ns.codingcontract.getData(contract, server))
            }
        }
    }
}
