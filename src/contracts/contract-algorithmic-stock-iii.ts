import { NS } from "@ns"

/**
 * Algorithmic Stock Trader III
 */
export function algorithmicStockTraderIII(ns: NS, input: any): string {
    const prices = input as number[]

    let firstBuy = -999999999
    let firstSell = 0
    let secondBuy = -999999999
    let secondSell = 0

    for (let i = 0; i < prices.length; i++) {
        firstBuy = Math.max(firstBuy, prices[i] * -1)
        firstSell = Math.max(firstSell, firstBuy + prices[i])
        secondBuy = Math.max(secondBuy, firstSell - prices[i])
        secondSell = Math.max(secondSell, secondBuy + prices[i])
    }

    return secondSell.toString()
}
