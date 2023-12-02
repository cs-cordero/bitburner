import { NS } from "@ns"
import { getTargetedArguments } from "/lib/util"
import { fleetAttack } from "/lib/fleet-attack";

/**
 * Orders the fleet to grow() a single target with a specified number of threads.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedArguments(ns)
    await fleetAttack(ns, "grow.js", args)
}
