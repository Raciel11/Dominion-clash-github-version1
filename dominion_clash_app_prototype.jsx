import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sword, Shield, Zap, Heart, Coins, Crown, Trees, Castle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const HEROES = [
  {
    id: "kael",
    name: "Kael",
    title: "Dark Warrior",
    role: "Fighter",
    hp: 10,
    atk: 3,
    move: 2,
    ability: "Brutal Strike",
    ultimate: "Storm of Steel",
    flavor: "Frontline duelist built to break lanes.",
  },
  {
    id: "varyn",
    name: "Varyn",
    title: "Void Mage",
    role: "Mage",
    hp: 6,
    atk: 4,
    move: 2,
    ability: "Arcane Burst",
    ultimate: "Dark Tempest",
    flavor: "High damage caster with area control.",
  },
  {
    id: "nyx",
    name: "Nyx",
    title: "Shadow Assassin",
    role: "Assassin",
    hp: 6,
    atk: 5,
    move: 3,
    ability: "Surprise Attack",
    ultimate: "Mortal Blow",
    flavor: "Fast eliminator that punishes weak targets.",
  },
  {
    id: "darius",
    name: "Darius",
    title: "Iron Guardian",
    role: "Tank",
    hp: 12,
    atk: 2,
    move: 1,
    ability: "Protective Shield",
    ultimate: "Total Barrier",
    flavor: "Heavy defender that anchors the team.",
  },
  {
    id: "elyra",
    name: "Elyra",
    title: "Ghost Archer",
    role: "Carry",
    hp: 8,
    atk: 3,
    move: 2,
    ability: "Precise Shot",
    ultimate: "Triple Shot",
    flavor: "Reliable ranged pressure from a safe distance.",
  },
  {
    id: "liora",
    name: "Liora",
    title: "Dark Priestess",
    role: "Support",
    hp: 8,
    atk: 2,
    move: 2,
    ability: "Divine Heal",
    ultimate: "Total Restoration",
    flavor: "Sustains the team and enables longer fights.",
  },
];

const MONSTERS = [
  { name: "Shadow Wolf", hp: 5, atk: 2, reward: "+2 gold / +1 XP" },
  { name: "Stone Golem", hp: 8, atk: 3, reward: "+3 gold / +2 XP" },
  { name: "Dark Spirit", hp: 6, atk: 2, reward: "Event card / +2 XP" },
  { name: "Mini Shadow Dragon", hp: 10, atk: 4, reward: "Rare item / +4 gold" },
];

const SHOP = [
  { name: "Iron Sword", cost: 3, effect: "+1 Attack" },
  { name: "Steel Armor", cost: 3, effect: "+2 HP" },
  { name: "Shadow Boots", cost: 4, effect: "+1 Movement" },
  { name: "Arcane Amulet", cost: 5, effect: "+1 Skill Damage" },
  { name: "Health Potion", cost: 2, effect: "+3 HP once" },
];

const LANE_NAMES = ["Top Lane", "Mid Lane", "Bot Lane"];
const CELL_TYPES = ["base", "tower", "road", "tower", "road", "enemy-base"];

function createUnit(hero, side) {
  return {
    ...hero,
    currentHp: hero.hp,
    level: 1,
    gold: 2,
    xp: 0,
    position: side === "left" ? 0 : 5,
    side,
    inventory: [],
  };
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
      <span className="opacity-80">{icon}</span>
      <span className="text-white/70">{label}</span>
      <span className="ml-auto font-semibold text-white">{value}</span>
    </div>
  );
}

