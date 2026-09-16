// ==========================================
// DYNAMIC CSS INJECTION FOR ACTION COMMANDS
// ==========================================
const actionCmdStyle = document.createElement('style');
actionCmdStyle.innerHTML = `
.action-crosshair {
    position: fixed;
    width: 40px; height: 40px;
    border: 4px solid #2ecc71;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 0 10px #2ecc71, inset 0 0 10px #2ecc71;
}
.action-crosshair::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; height: 8px;
    background: #2ecc71;
    border-radius: 50%;
}
.action-target-marker {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60px; height: 60px;
    border: 3px dashed #e74c3c;
    border-radius: 50%;
    pointer-events: none;
    animation: spinTarget 4s linear infinite;
}
@keyframes spinTarget { 100% { transform: translate(-50%, -50%) rotate(360deg); } }

/* NEW CSS FOR MASH BAR & INSTRUCTIONS */
.action-instr {
    position: fixed;
    transform: translateX(-50%);
    color: #f1c40f;
    font-weight: bold;
    font-size: 18px;
    text-shadow: 2px 2px 4px #000;
    z-index: 10000;
    pointer-events: none;
}
.mash-bar-container {
    position: fixed;
    width: 120px;
    height: 15px;
    background: #333;
    border: 2px solid #fff;
    border-radius: 8px;
    z-index: 10000;
    pointer-events: none;
}
.mash-bar-fill {
    height: 100%;
    width: 0%;
    background: #f1c40f;
    border-radius: 6px;
    transition: width 0.1s linear;
}

/* BURN AND POISON BADGES */
.burn-badge {
    position: absolute;
    bottom: -10px;
    left: -10px;
    background: #e67e22;
    color: #fff;
    font-weight: bold;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    border: 1px solid #fff;
    box-shadow: 0 0 8px rgba(230, 126, 34, 0.8);
    display: none;
    z-index: 5;
}
.burn-badge.active { display: block; }

.poison-badge {
    position: absolute;
    bottom: -10px;
    right: -10px;
    background: #2ecc71;
    color: #fff;
    font-weight: bold;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    border: 1px solid #fff;
    box-shadow: 0 0 8px rgba(46, 204, 113, 0.8);
    display: none;
    z-index: 5;
}
.poison-badge.active { display: block; }

/* MOBILE ACTION BUTTON */
.mobile-action-btn {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 50px;
    font-size: 24px;
    font-weight: bold;
    background-color: #e74c3c;
    color: white;
    border: 4px solid #c0392b;
    border-radius: 12px;
    z-index: 10001;
    box-shadow: 0 0 15px rgba(231, 76, 60, 0.8);
    cursor: pointer;
    user-select: none;
}
.mobile-action-btn:active {
    background-color: #c0392b;
}
`;
document.head.appendChild(actionCmdStyle);

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ==========================================
// 1. CHARACTER STATS & MOVESET MODULE
// ==========================================
const CharacterModule = {
    businessman: {
        name: "Businessman",
        imgSrc: "Images/businessman.png",
        baseStats: { hp: 12, def: 0, sp: 10, maxSp: 10 },
        moves: ["briefcaseBash", "coffeeBreak", "investment"]
    },
    fireworkGuy: {
        name: "Firework Guy",
        imgSrc: "Images/fireworkguy.png",
        baseStats: { hp: 9, def: 1, sp: 10, maxSp: 10 },
        moves: ["dynamiteToss", "sparklerStrike", "fireworkBlast"]
    },
    knight: {
        name: "Knight",
        imgSrc: "Images/knight.png",
        baseStats: { hp: 10, def: 4, sp: 5, maxSp: 5 },
        moves: ["knightslash", "defend", "knightLunge"]
    },
    officer: {
        name: "Officer",
        imgSrc: "Images/officer.png",
        baseStats: { hp: 15, def: 0, sp: 6, maxSp: 6 },
        moves: ["officerPistol", "attackOrder", "defenseOrder", "command"]
    },
    thief: {
        name: "Thief",
        imgSrc: "Images/Thief.png",
        baseStats: { hp: 7, def: 0, sp: 5, maxSp: 5 },
        moves: ["quickPunch", "pickpocket"]
    },
    hazmat: {
        name: "Hazmat",
        imgSrc: "Images/hazmat.png", 
        baseStats: { hp: 12, def: 2, sp: 6, maxSp: 6 },
        moves: ["hazmatPunch", "cure", "poisonGas"],
        immunities: ["burn", "dizzy", "poison"]
    },
    tank: {
        name: "Tank",
        imgSrc: "Images/tank.png",
        baseStats: { hp: 30, def: 5, sp: 0, maxSp: 0 },
        moves: ["apShot", "heShot"],
        isBoss: true,
        isSlow: true,
        immunities: ["dizzy"]
    },
    ghost: {
        name: "Ghost",
        imgSrc: "Images/Ghost.png", 
        baseStats: { hp: 7, def: 0, sp: 6, maxSp: 6 },
        moves: ["invisible", "haunt", "ghostHunt"]
    },
    cultist: {
        name: "Cultist",
        imgSrc: "Images/cultist.png",
        baseStats: { hp: 14, def: 0, sp: 10, maxSp: 10 },
        moves: ["cultistStab", "ritual", "summonGhost"]
    },
    skeleton: {
        name: "Skeleton",
        imgSrc: "Images/skeleton.png",
        baseStats: { hp: 8, def: 1, sp: 0, maxSp: 0 },
        moves: ["boneSlash", "boneThrow"]
    },
    grimReaper: {
        name: "Grim Reaper",
        imgSrc: "Images/reaper.png",
        baseStats: { hp: 40, def: 1, sp: 15, maxSp: 15 },
        moves: ["scythe", "summonReaper", "lifeSucker", "soulClaimer"],
        isBoss: true,
        immunities: ["dizzy"]
    },
    medic: {
        name: "Medic",
        imgSrc: "Images/medic.png",
        baseStats: { hp: 7, def: 0, sp: 6, maxSp: 6 },
        moves: ["brace","heal", "cure", "surgery"]
    },
    musketeer: {
        name: "Musketeer",
        imgSrc: "Images/musketeer.png",
        baseStats: { hp: 12, def: 1, sp: 0, maxSp: 0 },
        moves: ["reload", "bayonet", "fire"]
    },
    person:{
        name:"Average Person",
        imgSrc:"Images/Person.png",
        baseStats: {hp: 4, def: 0,sp: 3, maxSp:3},
        moves:["quickPunch","brace"]
    },
    blacksmith:{
        name:"Blacksmith",
        imgSrc:"Images/blacksmith.png",
        baseStats: {hp: 11, def: 1, sp: 4, maxSp: 4},
        moves:["swordSlash", "sharpen", "lavaForge"]
    },
    archer:{
        name:"Archer",
        imgSrc:"Images/archer.png",
        baseStats: {hp: 9, def: 0, sp: 3, maxSp: 3},
        moves:["bowShot", "ignite"]
    },
    juggernaut: {
        name: "Juggernaut",
        imgSrc: "Images/juggernaut.png", 
        baseStats: { hp: 30, def: 6, sp: 6, maxSp: 10 },
        moves: ["bulletHell", "rally"],
        isBoss: true,
        immunities: ["dizzy"]
    },
    forcefieldTrooper: {
        name: "Forcefield Trooper",
        imgSrc: "Images/forcefieldtrooper.png", 
        baseStats: { hp: 12, def: 0, sp: 5, maxSp: 5 },
        moves: ["trooperShoot", "placeShield"]
    },
    shieldGenerator: {
        name: "Shield Generator",
        imgSrc: "Images/shieldgenerator.png", 
        baseStats: { hp: 6, def: 4, sp: 0, maxSp: 0 },
        moves: [],
        isPassive: true
    },
    president: {
        name: "The President",
        imgSrc: "Images/president.png",
        baseStats: { hp: 40, def: 0, sp: 0, maxSp: 15 },
        moves: ["presidentShotgun", "callForHelp", "airStrike"],
        isBoss: true,
        immunities: ["dizzy"]
    },
    juggernautHelper: {
        name: "Juggernaut (Helper)",
        imgSrc: "Images/juggernaut.png",
        baseStats: { hp: 15, def:2, sp: 0, maxSp: 0 }, 
        moves: ["bulletHell"],
    },
    pharmacist: {
        name: "Pharmacist",
        imgSrc: "Images/pharmacist.png",
        baseStats: { hp: 11, def: 0, sp: 5, maxSp: 5 },
        moves: ["testTubeThrow", "strengthen", "painkiller"]
    },
    apparition: {
        name: "Apparition",
        imgSrc: "Images/apparition.png",
        baseStats: { hp: 18, def: 0, sp: 4, maxSp: 4 },
        moves: ["invisibleOneTurn", "scare", "shadowStrike", "shadowStep"]
    }
};

