import { NS } from "@ns"
import { countIncomingThreads } from "/lib/threads";
import { AlignDirection, Column, getTargetableServers, numberWithCommas, printTable } from "/lib/util";

/**
 * Provides information on the fleet (pwned, non-purchased).
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")

    const headerSpec = [
        ["hostname", { displayName: "Server", alignment: AlignDirection.Left }],
        ["availableMoney", { displayName: "Current $", alignment: AlignDirection.Right }],
        ["maxMoney", { displayName: "Max $", alignment: AlignDirection.Right }],
        ["pctMoney", { displayName: "Pct %", alignment: AlignDirection.Right }],
        ["hackChance", { displayName: "Chance", alignment: AlignDirection.Right }],
        ["securityDelta", { displayName: "Sec Lvl", alignment: AlignDirection.Right }],
        ["weaken", { displayName: "Weak", alignment: AlignDirection.Right }],
        ["grow", { displayName: "Grow", alignment: AlignDirection.Right }],
        ["hack", { displayName: "Hack", alignment: AlignDirection.Right }],
    ] satisfies [string, Column][]

    while (true) {
        const targetToThreadCount = countIncomingThreads(ns)

        const data = getTargetableServers(ns).map((hostname) => {
            const moneyCurr = ns.getServerMoneyAvailable(hostname)
            const moneyMax = ns.getServerMaxMoney(hostname)
            const securityLevel = ns.getServerSecurityLevel(hostname)
            const minSecurityLevel = ns.getServerMinSecurityLevel(hostname)
            const chance = ns.hackAnalyzeChance(hostname)

            const incomingThreadCounts = targetToThreadCount[hostname]
            const weaken = numberWithCommas(incomingThreadCounts?.incomingWeaken ?? 0).padStart(6)
            const grow = numberWithCommas(incomingThreadCounts?.incomingGrow ?? 0).padStart(6)
            const hack = numberWithCommas(incomingThreadCounts?.incomingHack ?? 0).padStart(6)

            return [
                {
                    hostname,
                    availableMoney: `$${ns.formatNumber(moneyCurr, 1)}`,
                    maxMoney: `$${ns.formatNumber(moneyMax, 1)}`,
                    pctMoney: moneyMax === 0 ? "N/A " : `(${ns.formatNumber((moneyCurr / moneyMax) * 100, 0)}%)`,
                    securityDelta:  `+${ns.formatNumber(Math.max(0, securityLevel - minSecurityLevel), 2)}`,
                    hackChance: `${ns.formatNumber(chance * 100, 0)}%`,
                    weaken: `${weaken}W`,
                    grow: `${grow}G`,
                    hack: `${hack}H`,
                },
                moneyMax
            ] as const
        })

        data.sort((a, b) => b[1] - a[1])

        ns.clearLog()
        printTable(data.map(([a,]) => a), headerSpec, ns.print)
        await ns.sleep(500)
    }
}
