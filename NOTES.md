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

### Factions and Augmentations

#### CyberSec
  * Neurotrainer I (ALL_EXP) price: 4.000m rep: 1.000k
  * Synaptic Enhancement Implant (SPEED) price: 7.500m rep: 2.000k
  * BitWire (HACK) price: 10.000m rep: 3.750k
  * Cranial Signal Processors - Gen I (HACK,SPEED) price: 70.000m rep: 10.000k
  * Cranial Signal Processors - Gen II (HACK,HACK_CHANCE,SPEED) price: 125.000m rep: 18.750k

#### Tian Di Hui
  * Social Negotiation Assistant (S.N.A) [!] (COMPANY_MONEY,COMPANY_REP,FACTION_REP) price: 30.000m rep: 6.250k
  * Neuroreceptor Management Implant [!] () price: 550.000m rep: 75.000k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Speech Enhancement (CHA,COMPANY_REP) price: 12.500m rep: 2.500k
  * ADR-V1 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 17.500m rep: 3.750k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k

#### Netburners
  * Hacknet Node NIC Architecture Neural-Upload [!] (HACKNET) price: 4.500m rep: 1.875k
  * Hacknet Node Cache Architecture Neural-Upload [!] (HACKNET) price: 5.500m rep: 2.500k
  * Hacknet Node CPU Architecture Neural-Upload [!] (HACKNET) price: 11.000m rep: 3.750k
  * Hacknet Node Kernel Direct-Neural Interface [!] (HACKNET) price: 40.000m rep: 7.500k
  * Hacknet Node Core Direct-Neural Interface [!] (HACKNET) price: 60.000m rep: 12.500k

#### Shadows of Anarchy
  * SoA - Beauty of Aphrodite [!] () price: 1.000m rep: 16.900k
  * SoA - Chaos of Dionysus [!] () price: 1.000m rep: 16.900k
  * SoA - Flood of Poseidon [!] () price: 1.000m rep: 16.900k
  * SoA - Hunt of Artemis [!] () price: 1.000m rep: 16.900k
  * SoA - Knowledge of Apollo [!] () price: 1.000m rep: 16.900k
  * SoA - Might of Ares [!] () price: 1.000m rep: 16.900k
  * SoA - phyzical WKS harmonizer [!] () price: 1.000m rep: 16.900k
  * SoA - Trickery of Hermes [!] () price: 1.000m rep: 16.900k
  * SoA - Wisdom of Athena [!] () price: 1.000m rep: 16.900k

#### Sector-12
  * CashRoot Starter Kit [!] () price: 125.000m rep: 12.500k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Augmented Targeting II (DEX) price: 42.500m rep: 8.750k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k

#### Chongqing
  * Neuregen Gene Modification [!] (HACK_EXP) price: 375.000m rep: 37.500k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k
  * DataJack (HACK_MONEY) price: 450.000m rep: 112.500k

#### New Tokyo
  * NutriGen Implant [!] (COMBAT_EXP) price: 2.500m rep: 6.250k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k
  * DataJack (HACK_MONEY) price: 450.000m rep: 112.500k

#### Ishima
  * INFRARET Enhancement [!] (CRIME_CHANCE,CRIME_MONEY,DEX) price: 30.000m rep: 7.500k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k

#### Aevum
  * PCMatrix [!] (CHA,CHA_EXP,COMPANY_MONEY,COMPANY_REP,CRIME_CHANCE,CRIME_MONEY,FACTION_REP) price: 2.000b rep: 100.000k
  * Neurotrainer I (ALL_EXP) price: 4.000m rep: 1.000k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Synaptic Enhancement Implant (SPEED) price: 7.500m rep: 2.000k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k

#### Volhaven
  * DermaForce Particle Barrier [!] (DEF) price: 50.000m rep: 15.000k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * Combat Rib II (DEF,STR) price: 65.000m rep: 18.750k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k

