import { NS } from "@ns";
import { isNumber } from "/util";

export async function main(ns: NS): Promise<void> {
  const ram = ns.args[0] ?? 8;
  if (!isNumber(ram)) {
    throw Error("If you provide a ram amount, it should be numeric");
  }

  const wallet = ns.getPlayer().money;
  const buyCost = ns.getPurchasedServerCost(ram);
  const purchasedServerLimit = ns.getPurchasedServerLimit()
  const purchasedServerCount = ns.getPurchasedServers().length;
  const highestNumberedHomeServer = ns.getPurchasedServers()
      .map(hostname => hostname.replace("home-", ""))
      .map(hostNum => parseInt(hostNum, 10))
      .reduce((prev, curr) => prev > curr ? prev : curr, 0);

  const canAffordAmount = Math.floor(wallet / buyCost);
  if (purchasedServerCount < purchasedServerLimit) {
    const countToPurchase = Math.min(canAffordAmount, purchasedServerLimit - purchasedServerCount);
    for (let i = 1; i <= countToPurchase; i++) {
      const serverNum = highestNumberedHomeServer + i;
      ns.purchaseServer(`home-${serverNum}`, ram);
      ns.tprint(`Acquired home-${serverNum}.`)
    }
  }

  for (const server of ns.getPurchasedServers()) {
    if (ns.getServerMaxRam(server) >= ram) {
      continue;
    }

    const money = ns.getPlayer().money;
    const cost = ns.getPurchasedServerUpgradeCost(server, ram);
    if (money > cost) {
      ns.upgradePurchasedServer(server, ram);
      ns.tprint(`Upgraded ${server} to ${ram}GB.`)
    }
  }
}