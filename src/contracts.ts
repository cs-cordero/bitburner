import { NS } from "@ns"
import { algorithmicStockTraderI } from "/contracts/contract-algorithmic-stock-i"
import { algorithmicStockTraderII } from "/contracts/contract-algorithmic-stock-ii"
import { algorithmicStockTraderIII } from "/contracts/contract-algorithmic-stock-iii"
import { algorithmicStockTraderIV } from "/contracts/contract-algorithmic-stock-iv"
import { arrayJumpingGameI } from "/contracts/contract-array-jumping-game-i"
import { arrayJumpingGameII } from "/contracts/contract-array-jumping-game-ii"
import { compressionIILzDecompression } from "/contracts/contract-compression-ii-lz-decompression"
import { compressionIRleCompression } from "/contracts/contract-compression-i-rle-compression"
import { encryptionICaesarCipher } from "/contracts/contract-encryption-i-caesar-cipher"
import { encryptionIIVigenereCypher } from "/contracts/contract-encryption-ii-vigenere"
import { findLargestPrimeFactor } from "/contracts/contract-find-largest-prime-factor"
import { findValidMath } from "/contracts/contract-find-valid-math"
import { getAllServers, getPrintFunc, shouldRunOnlyOnce } from "/lib/util"
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
import { generateIpAddresses } from "/contracts/contract-generate-ip-addresses"
import { totalWaysToSumI } from "/contracts/contract-total-ways-to-sum-i"
import { compressionIIILzCompression } from "/contracts/contract-compression-iii-lz-compression"

const CONTRACT_TYPE_TO_SCRIPT: {
    [contractType: string]: ((ns: NS, input: any) => string) | undefined
} = {
    "Find Largest Prime Factor": findLargestPrimeFactor,
    "Subarray with Maximum Sum": subarrayWithMaximumSum,
    "Total Ways to Sum": totalWaysToSumI,
    "Total Ways to Sum II": totalWaysToSumII,
    "Spiralize Matrix": spiralizeMatrix,
    "Array Jumping Game": arrayJumpingGameI,
    "Array Jumping Game II": arrayJumpingGameII,
    "Merge Overlapping Intervals": mergeOverlappingIntervals,
    "Generate IP Addresses": generateIpAddresses,
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
    const print = getPrintFunc(ns)

    while (true) {
        const contractsToServer = getAllServers(ns).flatMap((hostname) =>
            ns
                .ls(hostname)
                .filter((filename) => filename.endsWith(".cct"))
                .map((filename) => [filename, hostname] as [string, string])
        )

        if (!contractsToServer.length) {
            print("No contracts to work on!")
            await ns.sleep(10000)
            continue
        }

        for (const [contract, server] of contractsToServer) {
            const contractType = ns.codingcontract.getContractType(contract, server)
            const input = ns.codingcontract.getData(contract, server)
            const solver = CONTRACT_TYPE_TO_SCRIPT[contractType]

            if (solver !== undefined) {
                const answer = solver(ns, input)

                if (ns.args.includes("--submit")) {
                    const result = ns.codingcontract.attempt(answer, contract, server)
                    if (result === "") {
                        print(`Attempt with ${answer} failed. (${contractType})`)
                    } else {
                        print(`Successful contract execution on ${contract}@${server}: ${result}`)
                    }
                } else {
                    print(`  ${contract}@${server}`)
                    print(`    Type: ${contractType}`)
                    print(`    Answer: ${answer}`)
                    print(`    Input: ${input}`)
                    print(`    Attempts Remaining: ${ns.codingcontract.getNumTriesRemaining(contract, server)}`)
                }
            } else {
                print(`${contract}@${server}: New contract type: "${contractType}"`)
                if (ns.args.includes("--show")) {
                    print(ns.codingcontract.getDescription(contract, server))
                    print(ns.codingcontract.getData(contract, server))
                }
            }
            await ns.sleep(5000)
        }

        if (shouldRunOnlyOnce(ns)) {
            break
        }

        await ns.sleep(10000)
    }
}