#### NiteSec
  * Neural-Retention Enhancement [!] (HACK_EXP) price: 250.000m rep: 20.000k
  * CRTX42-AA Gene Modification [!] (HACK,HACK_EXP) price: 225.000m rep: 45.000k
  * BitWire (HACK) price: 10.000m rep: 3.750k
  * Artificial Synaptic Potentiation (HACK_CHANCE,HACK_EXP,SPEED) price: 80.000m rep: 6.250k
  * Cranial Signal Processors - Gen I (HACK,SPEED) price: 70.000m rep: 10.000k
  * Neurotrainer II (ALL_EXP) price: 45.000m rep: 10.000k
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Cranial Signal Processors - Gen II (HACK,HACK_CHANCE,SPEED) price: 125.000m rep: 18.750k
  * Cranial Signal Processors - Gen III (HACK,HACK_MONEY,SPEED) price: 550.000m rep: 50.000k
  * DataJack (HACK_MONEY) price: 450.000m rep: 112.500k

#### The Black Hand
  * The Black Hand [!] (DEX,HACK,HACK_MONEY,SPEED,STR) price: 550.000m rep: 100.000k
  * Artificial Synaptic Potentiation (HACK_CHANCE,HACK_EXP,SPEED) price: 80.000m rep: 6.250k
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Cranial Signal Processors - Gen III (HACK,HACK_MONEY,SPEED) price: 550.000m rep: 50.000k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k
  * Enhanced Myelin Sheathing (HACK,HACK_EXP,SPEED) price: 1.375b rep: 100.000k
  * DataJack (HACK_MONEY) price: 450.000m rep: 112.500k
  * Cranial Signal Processors - Gen IV (GROW,HACK_MONEY,SPEED) price: 1.100b rep: 125.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k

#### BitRunners
  * Neural Accelerator [!] (HACK,HACK_EXP,HACK_MONEY) price: 1.750b rep: 200.000k
  * Cranial Signal Processors - Gen V [!] (GROW,HACK,HACK_MONEY) price: 2.250b rep: 250.000k
  * BitRunners Neurolink [!] (HACK,HACK_CHANCE,HACK_EXP,SPEED) price: 4.375b rep: 875.000k
  * Neurotrainer II (ALL_EXP) price: 45.000m rep: 10.000k
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Cranial Signal Processors - Gen III (HACK,HACK_MONEY,SPEED) price: 550.000m rep: 50.000k
  * Enhanced Myelin Sheathing (HACK,HACK_EXP,SPEED) price: 1.375b rep: 100.000k
  * DataJack (HACK_MONEY) price: 450.000m rep: 112.500k
  * Cranial Signal Processors - Gen IV (GROW,HACK_MONEY,SPEED) price: 1.100b rep: 125.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k
  * Artificial Bio-neural Network Implant (HACK,HACK_MONEY,SPEED) price: 3.000b rep: 275.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m

#### ECorp
  * ECorp HVMind Implant [!] (GROW) price: 5.500b rep: 1.500m
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k
  * PC Direct-Neural Interface (COMPANY_REP,HACK) price: 3.750b rep: 375.000k
  * PC Direct-Neural Interface Optimization Submodule (COMPANY_REP,HACK) price: 4.500b rep: 500.000k
  * Embedded Netburner Module Analyze Engine (SPEED) price: 6.000b rep: 625.000k
  * Graphene Bionic Legs Upgrade (AGI) price: 4.500b rep: 750.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m
  * Embedded Netburner Module Direct Memory Access Upgrade (HACK_CHANCE,HACK_MONEY) price: 7.000b rep: 1.000m
  * Graphene Bionic Spine Upgrade (COMBAT) price: 6.000b rep: 1.625m
  * Embedded Netburner Module Core V3 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 7.500b rep: 1.750m

