import { NS } from "@ns";
import { getPrintFunc, getTargetedScriptArgs, round, shouldRunOnlyOnce } from "/util";

/**
 * Runs weaken() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    while (true) {
        const weakenAmount = await ns.weaken(args.target, { threads: args.threads });
        print(`[${ns.getHostname()}] Weakened ${args.target} by ${round(weakenAmount, 3)} security level.`)

        if (shouldRunOnlyOnce(ns)) {
            break;
        }
    }
}