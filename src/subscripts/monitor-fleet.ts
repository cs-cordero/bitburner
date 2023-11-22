import { NS } from "@ns"
import {
    formatNumber,
    formatPct,
    getAllServers,
    getPwndServers,
} from "/lib/util"

interface TargetThreadCount {
    growThreads: number
    weakenThreads: number
    hackThreads: number
}

/**
 * Provides information on the fleet (pwned, non-purchased).
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")
    const scripts = ["hack.js", "weaken.js", "grow.js"]
    while (true) {
        const targetToThreadCount: { [hostname: string]: TargetThreadCount } =
            {}
        getAllServers(ns)
            .filter((hostname) => ns.hasRootAccess(hostname))
            .forEach((hostname) => {
                for (const proc of ns.ps(hostname)) {
                    if (!scripts.includes(proc.filename)) {
                        continue
                    }

                    const target = proc.args[0] as string
                    const threads = proc.threads

                    if (targetToThreadCount[target] == undefined) {
                        targetToThreadCount[target] = {
                            growThreads: 0,
                            weakenThreads: 0,
                            hackThreads: 0,
                        }
                    }

                    if (proc.filename === "weaken.js") {
                        targetToThreadCount[target].weakenThreads += threads
                    } else if (proc.filename === "hack.js") {
                        targetToThreadCount[target].hackThreads += threads
                    } else if (proc.filename === "grow.js") {
                        targetToThreadCount[target].growThreads += threads
                    } else {
                        throw new Error("Oops")
                    }
                }
            })

        const data = getPwndServers(ns)
            .filter((hostname) => !hostname.startsWith("home"))
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
                const hackChance = `${formatPct(chance)}%`
                const evMax = formatNumber(chance * moneyMax)
                const ev = `[${evMax} (${hackChance})]`

                return {
                    server,
                    availableMoney,
                    maxMoney,
                    pctMoney,
                    securityDelta,
                    moneyMax,
                    ev,
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
        const evPad = data.reduce((a, b) => Math.max(a, b.ev.length), 0)

        ns.clearLog()
        for (const datum of data) {
            const server = datum.server.padEnd(hostnamePad)
            const current = datum.availableMoney.padStart(curMoneyPad)
            const max = datum.maxMoney.padStart(maxMoneyPad)
            const pct = datum.pctMoney.padStart(pctMoneyPad)
            const delta = datum.securityDelta.padEnd(deltaPad)
            const ev = datum.ev.padStart(evPad)

            const threads = targetToThreadCount[
                datum.server.replace(":", "")
            ] ?? {
                weakenThreads: 0,
                growThreads: 0,
                hackThreads: 0,
            }
            const threadDesc = `${threads.weakenThreads}W ${threads.growThreads}G ${threads.hackThreads}H`

            ns.print(
                `${server} ${current} / ${max} ${pct} ${ev} ${delta} ${threadDesc}`
            )
        }

        await ns.sleep(200)
    }
}