#### MegaCorp
  * CordiARC Fusion Reactor [!] (COMBAT,COMBAT_EXP) price: 5.000b rep: 1.125m
  * ADR-V1 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 17.500m rep: 3.750k
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k
  * Embedded Netburner Module Analyze Engine (SPEED) price: 6.000b rep: 625.000k
  * Graphene Bionic Legs Upgrade (AGI) price: 4.500b rep: 750.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m
  * Embedded Netburner Module Direct Memory Access Upgrade (HACK_CHANCE,HACK_MONEY) price: 7.000b rep: 1.000m
  * Embedded Netburner Module Core V3 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 7.500b rep: 1.750m

#### KuaiGong International
  * Photosynthetic Cells [!] (AGI,DEF,STR) price: 2.750b rep: 562.500k
  * Speech Enhancement (CHA,COMPANY_REP) price: 12.500m rep: 2.500k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Augmented Targeting II (DEX) price: 42.500m rep: 8.750k
  * Combat Rib II (DEF,STR) price: 65.000m rep: 18.750k
  * Augmented Targeting III (DEX) price: 115.000m rep: 27.500k
  * Combat Rib III (DEF,STR) price: 120.000m rep: 35.000k
  * Bionic Spine (COMBAT) price: 125.000m rep: 45.000k
  * FocusWire (ALL_EXP,COMPANY_MONEY,COMPANY_REP) price: 900.000m rep: 75.000k
  * Bionic Legs (AGI) price: 375.000m rep: 150.000k
  * HyperSight Corneal Implant (DEX,HACK_MONEY,SPEED) price: 2.750b rep: 150.000k
  * Synfibril Muscle (DEF,STR) price: 1.125b rep: 437.500k
  * Synthetic Heart (AGI,STR) price: 2.875b rep: 750.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m

#### Four Sigma
  * Speech Enhancement (CHA,COMPANY_REP) price: 12.500m rep: 2.500k
  * ADR-V1 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 17.500m rep: 3.750k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Neurotrainer III (ALL_EXP) price: 130.000m rep: 25.000k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k
  * ADR-V2 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 550.000m rep: 62.500k
  * FocusWire (ALL_EXP,COMPANY_MONEY,COMPANY_REP) price: 900.000m rep: 75.000k
  * Enhanced Social Interaction Implant (CHA,CHA_EXP) price: 1.375b rep: 375.000k
  * PC Direct-Neural Interface (COMPANY_REP,HACK) price: 3.750b rep: 375.000k

#### NWO
  * Xanipher [!] (ALL,ALL_EXP) price: 4.250b rep: 875.000k
  * Hydroflame Left Arm [!] (STR) price: 2.500t rep: 1.250m
  * ADR-V1 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 17.500m rep: 3.750k
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Neurotrainer III (ALL_EXP) price: 130.000m rep: 25.000k
  * Power Recirculation Core (ALL,ALL_EXP) price: 180.000m rep: 25.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k
  * Enhanced Social Interaction Implant (CHA,CHA_EXP) price: 1.375b rep: 375.000k
  * Synfibril Muscle (DEF,STR) price: 1.125b rep: 437.500k
  * Embedded Netburner Module Analyze Engine (SPEED) price: 6.000b rep: 625.000k
  * Synthetic Heart (AGI,STR) price: 2.875b rep: 750.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m
  * Embedded Netburner Module Direct Memory Access Upgrade (HACK_CHANCE,HACK_MONEY) price: 7.000b rep: 1.000m
  * Embedded Netburner Module Core V3 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 7.500b rep: 1.750m

