import { NS } from "@ns"

const LOWEST_ORD = "A".charCodeAt(0)
const HIGHEST_ORD = "Z".charCodeAt(0)

/**
 * Encryption I: Caesar Cipher
 */
export function encryptionICaesarCipher(ns: NS, input: any): string {
    const [unencrypted, caesarShift] = input as [string, number]
    return unencrypted
        .split(" ")
        .map((word) =>
            word
                .split("")
                .map((char) => char.charCodeAt(0))
                .map((charCode) => charCode - LOWEST_ORD)
                .map((charCode) => charCode - caesarShift + HIGHEST_ORD - LOWEST_ORD + 1)
                .map((charCode) => charCode % (HIGHEST_ORD - LOWEST_ORD + 1))
                .map((charCode) => charCode + LOWEST_ORD)
                .map((charCode) => String.fromCharCode(charCode))
                .join("")
        )
        .join(" ")
}
