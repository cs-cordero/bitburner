import { NS } from "@ns";

/**
 * Sanitize Parentheses in Expression
 */
export function sanitizeParentheses(ns: NS, input: any): string {
    const original = (input as string).split("")

    const potentialFixes = fix(ns, original, 0, [], 0, 0)
    const minRemovals = potentialFixes
        .map(fix => fix.removals)
        .reduce((a, b) => Math.min(a, b))

    const fixes = potentialFixes
        .filter(fix => fix.removals === minRemovals)
        .map(fix => fix.s)
        .map(fix => `"${fix.toString()}"`)
    const dedupedFixes = [...new Set(fixes)].join(",")
    return `[${dedupedFixes}]`
}

interface FixedParentheses {
    s: string,
    removals: number
}

function fix(ns: NS, s: string[], index: number, fixed: string[], openCount: number, removals: number): FixedParentheses[] {
    if (index === s.length) {
        if (openCount === 0) {
            return [{
                s: fixed.join(""),
                removals
            }]
        } else {
            return []
        }
    }

    const currentChar = s[index]
    const mustSkip = currentChar !== "(" && currentChar !== ")"
    const mustRemove = currentChar === ")" && openCount === 0

    const result = []

    if (!mustSkip) {
        // remove the character
        result.push(...fix(ns, s, index + 1, [...fixed], openCount, removals + 1))
    }

    if (!mustRemove) {
        const newOpenCount = currentChar === "(" ? openCount + 1 : currentChar === ")" ? openCount - 1 : openCount
        // keep the character
        result.push(...fix(ns, s, index + 1, [...fixed, s[index]], newOpenCount, removals))
    }

    return result
}