function HeroCard({ hero, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => onSelect(hero)}
      className={`text-left w-full rounded-3xl border p-4 transition ${
        selected ? "border-white/60 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{hero.name}</div>
          <div className="text-sm text-white/60">{hero.title}</div>
        </div>
        <Badge variant="secondary" className="rounded-full bg-white/10 text-white">
          {hero.role}
        </Badge>
      </div>
      <p className="mt-3 text-sm text-white/70">{hero.flavor}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon={<Heart className="h-4 w-4" />} label="HP" value={hero.hp} />
        <Stat icon={<Sword className="h-4 w-4" />} label="ATK" value={hero.atk} />
        <Stat icon={<Zap className="h-4 w-4" />} label="MOVE" value={hero.move} />
      </div>
      <div className="mt-4 space-y-1 text-sm">
        <div><span className="text-white/50">Skill:</span> {hero.ability}</div>
        <div><span className="text-white/50">Ultimate:</span> {hero.ultimate}</div>
      </div>
    </motion.button>
  );
}

function BoardCell({ type, laneIndex, cellIndex, leftUnit, rightUnit, onMove, activeUnit }) {
  const label =
    type === "base"
      ? "Base A"
      : type === "enemy-base"
      ? "Base B"
      : type === "tower"
      ? "Tower"
      : "Road";

  return (
    <button
      onClick={() => onMove(laneIndex, cellIndex)}
      className="relative min-h-24 rounded-2xl border border-white/10 bg-white/5 p-2 text-left hover:bg-white/10"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-white/50">
        <span>{label}</span>
        {type === "tower" && <Shield className="h-3.5 w-3.5" />}
        {type === "base" && <Castle className="h-3.5 w-3.5" />}
        {type === "enemy-base" && <Crown className="h-3.5 w-3.5" />}
      </div>

      <div className="space-y-1">
        {leftUnit && (
          <div className={`rounded-xl px-2 py-1 text-xs ${activeUnit?.id === leftUnit.id ? "bg-white text-black" : "bg-emerald-400/20 text-emerald-100"}`}>
            {leftUnit.name} · {leftUnit.currentHp} HP
          </div>
        )}
        {rightUnit && (
          <div className={`rounded-xl px-2 py-1 text-xs ${activeUnit?.id === rightUnit.id ? "bg-white text-black" : "bg-rose-400/20 text-rose-100"}`}>
            {rightUnit.name} · {rightUnit.currentHp} HP
          </div>
        )}
      </div>
    </button>
  );
}

export default function DominionClashAppPrototype() {
  const [screen, setScreen] = useState("home");
  const [leftHero, setLeftHero] = useState(HEROES[0]);
  const [rightHero, setRightHero] = useState(HEROES[2]);
  const [leftLane, setLeftLane] = useState(1);
  const [rightLane, setRightLane] = useState(1);
  const [leftUnit, setLeftUnit] = useState(() => createUnit(HEROES[0], "left"));
  const [rightUnit, setRightUnit] = useState(() => createUnit(HEROES[2], "right"));
  const [turn, setTurn] = useState("left");
  const [log, setLog] = useState([
    "Welcome to Dominion Clash.",
    "Choose heroes, enter the battlefield, and pressure lanes.",
  ]);

  const activeUnit = turn === "left" ? leftUnit : rightUnit;

  const board = useMemo(() => {
    const grid = LANE_NAMES.map(() => CELL_TYPES.map((type) => ({ type })));
    return grid;
  }, []);

  const resetMatch = () => {
    const l = createUnit(leftHero, "left");
    const r = createUnit(rightHero, "right");
    l.position = 0;
    r.position = 5;
    setLeftUnit(l);
    setRightUnit(r);
    setLeftLane(1);
    setRightLane(1);
    setTurn("left");
    setLog([
      `Match started: ${l.name} vs ${r.name}.`,
      "Left side acts first.",
    ]);
    setScreen("battle");
  };

  const addLog = (entry) => setLog((prev) => [entry, ...prev].slice(0, 8));

  const resolveLevel = (unit) => {
    let leveled = { ...unit };
    while (leveled.xp >= leveled.level * 3 && leveled.level < 4) {
      leveled.xp -= leveled.level * 3;
      leveled.level += 1;
      if (leveled.level === 2) leveled.atk += 1;
      if (leveled.level === 3) {
        leveled.hp += 2;
        leveled.currentHp += 2;
      }
      if (leveled.level === 4) leveled.atk += 1;
    }
    return leveled;
  };

  const attack = () => {
    const attacker = turn === "left" ? { ...leftUnit } : { ...rightUnit };
    const defender = turn === "left" ? { ...rightUnit } : { ...leftUnit };
    const sameLane = leftLane === rightLane;
    const adjacent = Math.abs(leftUnit.position - rightUnit.position) <= 1;

    if (!(sameLane && adjacent)) {
      addLog("Attack failed: units must be in the same lane and adjacent.");
      return;
    }

    defender.currentHp -= attacker.atk;
    addLog(`${attacker.name} hits ${defender.name} for ${attacker.atk}.`);

    if (defender.currentHp <= 0) {
      attacker.gold += 2;
      attacker.xp += 2;
      const leveled = resolveLevel(attacker);
      addLog(`${defender.name} was defeated. ${attacker.name} gains 2 gold and 2 XP.`);
      const respawned = createUnit(defender, defender.side);
      respawned.position = defender.side === "left" ? 0 : 5;
      if (turn === "left") {
        setLeftUnit(leveled);
        setRightUnit(respawned);
        setRightLane(1);
      } else {
        setRightUnit(leveled);
        setLeftUnit(respawned);
        setLeftLane(1);
      }
      setTurn(turn === "left" ? "right" : "left");
      return;
    }

    const counter = Math.max(1, defender.atk - 1);
    attacker.currentHp -= counter;
    addLog(`${defender.name} counterattacks for ${counter}.`);

    if (attacker.currentHp <= 0) {
      defender.gold += 2;
      defender.xp += 2;
      const leveledDefender = resolveLevel(defender);
      addLog(`${attacker.name} falls during the exchange.`);
      const respawned = createUnit(attacker, attacker.side);
      respawned.position = attacker.side === "left" ? 0 : 5;
      if (turn === "left") {
        setLeftUnit(respawned);
        setRightUnit(leveledDefender);
        setLeftLane(1);
      } else {
        setRightUnit(respawned);
        setLeftUnit(leveledDefender);
        setRightLane(1);
      }
      setTurn(turn === "left" ? "right" : "left");
      return;
    }

    if (turn === "left") {
      setLeftUnit(attacker);
      setRightUnit(defender);
    } else {
      setRightUnit(attacker);
      setLeftUnit(defender);
    }
    setTurn(turn === "left" ? "right" : "left");
  };

  const farmMonster = () => {
    const reward = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    const unit = { ...(turn === "left" ? leftUnit : rightUnit) };
    unit.gold += 3;
    unit.xp += 1;
    const leveled = resolveLevel(unit);
    addLog(`${unit.name} defeated ${reward.name} and earned 3 gold + 1 XP.`);
    if (turn === "left") setLeftUnit(leveled);
    else setRightUnit(leveled);
    setTurn(turn === "left" ? "right" : "left");
  };

  const buyItem = (item) => {
    const unit = { ...(turn === "left" ? leftUnit : rightUnit) };
    const inBase = (turn === "left" && unit.position === 0) || (turn === "right" && unit.position === 5);

    if (!inBase) {
      addLog("You can only buy while standing in your base.");
      return;
    }
    if (unit.gold < item.cost) {
      addLog("Not enough gold for that item.");
      return;
    }
    if (unit.inventory.length >= 3) {
      addLog("Inventory full. Max 3 items.");
      return;
    }

    unit.gold -= item.cost;
    unit.inventory.push(item.name);
    if (item.name.includes("Sword")) unit.atk += 1;
    if (item.name.includes("Armor")) {
      unit.hp += 2;
      unit.currentHp += 2;
    }
    if (item.name.includes("Boots")) unit.move += 1;
    if (item.name.includes("Potion")) unit.currentHp = Math.min(unit.hp, unit.currentHp + 3);
    if (turn === "left") setLeftUnit(unit);
    else setRightUnit(unit);
    addLog(`${unit.name} bought ${item.name}.`);
  };

  const moveTo = (laneIndex, cellIndex) => {
    const unit = { ...(turn === "left" ? leftUnit : rightUnit) };
    const currentLane = turn === "left" ? leftLane : rightLane;
    const distance = Math.abs(cellIndex - unit.position) + (laneIndex === currentLane ? 0 : 1);

    if (distance > unit.move) {
      addLog(`${unit.name} cannot move that far this turn.`);
      return;
    }

    unit.position = cellIndex;
    if (turn === "left") {
      setLeftUnit(unit);
      setLeftLane(laneIndex);
    } else {
      setRightUnit(unit);
      setRightLane(laneIndex);
    }
    addLog(`${unit.name} moved to ${LANE_NAMES[laneIndex]} (${CELL_TYPES[cellIndex]}).`);
    setTurn(turn === "left" ? "right" : "left");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" /> Dominion Clash
            </div>
            <h1 className="text-3xl font-bold md:text-5xl">Dark fantasy board game, now as an app prototype.</h1>
            <p className="mt-2 max-w-3xl text-white/70">
              This MVP turns your tabletop concept into a playable digital mockup with hero selection, lane movement,
              combat, monster farming, gold, shop, and leveling.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant={screen === "home" ? "default" : "secondary"} onClick={() => setScreen("home")} className="rounded-2xl">
              Overview
            </Button>
            <Button variant={screen === "battle" ? "default" : "secondary"} onClick={() => setScreen("battle")} className="rounded-2xl">
              Battle
            </Button>
          </div>
        </div>

        {screen === "home" && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl shadow-black/30">
              <CardHeader>
                <CardTitle className="text-2xl">Choose the first duel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-3 text-sm font-medium text-white/60">Left Side</div>
                    <div className="grid gap-3">
                      {HEROES.map((hero) => (
                        <HeroCard key={`left-${hero.id}`} hero={hero} selected={leftHero.id === hero.id} onSelect={setLeftHero} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-medium text-white/60">Right Side</div>
                    <div className="grid gap-3">
                      {HEROES.map((hero) => (
                        <HeroCard key={`right-${hero.id}`} hero={hero} selected={rightHero.id === hero.id} onSelect={setRightHero} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    className="rounded-2xl"
                    onClick={() => {
                      setLeftUnit(createUnit(leftHero, "left"));
                      setRightUnit(createUnit(rightHero, "right"));
                      resetMatch();
                    }}
                  >
                    Start Match Prototype
                  </Button>
                  <Button variant="secondary" className="rounded-2xl" onClick={() => setScreen("battle")}>
                    Open Arena
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">App MVP scope</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-white/75">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Hero selection and role identity</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Three-lane battlefield structure</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Turn-based movement and combat</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Monster farming, gold, XP, and item shop</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Foundation for campaign and multiplayer later</div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Featured jungle monsters</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {MONSTERS.map((m) => (
                    <div key={m.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="font-semibold">{m.name}</div>
                      <div className="mt-1 text-sm text-white/70">HP {m.hp} · ATK {m.atk}</div>
                      <div className="mt-1 text-sm text-white/50">Reward: {m.reward}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {screen === "battle" && (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr_0.9fr]">
            <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>{leftUnit.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={(leftUnit.currentHp / leftUnit.hp) * 100} className="h-3" />
                <div className="grid gap-2">
                  <Stat icon={<Heart className="h-4 w-4" />} label="HP" value={`${leftUnit.currentHp}/${leftUnit.hp}`} />
                  <Stat icon={<Sword className="h-4 w-4" />} label="ATK" value={leftUnit.atk} />
                  <Stat icon={<Zap className="h-4 w-4" />} label="MOVE" value={leftUnit.move} />
                  <Stat icon={<Coins className="h-4 w-4" />} label="Gold" value={leftUnit.gold} />
                  <Stat icon={<Crown className="h-4 w-4" />} label="Level" value={leftUnit.level} />
                </div>
                <div>
                  <div className="mb-2 text-sm text-white/60">Inventory</div>
                  <div className="flex flex-wrap gap-2">
                    {leftUnit.inventory.length ? leftUnit.inventory.map((i) => <Badge key={i} className="rounded-full bg-white/10">{i}</Badge>) : <span className="text-sm text-white/40">No items</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>Battlefield</span>
                    <Badge className="rounded-full bg-white text-black">{turn === "left" ? `${leftUnit.name}'s turn` : `${rightUnit.name}'s turn`}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {board.map((lane, laneIndex) => (
                    <div key={LANE_NAMES[laneIndex]}>
                      <div className="mb-2 flex items-center gap-2 text-sm text-white/60">
                        <Trees className="h-4 w-4" /> {LANE_NAMES[laneIndex]}
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {lane.map((cell, cellIndex) => (
                          <BoardCell
                            key={`${laneIndex}-${cellIndex}`}
                            type={cell.type}
                            laneIndex={laneIndex}
                            cellIndex={cellIndex}
                            activeUnit={activeUnit}
                            leftUnit={leftLane === laneIndex && leftUnit.position === cellIndex ? leftUnit : null}
                            rightUnit={rightLane === laneIndex && rightUnit.position === cellIndex ? rightUnit : null}
                            onMove={moveTo}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <Button className="rounded-2xl" onClick={attack}>Attack Adjacent Enemy</Button>
                    <Button variant="secondary" className="rounded-2xl" onClick={farmMonster}>Farm Jungle Monster</Button>
                    <Button variant="secondary" className="rounded-2xl" onClick={resetMatch}>Reset Match</Button>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
                      Move by clicking a board cell. Changing lanes costs part of your movement. Buying is only allowed in base.
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <CardTitle>Combat Log</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {log.map((entry, index) => (
                      <div key={`${entry}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/75">
                        {entry}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>{rightUnit.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={(rightUnit.currentHp / rightUnit.hp) * 100} className="h-3" />
                <div className="grid gap-2">
                  <Stat icon={<Heart className="h-4 w-4" />} label="HP" value={`${rightUnit.currentHp}/${rightUnit.hp}`} />
                  <Stat icon={<Sword className="h-4 w-4" />} label="ATK" value={rightUnit.atk} />
                  <Stat icon={<Zap className="h-4 w-4" />} label="MOVE" value={rightUnit.move} />
                  <Stat icon={<Coins className="h-4 w-4" />} label="Gold" value={rightUnit.gold} />
                  <Stat icon={<Crown className="h-4 w-4" />} label="Level" value={rightUnit.level} />
                </div>
                <div>
                  <div className="mb-2 text-sm text-white/60">Shop</div>
                  <div className="space-y-2">
                    {SHOP.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => buyItem(item)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{item.name}</span>
                          <Badge className="rounded-full bg-white/10">{item.cost}g</Badge>
                        </div>
                        <div className="mt-1 text-sm text-white/60">{item.effect}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
