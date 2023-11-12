import { NS } from "@ns";
import { getPrintFunc, getTargetedScriptArgs, round, shouldRunOnlyOnce } from "/util";

/**
 * Runs grow() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    while (true) {
        const growth = await ns.grow(args.target, { threads: args.threads });
        print(`[${ns.getHostname()}] Grow completed on ${args.target} with effective increase of ${round(growth, 3)}x.`)

        if (shouldRunOnlyOnce(ns)) {
            break;
        }
    }
}