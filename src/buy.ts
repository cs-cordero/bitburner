import { NS } from "@ns"
import {
    getPrintFunc,
    isNumber,
    parseArguments,
    PositionalArgType,
    PURCHASED_SERVER_PREFIX,
    ScriptArguments,
    ScriptArgumentsSpec
} from "/lib/util"

/**
 * Purchases/Upgrades servers or hacknet nodes.  TOR is not supported yet to keep RAM usage low.
 */
export async function main(ns: NS): Promise<void> {
    const args = getArgs(ns)
    const print = getPrintFunc(ns, args.silent)

    if (args.check) {
        checkBuyServers(ns, args)
    } else if (args.hacknet) {
        await buyHacknet(ns)
    } else {
        const ram = args.ram ?? 2
        if (!isNumber(ram)) {
            throw Error("If you provide a ram amount, it should be numeric")
        }
        const allowPartialUpgrade = args.partial

        const purchasedServerLimit = ns.getPurchasedServerLimit()
        const purchasedServerCount = ns.getPurchasedServers().length
        const countToBuy = purchasedServerLimit - purchasedServerCount

        const perServerCost = ns.getPurchasedServerCost(ram)
        const totalBuyCost = perServerCost * countToBuy
        const totalUpgradeCost = ns
            .getPurchasedServers()
            .map((server) => Math.max(0, ns.getPurchasedServerUpgradeCost(server, ram)))
            .reduce((a, b) => a + b, 0)
        const totalCost = totalBuyCost + totalUpgradeCost

        if (ns.getPlayer().money < totalCost && !allowPartialUpgrade) {
            print(`Not enough money to buy/upgrade fleet standardized to ${ram} RAM.`)
            print(`Buy cost: ${totalBuyCost} Upgrade cost: ${totalUpgradeCost}`)
            return
        } else {
            // Helper binded method that returns monotonically increasing server numbers.
            const getNextServerNumber = (() => {
                let highestNumberedHomeServer = ns
                    .getPurchasedServers()
                    .map((hostname) => hostname.replace(`${PURCHASED_SERVER_PREFIX}-`, ""))
                    .map((hostNum) => parseInt(hostNum, 10))
                    .reduce((prev, curr) => (prev > curr ? prev : curr), 0)

                return () => {
                    highestNumberedHomeServer += 1
                    return highestNumberedHomeServer
                }
            })()

            // Perform all server purchases.
            // Purchases come before upgrades
            while (ns.getPlayer().money >= perServerCost && ns.getPurchasedServers().length < purchasedServerLimit) {
                const serverNum = getNextServerNumber()
                ns.purchaseServer(`${PURCHASED_SERVER_PREFIX}-${serverNum}`, ram)
                print(`Acquired ${PURCHASED_SERVER_PREFIX}-${serverNum}.`)
            }

            // Perform all server upgrades
            for (const server of ns.getPurchasedServers()) {
                if (ns.getServerMaxRam(server) >= ram) {
                    continue
                }

                const upgradeCost = ns.getPurchasedServerUpgradeCost(server, ram)
                if (ns.getPlayer().money >= upgradeCost) {
                    ns.upgradePurchasedServer(server, ram)
                    print(`Upgraded ${server} to ${ram}GB.`)
                }
            }
        }
    }
}

type Required = "silent" | "check" | "hacknet" | "partial"
type Optional = "ram"
type ArgumentNames = Required & Optional
const ArgsSpec: ScriptArgumentsSpec<ArgumentNames> = {
    targets: {
        type: "POSITIONAL",
        position: 0,
        argType: PositionalArgType.Number,
        optional: true
    },
    silent: { type: "FLAG" },
    check: { type: "FLAG" },
    hacknet: { type: "FLAG" },
    partial: { type: "FLAG" },
}
interface Args extends ScriptArguments<Required, Optional> {
    ram?: number
    silent: boolean
    check: boolean
    hacknet: boolean
    partial: boolean
}
function getArgs(ns: NS): Args {
    return parseArguments<Required, Optional, typeof ArgsSpec, Args>(ns, ArgsSpec)
}

/**
 * Scans the purchased servers and determines the highest RAM you can purchase with the buy.js script.
 */
