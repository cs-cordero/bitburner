import { NS } from "@ns";
import { formatNumber } from "/util";

/**
 * Scans the purchased servers and determines the highest RAM you can purchase with the buy.js script.
 */
export async function main(ns: NS): Promise<void> {
  const money = ns.getPlayer().money

  const maxCountServersToPurchase = ns.getPurchasedServerLimit();
  const servers = ns.getPurchasedServers();
  const serversToBuy = maxCountServersToPurchase - servers.length;
  const existingServerMinRam = servers
      .map(server => ns.getServerMaxRam(server))
      .reduce((a, b) => Math.min(a, b), 0)

  let confirmedRam = existingServerMinRam;
  let ramToEvaluate = Math.max(2, existingServerMinRam * 2)
  let costToReport = 0;
  let lastCostEvaluated = 0;
  let maximumReached = false;
  while (true) {
    const costToPurchase = ns.getPurchasedServerCost(ramToEvaluate) * serversToBuy;
    const costToUpgrade = servers
        .map(server => Math.max(0, ns.getPurchasedServerUpgradeCost(server, ramToEvaluate)))
        .reduce((a, b) => a + b, 0);
    const totalCost = costToUpgrade + costToPurchase;

    if (totalCost > money) {
      // we can't afford it
      lastCostEvaluated = totalCost;
      break;
    }

    confirmedRam = ramToEvaluate
    costToReport = totalCost
    ramToEvaluate *= 2

    if (ramToEvaluate > ns.getPurchasedServerMaxRam()) {
      // the next eval would exceed max purchased server
      maximumReached = true;
      break;
    }
  }

  const ramToServerCount: { [ram: number]: number } = {}
  servers.forEach(server => {
    const ram = ns.getServerMaxRam(server);
    if (ramToServerCount[ram] == undefined) {
      ramToServerCount[ram] = 0
    }
    ramToServerCount[ram] += 1
  })

  if (maximumReached && costToReport === 0) {
    ns.tprint("Maximum purchased server count and RAM achieved")
  } else if (!maximumReached && costToReport === 0) {
    ns.tprint("Cannot buy/purchase more servers or RAM at the moment")
  } else {
    // (!maximumReached && costToReport > 0) || (maximumReached && costToReport === 0)

    const ramDescription = Object.entries(ramToServerCount)
        .map(([ram, count]) => `${count} hosts at ${ram} RAM`)
        .join(", ")
    ns.tprint(ramDescription)
    ns.tprint(`Can buy/upgrade to ${confirmedRam} RAM at cost ${formatNumber(costToReport)}`)
  }

  if (!maximumReached) {
    ns.tprint(`\tThe next RAM (${ramToEvaluate}) will cost ${formatNumber(lastCostEvaluated)}`)
  }
}