#### Blade Industries
  * Neotra [!] (DEF,STR) price: 2.875b rep: 562.500k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Augmented Targeting II (DEX) price: 42.500m rep: 8.750k
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Combat Rib II (DEF,STR) price: 65.000m rep: 18.750k
  * Augmented Targeting III (DEX) price: 115.000m rep: 27.500k
  * Combat Rib III (DEF,STR) price: 120.000m rep: 35.000k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k
  * Bionic Spine (COMBAT) price: 125.000m rep: 45.000k
  * Bionic Legs (AGI) price: 375.000m rep: 150.000k
  * HyperSight Corneal Implant (DEX,HACK_MONEY,SPEED) price: 2.750b rep: 150.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k
  * PC Direct-Neural Interface (COMPANY_REP,HACK) price: 3.750b rep: 375.000k
  * Synfibril Muscle (DEF,STR) price: 1.125b rep: 437.500k
  * PC Direct-Neural Interface Optimization Submodule (COMPANY_REP,HACK) price: 4.500b rep: 500.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m

#### OmniTek Incorporated
  * OmniTek InfoLoad [!] (HACK,HACK_EXP) price: 2.875b rep: 625.000k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Augmented Targeting II (DEX) price: 42.500m rep: 8.750k
  * Combat Rib II (DEF,STR) price: 65.000m rep: 18.750k
  * Augmented Targeting III (DEX) price: 115.000m rep: 27.500k
  * Combat Rib III (DEF,STR) price: 120.000m rep: 35.000k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k
  * Bionic Spine (COMBAT) price: 125.000m rep: 45.000k
  * Bionic Legs (AGI) price: 375.000m rep: 150.000k
  * Enhanced Social Interaction Implant (CHA,CHA_EXP) price: 1.375b rep: 375.000k
  * PC Direct-Neural Interface (COMPANY_REP,HACK) price: 3.750b rep: 375.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m

#### Bachman & Associates
  * SmartJaw [!] (CHA,CHA_EXP,COMPANY_REP,FACTION_REP) price: 2.750b rep: 375.000k
  * Speech Enhancement (CHA,COMPANY_REP) price: 12.500m rep: 2.500k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k
  * ADR-V2 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 550.000m rep: 62.500k
  * FocusWire (ALL_EXP,COMPANY_MONEY,COMPANY_REP) price: 900.000m rep: 75.000k
  * Enhanced Social Interaction Implant (CHA,CHA_EXP) price: 1.375b rep: 375.000k

#### Clarke Incorporated
  * Neuronal Densification [!] (HACK,HACK_EXP,SPEED) price: 1.375b rep: 187.500k
  * nextSENS Gene Modification [!] (ALL) price: 1.925b rep: 437.500k
  * Speech Enhancement (CHA,COMPANY_REP) price: 12.500m rep: 2.500k
  * Nuoptimal Nootropic Injector Implant (COMPANY_REP) price: 20.000m rep: 5.000k
  * Neuralstimulator (HACK_CHANCE,HACK_EXP,SPEED) price: 3.000b rep: 50.000k
  * ADR-V2 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 550.000m rep: 62.500k
  * FocusWire (ALL_EXP,COMPANY_MONEY,COMPANY_REP) price: 900.000m rep: 75.000k
  * Enhanced Social Interaction Implant (CHA,CHA_EXP) price: 1.375b rep: 375.000k