function checkBuyServers(ns: NS, args: Args) {
    const {
        maximumReached,
        recommendedCost,
        recommendedRam,
        nextRam,
        nextCost,
        ramToServerCount
    } = analyzeBuyDetails(ns)
    const print = getPrintFunc(ns, args.silent)

    if (maximumReached && recommendedCost === 0) {
        print("Maximum purchased server count and RAM achieved")
    } else if (!maximumReached && recommendedCost === 0) {
        print("Cannot buy/purchase more servers or RAM at the moment")
    } else {
        const ramDescription = Object.entries(ramToServerCount)
            .map(([ram, count]) => `${count} hosts at ${ram} RAM`)
            .join(", ")
        print(ramDescription)
        print(`Can buy/upgrade to ${recommendedRam} RAM at cost $${ns.formatNumber(recommendedCost)}`)
    }

    if (!maximumReached) {
        print(`\tThe next RAM (${nextRam}) will cost $${ns.formatNumber(nextCost)}`)
    }
}

interface BuyDetails {
    maximumReached: boolean
    recommendedCost: number
    recommendedRam: number
    nextRam: number
    nextCost: number
    ramToServerCount: { [ram: number]: number }
}

function analyzeBuyDetails(ns: NS): BuyDetails {
    const money = ns.getPlayer().money

    const maxCountServersToPurchase = ns.getPurchasedServerLimit()
    const servers = ns.getPurchasedServers()
    const serversToBuy = maxCountServersToPurchase - servers.length
    const existingServerMinRam = servers.map((server) => ns.getServerMaxRam(server)).reduce((a, b) => Math.min(a, b), 0)

    let confirmedRam = existingServerMinRam
    let ramToEvaluate = Math.max(2, existingServerMinRam * 2)
    let costToReport = 0
    let lastCostEvaluated = 0
    let maximumReached = false
    while (true) {
        const costToPurchase = ns.getPurchasedServerCost(ramToEvaluate) * serversToBuy
        const costToUpgrade = servers
            .map((server) => Math.max(0, ns.getPurchasedServerUpgradeCost(server, ramToEvaluate)))
            .reduce((a, b) => a + b, 0)
        const totalCost = costToUpgrade + costToPurchase

        if (totalCost > money) {
            // we can't afford it
            lastCostEvaluated = totalCost
            break
        }

        confirmedRam = ramToEvaluate
        costToReport = totalCost
        ramToEvaluate *= 2

        if (ramToEvaluate > ns.getPurchasedServerMaxRam()) {
            // the next eval would exceed max purchased server
            maximumReached = true
            break
        }
    }

    const ramToServerCount: { [ram: number]: number } = {}
    servers.forEach((server) => {
        const ram = ns.getServerMaxRam(server)
        if (ramToServerCount[ram] === undefined) {
            ramToServerCount[ram] = 0
        }
        ramToServerCount[ram] += 1
    })

    return {
        maximumReached,
        recommendedCost: costToReport,
        recommendedRam: confirmedRam,
        nextRam: ramToEvaluate,
        nextCost: lastCostEvaluated,
        ramToServerCount,
    }
}

async function buyHacknet(ns: NS) {
    while (true) {
        const nodeCount = ns.hacknet.numNodes()
        const index = nodeCount - 1
        let editMade = false

        if (index >= 0) {
            while (
                ns.hacknet.getLevelUpgradeCost(index) != Infinity &&
                ns.hacknet.getLevelUpgradeCost(index) < ns.getPlayer().money
            ) {
                ns.hacknet.upgradeLevel(index)
                editMade = true
            }
            while (
                ns.hacknet.getRamUpgradeCost(index) != Infinity &&
                ns.hacknet.getRamUpgradeCost(index) < ns.getPlayer().money
            ) {
                ns.hacknet.upgradeRam(index)
                editMade = true
            }
            while (
                ns.hacknet.getCoreUpgradeCost(index) != Infinity &&
                ns.hacknet.getCoreUpgradeCost(index) < ns.getPlayer().money
            ) {
                ns.hacknet.upgradeCore(index)
                editMade = true
            }
        }
        if (ns.hacknet.getPurchaseNodeCost() <= ns.getPlayer().money) {
            ns.hacknet.purchaseNode()
            editMade = true
        }

        if (!editMade) {
            break
        }

        await ns.sleep(100)
    }
}