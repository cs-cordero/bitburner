import { NS } from "@ns";
import { formatNumber, getPrintFunc, getTargetedScriptArgs, isNumber, isString, round, shouldRunOnlyOnce } from "/util";

/**
 * Runs hack() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    while (true) {
        const money = await ns.hack(args.target, { threads: args.threads });
        print(`[${ns.getHostname()}] Hacked ${args.target} and acquired ${formatNumber(money)}.`)

        if (shouldRunOnlyOnce(ns)) {
            break;
        }
    }
}