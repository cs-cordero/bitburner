import { NS } from "@ns"
import { formulasApiActive, getPrintFunc, getTargetedScriptArgs, ProcessId, waitUntilPidsFinish } from "/lib/util";
import {
    allocateFleetThreadsForScript,
    estimateGrowWeakenDistribution,
    estimateGrowWeakenDistributionSmart,
    estimateHackWeakenDistribution,
    estimateHackWeakenDistributionSmart,
    estimateWeakenThreadToMinimize,
    executeScriptThreadAllocations,
    getFleetThreadManifest
} from "/lib/threads";

const DEFAULT_THREADS = 4400

export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)
    const args = getTargetedScriptArgs(ns)

    while (true) {
        // Sap to minimize security level
        while (ns.getServerSecurityLevel(args.target) > ns.getServerMinSecurityLevel(args.target)) {
            const weakenThreadsNeeded = estimateWeakenThreadToMinimize(ns, args.target)
            if (weakenThreadsNeeded <= 0) {
                // nothing to do but wait
                await ns.sleep(2500)
            } else {
                print(`sapping ${args.target}`)
                const allocations = allocateFleetThreadsForScript(ns, "weaken.js", weakenThreadsNeeded)
                await waitUntilPidsFinish(ns, executeScriptThreadAllocations(ns, args.target, allocations).filter(pid => pid !== 0))
                await ns.sleep(1000)
            }
        }

        // Grow-Weaken until money is maximized
        while (ns.getServerMoneyAvailable(args.target) < ns.getServerMaxMoney(args.target)) {
            let growWeakenDistribution;
            if (formulasApiActive(ns)) {
                growWeakenDistribution = estimateGrowWeakenDistributionSmart(ns, args.target)
            } else {
                growWeakenDistribution = estimateGrowWeakenDistribution(ns, args.threads ?? DEFAULT_THREADS)
            }

            while (getFleetThreadManifest(ns).free < (growWeakenDistribution.growThreads + growWeakenDistribution.weakenThreads)) {
                await ns.sleep(2500)
            }

            if (growWeakenDistribution.growThreads <= 0 && growWeakenDistribution.weakenThreads <= 0) {
                // nothing to do but wait
                await ns.sleep(2500)
            } else {
                print(`farming ${args.target}`)
                const pids: ProcessId[] = []
                if (growWeakenDistribution.growThreads) {
                    executeScriptThreadAllocations(
                        ns,
                        args.target,
                        allocateFleetThreadsForScript(ns, "grow.js", growWeakenDistribution.growThreads)
                    ).forEach(pid => pids.push(pid))
                }
                if (growWeakenDistribution.weakenThreads) {
                    executeScriptThreadAllocations(
                        ns,
                        args.target,
                        allocateFleetThreadsForScript(ns, "weaken.js", growWeakenDistribution.weakenThreads)
                    ).forEach(pid => pids.push(pid))
                }

                await waitUntilPidsFinish(ns, pids.filter(pid => pid !== 0))
            }
        }

        // Hack-Weaken until a successful hack occurs, stealing a nonzero amount of money.
        while (ns.getServerMoneyAvailable(args.target) >= ns.getServerMaxMoney(args.target)) {
            let hackWeakenDistribution;
            if (formulasApiActive(ns)) {
                hackWeakenDistribution = estimateHackWeakenDistributionSmart(ns, args.target)
            } else {
                hackWeakenDistribution = estimateHackWeakenDistribution(ns, args.threads ?? DEFAULT_THREADS)
            }

            while (getFleetThreadManifest(ns).free < (hackWeakenDistribution.hackThreads + hackWeakenDistribution.weakenThreads)) {
                await ns.sleep(2500)
            }

            if (hackWeakenDistribution.hackThreads <= 0 && hackWeakenDistribution.weakenThreads <= 0) {
                // nothing to do but wait
                await ns.sleep(2500)
            } else {
                print(`harvesting ${args.target}`)

                const pids: ProcessId[] = []
                if (hackWeakenDistribution.hackThreads) {
                    executeScriptThreadAllocations(
                        ns,
                        args.target,
                        allocateFleetThreadsForScript(ns, "hack.js", hackWeakenDistribution.hackThreads)
                    ).forEach(pid => pids.push(pid))
                }
                if (hackWeakenDistribution.weakenThreads) {
                    executeScriptThreadAllocations(
                        ns,
                        args.target,
                        allocateFleetThreadsForScript(ns, "weaken.js", hackWeakenDistribution.weakenThreads)
                    ).forEach(pid => pids.push(pid))
                }

                await waitUntilPidsFinish(ns, pids.filter(pid => pid !== 0))
            }
        }
    }
}
