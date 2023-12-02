import { NS } from "@ns"

/**
 * Purchases the TOR server using its singularity function.
 */
export async function main(ns: NS): Promise<void> {
    ns.singularity.purchaseTor()
}