// ==========================================
// 2. EXECUTABLE MOVESET MODULE
// ==========================================
const MovesetModule = {
    // ---- Pharmacist Moves ----
    testTubeThrow: {
        name: "Test Tube",
        type: "ranged-any",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} throws a Test Tube at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(1 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);

            if (Math.random() < 0.25 && defender.isAlive() && !defender.immunities.includes("poison")) {
                defender.poisonTurns = 3; 
                updateLog(`${defender.name} was poisoned!`);
            }
            
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
            defender.updateUI();
        }
    },
    strengthen: {
        name: "Strengthen (+3 Atk, +1 Def)",
        type: "support-ally-target",
        spCost: 6,
        async execute(attacker, targetAlly) {
            updateLog(`${attacker.name} gives medicine to ${targetAlly.name}!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 400);
            targetAlly.stats.attackAdd += 3;
            targetAlly.stats.def += 1;
            targetAlly.defBoostAmount += 1;
            triggerBoostVisual(targetAlly, 3, "gold");
            triggerBoostVisual(targetAlly, 1, "blue");
            targetAlly.updateUI();
        }
    },
    painkiller: {
        name: "Painkiller",
        type: "support-ally-target",
        spCost: 10,
        async execute(attacker, targetAlly) {
            updateLog(`${attacker.name} applies a Painkiller to ${targetAlly.name}! (+5 Def, +4 HP)`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 400);
            targetAlly.heal(4);
            targetAlly.stats.def += 5;
            targetAlly.defBoostAmount += 5;
            triggerBoostVisual(targetAlly, 5, "blue");
            targetAlly.updateUI();
        }
    },
    // ---- Apparition Moves ----
    invisibleOneTurn: {
        name: "Invisible (1 Turn)",
        type: "support",
        spCost: 0,
        isUsable(attacker) {
            return !attacker.invisibleUsedOnce;
        },
        async execute(attacker) {
            attacker.invisibleUsedOnce = true;
            attacker.invisibleTurns = 1;
            updateLog(`${attacker.name} turns invisible! (Untargetable for 1 turn)`);
            attacker.updateUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    scare: {
        name: "Scare",
        type: "ranged-any",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} scares ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(6 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    shadowStrike: {
        name: "Shadow Strike (Dizzy)",
        type: "melee",
        spCost: 4,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} uses Shadow Strike on ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(6 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            
            if (!defender.immunities.includes("dizzy")) {
                defender.dizzyTurns = 3;
                updateLog(`${defender.name} is dizzy for 3 turns!`);
            } else {
                updateLog(`${defender.name} is immune to dizziness!`);
            }
            
            defender.updateUI();
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    shadowStep: {
        name: "Shadow Step (AoE Dizzy)",
        type: "aoe",
        spCost: 13,
        async execute(attacker, defenders) {
            const bonus = await performActionCommand(attacker, defenders, "aoe");
            updateLog(`${attacker.name} uses Shadow Step!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            
            const damage = Math.floor(6 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defenders.forEach(defender => {
                if (defender.isAlive()) {
                    defender.takeDamage(damage, false, attacker);
                    if (!defender.immunities.includes("dizzy")) {
                        defender.dizzyTurns = Math.max(defender.dizzyTurns, 2);
                    }
                }
            });
            
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    // ---- Hazmat Moves ----
    hazmatPunch: {
        name: "Quick Punch (Poison)",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} punches ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(3 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);

            if (Math.random() < 0.3 && defender.isAlive() && !defender.immunities.includes("poison")) {
                defender.poisonTurns = 3;
                updateLog(`${defender.name} was poisoned!`);
            }
            
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
            defender.updateUI();
        }
    },
    poisonGas: {
        name: "Poison Gas",
        type: "aoe",
        spCost: 6,
        async execute(attacker, defenders) {
            const bonus = await performActionCommand(attacker, defenders, "aoe");
            updateLog(`${attacker.name} releases a deadly Poison Gas!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);

            defenders.forEach(defender => {
                if (defender.isAlive() && !defender.immunities.includes("poison")) {
                    defender.poisonTurns = 4;
                    defender.updateUI();
                }
            });
            if (bonus > 0) {
                updateLog(`The toxic fumes were concentrated flawlessly!`);
            }
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    // ---- The President Moves ----
    presidentShotgun: {
        name: "President Shotgun (+4 SP)",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} blasts ${defender.name} with a Shotgun!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(9 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            
            const teamKey = attacker.isPlayer ? 'player' : 'enemy';
            TeamStats[teamKey].sp = Math.min(
                TeamStats[teamKey].maxSp, 
                TeamStats[teamKey].sp + 4
            );
            updateTeamSPUI();

            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    callForHelp: {
        name: "Call for Help",
        type: "support",
        spCost: 10,
        async execute(attacker) {
            updateLog(`${attacker.name} calls for help! A Juggernaut arrives!`);
            summonEntity("juggernautHelper", attacker.isPlayer, true); 
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    airStrike: {
        name: "Air Strike",
        type: "aoe",
        spCost: 14,
        async execute(attacker, defenders) {
            updateLog(`${attacker.name} calls in an Air Strike!`);
            const sequence = [3, 4, 5];
            
            for (let i = 0; i < sequence.length; i++) {
                const bonus = i === 0 ? await performActionCommand(attacker, defenders, "aoe") : 0;
                const dmg = sequence[i];
                const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
                await playAnimation(`img-${attacker.id}`, anim, 400);

                defenders.forEach(defender => {
                    if (defender.isAlive()) {
                        const damage = Math.floor(dmg + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
                        defender.takeDamage(damage, false, attacker);
                    }
                });
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    // ---- Medic Moves ----
    heal: {
        name: "Heal",
        type: "support-ally-target",
        spCost: 0,
        async execute(attacker, targetAlly) {
            updateLog(`${attacker.name} applies first aid to ${targetAlly.name}!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 400);
            targetAlly.heal(4);
        }
    },
    cure: {
        name: "Cure",
        type: "support-ally-target",
        spCost: 2,
        async execute(attacker, targetAlly) {
            updateLog(`${attacker.name} applies a Cure to ${targetAlly.name}!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 400);
            let cleansed = false;
            
            if (targetAlly.dizzyTurns > 0) {
                targetAlly.dizzyTurns = 0;
                cleansed = true;
            }
            
            if (targetAlly.burnTurns > 0) {
                targetAlly.burnTurns = 0;
                cleansed = true;
            }

            if (targetAlly.poisonTurns > 0) {
                targetAlly.poisonTurns = 0;
                cleansed = true;
            }
            
            if (cleansed) {
                updateLog(`${targetAlly.name} was cleansed of negative effects!`);
            } else {
                updateLog(`It had no effect...`);
            }
            targetAlly.updateUI();
        }
    },
    surgery: {
        name: "Surgery",
        type: "support-ally-target",
        spCost: 5,
        async execute(attacker, targetAlly) {
            updateLog(`${attacker.name} preps ${targetAlly.name} for Surgery...`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 400);
            attacker.surgeryTarget = targetAlly;
        }
    },
    // ---- Musketeer Moves ----
    reload: {
        name: "Reload",
        type: "support",
        spCost: 0,
        async execute(attacker) {
            attacker.ammo = 1;
            updateLog(`${attacker.name} reloads their gun!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    bayonet: {
        name: "Bayonet",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} thrusts their bayonet at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    fire: {
        name: "Fire (1 Ammo)",
        type: "ranged-any",
        spCost: 0,
        isUsable(attacker) {
            return attacker.ammo > 0;
        },
        async execute(attacker, defender) {
            attacker.ammo = 0;
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} fires a bullet at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(10 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    // ---- Blacksmith & Archer Moves ----
    swordSlash: {
        name: "Sword Slash",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} slashes ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(3 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    sharpen: {
        name: "Sharpen",
        type: "support",
        spCost: 0,
        isUsable(attacker) {
            attacker.sharpenUses = attacker.sharpenUses || 0;
            return attacker.sharpenUses < 6 && attacker.stats.permanentAttack < 5;
        },
        async execute(attacker) {
            attacker.sharpenUses = attacker.sharpenUses || 0;
            if (attacker.sharpenUses < 6 && attacker.stats.permanentAttack < 5) {
                attacker.stats.permanentAttack += 1;
                attacker.sharpenUses++;
                updateLog(`${attacker.name} sharpens their weapon (+1 Permanent Attack)!`);
                triggerBoostVisual(attacker, 1, "gold");
            } else {
                updateLog(`${attacker.name}'s weapon is already fully sharpened!`);
            }
            attacker.updateUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    lavaForge: {
        name: "Lava Forge",
        type: "support",
        spCost: 4,
        async execute(attacker) {
            attacker.nextAttackBurns = 3;
            updateLog(`${attacker.name} coats their weapon in Lava!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    bowShot: {
        name: "Bow Shot",
        type: "ranged-any",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} shoots an arrow at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    ignite: {
        name: "Ignite",
        type: "support",
        spCost: 3,
        async execute(attacker) {
            attacker.nextAttackBurns = 4;
            updateLog(`${attacker.name} readies a flaming arrow!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    // ---- Standard Moves ----
    briefcaseBash: {
        name: "Briefcase Bash",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} bashes ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(2 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    coffeeBreak: {
        name: "Coffee Break (+3 Boost)",
        type: "support",
        spCost: 0,
        async execute(attacker) {
            attacker.stats.attackAdd += 3;
            attacker.updateUI();
            updateLog(`${attacker.name} takes a Coffee Break (+3 Attack)!`);
            triggerBoostVisual(attacker, 3, "gold");
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    brace: {
        name: "Brace (+1 Def)",
        type: "support",
        spCost: 0,
        async execute(attacker) {
            attacker.stats.def += 1;
            attacker.defBoostAmount += 1;
            attacker.updateUI();
            updateLog(`${attacker.name} braces for impact (+1 Defense)!`);
            triggerBoostVisual(attacker, 1, "blue");
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }   
    },
    defend: {
        name: "Defend (+2 Def)",
        type: "support",
        spCost: 3,
        async execute(attacker) {
            attacker.stats.def += 2;
            attacker.defBoostAmount += 2;
            attacker.updateUI();
            updateLog(`${attacker.name} takes a defensive stance (+2 Defense)!`);
            triggerBoostVisual(attacker, 2, "blue");
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    investment: {
        name: "Investment",
        type: "support",
        spCost: 4,
        async execute(attacker) {
            attacker.spRegenAmount = 7;
            attacker.spRegenTurns = 2;
            updateLog(`${attacker.name} makes a smart Investment!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    dynamiteToss: {
        name: "Dynamite Toss",
        type: "offensive",
        spCost: 4,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} tossed Dynamite at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(6 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    sparklerStrike: {
        name: "Sparkler Strike",
        type: "offensive",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} used Sparkler Strike on ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    fireworkBlast: {
        name: "Firework Blast",
        type: "aoe",
        spCost: 7,
        async execute(attacker, defenders) {
            const bonus = await performActionCommand(attacker, defenders, "aoe");
            updateLog(`${attacker.name} unleashes a massive Firework Blast!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(6 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defenders.forEach(defender => {
                if (defender.isAlive()) {
                    defender.takeDamage(damage, false, attacker);
                }
            });
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    knightslash: {
        name: "Knightly Slash",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            updateLog(`${attacker.name} performs a Knightly Slash`);
            await playAnimation(`img-${attacker.id}`, anim, 700);
            const damage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    knightLunge: {
        name: "Knightly Lunge",
        type: "melee",
        spCost: 5,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            updateLog(`${attacker.name} performs a Knightly Lunge`);
            await playAnimation(`img-${attacker.id}`, anim, 700);
            const damage = Math.floor(7 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    officerPistol: {
        name: "Officer Pistol",
        type: "ranged-any",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} shoots ${defender.name} with Officer Pistol!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(3 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    attackOrder: {
        name: "Attack Order",
        type: "support-allies",
        spCost: 0,
        async execute(attacker) {
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            team.forEach(member => {
                if (member.isAlive()) {
                    member.stats.attackAdd += 1;
                    member.updateUI();
                    triggerBoostVisual(member, 1, "gold");
                }
            });
            updateLog(`${attacker.name} issues an Attack Order (+1 Attack to allies)!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    defenseOrder: {
        name: "Defense Order",
        type: "support-allies",
        spCost: 0,
        async execute(attacker) {
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            team.forEach(member => {
                if (member.isAlive()) {
                    member.stats.def += 1;
                    member.incomingDefenseOrders = (member.incomingDefenseOrders || 0) + 1;
                    member.updateUI();
                    triggerBoostVisual(member, 1, "blue");
                }
            });
            updateLog(`${attacker.name} issues a Defense Order (+1 Defense vs 1 attack to allies)!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    command: {
        name: "Command",
        type: "support-ally-target",
        spCost: 3,
        async execute(attacker, targetAlly) {
            updateLog(`${attacker.name} commands ${targetAlly.name} to act again!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
            pendingCommandAlly = targetAlly;
        }
    },
    quickPunch: {
        name: "Quick Punch",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} punches ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(3 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    pickpocket: {
        name: "Pickpocket",
        type: "support",
        spCost: 0,
        async execute(attacker) {
            const enemyTeamKey = attacker.isPlayer ? 'enemy' : 'player';
            const friendlyTeamKey = attacker.isPlayer ? 'player' : 'enemy';

            const stolenAmount = Math.min(2, TeamStats[enemyTeamKey].sp);
            if (stolenAmount > 0) {
                TeamStats[enemyTeamKey].sp -= stolenAmount;
                TeamStats[friendlyTeamKey].sp = Math.min(
                    TeamStats[friendlyTeamKey].maxSp,
                    TeamStats[friendlyTeamKey].sp + stolenAmount
                );
            }

            updateLog(`${attacker.name} pickpockets the enemy team, stealing ${stolenAmount} SP!`);
            updateTeamSPUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    apShot: {
        name: "AP Shot (Pierces Def)",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} fires an AP round at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(10 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, true, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    heShot: {
        name: "HE Shot (Splash)",
        type: "offensive",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} fires an HE round at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            
            const directDamage = Math.floor(6 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(directDamage, false, attacker);

            const defenderTeam = defender.isPlayer ? playerTeam : enemyTeam;
            const targetIdx = defenderTeam.indexOf(defender);
            const splashDamage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack);

            [targetIdx - 1, targetIdx + 1].forEach(idx => {
                if (idx >= 0 && idx < defenderTeam.length) {
                    const neighbor = defenderTeam[idx];
                    if (neighbor && neighbor.isAlive()) {
                        neighbor.takeDamage(splashDamage, false, attacker);
                    }
                }
            });

            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    invisible: {
        name: "Invisible (2 Turns)",
        type: "support",
        spCost: 0,
        isUsable(attacker) {
            return !attacker.invisibleUsedOnce;
        },
        async execute(attacker) {
            attacker.invisibleUsedOnce = true;
            attacker.invisibleTurns = 2;
            updateLog(`${attacker.name} turns invisible! (Untargetable for 2 turns)`);
            attacker.updateUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    haunt: {
        name: "Haunt",
        type: "offensive",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} haunts ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(5 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    ghostHunt: {
        name: "Ghost Hunt (Dizzy)",
        type: "offensive",
        spCost: 8,
        isUsable(attacker) {
            return attacker.invisibleTurns > 0;
        },
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} uses Ghost Hunt on ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(10 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            
            if (!defender.immunities.includes("dizzy")) {
                defender.dizzyTurns = 4;
                updateLog(`${defender.name} is dizzy for 4 turns!`);
            } else {
                updateLog(`${defender.name} is immune to dizziness!`);
            }
            
            defender.updateUI();
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    cultistStab: {
        name: "Cultist Stab",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} stabs ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(5 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    ritual: {
        name: "Ritual (Lifesteal)",
        type: "support",
        spCost: 0,
        isUsable(attacker) {
            return !attacker.ritualUsedOnce;
        },
        async execute(attacker) {
            attacker.ritualUsedOnce = true;
            attacker.lifesteal = true;
            updateLog(`${attacker.name} performs a dark Ritual and gains Lifesteal!`);
            attacker.updateUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    summonGhost: {
        name: "Summons (Ghost)",
        type: "support",
        spCost: 5,
        
        async execute(attacker) {
            updateLog(`${attacker.name} summons a Ghost to the front!`);
            summonEntity("ghost", attacker.isPlayer, true);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    boneSlash: {
        name: "Bone Slash",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} slashes ${defender.name} with a bone!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    boneThrow: {
        name: "Bone Throw",
        type: "ranged-any",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} throws a bone at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(3 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    scythe: {
        name: "Scythe",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} swings a deadly Scythe at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(10 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            const teamKey = attacker.isPlayer ? 'player' : 'enemy';
            TeamStats[teamKey].sp = Math.min(
                TeamStats[teamKey].maxSp, 
                TeamStats[teamKey].sp + 3
            );
            updateTeamSPUI();
            attacker.updateUI();
        }
    },
    summonReaper: {
        name: "Summon",
        type: "support",
        spCost: 8,
        async execute(attacker) {
            updateLog(`${attacker.name} summons minion entities!`);
            summonEntity(Math.random() < 0.5 ? "ghost" : "skeleton", attacker.isPlayer, true);
            summonEntity(Math.random() < 0.5 ? "ghost" : "skeleton", attacker.isPlayer, true);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    lifeSucker: {
        name: "Life Sucker",
        type: "offensive",
        spCost: 5,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "melee");
            updateLog(`${attacker.name} uses Life Sucker on ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(5 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, true, attacker); 
            
            if (!defender.immunities.includes("dizzy")) {
                defender.dizzyTurns = 2;
            } else {
                updateLog(`${defender.name} is immune to dizziness!`);
            }
            
            defender.updateUI();
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    soulClaimer: {
        name: "Soul Claimer",
        type: "support",
        spCost: 10,
        isUsable(attacker) {
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            const minions = team.filter(m => m.isAlive() && (m.characterKey === "ghost" || m.characterKey === "skeleton"));
            return minions.length >= 3;
        },
        async execute(attacker) {
            updateLog(`${attacker.name} claims the souls of his minions!`);
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            team.forEach(m => {
                if (m.isAlive() && (m.characterKey === "ghost" || m.characterKey === "skeleton")) {
                    m.takeDamage(9999, true); 
                }
            });
            attacker.heal(999);
            attacker.stats.attackAdd += 7;
            attacker.updateUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    bulletHell: {
        name: "Bullet Hell",
        type: "melee",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} uses Bullet Hell on ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            
            for (let i = 0; i < 10; i++) {
                if (!defender.isAlive()) break;
                // Add the timing bonus to only the first hit to keep it balanced
                const currentBonus = i === 0 ? bonus : 0; 
                const damage = Math.floor(1 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + currentBonus;
                defender.takeDamage(damage, false, attacker);
                await new Promise(resolve => setTimeout(resolve, 150));
            }
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    rally: {
        name: "Rally",
        type: "support-allies",
        spCost: 6,
        async execute(attacker) {
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            team.forEach(member => {
                // Modified: Now correctly avoids buffing itself!
                if (member.isAlive() && member !== attacker) {
                    member.stats.def += 3;
                    member.stats.defBoostAmount = 3;
                    member.stats.attackAdd += 2;
                    member.updateUI();
                    triggerBoostVisual(member, 2, "gold");
                    triggerBoostVisual(member, 3, "blue");
                }
            });
            updateLog(`${attacker.name} rallies his allies (+3 Def, +2 Atk)!`);
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
        }
    },
    trooperShoot: {
        name: "Shoot",
        type: "ranged-any",
        spCost: 0,
        async execute(attacker, defender) {
            const bonus = await performActionCommand(attacker, defender, "ranged");
            updateLog(`${attacker.name} shoots its pistol at ${defender.name}!`);
            const anim = attacker.isPlayer ? "anim-attack-right" : "anim-attack-left";
            await playAnimation(`img-${attacker.id}`, anim, 400);
            const damage = Math.floor(4 + attacker.stats.attackAdd + attacker.stats.permanentAttack) + bonus;
            defender.takeDamage(damage, false, attacker);
            attacker.stats.attackAdd = 0;
            attacker.updateUI();
        }
    },
    placeShield: {
        name: "Shield (1 Use)",
        type: "support",
        spCost: 5,
        isUsable(attacker) {
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            const hasAliveShield = team.some(m => m.characterKey === "shieldGenerator" && m.isAlive());
            return !attacker.shieldUsed && !hasAliveShield;
        },
        async execute(attacker) {
            attacker.shieldUsed = true;
            updateLog(`${attacker.name} places down a Shield Generator at the very back!`);
            summonEntity("shieldGenerator", attacker.isPlayer, false);
            attacker.updateUI();
            await playAnimation(`img-${attacker.id}`, "anim-boost", 800);
            
            const team = attacker.isPlayer ? playerTeam : enemyTeam;
            team.forEach(m => m.updateUI());
        }
    }
};

// ==========================================
// 3. UI, ANIMATION HELPERS & SUMMONING
// ==========================================
function playAnimation(elementId, animationClass, duration) {
    return new Promise(resolve => {
        const el = document.getElementById(elementId);
        if (!el) return resolve();
        el.classList.add(animationClass);
        setTimeout(() => {
            el.classList.remove(animationClass);
            resolve();
        }, duration);
    });
}

function updateLog(message) {
    document.getElementById("battle-log").innerText = message;
}

function triggerBoostVisual(entity, boostAmount, type = "gold") {
    const entityElement = document.getElementById(`entity-${entity.id}`);
    if (!entityElement) return;
    const popup = document.createElement("div");
    popup.className = type === "blue" ? "defense-star-popup" : "boost-popup";
    popup.innerHTML = type === "blue" ? `<span>+${boostAmount}</span>` : `▲ +${boostAmount}`;
    entityElement.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
}

function triggerDamageVisual(entity, damageAmount) {
    const entityElement = document.getElementById(`entity-${entity.id}`);
    if (!entityElement) return;
    const popup = document.createElement("div");
    popup.className = "damage-star-popup";
    popup.innerHTML = `<span>-${damageAmount}</span>`;
    entityElement.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
}

function triggerHealVisual(entity, amount) {
    const entityElement = document.getElementById(`entity-${entity.id}`);
    if (!entityElement) return;
    const popup = document.createElement("div");
    popup.className = "heal-heart-popup";
    popup.innerHTML = `<span>+${amount}</span>`;
    entityElement.appendChild(popup);
    setTimeout(() => popup.remove(), 1100);
}

function updateTeamSPUI() {
    const pCurrent = TeamStats.player.sp;
    const pMax = TeamStats.player.maxSp;
    const pPercent = pMax > 0 ? Math.max(0, (pCurrent / pMax) * 100) : 0;
    const pBar = document.getElementById("player-sp-bar");
    const pText = document.getElementById("player-sp-text");
    if (pBar) pBar.style.width = pPercent + "%";
    if (pText) pText.innerText = `${pCurrent} / ${pMax} SP`;

    const eCurrent = TeamStats.enemy.sp;
    const eMax = TeamStats.enemy.maxSp;
    const ePercent = eMax > 0 ? Math.max(0, (eCurrent / eMax) * 100) : 0;
    const eBar = document.getElementById("enemy-sp-bar");
    const eText = document.getElementById("enemy-sp-text");
    if (eBar) eBar.style.width = ePercent + "%";
    if (eText) eText.innerText = `${eCurrent} / ${eMax} SP`;
}

// Action Command Core Logic
async function performActionCommand(attacker, target, cmdType = "melee") {
    if (!attacker.isPlayer) return 0;
    
    // In case of AoE moves, pick the first living defender to draw the crosshair towards
    const visualTarget = Array.isArray(target) ? target.find(t => t.isAlive()) : target;
    if (!visualTarget) return 0;

    return new Promise(resolve => {
        const targetEl = document.getElementById(`entity-${visualTarget.id}`);
        const attackerEl = document.getElementById(`entity-${attacker.id}`);
        if (!targetEl || !attackerEl) return resolve(0);

        const targetRect = targetEl.getBoundingClientRect();
        const attackerRect = attackerEl.getBoundingClientRect();

        let resolved = false;

        const finish = (bonus) => {
            if (resolved) return;
            resolved = true;
            
            if (bonus > 0) {
                const popup = document.createElement("div");
                popup.className = "damage-star-popup";
                popup.style.background = "#2ecc71";
                popup.innerHTML = `<span>+${bonus} DMG!</span>`;
                targetEl.appendChild(popup);
                setTimeout(() => popup.remove(), 900);
            } else {
                const popup = document.createElement("div");
                popup.className = "damage-star-popup";
                popup.style.background = "#7f8c8d";
                popup.innerHTML = "<span>Miss</span>";
                targetEl.appendChild(popup);
                setTimeout(() => popup.remove(), 900);
            }
            
            setTimeout(() => resolve(bonus), 200);
        };

        if (cmdType === "aoe") {
            // ==========================================
            // AOE ACTION COMMAND (Mash Bar)
            // ==========================================
            const instrPopup = document.createElement("div");
            instrPopup.className = "action-instr";
            instrPopup.innerText = isMobile ? "TAP MASH BUTTON to fill!" : "MASH Click/Space to fill!";
            document.body.appendChild(instrPopup);
            instrPopup.style.top = `${targetRect.top - 80}px`;
            instrPopup.style.left = `${targetRect.left + targetRect.width / 2}px`;

            const mashContainer = document.createElement("div");
            mashContainer.className = "mash-bar-container";
            mashContainer.style.top = `${targetRect.top - 40}px`;
            mashContainer.style.left = `${targetRect.left + targetRect.width / 2 - 60}px`;
            
            const mashFill = document.createElement("div");
            mashFill.className = "mash-bar-fill";
            mashContainer.appendChild(mashFill);
            document.body.appendChild(mashContainer);
            
            let mobileBtn = null;
            if (isMobile) {
                mobileBtn = document.createElement("button");
                mobileBtn.className = "mobile-action-btn";
                mobileBtn.innerText = "MASH TAP!";
                document.body.appendChild(mobileBtn);
                
                mobileBtn.addEventListener("touchstart", (e) => {
                    e.preventDefault();
                    fill += 15;
                    if (fill > 100) fill = 100;
                }, {passive: false});
            }

            let fill = 0;
            let animationId;
            let lastTime = Date.now();
            let elapsed = 0;
            const duration = 3000; // 3 seconds to complete
            const depleteRate = 0.04; // Loss per millisecond (~40% per second)
            
            const mashHandler = (e) => {
                if (e.type === "keydown" && e.code !== "Space") return;
                if (e.type === "mousedown" && e.target.tagName === "BUTTON" && e.target !== mobileBtn) return; 
                if (e.type === "touchstart") return; // Handled by button's exact listener
                e.preventDefault();
                fill += 15;
                if (fill > 100) fill = 100;
            };

            const cleanup = () => {
                cancelAnimationFrame(animationId);
                document.removeEventListener("keydown", mashHandler);
                document.removeEventListener("mousedown", mashHandler);
                instrPopup.remove();
                mashContainer.remove();
                if (mobileBtn) mobileBtn.remove();
            };

            setTimeout(() => {
                if (!resolved) {
                    document.addEventListener("keydown", mashHandler);
                    document.addEventListener("mousedown", mashHandler);
                }
            }, 50);

            const animate = () => {
                if (resolved) return;
                const now = Date.now();
                const dt = now - lastTime;
                lastTime = now;
                elapsed += dt;
                
                fill -= depleteRate * dt;
                if (fill < 0) fill = 0;
                mashFill.style.width = `${fill}%`;
                
                if (elapsed >= duration) {
                    cleanup();
                    // Gives +2 if filled nearly all the way
                    if (fill >= 95) finish(2);
                    else finish(0);
                } else {
                    animationId = requestAnimationFrame(animate);
                }
            };

            animationId = requestAnimationFrame(animate);
        }
        else if (cmdType === "ranged") {
            // ==========================================
            // RANGED ACTION COMMAND (WASD / Drag Alignment)
            // ==========================================
            const instrPopup = document.createElement("div");
            instrPopup.className = "action-instr";
            instrPopup.innerText = isMobile ? "Drag anywhere to Aim!" : "Use WASD/Arrows to Aim!";
            document.body.appendChild(instrPopup);
            instrPopup.style.top = `${targetRect.top - 60}px`;
            instrPopup.style.left = `${targetRect.left + targetRect.width / 2}px`;

            const crosshair = document.createElement("div");
            crosshair.className = "action-crosshair";
            document.body.appendChild(crosshair);

            const targetMarker = document.createElement("div");
            targetMarker.className = "action-target-marker";
            targetEl.appendChild(targetMarker);

            // Start randomly on screen
            let cx = Math.random() * (window.innerWidth - 200) + 100;
            let cy = Math.random() * (window.innerHeight - 200) + 100;
            
            let keys = {};
            const keydown = (e) => { 
                keys[e.key.toLowerCase()] = true; 
                if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) e.preventDefault(); 
            };
            const keyup = (e) => { keys[e.key.toLowerCase()] = false; };
            
            let touchMoveHandler = null;
            if (isMobile) {
                touchMoveHandler = (e) => {
                    e.preventDefault();
                    cx = e.touches[0].clientX;
                    cy = e.touches[0].clientY;
                };
                document.addEventListener("touchmove", touchMoveHandler, {passive: false});
            }
            
            let animationId;
            let lastTime = Date.now();
            let elapsed = 0;
            const duration = 3000;
            const speed = 0.45; // movement pixels per millisecond

            const cleanup = () => {
                cancelAnimationFrame(animationId);
                document.removeEventListener("keydown", keydown);
                document.removeEventListener("keyup", keyup);
                if (touchMoveHandler) document.removeEventListener("touchmove", touchMoveHandler);
                instrPopup.remove();
                crosshair.remove();
                targetMarker.remove();
            };

            setTimeout(() => {
                if (!resolved) {
                    document.addEventListener("keydown", keydown);
                    document.addEventListener("keyup", keyup);
                }
            }, 50);

            const animate = () => {
                if (resolved) return;
                const now = Date.now();
                const dt = now - lastTime;
                lastTime = now;
                elapsed += dt;
                
                if (!isMobile) {
                    if (keys['w'] || keys['arrowup']) cy -= speed * dt;
                    if (keys['s'] || keys['arrowdown']) cy += speed * dt;
                    if (keys['a'] || keys['arrowleft']) cx -= speed * dt;
                    if (keys['d'] || keys['arrowright']) cx += speed * dt;
                }
                
                // Screen boundaries
                cx = Math.max(20, Math.min(window.innerWidth - 20, cx));
                cy = Math.max(20, Math.min(window.innerHeight - 20, cy));

                crosshair.style.left = `${cx - 20}px`;
                crosshair.style.top = `${cy - 20}px`;
                
                if (elapsed >= duration) {
                    cleanup();
                    const targetCenterX = targetRect.left + targetRect.width / 2;
                    const targetCenterY = targetRect.top + targetRect.height / 2;
                    const dist = Math.hypot(cx - targetCenterX, cy - targetCenterY);
                    
                    if (dist < 45) finish(1); 
                    else finish(0);
                } else {
                    animationId = requestAnimationFrame(animate);
                }
            };
            
            animationId = requestAnimationFrame(animate);
        }
        else {
            // ==========================================
            // MELEE ACTION COMMAND (Timing Click)
            // ==========================================
            const instrPopup = document.createElement("div");
            instrPopup.className = "action-instr";
            instrPopup.innerText = isMobile ? "TAP the button to hit the mark!" : "Click or SPACE to hit the mark!";
            document.body.appendChild(instrPopup);
            instrPopup.style.top = `${targetRect.top - 60}px`;
            instrPopup.style.left = `${targetRect.left + targetRect.width / 2}px`;

            const crosshair = document.createElement("div");
            crosshair.className = "action-crosshair";
            crosshair.style.top = `${targetRect.top + targetRect.height / 2 - 20}px`;
            document.body.appendChild(crosshair);

            const targetMarker = document.createElement("div");
            targetMarker.className = "action-target-marker";
            targetEl.appendChild(targetMarker);

            let startX = attackerRect.left;
            let endX = targetRect.left + targetRect.width / 2;
            let currentX = startX;
            
            let distanceTotal = Math.abs(endX - startX);
            let speed = distanceTotal / 700; // pixels per ms
            if (speed < 0.1) speed = 0.1;

            let animationId;
            let lastTime = Date.now();
            
            let mobileBtn = null;
            if (isMobile) {
                mobileBtn = document.createElement("button");
                mobileBtn.className = "mobile-action-btn";
                mobileBtn.innerText = "TAP TO HIT!";
                document.body.appendChild(mobileBtn);
                
                mobileBtn.addEventListener("touchstart", (e) => {
                    e.preventDefault();
                    const distance = Math.abs(currentX - endX);
                    if (distance < 45) finishMelee(true);
                    else finishMelee(false);
                }, {passive: false});
            }

            const cleanup = () => {
                cancelAnimationFrame(animationId);
                document.removeEventListener("keydown", inputHandler);
                document.removeEventListener("mousedown", inputHandler);
                crosshair.remove();
                targetMarker.remove();
                instrPopup.remove();
                if (mobileBtn) mobileBtn.remove();
            };

            const finishMelee = (success) => {
                cleanup();
                finish(success ? 1 : 0);
            };

            const inputHandler = (e) => {
                if (e.type === "keydown" && e.code !== "Space") return;
                if (e.type === "mousedown" && e.target.tagName === "BUTTON" && e.target !== mobileBtn) return;
                if (e.type === "touchstart") return;
                e.preventDefault();

                const distance = Math.abs(currentX - endX);
                if (distance < 45) finishMelee(true);
                else finishMelee(false);
            };

            setTimeout(() => {
                if (!resolved) {
                    document.addEventListener("keydown", inputHandler);
                    document.addEventListener("mousedown", inputHandler);
                }
            }, 50);

            const animate = () => {
                if (resolved) return;
                const now = Date.now();
                const dt = now - lastTime;
                lastTime = now;

                currentX += speed * dt;
                crosshair.style.left = `${currentX - 20}px`;

                if (currentX > endX + 60) finishMelee(false); 
                else animationId = requestAnimationFrame(animate);
            };

            animationId = requestAnimationFrame(animate);
        }
    });
}

let entityIdCounter = 100;
function summonEntity(characterKey, isPlayer, atFront = false) {
    const id = `s${entityIdCounter++}`;
    const template = CharacterModule[characterKey];
    
    // Frontmost bug completely eliminated here and natively handles front targets.
    // Index 0 in the logical arrays represents the absolute FRONT of any team.
    const newFighter = new Fighter(id, characterKey, template.name, isPlayer, atFront, false)
    const team = isPlayer ? playerTeam : enemyTeam;
    if (atFront) {
        team.unshift(newFighter); 
    } else {
        team.push(newFighter); 
    }
    
    newFighter.updateUI();
}

// ==========================================
// 4. GLOBAL TEAM STATS & FIGHTER CLASS
// ==========================================
const TeamStats = {
    player: { sp: 0, maxSp: 0 },
    enemy: { sp: 0, maxSp: 0 }
};

class Fighter {
    // Array Ordering fix explicitly introduces isInit var so rendering cleanly places array [0] at front
    constructor(id, characterKey, customName, isPlayer, insertAtFront = false, isInit = false) {
        const template = CharacterModule[characterKey];
        this.id = id;
        this.characterKey = characterKey;
        this.name = customName || template.name;
        this.isPlayer = isPlayer;
        this.imgSrc = template.imgSrc;
        this.moves = template.moves || [];
        this.isBoss = template.isBoss || false;
        this.isSlow = template.isSlow || false;
        this.isPassive = template.isPassive || false;
        this.turnCount = 0;
        this.isSkippingTurn = false;
        
        this.stats = { 
            hp: template.baseStats.hp, 
            maxHp: template.baseStats.hp, 
            attackAdd: 0, 
            permanentAttack: 0,
            def: template.baseStats.def 
        };

        if (isInit) {
            const teamKey = this.isPlayer ? 'player' : 'enemy';
            TeamStats[teamKey].maxSp += template.baseStats.maxSp;
            TeamStats[teamKey].sp += template.baseStats.sp;
        }

        this.spRegenAmount = 0;
        this.spRegenTurns = 0;
        this.defBoostAmount = 0;
        this.incomingDefenseOrders = 0;
        this.surgeryDefAttacks = 0; 
        this.invisibleTurns = 0;
        this.dizzyTurns = 0;
        this.burnTurns = 0;
        this.poisonTurns = 0; 
        this.nextAttackBurns = 0;
        this.lifesteal = false;
        this.immunities = template.immunities || [];
        this.surgeryTarget = null;
        this.juggernautEnraged = false;
        this.shieldUsed = false;
        this.invisibleUsedOnce = false;
        this.ritualUsedOnce = false;
        this.sharpenUses = 0;
        this.ammo = 0; 
        
        this.render(insertAtFront, isInit);
    }

    isAlive() {
        return this.stats.hp > 0;
    }

    async onTurnStart() {
        // Evaluate burn status first
        if (this.burnTurns > 0) {
            updateLog(`${this.name} takes 1 Burn damage!`);
            this.takeDamage(1, true); 
            this.burnTurns--;
            if (this.burnTurns === 0) {
                updateLog(`${this.name} is no longer burning.`);
            }
            this.updateUI();
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (!this.isAlive()) return;
        }

        // Evaluate poison status next
        if (this.poisonTurns > 0) {
            this.poisonTurns--;
            if (this.poisonTurns === 0) {
                updateLog(`${this.name} is no longer poisoned.`);
            }
            this.updateUI();
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        this.turnCount++;
        this.isSkippingTurn = false;

        // Medic Surgery Resolution Phase
        if (this.surgeryTarget) {
            this.isSkippingTurn = true; 
            if (this.surgeryTarget.isAlive()) {
                updateLog(`${this.name} completes Surgery on ${this.surgeryTarget.name}!`);
                await new Promise(resolve => setTimeout(resolve, 800));
                
                this.surgeryTarget.heal(15);
                
                // Medic Surgery Update: Applies +2 Attack (1 turn) and +2 Defense (1 hit)
                this.surgeryTarget.stats.attackAdd += 2;
                this.surgeryTarget.stats.def += 2;
                this.surgeryTarget.surgeryDefAttacks = 1;

                triggerBoostVisual(this.surgeryTarget, 2, "gold");
                triggerBoostVisual(this.surgeryTarget, 2, "blue");

                let cleansed = false;
                if (this.surgeryTarget.dizzyTurns > 0) {
                    this.surgeryTarget.dizzyTurns = 0;
                    cleansed = true;
                }
                if (this.surgeryTarget.poisonTurns > 0) {
                    this.surgeryTarget.poisonTurns = 0;
                    cleansed = true;
                }
                
                if(cleansed){
                    updateLog(`${this.surgeryTarget.name} was cleansed of negative effects!`);
                }
                this.surgeryTarget.updateUI();
            } else {
                updateLog(`Surgery failed! Patient died. ${this.name} loses 2 Defense!`);
                this.stats.def -= 2;
                this.updateUI();
            }
            this.surgeryTarget = null;
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        if (this.characterKey === "grimReaper" && this.turnCount === 1) {
            this.lifesteal = true;
            updateLog(`${this.name} gained permanent Lifesteal!`);
            this.updateUI();
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        if (this.isSlow && this.turnCount % 2 === 0) {
            this.isSkippingTurn = true;
        }

        if (this.defBoostAmount > 0) {
            this.stats.def -= this.defBoostAmount;
            this.defBoostAmount = 0;
            updateLog(`${this.name}'s defensive stance wore off.`);
            this.updateUI();
            await new Promise(resolve => setTimeout(resolve, 600));
        }
        
        if (this.invisibleTurns > 0) {
            this.invisibleTurns--;
            if (this.invisibleTurns === 0) {
                updateLog(`${this.name} is no longer invisible.`);
                this.updateUI();
                await new Promise(resolve => setTimeout(resolve, 600));
            }
        }
        
        if (this.dizzyTurns > 0) {
            this.dizzyTurns--;
            if (this.dizzyTurns === 0) {
                updateLog(`${this.name} is no longer dizzy.`);
                this.updateUI();
                await new Promise(resolve => setTimeout(resolve, 600));
            }
        }

        if (this.spRegenTurns > 0) {
            const teamKey = this.isPlayer ? 'player' : 'enemy';
            TeamStats[teamKey].sp = Math.min(
                TeamStats[teamKey].maxSp, 
                TeamStats[teamKey].sp + this.spRegenAmount
            );
            updateLog(`${this.name} regains ${this.spRegenAmount} Team SP from Investment!`);
            this.spRegenTurns--;
            updateTeamSPUI();
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    render(insertAtFront = false, isInit = false) {
        const container = document.getElementById(this.isPlayer ? "player-container" : "enemy-container");
        const entityDiv = document.createElement("div");
        entityDiv.className = "entity";
        entityDiv.id = `entity-${this.id}`;
        entityDiv.onclick = () => handleEntityClick(this);

        entityDiv.innerHTML = `
            <div class="burn-badge" id="burn-badge-${this.id}">🔥 0</div>
            <div class="poison-badge" id="poison-badge-${this.id}">☠️ 0</div>
            <div class="ls-badge" id="ls-badge-${this.id}">❤️</div>
            <div class="boost-badge" id="badge-${this.id}">▲ +0</div>
            <div class="def-badge" id="def-badge-${this.id}">🛡️ 0</div>
            <img id="img-${this.id}" width="90" height="90" src="${this.imgSrc}">
            
            <div class="health-bar-container">
                <div class="health-bar ${this.isBoss ? 'boss-bar' : ''}" id="hp-bar-${this.id}"></div>
                <span class="hp-text" id="hp-text-${this.id}">${this.stats.hp} / ${this.stats.maxHp}</span>
            </div>
        `;
        
        // Logical Bug Decoupling: Maps Index 0 perfectly visual representation so Player frontmost is Right, Enemy frontmost is Left.
        if (isInit) {
            if (this.isPlayer) container.prepend(entityDiv); // Player [0] forced right
            else container.appendChild(entityDiv);           // Enemy [0] forced left
        } else {
            if (insertAtFront) {
                if (this.isPlayer) container.appendChild(entityDiv); // Right Edge
                else container.prepend(entityDiv);                   // Left Edge
            } else {
                if (this.isPlayer) container.prepend(entityDiv);     // Left Edge
                else container.appendChild(entityDiv);               // Right Edge
            }
        }
    }

    updateUI() {
        const hpPercentage = Math.max(0, (this.stats.hp / this.stats.maxHp) * 100);
        const hpBar = document.getElementById(`hp-bar-${this.id}`);
        if (hpBar) {
            hpBar.style.width = hpPercentage + "%";
            if (this.isBoss) hpBar.classList.add("boss-bar");
        }
        
        const hpText = document.getElementById(`hp-text-${this.id}`);
        if (hpText) hpText.innerText = `${this.stats.hp} / ${this.stats.maxHp}`;
        
        updateTeamSPUI();

        const badge = document.getElementById(`badge-${this.id}`);
        if (badge) {
            const totalAttackBoost = this.stats.attackAdd + this.stats.permanentAttack;
            if (totalAttackBoost > 0) {
                badge.innerText = `▲ +${totalAttackBoost}`;
                badge.classList.add("active");
            } else {
                badge.classList.remove("active");
            }
        }

        const burnBadge = document.getElementById(`burn-badge-${this.id}`);
        if (burnBadge) {
            if (this.burnTurns > 0) {
                burnBadge.innerText = `🔥 ${this.burnTurns}`;
                burnBadge.classList.add("visible"); // Changed from active
            } else {
                burnBadge.classList.remove("visible"); // Changed from active
            }
        }

        const poisonBadge = document.getElementById(`poison-badge-${this.id}`);
        if (poisonBadge) {
            if (this.poisonTurns > 0) {
                poisonBadge.innerText = `☠️ ${this.poisonTurns}`;
                poisonBadge.classList.add("visible"); // Changed from active
            } else {
                poisonBadge.classList.remove("visible"); // Changed from active
            }
        }

        const defBadge = document.getElementById(`def-badge-${this.id}`);
        if (defBadge) {
            if (this.stats.def > 0) {
                defBadge.innerText = `🛡️ ${this.stats.def}`;
                defBadge.classList.add("active");
            } else if (this.stats.def < 0) {
                defBadge.innerText = `🛡️ ${this.stats.def}`;
                defBadge.style.background = "#e74c3c";
                defBadge.classList.add("active");
            } else {
                defBadge.classList.remove("active");
                defBadge.style.background = "#3498db";
            }
        }

        const lsBadge = document.getElementById(`ls-badge-${this.id}`);
        if (lsBadge) {
            if (this.lifesteal) lsBadge.classList.add("active");
            else lsBadge.classList.remove("active");
        }

        const entityDiv = document.getElementById(`entity-${this.id}`);
        if (entityDiv) {
            if (!this.isAlive()) {
                entityDiv.classList.add("dead");
                entityDiv.classList.remove("dizzy");
                
                entityDiv.style.transition = "opacity 0.9s ease-out";
                entityDiv.style.opacity = "0";
                setTimeout(() => {
                    if (entityDiv.parentNode) {
                        entityDiv.remove();
                    }
                }, 900);
                
            } else {
                if (this.dizzyTurns > 0) {
                    entityDiv.classList.add("dizzy");
                } else {
                    entityDiv.classList.remove("dizzy");
                }
                
                if (this.invisibleTurns > 0) {
                    entityDiv.style.opacity = "0.5";
                } else {
                    entityDiv.style.opacity = "1";
                }

                // Forcefield Trooper Shield Effect
                if (this.characterKey === "forcefieldTrooper") {
                    const team = this.isPlayer ? playerTeam : enemyTeam;
                    const hasShield = team.some(m => m.characterKey === "shieldGenerator" && m.isAlive());
                    if (hasShield) {
                        entityDiv.style.boxShadow = "0 0 15px 5px #3498db";
                        entityDiv.style.borderColor = "#3498db";
                    } else {
                        entityDiv.style.boxShadow = "none";
                        entityDiv.style.borderColor = "rgba(255, 255, 255, 0.1)"; 
                    }
                }
            }
        }
    }

    heal(amount) {
        if (!this.isAlive()) return 0;
        const missingHp = this.stats.maxHp - this.stats.hp;
        const actualHeal = missingHp > 0 ? Math.min(missingHp, amount) : 0;
        
        this.stats.hp += actualHeal;
        triggerHealVisual(this, actualHeal);
        
        // Poison Status Check
        if (actualHeal > 0 && this.poisonTurns > 0) {
            this.stats.hp -= 1;
            if (this.stats.hp < 0) this.stats.hp = 0;
            triggerDamageVisual(this, 1);
            updateLog(`${this.name} takes 1 damage from Poison for healing!`);
        }

        this.updateUI();
        return actualHeal;
    }

    takeDamage(amount, ignoreDef = false, attacker = null) {
        // Invincibility check for Forcefield Trooper
        if (this.characterKey === "forcefieldTrooper") {
            const team = this.isPlayer ? playerTeam : enemyTeam;
            const hasShield = team.some(m => m.characterKey === "shieldGenerator" && m.isAlive());
            if (hasShield) {
                updateLog(`${this.name}'s Shield Generator absorbs the attack!`);
                triggerDamageVisual(this, 0);
                return 0; 
            }
        }

        let actualDamage = amount;
        if (!ignoreDef) {
            let currentDef = this.stats.def;
            if (this.incomingDefenseOrders > 0) {
                this.incomingDefenseOrders--;
                this.stats.def -= 1; 
            }
            if (this.surgeryDefAttacks > 0) {
                this.surgeryDefAttacks--;
                this.stats.def -= 3;
            }
            actualDamage = Math.max(1, amount - currentDef);
        } else {
            actualDamage = Math.max(1, amount);
        }
        
        this.stats.hp -= actualDamage;
        if (this.stats.hp < 0) this.stats.hp = 0;
        triggerDamageVisual(this, actualDamage);

        // Poison Status Check
        if (actualDamage > 0 && this.poisonTurns > 0 && this.isAlive()) {
            this.stats.hp -= 1;
            if (this.stats.hp < 0) this.stats.hp = 0;
            triggerDamageVisual(this, 1);
            updateLog(`${this.name} takes 1 damage from Poison from being attacked!`);
        }

        if (attacker && attacker.nextAttackBurns > 0) {
            this.burnTurns = Math.max(this.burnTurns, attacker.nextAttackBurns);
            updateLog(`${this.name} was afflicted with Burn!`);
            attacker.nextAttackBurns = 0; 
        }

        // Juggernaut Half HP Enrage check
        if (this.characterKey === "juggernaut" && !this.juggernautEnraged && this.stats.hp <= (this.stats.maxHp / 2) && this.isAlive()) {
            this.juggernautEnraged = true;
            this.stats.def = 3;
            this.stats.permanentAttack += 1;
            updateLog("The Juggernaut grips its weapon tighter, lowering its defense but increases his attack");
        }
        
        this.updateUI();

        // Update Forcefield Troopers visuals if their shield dies
        if (!this.isAlive() && this.characterKey === "shieldGenerator") {
            const team = this.isPlayer ? playerTeam : enemyTeam;
            team.forEach(m => {
                if (m.characterKey === "forcefieldTrooper") m.updateUI();
            });
        }

        if (attacker && attacker.lifesteal) {
            const healed = attacker.heal(actualDamage);
            if (healed > 0) {
                updateLog(`${attacker.name} recovered ${healed} HP from Lifesteal!`);
            }
        }

        return actualDamage;
    }
}

// ==========================================
// 5. TEAMS & MODES SETUP 
// ==========================================
let playerTeam = [];
let enemyTeam = [];
let sandboxPlayerTeam = [];
let sandboxEnemyTeam = [];

let isTrialsMode = false;
let currentWave = 0;
const waveData = [
    ["person", "person","thief"],
    ["person", "thief", "person","medic"],
    ["thief","thief","businessman", "medic"],
    ["knight", "businessman", "medic","medic"],
    ["knight", "knight", "officer"],
    ["knight","fireworkGuy", "officer", "medic"],
    ["thief","fireworkGuy", "tank"],
    ["ghost", "ghost", "skeleton","cultist"],
    ["cultist", "cultist", "ghost","medic"],
    ["skeleton", "ghost", "grimReaper"],
    ["knight","blacksmith","archer","officer"],
    ["blacksmith","blacksmith","officer","medic"],
    ["knight","archer","fireworkGuy","officer"],
    ["officer","fireworkGuy","fireworkGuy","medic"],
    ["juggernaut","archer","archer"],
    ["forcefieldTrooper","fireworkGuy","medic","blacksmith"],
    ["forcefieldTrooper","knight","musketeer","musketeer"],
    ["officer","musketeer","musketeer","medic"],
    ["forcefieldTrooper","officer","musketeer","fireworkGuy"],
    ["forcefieldTrooper","musketeer","president",],
    ["knight","musketeer","hazmat","medic"],
    ["hazmat"," musketeer","hazmat","musketeer"],
    ["apparition","musketeer","officer","medic"],
    ["apparition","apparition","cultist","cultist"],
    ["juggernaut","tank"],
];

// Dynamically calculates a power level scalar score grounded to Average Person as ~1-2.
function calculatePowerLevel(charKey) {
    const char = CharacterModule[charKey];
    let score = 0;
    
    // Evaluate Stats
    score += char.baseStats.hp * 0.2;
    score += char.baseStats.def * 1.5;
    score += (char.baseStats.maxSp || 0) * 0.1;

    // Evaluate Movesets 
    if (char.moves) {
        char.moves.forEach(moveKey => {
            const move = MovesetModule[moveKey];
            if (!move) return;
            let moveScore = 0;
            
            if (move.type === 'aoe') moveScore += 4;
            else if (move.type.includes('support')) moveScore += 2.5;
            else moveScore += 2; // general melee, offensive, ranged attacks
            
            if (move.spCost > 0) {
                moveScore += (move.spCost * 0.2); 
            }
            score += moveScore;
        });
    }

    // Apply multipliers for specialized entity status
    if (char.isBoss) score *= 1.5;
    if (char.isSlow) score *= 0.8;
    
    // Divided by 3.5 creates an ideal curve where 'Average Person' ~1.6 and major bosses scale significantly higher.
    return (score / 3.5).toFixed(1); 
}

function populateSelects() {
    const pSelect = document.getElementById('player-char-select');
    const eSelect = document.getElementById('enemy-char-select');
    
    pSelect.innerHTML = "";
    eSelect.innerHTML = "";
    
    let charList = [];
    
    // Calculate and store power stats prior to rendering
    for (const key in CharacterModule) {
        if (CharacterModule[key].isPassive || key === "juggernautHelper") continue; 
        
        const char = CharacterModule[key];
        const power = calculatePowerLevel(key);
        
        charList.push({
            key: key,
            name: char.name,
            isBoss: char.isBoss,
            power: parseFloat(power)
        });
    }
    
    // Sort array by power scaling up (Highest power gets pushed to the bottom of the array list/dropdown menu)
    charList.sort((a, b) => a.power - b.power);
    
    // Render the sorted items into the selection elements
    charList.forEach(char => {
        let label = char.name;
        if (char.isBoss) {
            label += " (Boss)";
        }
        label += ` (Power: ${char.power})`;
        
        const option = `<option value="${char.key}">${label}</option>`;
        pSelect.innerHTML += option;
        eSelect.innerHTML += option;
    });
}

function addToTeam(team) {
    const select = document.getElementById(`${team}-char-select`);
    const key = select.value;
    if (team === 'player') {
        sandboxPlayerTeam.push(key);
    } else {
        sandboxEnemyTeam.push(key);
    }
    updateSandboxUI(team);
}

function removeFromTeam(team, index) {
    if (team === 'player') {
        sandboxPlayerTeam.splice(index, 1);
    } else {
        sandboxEnemyTeam.splice(index, 1);
    }
    updateSandboxUI(team);
}

function updateSandboxUI(team) {
    const list = document.getElementById(`${team}-team-list`);
    const arr = team === 'player' ? sandboxPlayerTeam : sandboxEnemyTeam;
    list.innerHTML = "";
    arr.forEach((key, index) => {
        const charName = CharacterModule[key].name;
        list.innerHTML += `
            <li>${charName} 
            <button class="remove-btn" onclick="removeFromTeam('${team}', ${index})">X</button>
            </li>`;
    });
}

function startSandboxBattle() {
    if (sandboxPlayerTeam.length === 0 || sandboxEnemyTeam.length === 0) {
        alert("Both teams must have at least one character to start the battle!");
        return;
    }

    isTrialsMode = false;
    document.getElementById('main-menu').style.display = "none";
    document.getElementById('game-screen').style.display = "block";

    document.getElementById("player-container").innerHTML = "";
    document.getElementById("enemy-container").innerHTML = "";
    entityIdCounter = 100;
    TeamStats.player = { sp: 0, maxSp: 0 };
    TeamStats.enemy = { sp: 0, maxSp: 0 };
    
    // Decoupled Array mapping correctly invokes `isInit = true` rendering mechanics
    playerTeam = sandboxPlayerTeam.map((key, i) => new Fighter(`p${i}`, key, null, true, false, true));
    enemyTeam = sandboxEnemyTeam.map((key, i) => new Fighter(`e${i}`, key, null, false, false, true));

    [...playerTeam, ...enemyTeam].forEach(f => f.updateUI());
    updateTeamSPUI();

    startRound();
}

function startTrialsMode() {
    if (sandboxPlayerTeam.length === 0) {
        alert("Player team must have at least one character to attempt the Trials!");
        return;
    }
    
    isTrialsMode = true;
    const waveInputVal = parseInt(document.getElementById("start-wave-input").value) || 1;
    currentWave = Math.max(0, Math.min(waveData.length - 1, waveInputVal - 1));

    document.getElementById('main-menu').style.display = "none";
    document.getElementById('game-screen').style.display = "block";
    
    document.getElementById("player-container").innerHTML = "";
    entityIdCounter = 100;
    TeamStats.player = { sp: 0, maxSp: 0 };
    
    playerTeam = sandboxPlayerTeam.map((key, i) => new Fighter(`p${i}`, key, null, true, false, true));
    
    loadTrialsWave();
}

function loadTrialsWave() {
    document.getElementById("enemy-container").innerHTML = "";
    TeamStats.enemy = { sp: 0, maxSp: 0 };

    const bgm = document.getElementById('bgm');
    let musicSrc = "";
    
    if (currentWave >= 0 && currentWave <= 5) {
        musicSrc = "Music/wave1-6.mp3";
    } else if (currentWave === 6 || currentWave === 14 || currentwave == 24) {
        musicSrc = "Music/wave7.mp3";
    } else if ((currentWave === 7 || currentWave === 8) || (currentwave >= 20 && currentWave < 24)) {
        musicSrc = "Music/wave8-9.mp3";
    } else if (currentWave === 9) {
        musicSrc = "Music/wave10.mp3";
    } else if (currentWave >= 10 && currentWave < 19) {
        musicSrc = "Music/wave11-19.mp3";
    } else if (currentWave == 19) {
        musicSrc = "Music/wave20.mp3";
    }

    if (bgm && bgm.getAttribute('src') !== musicSrc) {
        bgm.src = musicSrc;
        bgm.play().catch(e => console.log("Music play blocked by browser requirement", e));
    }

    TeamStats.player.sp = TeamStats.player.maxSp;
    playerTeam.forEach(f => {
        if (f.isAlive()) {
            if (currentWave + 1 % 10 == 0){
                var difference = f.stats.maxHp - f.stats.hp
                f.stats.hp += difference;
                triggerHealVisual(f, difference);

            } else {
                f.stats.hp += 3;
                triggerHealVisual(f, 2);

            }
            if (f.stats.hp >= f.stats.maxHp){
                f.stats.hp = f.stats.maxHp
            }
        }
    });

    const waveEnemies = waveData[currentWave];
    enemyTeam = waveEnemies.map((key, i) => new Fighter(`e${i}_w${currentWave}`, key, null, false, false, true));

    [...playerTeam, ...enemyTeam].forEach(f => f.updateUI());
    updateTeamSPUI();

    updateLog(`--- WAVE ${currentWave + 1} START ---`);
    setTimeout(startRound, 1200);
}

window.onload = populateSelects;

// ==========================================
// 6. TARGETING & TURN CYCLE LOGIC
// ==========================================
let currentPlayerIndex = 0;
let pendingMoveKey = null;
let pendingCommandAlly = null;
let activeExtraTurnFighter = null;

function getAllAliveTargets(team) {
    return team.filter(member => member.isAlive());
}

function getTargetableAlive(team) {
    return team.filter(member => member.isAlive() && member.invisibleTurns <= 0);
}

// BUG FIXED: By utilizing absolute Indexing rendering, Index 0 is flawless Frontmost for ANY Team Side.
function getFrontmostAlive(team) {
    const aliveTargets = getTargetableAlive(team);
    if (aliveTargets.length === 0) return null;
    return aliveTargets[0];
}

function getRandomAliveTarget(team) {
    const aliveTargets = getTargetableAlive(team);
    if (aliveTargets.length === 0) return null;
    return aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
}

function renderActionMenu(activePlayer) {
    const actionMenu = document.getElementById("action-menu");
    actionMenu.innerHTML = "";

    activePlayer.moves.forEach(moveKey => {
        const move = MovesetModule[moveKey];
        const btn = document.createElement("button");
        btn.className = "move-btn";
        
        btn.innerText = move.spCost > 0 ? `${move.name} (${move.spCost} SP)` : move.name;
        btn.onclick = () => selectMove(moveKey);
        
        if (TeamStats.player.sp < move.spCost || (move.isUsable && !move.isUsable(activePlayer))) {
            btn.disabled = true;
        }

        actionMenu.appendChild(btn);
    });
}

function toggleActionButtons(disabled) {
    document.querySelectorAll(".move-btn").forEach(btn => btn.disabled = disabled);
}

function setTargetingMode(enabled, teamToTarget, excludeEntity = null, requiresVisibility = true) {
    const aliveTargets = teamToTarget.filter(m => m.isAlive());
    aliveTargets.forEach(target => {
        if (target === excludeEntity) return;
        if (requiresVisibility && target.invisibleTurns > 0) return;

        const el = document.getElementById(`entity-${target.id}`);
        if (enabled && el) {
            el.classList.add("targetable");
        } else if (el) {
            el.classList.remove("targetable");
        }
    });
}

function selectMove(moveKey) {
    const move = MovesetModule[moveKey];
    const activePlayer = activeExtraTurnFighter || playerTeam[currentPlayerIndex];

    if (TeamStats.player.sp < move.spCost) {
        updateLog("Not enough Team SP!");
        return;
    }
    
    // Safety check just in case UI validation is bypassed
    if (move.isUsable && !move.isUsable(activePlayer)) {
        updateLog("Move conditions not met!");
        return;
    }
    
    if (move.type === "offensive" || move.type === "ranged-any") {
        pendingMoveKey = moveKey;
        setTargetingMode(true, enemyTeam, null, true);
        updateLog(`Select an enemy target for ${move.name}!`);
        
        const actionMenu = document.getElementById("action-menu");
        actionMenu.innerHTML = `<button onclick="cancelTargeting()" class="move-btn cancel-btn">Cancel</button>`;
    } else if (move.type === "support-ally-target") {
        pendingMoveKey = moveKey;
        setTargetingMode(true, playerTeam, null, false);
        updateLog(`Select an ally target for ${move.name}!`);

        const actionMenu = document.getElementById("action-menu");
        actionMenu.innerHTML = `<button onclick="cancelTargeting()" class="move-btn cancel-btn">Cancel</button>`;
    } else if (move.type === "melee") {
        const target = getFrontmostAlive(enemyTeam);
        if (!target) {
            updateLog("No valid target available!");
            setTimeout(cancelTargeting, 1000);
            return;
        }
        executePlayerTurn(moveKey, target);
    } else if (move.type === "aoe") {
        executePlayerTurn(moveKey, enemyTeam);
    } else {
        executePlayerTurn(moveKey, activePlayer);
    }
}

function cancelTargeting() {
    pendingMoveKey = null;
    setTargetingMode(false, enemyTeam);
    setTargetingMode(false, playerTeam);
    const activePlayer = activeExtraTurnFighter || playerTeam[currentPlayerIndex];
    updateLog(`${activePlayer.name}'s turn! Select a move:`);
    renderActionMenu(activePlayer);
}

function handleEntityClick(targetFighter) {
    if (!pendingMoveKey) return;
    
    const move = MovesetModule[pendingMoveKey];
    if (move.type === "support-ally-target") {
        if (targetFighter.isPlayer && targetFighter.isAlive()) { 
            const moveKey = pendingMoveKey;
            pendingMoveKey = null;
            setTargetingMode(false, playerTeam);
            executePlayerTurn(moveKey, targetFighter);
        }
    } else if (move.type === "ranged-any" || move.type === "offensive") {
        if (!targetFighter.isPlayer && targetFighter.isAlive() && targetFighter.invisibleTurns <= 0) {
            const moveKey = pendingMoveKey;
            pendingMoveKey = null;
            setTargetingMode(false, enemyTeam);
            executePlayerTurn(moveKey, targetFighter);
        }
    }
}

async function executePlayerTurn(moveKey, target) {
    toggleActionButtons(true);
    const activePlayer = activeExtraTurnFighter || playerTeam[currentPlayerIndex];
    const move = MovesetModule[moveKey];

    if (move.spCost > 0) {
        TeamStats.player.sp -= move.spCost;
        updateTeamSPUI();
    }

    if (activePlayer.dizzyTurns > 0 && Math.random() < 0.5) {
        updateLog(`${activePlayer.name} is dizzy and missed their action!`);
        await new Promise(resolve => setTimeout(resolve, 800));
    } else {
        await move.execute(activePlayer, target);
    }

    // Refresh action menu buttons so things like shield usage locks disable properly immediately after execution
    renderActionMenu(activePlayer);
    toggleActionButtons(true); // Disable new buttons so user can't spam while turning over to next player

    if (pendingCommandAlly) {
        activeExtraTurnFighter = pendingCommandAlly;
        pendingCommandAlly = null;
        updateLog(`${activeExtraTurnFighter.name} acts again via Command! Select a move:`);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        renderActionMenu(activeExtraTurnFighter);
        return; 
    }

    if (activeExtraTurnFighter) {
        activeExtraTurnFighter = null;
    }

    currentPlayerIndex++;
    setTimeout(processNextPlayerTurn, 600);
}

function startRound() {
    currentPlayerIndex = 0;
    processNextPlayerTurn();
}

async function processNextPlayerTurn() {
    if (getAllAliveTargets(enemyTeam).length === 0) {
        if (isTrialsMode) {
            currentWave++;
            if (currentWave >= waveData.length) {
                updateLog("VICTORY! You have completed all 15 Trials!");
                document.getElementById("action-menu").innerHTML = "";
            } else {
                updateLog(`Wave ${currentWave} cleared! Prepare for Wave ${currentWave + 1}...`);
                document.getElementById("action-menu").innerHTML = "";
                setTimeout(loadTrialsWave, 2000);
            }
        } else {
            updateLog("VICTORY! All enemies have been defeated!");
            document.getElementById("action-menu").innerHTML = "";
        }
        return;
    }

    while (currentPlayerIndex < playerTeam.length && !playerTeam[currentPlayerIndex].isAlive()) {
        currentPlayerIndex++;
    }

    if (currentPlayerIndex >= playerTeam.length) {
        startEnemyPhase();
        return;
    }

    const activePlayer = playerTeam[currentPlayerIndex];

    if (activePlayer.isPassive) {
        currentPlayerIndex++;
        setTimeout(processNextPlayerTurn, 50);
        return;
    }
    
    await activePlayer.onTurnStart();

    if (!activePlayer.isAlive()) {
        currentPlayerIndex++;
        setTimeout(processNextPlayerTurn, 300);
        return;
    }

    if (activePlayer.isSkippingTurn) {
        if (activePlayer.isSlow && activePlayer.turnCount % 2 === 0) {
            updateLog(`${activePlayer.name} is slow and recharging (skipping turn)...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        currentPlayerIndex++;
        setTimeout(processNextPlayerTurn, 300);
        return;
    }

    updateLog(`${activePlayer.name}'s turn! Select a move:`);
    renderActionMenu(activePlayer); // Ensures buttons evaluate isUsable() fresh
}

async function startEnemyPhase() {
    updateLog("--- ENEMY TURN PHASE ---");
    document.getElementById("action-menu").innerHTML = "";

    const enemiesToAct = [...enemyTeam]; 

    for (let i = 0; i < enemiesToAct.length; i++) {
        const enemy = enemiesToAct[i];
        if (!enemy.isAlive() || !enemyTeam.includes(enemy)) continue;
        if (enemy.isPassive) continue;

        await enemy.onTurnStart();

        if (!enemy.isAlive() || !enemyTeam.includes(enemy)) continue;

        if (enemy.isSkippingTurn) {
            if (enemy.isSlow && enemy.turnCount % 2 === 0) {
                updateLog(`${enemy.name} is slow and recharging (skipping turn)...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            continue;
        }

        const availableMoves = enemy.moves.filter(m => {
            const moveData = MovesetModule[m];
            const canAfford = TeamStats.enemy.sp >= (moveData.spCost || 0);
            const usable = moveData.isUsable ? moveData.isUsable(enemy) : true;
            return canAfford && usable;
        });

        let randomMoveKey;
        let target;

        // Musketeer AI update checks for existing ammo
        if (enemy.characterKey === 'musketeer' && enemy.ammo > 0) {
            randomMoveKey = "fire";
            target = getRandomAliveTarget(playerTeam);
        } else if (enemy.characterKey === 'medic') {
            const aliveAllies = getAllAliveTargets(enemyTeam);
            
            if (aliveAllies.length === 1) {
                randomMoveKey = "brace";
                target = enemy;
            } else {
                let lowestAlly = null;
                let lowestHpRatio = 1.1; 
                
                aliveAllies.forEach(ally => {
                    if (ally !== enemy) {
                        const ratio = ally.stats.hp / ally.stats.maxHp;
                        if (ratio < lowestHpRatio) {
                            lowestHpRatio = ratio;
                            lowestAlly = ally;
                        }
                    }
                });

                if (lowestAlly && lowestAlly.stats.hp < lowestAlly.stats.maxHp) {
                    target = lowestAlly;
                    const missingHp = lowestAlly.stats.maxHp - lowestAlly.stats.hp;
                    
                    if (missingHp >= 4 && lowestHpRatio >= 0.6 && TeamStats.enemy.sp >= 5 && Math.random() < 0.5) {
                        randomMoveKey = "surgery";
                    } else {
                        randomMoveKey = "heal";
                    }
                } else {
                    randomMoveKey = "brace";
                    target = enemy;
                }
            }
            
            if (!availableMoves.includes(randomMoveKey)) {
                randomMoveKey = availableMoves.length > 0 ? availableMoves[0] : "brace";
            }
        } else if (enemy.characterKey === 'forcefieldTrooper' && availableMoves.includes("placeShield")) {
            randomMoveKey = "placeShield";
            target = enemy;
        } else {
            randomMoveKey = availableMoves.length > 0 
                ? availableMoves[Math.floor(Math.random() * availableMoves.length)] 
                : enemy.moves[0];
                
            const move = MovesetModule[randomMoveKey];

            if (move.type === 'melee') {
                target = getFrontmostAlive(playerTeam);
            } else if (move.type === 'aoe') {
                target = playerTeam;
            } else if (move.type === 'support' || move.type === 'support-allies') {
                target = enemy;
            } else if (move.type === 'support-ally-target') {
                // Ensure enemies attempt to target other valid allies to maximize move utility (e.g., Command)
                const validAllies = enemyTeam.filter(m => m.isAlive() && m !== enemy && m.invisibleTurns <= 0);
                target = validAllies.length > 0 ? validAllies[Math.floor(Math.random() * validAllies.length)] : enemy;
            } else if (move.type === 'ranged-any' || move.type === 'offensive') {
                target = getRandomAliveTarget(playerTeam);
            } else {
                target = getRandomAliveTarget(enemyTeam);
            }
        }

        const executedMove = MovesetModule[randomMoveKey];

        if (executedMove.type === 'melee' || executedMove.type === 'ranged-any' || executedMove.type === 'offensive') {
            if (!target) continue;
        }

        if (executedMove.spCost > 0) {
            TeamStats.enemy.sp -= executedMove.spCost;
            updateTeamSPUI();
        }

        if (enemy.dizzyTurns > 0 && Math.random() < 0.5) {
            updateLog(`${enemy.name} is dizzy and missed their action!`);
            await new Promise(resolve => setTimeout(resolve, 800));
        } else {
            await executedMove.execute(enemy, target);
        }
        
        // Let the Enemy Team seamlessly exploit Officer's 'Command' move
        if (pendingCommandAlly && !pendingCommandAlly.isPlayer) {
            enemiesToAct.splice(i + 1, 0, pendingCommandAlly);
            pendingCommandAlly = null;
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    if (getAllAliveTargets(playerTeam).length === 0) {
        updateLog("DEFEAT! Your team was wiped out!");
        if (isTrialsMode) {
            setTimeout(() => {
                updateLog(`You survived until Wave ${currentWave + 1}.`);
            }, 1500);
        }
        return;
    }

    startRound();
}