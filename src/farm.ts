import { NS } from "@ns"
import { getPrintFunc, getTargetedScriptArgs, waitUntilPidFinishes } from "/lib/util"
import { estimateGrowWeakenDistribution, estimateHackWeakenDistribution } from "/lib/threads"

export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)
    const args = getTargetedScriptArgs(ns)

    const totalThreads = args.threads ?? 4400

    let cycle = 1
    while (true) {
        while (ns.getServerSecurityLevel(args.target) > ns.getServerMinSecurityLevel(args.target)) {
            print(`sapping ${args.target}, cycle ${cycle++}`)
            const weakenPid = ns.run(
                "weaken.js",
                { threads: totalThreads },
                args.target,
                totalThreads,
                "--silent",
                "--once"
            )
            await waitUntilPidFinishes(ns, weakenPid)
        }

        while (ns.getServerMoneyAvailable(args.target) < ns.getServerMaxMoney(args.target)) {
            print(`farming ${args.target}, cycle ${cycle++}`)
            const threadDistribution = estimateGrowWeakenDistribution(ns, totalThreads)
            const growPid = ns.run(
                "grow.js",
                { threads: threadDistribution.growThreads },
                args.target,
                threadDistribution.growThreads,
                "--silent",
                "--once"
            )
            const weakenPid = ns.run(
                "weaken.js",
                { threads: threadDistribution.weakenThreads },
                args.target,
                threadDistribution.weakenThreads,
                "--silent",
                "--once"
            )

            await waitUntilPidFinishes(ns, growPid)
            await waitUntilPidFinishes(ns, weakenPid)
        }

        print(`harvesting ${args.target}, cycle ${cycle++}`)
        const threadDistribution = estimateHackWeakenDistribution(ns, totalThreads)
        const hackPid = ns.run(
            "hack.js",
            { threads: threadDistribution.hackThreads },
            args.target,
            threadDistribution.hackThreads,
            "--silent",
            "--once"
        )
        const weakenPid = ns.run(
            "weaken.js",
            { threads: threadDistribution.weakenThreads },
            args.target,
            threadDistribution.weakenThreads,
            "--silent",
            "--once"
        )

        await waitUntilPidFinishes(ns, hackPid)
        await waitUntilPidFinishes(ns, weakenPid)
    }
}
