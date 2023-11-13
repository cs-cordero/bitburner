import { NS } from "@ns";
import { formatNumber, getPwndServers, isNumber } from "/util";

export async function main(ns: NS): Promise<void> {
  const money = ns.getPlayer().money

  const servers = ns.getPurchasedServers();

  const ramToServerCount: {[ram: number]: number} = {}
  for (const server of servers) {
    const existingRam = ns.getServerMaxRam(server);
    if (ramToServerCount[existingRam] === undefined) {
      ramToServerCount[existingRam] = 0
    }
    ramToServerCount[existingRam] += 1
  }

  let confirmed_ram = 0;
  let ram = 2;
  while (true) {
    let totalCost = 0;
    for (const server of servers) {

      const cost = ns.getPurchasedServerUpgradeCost(server, ram)
      if (cost <= 0) {
        continue
      }
      totalCost += cost
    }

    if (totalCost < money) {
      confirmed_ram = ram
    } else if (totalCost > money) {
      ns.tprint(`Failed at ${ram}, total cost was ${formatNumber(totalCost)}`)
      break
    }
    ram *= 2
  }

  const ramDescription = Object.entries(ramToServerCount)
      .map(([ram, count]) => `${count} hosts at ${ram} RAM`)
      .join(", ")
  ns.tprint(ramDescription)
  ns.tprint(`Can upgrade to ${confirmed_ram} RAM.`)
}