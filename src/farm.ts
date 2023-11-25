import { NS } from "@ns"
import { getPrintFunc, getTargetedScriptArgs, waitUntilPidFinishes } from "/lib/util";

export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)
    const args = getTargetedScriptArgs(ns)

    let cycle = 1
    while (true) {
        while (ns.getServerSecurityLevel(args.target) > ns.getServerMinSecurityLevel(args.target)) {
            print(`sapping ${args.target}, cycle ${cycle++}`)
            const weakenPid = ns.run("weaken.js", {threads: 4400}, args.target, 4400, "--silent", "--once")
            await waitUntilPidFinishes(ns, weakenPid)
        }

        while (ns.getServerMoneyAvailable(args.target) < ns.getServerMaxMoney(args.target)) {
            print(`farming ${args.target}, cycle ${cycle++}`)
            const growPid = ns.run("grow.js", {threads: 4000}, args.target, 4000, "--silent", "--once")
            const weakenPid = ns.run("weaken.js", {threads: 400}, args.target, 400, "--silent", "--once")

            await waitUntilPidFinishes(ns, growPid)
            await waitUntilPidFinishes(ns, weakenPid)
        }

        print(`harvesting ${args.target}, cycle ${cycle++}`)
        const hackPid = ns.run("hack.js", {threads: 4000}, args.target, 4000, "--silent", "--once")
        const weakenPid = ns.run("weaken.js", {threads: 400}, args.target, 400, "--silent", "--once")

        await waitUntilPidFinishes(ns, hackPid)
        await waitUntilPidFinishes(ns, weakenPid)
    }
}