#### Fulcrum Secret Technologies
  * PC Direct-Neural Interface NeuroNet Injector [!] (COMPANY_REP,HACK,SPEED) price: 7.500b rep: 1.500m
  * Embedded Netburner Module (HACK) price: 250.000m rep: 15.000k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k
  * Enhanced Myelin Sheathing (HACK,HACK_EXP,SPEED) price: 1.375b rep: 100.000k
  * Embedded Netburner Module Core Implant (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 2.500b rep: 175.000k
  * Artificial Bio-neural Network Implant (HACK,HACK_MONEY,SPEED) price: 3.000b rep: 275.000k
  * Synfibril Muscle (DEF,STR) price: 1.125b rep: 437.500k
  * PC Direct-Neural Interface Optimization Submodule (COMPANY_REP,HACK) price: 4.500b rep: 500.000k
  * Embedded Netburner Module Analyze Engine (SPEED) price: 6.000b rep: 625.000k
  * Graphene Bionic Legs Upgrade (AGI) price: 4.500b rep: 750.000k
  * Synthetic Heart (AGI,STR) price: 2.875b rep: 750.000k
  * NEMEAN Subdermal Weave (DEF) price: 3.250b rep: 875.000k
  * Embedded Netburner Module Core V2 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 4.500b rep: 1.000m
  * Embedded Netburner Module Direct Memory Access Upgrade (HACK_CHANCE,HACK_MONEY) price: 7.000b rep: 1.000m
  * Graphene Bone Lacings (DEF,STR) price: 4.250b rep: 1.125m
  * Graphene Bionic Spine Upgrade (COMBAT) price: 6.000b rep: 1.625m
  * Embedded Netburner Module Core V3 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 7.500b rep: 1.750m

#### Slum Snakes
  * SmartSonar Implant [!] (CRIME_MONEY,DEX,DEX_EXP) price: 75.000m rep: 22.500k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * LuminCloaking-V1 Skin Implant (AGI,CRIME_MONEY) price: 5.000m rep: 1.500k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * LuminCloaking-V2 Skin Implant (AGI,CRIME_MONEY,DEF) price: 30.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k

#### Tetrads
  * Bionic Arms [!] (DEX,STR) price: 275.000m rep: 62.500k
  * LuminCloaking-V1 Skin Implant (AGI,CRIME_MONEY) price: 5.000m rep: 1.500k
  * LuminCloaking-V2 Skin Implant (AGI,CRIME_MONEY,DEF) price: 30.000m rep: 5.000k
  * HemoRecirculator (COMBAT) price: 45.000m rep: 10.000k
  * Power Recirculation Core (ALL,ALL_EXP) price: 180.000m rep: 25.000k

#### Silhouette
  * TITN-41 Gene-Modification Injection [!] (CHA,CHA_EXP) price: 190.000m rep: 25.000k
  * Speech Processor Implant (CHA) price: 50.000m rep: 7.500k
  * ADR-V2 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 550.000m rep: 62.500k

#### Speakers for the Dead
  * Graphene BrachiBlades Upgrade [!] (CRIME_CHANCE,CRIME_MONEY,DEF,STR) price: 2.500b rep: 225.000k
  * Unstable Circadian Modulator [!] (HACKNET) price: 5.000b rep: 362.500k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Speech Enhancement (CHA,COMPANY_REP) price: 12.500m rep: 2.500k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k
  * The Shadow's Simulacrum (COMPANY_REP,FACTION_REP) price: 400.000m rep: 37.500k
  * Bionic Spine (COMBAT) price: 125.000m rep: 45.000k
  * Bionic Legs (AGI) price: 375.000m rep: 150.000k
  * Synfibril Muscle (DEF,STR) price: 1.125b rep: 437.500k
  * Synthetic Heart (AGI,STR) price: 2.875b rep: 750.000k

#### The Dark Army
  * Graphene Bionic Arms Upgrade [!] (DEX,STR) price: 3.750b rep: 500.000k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Augmented Targeting II (DEX) price: 42.500m rep: 8.750k
  * HemoRecirculator (COMBAT) price: 45.000m rep: 10.000k
  * Combat Rib II (DEF,STR) price: 65.000m rep: 18.750k
  * Power Recirculation Core (ALL,ALL_EXP) price: 180.000m rep: 25.000k
  * Augmented Targeting III (DEX) price: 115.000m rep: 27.500k
  * Combat Rib III (DEF,STR) price: 120.000m rep: 35.000k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k
  * The Shadow's Simulacrum (COMPANY_REP,FACTION_REP) price: 400.000m rep: 37.500k

#### The Syndicate
  * BrachiBlades [!] (CRIME_CHANCE,CRIME_MONEY,DEF,STR) price: 90.000m rep: 12.500k
  * Wired Reflexes (AGI,DEX) price: 2.500m rep: 1.250k
  * ADR-V1 Pheromone Gene (COMPANY_REP,FACTION_REP) price: 17.500m rep: 3.750k
  * Augmented Targeting I (DEX) price: 15.000m rep: 5.000k
  * Combat Rib I (DEF,STR) price: 23.750m rep: 7.500k
  * Augmented Targeting II (DEX) price: 42.500m rep: 8.750k
  * HemoRecirculator (COMBAT) price: 45.000m rep: 10.000k
  * Combat Rib II (DEF,STR) price: 65.000m rep: 18.750k
  * Power Recirculation Core (ALL,ALL_EXP) price: 180.000m rep: 25.000k
  * Augmented Targeting III (DEX) price: 115.000m rep: 27.500k
  * Combat Rib III (DEF,STR) price: 120.000m rep: 35.000k
  * Nanofiber Weave (DEF,STR) price: 125.000m rep: 37.500k
  * The Shadow's Simulacrum (COMPANY_REP,FACTION_REP) price: 400.000m rep: 37.500k
  * Bionic Spine (COMBAT) price: 125.000m rep: 45.000k
  * Bionic Legs (AGI) price: 375.000m rep: 150.000k
  * NEMEAN Subdermal Weave (DEF) price: 3.250b rep: 875.000k

#### Daedalus
  * The Red Pill [!] () price: 0.000 rep: 2.500m
  * Synfibril Muscle (DEF,STR) price: 1.125b rep: 437.500k
  * Embedded Netburner Module Analyze Engine (SPEED) price: 6.000b rep: 625.000k
  * Synthetic Heart (AGI,STR) price: 2.875b rep: 750.000k
  * NEMEAN Subdermal Weave (DEF) price: 3.250b rep: 875.000k
  * Embedded Netburner Module Direct Memory Access Upgrade (HACK_CHANCE,HACK_MONEY) price: 7.000b rep: 1.000m
  * Embedded Netburner Module Core V3 Upgrade (HACK,HACK_CHANCE,HACK_EXP,HACK_MONEY,SPEED) price: 7.500b rep: 1.750m


## Factions

### Early Game

#### CyberSec
  * Neurotrainer I (ALL) ****************************
  * Cranial Signal Processors - Gen I (HACK, GROW, WEAKEN) ****************************
  * Cranial Signal Processors - Gen II (HACK, GROW, WEAKEN) ****************************
  * Synaptic Enhancement Implant (HACK, GROW, WEAKEN) ****************************
  * BitWire (HACK) ****************************
#### Tian Di Hui
  * Neuroreceptor Management Implant (Always FOCUSED) ******************************
  * Social Negotiation Assistant (S.N.A) (REP) *********************************
#### Sector-12 and Aevum
#### Chongqing, New Tokyo, and Ishima
  * Neuregen Gene Modification (HACKING EXP)
#### Volhaven

### Corpos
#### ECorp
#### MegaCorp
#### KuaiGong International
#### Four Sigma
#### NWO
  * Xanipher (ALL): $4.25b 875.0k rep **************************
  * Hydroflame Left Arm (STR): $2.5t 1.250m rep
#### Blade Industries
#### OmniTek Incorporated
#### Bachman & Associates
#### Clarke Incorporated
#### Fulcrum Secret Technologies


### Crime

#### Slum Snakes
  * SmartSonar Implant (DEF)
#### Tetrads
  * Bionic Arms (STR, DEF)
#### The Syndicate
  * BrachiBlades (STR, DEF, CRIME)
#### The Dark Army
  * Graphene Bionic Arms (STR, DEF): $3.75b 500.0k rep
#### Speakers for the Dead
  * Unstable Circadian Modulator (HACKNET): $5b 362.5k rep
  * Graphene BrachjiBlades (STR, DEF, CRIME): $2.5b 225.0k rep

### Special
#### Netburners
* All are HACKNET related
#### Shadows of Anarchy
* All are infiltration related
