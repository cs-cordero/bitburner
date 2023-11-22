import { NS } from "@ns";

/**
 * Encryption II: Vigenère Cipher
 */
export function encryptionIIVigenereCypher(ns: NS, input: any): string {
    const data = input as [string, string]
    const [plaintext, keyword] = data

    const cipher: string[] = []

    let i = 0
    const raw = plaintext.toUpperCase().split("")
    const keywordSplit = keyword.toUpperCase().split("")
    for (const plainChar of raw) {
        const keywordChar = keywordSplit[i]
        const cipherChar = vigenere(plainChar, keywordChar)
        cipher.push(cipherChar)
        i += 1
        i %= keywordSplit.length
    }

    return cipher.join("")
}

const LOWEST_CODE = "A".charCodeAt(0)

function vigenere(leftChar: string, rightChar: string): string {
    const leftCharCode = leftChar.toUpperCase().charCodeAt(0) - LOWEST_CODE
    const rightCharCode = rightChar.toUpperCase().charCodeAt(0) - LOWEST_CODE
    return String.fromCharCode((leftCharCode + rightCharCode) % 26 + LOWEST_CODE)
}