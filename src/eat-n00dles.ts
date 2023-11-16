import { NS } from "@ns";
import { waitUntilPidFinishes } from "/util";

/**
 * Very early game dedicating 65 threads to repeatedly grow and hack n00dles.
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  while (true) {
    await waitUntilPidFinishes(ns, ns.run("grow.js", { threads: 65 }, ns.args[0] ?? "n00dles", 65, "--silent", "--once"))
    ns.run("weaken.js", { threads : 7 }, ns.args[0] ?? "n00dles", 7, "--silent", "--once")
    await waitUntilPidFinishes(ns, ns.run("hack.js", { threads: 65 }, ns.args[0] ?? "n00dles", 65, "--silent", "--once"))
  }
}