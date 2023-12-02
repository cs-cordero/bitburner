import { NS } from "@ns"
import { formatMs, getTargetableServers, round } from "/lib/util"

/**
 * Provides information on the grow, weaken, and hack times for every pwned server.
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")
    while (true) {
        const data = getTargetableServers(ns).map((hostname) => {
            const hackTime = formatMs(ns.getHackTime(hostname))
            const growTime = ns.getGrowTime(hostname)
            const weakenTime = formatMs(ns.getWeakenTime(hostname))
            const growth = ns.getServerGrowth(hostname)
            const maxMoney = ns.getServerMaxMoney(hostname)

            return {
                server: hostname,
                hackTime,
                growTime: formatMs(growTime),
                weakenTime,
                growthMetric: round(((growth / (growTime / 1000)) * maxMoney) / 1_000_000, 1),
            }
        })

        data.sort((a, b) => a.server.localeCompare(b.server))
        const serverPad = data.reduce((a, b) => Math.max(a, b.server.length), 0)
        const hackPad = data.reduce((a, b) => Math.max(a, b.hackTime.length), 0)
        const growPad = data.reduce((a, b) => Math.max(a, b.growTime.length), 0)
        const weakenPad = data.reduce((a, b) => Math.max(a, b.weakenTime.length), 0)
        const growthPad = data.reduce((a, b) => Math.max(a, b.growthMetric.toString().length), 0)

        ns.clearLog()
        ns.print(
            `${"".padStart(serverPad)} ${"HACK".padStart(hackPad)} ${"WEAKEN".padStart(hackPad)} ${"GROW".padStart(
                growPad
            )}`
        )
        for (const datum of data) {
            const server = datum.server.padEnd(serverPad)
            const h = datum.hackTime.padStart(hackPad)
            const g = datum.growTime.padStart(growPad)
            const w = datum.weakenTime.padStart(weakenPad)
            const m = datum.growthMetric.toString().padEnd(growthPad)

            ns.print(`${server} ${h} ${w} ${g} (${m})`)
        }

        await ns.sleep(200)
    }
}
