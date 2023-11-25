# Notes

- `hack()` steals a _percentage_ of the server money. As a result, it is more effective when the server has lots of money.
- `grow()` increases the money on the server by a _percentage_. Similar to `hack()`, this means it's more effective
  when the server has a high nominal amount of money.
- Use `Alpha Enterprise` in the city to get more RAM to run more scripts early game.
- Prioritize upgrading the RAM on home computer.
  - Use `Alpha Enterprise`.
  - another way?
  - Use RAM on other servers.
- Keep security low.
  - `getServerSecurityLevel()` and `getServerMinSecurityLevel()`

- There should be a 12:1 ratio for growth to weaken threads for a given server.
  - Every `grow()` increases security level by 0.004.
  - Every `weaken()` decreases security level by 0.05.
  - Every `hack()` increase security level by 0.002.
  - A 12:1 ratio will keep the security stable, slightly decreasing it.

`0.004 / timeGrow` is the increase in sec level per second per thread, call it `A`.
`0.05 / timeWeaken` is the decrease in sec level per second per thread, call it `B`.