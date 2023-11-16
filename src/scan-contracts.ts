import { NS } from "@ns";
import { getAllServers } from "/util";

export async function main(ns: NS): Promise<void> {
  getAllServers(ns)
      .forEach(hostname => {
          const files = ns.ls(hostname).filter(fn => fn.endsWith(".cct")).join(", ")
          if (files.length) {
              ns.tprint(`${hostname.padEnd(18)}${files}`)
          }
      });
}