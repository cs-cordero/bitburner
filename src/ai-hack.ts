import { NS } from "@ns";
import {
    allocateThreadsForScript, formatMs,
    getNumberOfWeakenThreadsNeeded,
    getPrintFunc,
    getPwndServers, waitUntilPidFinishes,
} from "/util";

/**
 * Long-running process that launches big hack attacks at servers with maxed out money.
 * Meant to be used from "home" server.
 */
export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns);
    const memCost = ns.getScriptRam("hack.js")
    // leave free around 10GB if its available.
    const memFree = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) - 10
    const threads = Math.floor(memFree / memCost);


    while (true) {
        const targets = getPwndServers(ns)
            .filter(target => !ns.getPurchasedServers().includes(target))
            .filter(target => target !== "home")
            .filter(target => ns.getServerMoneyAvailable(target) >= ns.getServerMaxMoney(target))
            .filter(target => ns.getServerMoneyAvailable(target) > 0)
        targets.sort((a, b) => ns.getServerMoneyAvailable(b) - ns.getServerMoneyAvailable(a))

        if (!targets.length) {
            print("[AI-HACK] No targets to hack.")
        }

        for (const target of targets) {
            if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
                // only run hack() against flush targets
                continue
            }

            const hackTime = formatMs(ns.getHackTime(target))

            print(`[AI-HACK] Target ${target}: Using ${threads} threads. Expected completion in ${hackTime}...`)
            await waitUntilPidFinishes(ns, ns.exec("hack.js", ns.getHostname(), { threads }, target, threads, "--silent", "--once"))
            print(`[AI-HACK] Target ${target}: Using ${threads} threads. Successful.`)
            break;
        }

        await ns.sleep(10000);
    }
}