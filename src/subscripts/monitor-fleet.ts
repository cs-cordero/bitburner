import { NS } from "@ns"
import { formatNumber, formatPct, getTargetableServers, } from "/lib/util"
import { countIncomingThreads } from "/lib/threads";

/**
 * Provides information on the fleet (pwned, non-purchased).
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")
    while (true) {
        const targetToThreadCount = countIncomingThreads(ns)

        let data = getTargetableServers(ns)
            .map((hostname) => {
                const moneyCurr = ns.getServerMoneyAvailable(hostname)
                const moneyMax = ns.getServerMaxMoney(hostname)
                const securityLevel = ns.getServerSecurityLevel(hostname)
                const minSecurityLevel = ns.getServerMinSecurityLevel(hostname)
                const chance = ns.hackAnalyzeChance(hostname)

                const server = `${hostname}:`
                const availableMoney = formatNumber(moneyCurr)
                const maxMoney = formatNumber(moneyMax)
                const pctMoney = `(${formatPct((moneyCurr / moneyMax) * 100)}%)`
                const securityDelta = `+${formatNumber(
                    Math.max(0, securityLevel - minSecurityLevel),
                    false
                )}`
                const hackChance = `${formatPct(chance * 100)}%`

                return {
                    server,
                    availableMoney,
                    maxMoney,
                    pctMoney,
                    securityDelta,
                    moneyMax,
                    hackChance,
                }
            })

        data.sort((a, b) => b.moneyMax - a.moneyMax)
        const hostnamePad = data.reduce(
            (a, b) => Math.max(a, b.server.length),
            0
        )
        const curMoneyPad = data.reduce(
            (a, b) => Math.max(a, b.availableMoney.length),
            0
        )
        const maxMoneyPad = data.reduce(
            (a, b) => Math.max(a, b.maxMoney.length),
            0
        )
        const pctMoneyPad = data.reduce(
            (a, b) => Math.max(a, b.pctMoney.length),
            0
        )
        const deltaPad = data.reduce(
            (a, b) => Math.max(a, b.securityDelta.length),
            0
        )
        const chancePad = data.reduce((a, b) => Math.max(a, b.hackChance.length), 0)

        ns.clearLog()
        for (const datum of data) {
            const server = datum.server.padEnd(hostnamePad)
            const current = datum.availableMoney.padStart(curMoneyPad)
            const max = datum.maxMoney.padStart(maxMoneyPad)
            const pct = datum.pctMoney.padStart(pctMoneyPad)
            const delta = datum.securityDelta.padEnd(deltaPad)
            const hackChance = datum.hackChance.padStart(chancePad)

            const targetedHost = datum.server.replace(":", "")
            const threads = targetToThreadCount[targetedHost] ?? {
                incomingWeaken: 0,
                incomingGrow: 0,
                incomingHack: 0,
            }
            const threadDesc = `${threads.incomingWeaken}W ${threads.incomingGrow}G ${threads.incomingHack}H`

            ns.print(`${server} ${current} / ${max} ${pct} [${hackChance}] ${delta} ${threadDesc}`)
        }

        await ns.sleep(200)
    }
}
