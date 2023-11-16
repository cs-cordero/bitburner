import { NS } from "@ns";
import { isNumber } from "/util";

export async function main(ns: NS): Promise<void> {
  const ram = ns.args[0] ?? 2;
  if (!isNumber(ram)) {
    throw Error("If you provide a ram amount, it should be numeric");
  }
  const allowPartialUpgrade = ns.args.includes("--partial")

  const purchasedServerLimit = ns.getPurchasedServerLimit()
  const purchasedServerCount = ns.getPurchasedServers().length
  const countToBuy = purchasedServerLimit - purchasedServerCount

  const perServerCost = ns.getPurchasedServerCost(ram)
  const totalBuyCost = perServerCost * countToBuy;
  const totalUpgradeCost = ns.getPurchasedServers()
      .map(server => Math.max(0, ns.getPurchasedServerUpgradeCost(server, ram)))
      .reduce((a, b) => a + b, 0)
  const totalCost = totalBuyCost + totalUpgradeCost

  if (ns.getPlayer().money < totalCost && !allowPartialUpgrade) {
    ns.tprint(`Not enough money to buy/upgrade fleet standardized to ${ram} RAM.`)
    ns.tprint(`Buy cost: ${totalBuyCost} Upgrade cost: ${totalUpgradeCost}`)
    return
  } else {
    const getNextServerNumber = (() => {
      let highestNumberedHomeServer = ns.getPurchasedServers()
          .map(hostname => hostname.replace("home-", ""))
          .map(hostNum => parseInt(hostNum, 10))
          .reduce((prev, curr) => prev > curr ? prev : curr, 0);

      return () => {
        highestNumberedHomeServer += 1;
        return highestNumberedHomeServer
      }
    })()

    while (ns.getPlayer().money >= perServerCost && ns.getPurchasedServers().length < purchasedServerLimit) {
      const serverNum = getNextServerNumber()
      ns.purchaseServer(`home-${serverNum}`, ram);
      ns.tprint(`Acquired home-${serverNum}.`)
    }

    for (const server of ns.getPurchasedServers()) {
      const upgradeCost = ns.getPurchasedServerUpgradeCost(server, ram)
      if (ns.getPlayer().money >= upgradeCost) {
        ns.upgradePurchasedServer(server, ram)
        ns.tprint(`Upgraded ${server} to ${ram}GB.`)
      }
    }
  }
}