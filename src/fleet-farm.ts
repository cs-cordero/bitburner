import { NS } from "@ns"
import {
    allocateThreadsForScript,
    formulasApiActive,
    getFleetThreadManifest,
    getPrintFunc,
    getTargetedScriptArgs,
    waitUntilPidFinishes
} from "/lib/util";

export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)
    const args = getTargetedScriptArgs(ns)

    const farmThreadsRequired = 4400

    const getGrowThreadCounts = () => {
        if (formulasApiActive(ns)) {
            const growThreads = ns.formulas.hacking.growThreads(
                ns.getServer(args.target),
                ns.getPlayer(),
                ns.getServerMaxMoney(args.target),
                1
            );
            const securityLevelIncreaseFromGrow = 0.004 * growThreads
            const weakenThreads = Math.ceil(securityLevelIncreaseFromGrow / 0.05)

            if (growThreads > 4074) {
                return {
                    grow: 4074,
                    weaken: 326
                }
            } else {
                return {
                    grow: growThreads,
                    weaken: weakenThreads
                }
            }
        } else {
            return {
                grow: 4074,
                weaken: 326
            }
        }
    }

    const getHackThreadCounts = () => {
        if (formulasApiActive(ns)) {
            const hackPctPerThread = ns.formulas.hacking.hackPercent(
                ns.getServer(args.target),
                ns.getPlayer(),
            );
            const hackThreads = Math.ceil(1 / hackPctPerThread)
            const securityLevelIncreaseFromHack = 0.002 * hackThreads
            const weakenThreads = Math.ceil(securityLevelIncreaseFromHack / 0.05)

            if (hackThreads > 4230) {
                return {
                    hack: 4230,
                    weaken: 170
                }
            } else {
                return {
                    hack: hackThreads,
                    weaken: weakenThreads
                }
            }
        } else {
            return {
                hack: 4230,
                weaken: 170
            }
        }
    }

    let cycle = 1
    while (true) {
        while (ns.getServerSecurityLevel(args.target) > ns.getServerMinSecurityLevel(args.target)) {
            while (getFleetThreadManifest(ns).fleetThreadsFree < farmThreadsRequired) {
                await ns.sleep(2500)
            }

            print(`sapping ${args.target}, cycle ${cycle++}`)
            for (const pid of allocateAndExecute(ns, "grow.js", args.target, 0, 4400)) {
                await waitUntilPidFinishes(ns, pid)
            }
        }

        while (ns.getServerMoneyAvailable(args.target) < ns.getServerMaxMoney(args.target)) {
            while (getFleetThreadManifest(ns).fleetThreadsFree < farmThreadsRequired) {
                await ns.sleep(2500)
            }

            print(`farming ${args.target}, cycle ${cycle++}`)
            const { grow, weaken } = getGrowThreadCounts()
            for (const pid of allocateAndExecute(ns, "grow.js", args.target, grow, weaken)) {
                await waitUntilPidFinishes(ns, pid)
            }
        }

        while (ns.getServerMoneyAvailable(args.target) >= ns.getServerMaxMoney(args.target)) {
            while (getFleetThreadManifest(ns).fleetThreadsFree < farmThreadsRequired) {
                await ns.sleep(2500)
            }

            print(`harvesting ${args.target}, cycle ${cycle++}`)
            const { hack, weaken } = getHackThreadCounts()
            for (const pid of allocateAndExecute(ns, "hack.js", args.target, hack, weaken)) {
                await waitUntilPidFinishes(ns, pid)
            }
        }
    }
}


function allocateAndExecute(
    ns: NS,
    script: "grow.js" | "hack.js",
    target: string,
    growOrHackCount: number,
    weakenCount: number
): number[] {
    const pids: number[] = []

    if (growOrHackCount > 0) {
        allocateThreadsForScript(ns, script, growOrHackCount)
            .map(allocation => ns.exec(
                allocation.scriptName,
                allocation.hostname,
                { threads: allocation.threads },
                target, allocation.threads, "--silent", "--once"
            ))
            .forEach(pid => pids.push(pid))
    }

    if (weakenCount > 0) {
        allocateThreadsForScript(ns, "weaken.js", weakenCount)
            .map(allocation => ns.exec(
                allocation.scriptName,
                allocation.hostname,
                { threads: allocation.threads },
                target, allocation.threads, "--silent", "--once"
            ))
            .forEach(pid => pids.push(pid))
    }

    return pids.filter(pid => pid !== 0)
}