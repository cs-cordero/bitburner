import { NS } from "@ns";

export async function buyHacknet(ns: NS) {
  while (true) {
    const nodeCount = ns.hacknet.numNodes()
    const index = nodeCount - 1
    let editMade = false;

    if (index >= 0) {
      while (ns.hacknet.getLevelUpgradeCost(index) != Infinity && ns.hacknet.getLevelUpgradeCost(index) < ns.getPlayer().money) {
        ns.hacknet.upgradeLevel(index)
        editMade = true;
      }
      while (ns.hacknet.getRamUpgradeCost(index) != Infinity && ns.hacknet.getRamUpgradeCost(index) < ns.getPlayer().money) {
        ns.hacknet.upgradeRam(index)
        editMade = true;
      }
      while (ns.hacknet.getCoreUpgradeCost(index) != Infinity && ns.hacknet.getCoreUpgradeCost(index) < ns.getPlayer().money) {
        ns.hacknet.upgradeCore(index)
        editMade = true;
      }
    }
    if (ns.hacknet.getPurchaseNodeCost() <= ns.getPlayer().money) {
      ns.hacknet.purchaseNode()
      editMade = true;
    }

    if (!editMade) {
      break
    }

    await ns.sleep(100)
  }
}