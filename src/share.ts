import { NS } from "@ns"

/**
 * Executes share().
 */
export async function main(ns: NS): Promise<void> {
    while (true) {
        await ns.share()
    }
}
