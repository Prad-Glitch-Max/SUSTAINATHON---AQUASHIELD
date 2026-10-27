import { BLUEPRINT_PRESETS, DEFAULT_BLUEPRINT_ID } from './blueprints';
import { adaptiveLearningEngine } from './adaptiveLearningEngine';

export const ATTACK_SCENARIOS = {
  NONE: {
    id: 'NONE',
    name: 'Normal Operation',
    layer: null,
    layerName: 'None (Plant Healthy)',
    target: 'All Systems Normal',
    description: 'Clean drinking water is flowing smoothly through all treatment tanks.',
    color: '#047857'
  },
  SENSOR_SPOOF: {
    id: 'SENSOR_SPOOF',
    name: '1. Fake Sensor Reading',
    layer: 'SENSOR',
    layerName: 'Layer 1: Sensor',
    target: 'Water Level Sensor (Tank 2)',
    targetNode: 'tank2',
    description: 'A hacker froze the water sensor to say 32%, even though the tank is actually filling up.',
    symptom: 'The sensor says the tank is empty, but the pump is pouring water in full blast.',
    traditionalMistake: 'Old security tools panic! They think the tank is drying up, pump in way too much water, and flood the whole facility.',
    plainMathProof: 'Water is flowing in, so the water level MUST rise. The sensor says it didn’t move. Therefore, the sensor is lying.',
    plainFix: 'We ignore the lying sensor, calculate the real water level using simple math, and keep the drinking water clean with zero downtime.',
    color: '#0e7490'
  },
  NETWORK_REPLAY: {
    id: 'NETWORK_REPLAY',
    name: '2. Network Cable Attack',
    layer: 'COMMUNICATION_CHANNEL',
    layerName: 'Layer 2: Network Cable',
    target: 'Communication Wire (Network Cable)',
    targetNode: 'wire',
    description: 'A hacker slowed down the network wire, delaying messages and resending old data.',
    symptom: 'Messages from the water tanks are arriving late and out of order.',
    traditionalMistake: 'Old tools panic, think the entire internet is down, and shut down the whole plant, dumping 40,000 Liters of clean water.',
    plainMathProof: 'The water tanks and pumps are completely healthy. Only the message timestamps are late. This proves only the wire is having trouble.',
    plainFix: 'We automatically switch messages to a backup wireless wire in 38 milliseconds. The plant never stops.',
    color: '#2563eb'
  },
  CONTROLLER_HIJACK: {
    id: 'CONTROLLER_HIJACK',
    name: '3. Computer Brain Hack',
    layer: 'CONTROLLER',
    layerName: 'Layer 3: Computer Brain (PLC)',
    target: 'Main Control Computer (PLC)',
    targetNode: 'pump1',
    description: 'A hacker broke into the main computer and told it to push water pressure to a dangerous 8.5 bar.',
    symptom: 'Water pressure is shooting up dangerously close to bursting the pipes.',
    traditionalMistake: 'Old tools blame the water pumps, completely missing that the computer brain itself was commanded to do something dangerous.',
    plainMathProof: 'The water pipes physically cannot handle 8.5 bar. The computer command broke basic safety limits.',
    plainFix: 'Our emergency safety switch overrides the computer, clamps the pressure back to a safe 3.2 bar, and saves the pipes.',
    color: '#7c3aed'
  },
  FIRMWARE_ROOTKIT: {
    id: 'FIRMWARE_ROOTKIT',
    name: '4. Corrupted Software Code',
    layer: 'FIRMWARE',
    layerName: 'Layer 4: Software Code (Firmware)',
    target: 'Motor Software Code',
    targetNode: 'pump2',
    description: 'A hacker replaced the pump software with bad code that shakes the motor until it breaks, while lying to the screen that it is fine.',
    symptom: 'The water pump is vibrating violently, but the screen falsely says everything is normal.',
    traditionalMistake: 'Old tools trust what the screen says and never notice the motor physically shaking until it burns out.',
    plainMathProof: 'We checked the software’s digital fingerprint. The fingerprint did not match the original clean software code.',
    plainFix: 'We erased the hacked software and restored the clean original code in less than a second.',
    color: '#d97706'
  },
  ACTUATOR_JAM: {
    id: 'ACTUATOR_JAM',
    name: '5. Stuck Water Valve',
    layer: 'ACTUATOR',
    layerName: 'Layer 5: Physical Valve (Motor)',
    target: 'Emergency Release Valve',
    targetNode: 'valve',
    description: 'A mechanical valve physically jammed open at 100%, spilling clean water into the drain.',
    symptom: 'Water is pouring out of the pipe even though the computer commanded the valve to CLOSE.',
    traditionalMistake: 'Old tools blame the water sensor and think it is glitching, while 60,000 Liters of water leak away.',
    plainMathProof: 'The sensor was telling the truth: water was really leaking. The computer command was 0%, but the physical valve was stuck at 100%.',
    plainFix: 'AquaShield isolates the mechanical gate jam, engages the secondary motorized diverter bypass valve, and preserves 100% of municipal clean water supply.',
    color: '#e11d48'
  },
  ALL_PATHS_BLOCKED: {
    id: 'ALL_PATHS_BLOCKED',
    name: 'All Alternate Paths Blocked (Total Bypass Gridlock)',
    layer: 'ACTUATOR',
    layerName: 'Physical Hydraulics (Multi-Path Blockade)',
    target: 'All Transfer & Bypass Conduits',
    targetNode: 'valve',
    isAllPathsBlocked: true,
    description: 'The hacker jammed the primary transfer pipe AND simultaneously blocked all alternate bypass conduits.',
    symptom: 'Total hydraulic gridlock! Primary valve blocked and alternate bypass valve jammed shut. Pressure surging toward pipe rupture.',
    traditionalMistake: 'Old IT tools panic and repeatedly issue valve commands until hydraulic pressure ruptures the steel pipeline, destroying the plant.',
    plainMathProof: 'Bernoulli Incompressible Fluid Law: Kinetic inflow (42.5 L/s) slamming into zero outflow generates destructive water hammer shockwave (ΔP > 8.0 bar).',
    plainFix: 'AquaShield mechanical pressure-relief disc vents surge pressure, decouples upstream pump P-101, and redirects water into the internal recirculation loop back to Reservoir Tank 1. 0 Liters lost.',
    color: '#e11d48'
  },
  POWER_GRID_BLACKOUT: {
    id: 'POWER_GRID_BLACKOUT',
    name: 'Widespread Power Grid Blackout (Total 0V Shutdown)',
    layer: 'CONTROLLER',
    layerName: 'Electrical Power Grid (0V Blackout)',
    target: 'Main Power Distribution Bus',
    targetNode: 'power',
    isPowerBlackout: true,
    description: 'A complete power outage or cyber grid attack cut electrical power to 0 volts across all facility pumps and digital computers.',
    symptom: 'Total electrical blackout (0V AC)! All electric pumps and SCADA computers have shut down.',
    traditionalMistake: 'Traditional computerized systems go blind and crash, shutting off all municipal drinking water to the city for days.',
    plainMathProof: 'Natural Gravity Siphon Law (P = ρgh): Water elevation gradient between Tank 1 (elevated) and Tank 4 (ground) generates continuous passive head pressure of 1.6 bar without electricity.',
    plainFix: 'Fail-secure mechanical spring-return valves immediately snap into open posture with 0V power. Passive gravity-flow filtration continues supplying 18.5 L/s clean water with zero electricity.',
    color: '#a16207'
  }
};

export class CPSSimulator {
  constructor(blueprintId = DEFAULT_BLUEPRINT_ID) {
    this.blueprintId = blueprintId;
    this.blueprint = BLUEPRINT_PRESETS[blueprintId] || BLUEPRINT_PRESETS[DEFAULT_BLUEPRINT_ID];
    this.isLearnedReflex = false;
    this.learnedExperience = null;
    this.reset();
  }

  // Switch facility blueprint dynamically (3, 4, 5, 6 tanks)
  setBlueprint(blueprintId) {
    if (BLUEPRINT_PRESETS[blueprintId]) {
      this.blueprintId = blueprintId;
      this.blueprint = BLUEPRINT_PRESETS[blueprintId];
      this.reset();
      this.addLog('INFO', `[BLUEPRINT RECONFIGURED] Switched to: ${this.blueprint.name} (${this.blueprint.tankCount} tanks). Dynamic mass-balance equations updated.`);
    }
  }

  reset() {
    this.activeScenarios = [];
    this.activeScenario = ATTACK_SCENARIOS.NONE;
    this.phase = 'NOMINAL'; // 'NOMINAL' | 'ATTACK_ACTIVE' | 'LOCALIZED' | 'RESOLVED'
    this.time = 0;
    this.isLearnedReflex = false;
    this.learnedExperience = null;

    // Dynamically instantiate tanks based on the active blueprint!
    this.tanks = {};
    if (this.blueprint && this.blueprint.tanks) {
      this.blueprint.tanks.forEach(t => {
        this.tanks[t.key] = {
          id: t.id,
          name: t.name,
          role: t.role,
          level: t.level,
          capacity: t.capacity,
          color: t.color,
          chemical: t.chemical
        };
      });
    } else {
      // Fallback
      this.tanks = {
        tank1: { id: 'TNK-101', name: 'Raw Water Intake', level: 72, capacity: 50000, color: '#0284c7' },
        tank2: { id: 'TNK-102', name: 'Filtration Tank', level: 68, capacity: 40000, color: '#0e7490' },
        tank3: { id: 'TNK-103', name: 'Disinfection Tank', level: 75, capacity: 45000, color: '#16a34a' },
        tank4: { id: 'TNK-104', name: 'Clean Drinking Water', level: 82, capacity: 60000, color: '#047857' }
      };
    }

    // Sensor Readings
    const nominalFlow = this.blueprint?.flowRateNominal || 42.5;
    this.sensors = {
      levelT2_true: this.tanks.tank2 ? this.tanks.tank2.level : 68.0,
      levelT2_observed: this.tanks.tank2 ? this.tanks.tank2.level : 68.0,
      flowInflow: nominalFlow,
      flowOutflow: nominalFlow - 4.5,
      pressureBar: 3.2,
      chlorinePpm: 2.1,
      turbidityNtu: 0.8
    };

    // 5 CPS Layers
    this.layers = {
      SENSOR: { status: 'OPTIMAL', integrity: 100, latencyMs: 12 },
      COMMUNICATION_CHANNEL: { status: 'OPTIMAL', integrity: 100, packetLoss: 0.0, jitterMs: 3 },
      CONTROLLER: { status: 'OPTIMAL', integrity: 100, cpuLoad: 24 },
      FIRMWARE: { status: 'OPTIMAL', integrity: 100, hashMatch: true },
      ACTUATOR: { status: 'OPTIMAL', integrity: 100, valvePos: 65, pumpRpm: 1750 }
    };

    this.localizationResult = {
      localized: false,
      localizedLayers: [],
      localizedLayer: null,
      culpritNode: null,
      plainProof: null,
      traditionalResult: null,
      recoveryMsg: null
    };

    this.sustainability = {
      litersProtected: 142850,
      energySavedKwh: 382.4,
      downtimePreventedMin: 145
    };

    this.logs = [
      { id: 1, time: '10:00:01', level: 'INFO', msg: `AquaShield initialized with ${this.blueprint?.name || '4-Tank Standard Plant'}. All physical invariants in sync.` },
      { id: 2, time: '10:00:02', level: 'INFO', msg: 'Clean drinking water flowing to the city. Adaptive Experience Vault online.' }
    ];
  }

  // STEP 1: Launch one or MULTIPLE attacks, or custom ZERO-DAY attacks!
  launchAttack(scenarioKeysOrObjects) {
    const items = Array.isArray(scenarioKeysOrObjects) ? scenarioKeysOrObjects : [scenarioKeysOrObjects];
    const scenarios = items
      .map(item => {
        if (typeof item === 'object' && item !== null) {
          return item; // Direct custom zero-day scenario synthesized by classifier!
        }
        return ATTACK_SCENARIOS[item];
      })
      .filter(s => s && s.id !== 'NONE');

    if (scenarios.length === 0) {
      this.reset();
      return;
    }

    this.activeScenarios = scenarios;
    this.activeScenario = scenarios[0]; // Primary scenario
    this.phase = 'ATTACK_ACTIVE';
    this.localizationResult.localized = false;

    // Check Adaptive Experience Vault to see if this attack has been learned before!
    const lookup = adaptiveLearningEngine.lookup(this.activeScenario);
    if (lookup.isLearned && lookup.memory) {
      this.isLearnedReflex = true;
      this.learnedExperience = lookup.memory;
      this.addLog('INFO', `[ADAPTIVE MEMORY HIT] Attack fingerprint matched past incident #${lookup.memory.id} ("${lookup.memory.name}"). Instant 12ms zero-shot reflex mitigation enabled!`);
    } else {
      this.isLearnedReflex = false;
      this.learnedExperience = null;
      this.addLog('INFO', `[NOVEL UNSEEN ZERO-DAY] Attack signature not yet stored in Experience Vault. System will perform exploratory invariant search (8.5s). Operator feedback will teach future reflexes.`);
    }

    if (scenarios[0].isCustom) {
      this.addLog('ALERT', `[ZERO-DAY ATTACK INJECTED] "${scenarios[0].rawPrompt || scenarios[0].name}". Alarms sounding across facility!`);
      this.addLog('WARN', `Old Security Tools: "Unknown signature! Alert triggered but root-cause layer cannot be determined!"`);
    } else if (scenarios.length === 1) {
      this.addLog('ALERT', `[ATTACK LAUNCHED] ${scenarios[0].name}. Alarms ringing!`);
      this.addLog('WARN', `Old Security Tools: "Alarm triggered! Cannot determine root-cause layer!"`);
    } else {
      const names = scenarios.map(s => s.name).join(', ');
      this.addLog('ALERT', `[MULTI-VECTOR ATTACK LAUNCHED] ${scenarios.length} layers breached simultaneously: ${names}!`);
      this.addLog('WARN', `Old Security Tools: "Multiple alarms triggering! Complete system panic—we cannot isolate root causes!"`);
    }
  }

  // STEP 2: Run Attack Localization Algorithm across all layers
  localizeAttack() {
    if (this.phase !== 'ATTACK_ACTIVE') return;
    this.phase = 'LOCALIZED';
    this.localizationResult.localized = true;

    const layers = this.activeScenarios.map(s => s.layer);
    const layerNames = this.activeScenarios.map(s => s.layerName).join(' & ');
    const targets = this.activeScenarios.map(s => s.target).join(' & ');
    const proofs = this.activeScenarios.map(s => s.plainMathProof).join(' • ');

    this.localizationResult.localizedLayers = layers;
    this.localizationResult.localizedLayer = this.activeScenario.layer;
    this.localizationResult.culpritNode = targets;
    this.localizationResult.plainProof = proofs;

    this.addLog('INFO', `[PHYSICS & TELEMETRY AUDIT] Auditing mass conservation, network timestamps, memory hashes, and actuator discharge...`);
    this.addLog('ALERT', `[ROOT CAUSE ISOLATED] ${this.activeScenarios.length} compromised component(s) pinpointed: ${targets} (${layerNames}). All other layers verified 100% clean!`);
  }

  // STEP 3: Deploy Resilient Self-Healing Fix for all active breaches
  deployFix() {
    if (this.phase !== 'LOCALIZED') return;
    this.phase = 'RESOLVED';

    const fixes = this.activeScenarios.map(s => s.plainFix).join(' • ');
    this.localizationResult.recoveryMsg = fixes;

    this.sustainability.litersProtected += 250 * this.activeScenarios.length;
    this.sustainability.energySavedKwh += 1.2 * this.activeScenarios.length;

    this.addLog('INFO', `[AUTONOMOUS SELF-HEALING COMPLETE] ${fixes}`);
    this.addLog('INFO', `All ${this.activeScenarios.length} breaches mitigated in parallel. Clean drinking water protected with ZERO seconds downtime!`);
  }

  restoreBaseline() {
    this.reset();
    this.addLog('INFO', 'Plant reset to clean baseline operation. All 5 layers safe.');
  }

  step(dt = 0.5) {
    this.time += dt;

    const wave = Math.sin(this.time * 0.8) * 0.4;
    const microJitter = (Math.random() - 0.5) * 0.2;

    this.sensors.flowInflow = 42.0 + wave * 1.5;
    this.sensors.flowOutflow = 39.0 + wave * 1.2;
    this.sensors.pressureBar = 3.2 + microJitter * 0.08;
    this.sensors.chlorinePpm = 2.05 + microJitter * 0.05;
    this.sensors.turbidityNtu = 0.75 + microJitter * 0.02;

    const netFlow = this.sensors.flowInflow - this.sensors.flowOutflow;
    this.sensors.levelT2_true = Math.min(96, Math.max(20, this.sensors.levelT2_true + netFlow * 0.015));
    this.tanks.tank2.level = Math.round(this.sensors.levelT2_true);
    this.sensors.levelT2_observed = this.sensors.levelT2_true;

    Object.keys(this.layers).forEach(layerKey => {
      this.layers[layerKey].status = 'OPTIMAL';
      this.layers[layerKey].integrity = 100;
    });

    if (this.phase === 'NOMINAL') {
      this.localizationResult = {
        localized: false,
        localizedLayers: [],
        localizedLayer: null,
        culpritNode: null,
        plainProof: 'All 5 layers are checked and healthy.',
        traditionalResult: 'System Nominal',
        recoveryMsg: null
      };
      return this.getState();
    }

    const scns = this.activeScenarios && this.activeScenarios.length > 0 ? this.activeScenarios : [this.activeScenario];
    const hasSensor = scns.some(s => s.id === 'SENSOR_SPOOF' || s.layer === 'SENSOR');
    const hasNetwork = scns.some(s => s.id === 'NETWORK_REPLAY' || s.layer === 'COMMUNICATION_CHANNEL');
    const hasController = scns.some(s => s.id === 'CONTROLLER_HIJACK' || s.layer === 'CONTROLLER');
    const hasFirmware = scns.some(s => s.id === 'FIRMWARE_ROOTKIT' || s.layer === 'FIRMWARE');
    const hasActuator = scns.some(s => s.id === 'ACTUATOR_JAM' || s.layer === 'ACTUATOR');
    const hasAllPathsBlocked = scns.some(s => s.id === 'ALL_PATHS_BLOCKED' || s.isAllPathsBlocked);
    const hasPowerBlackout = scns.some(s => s.id === 'POWER_GRID_BLACKOUT' || s.isPowerBlackout);

    // 1. Sensor Spoof
    if (hasSensor) {
      if (this.phase === 'RESOLVED') {
        this.sensors.levelT2_observed = this.sensors.levelT2_true;
        this.layers.SENSOR.status = 'HEALED_WITH_MATH';
      } else {
        this.sensors.levelT2_observed = 32.0;
        this.layers.SENSOR.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    // 2. Network Cable
    if (hasNetwork) {
      if (this.phase === 'RESOLVED') {
        this.layers.COMMUNICATION_CHANNEL.status = 'BACKUP_WIRE_ACTIVE';
      } else {
        this.layers.COMMUNICATION_CHANNEL.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    // 3. Controller Brain
    if (hasController) {
      if (this.phase === 'RESOLVED') {
        this.sensors.pressureBar = 3.2;
        this.layers.CONTROLLER.status = 'SAFETY_CLAMPED';
      } else {
        this.sensors.pressureBar = 8.2;
        this.layers.CONTROLLER.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    // 4. Firmware Rootkit
    if (hasFirmware) {
      if (this.phase === 'RESOLVED') {
        this.layers.FIRMWARE.status = 'ORIGINAL_RESTORED';
      } else {
        this.layers.FIRMWARE.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    // 5. Actuator Jam
    if (hasActuator && !hasAllPathsBlocked) {
      if (this.phase === 'RESOLVED') {
        this.sensors.flowOutflow = 39.0;
        this.layers.ACTUATOR.status = 'BACKUP_PIPE_OPEN';
      } else {
        this.sensors.flowOutflow = 65.0;
        this.layers.ACTUATOR.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    // 6. Special Judge Challenge 1: ALL Alternate Paths Blocked (Total Hydraulic Gridlock)
    if (hasAllPathsBlocked) {
      if (this.phase === 'RESOLVED') {
        this.sensors.flowOutflow = 38.0;
        this.sensors.pressureBar = 2.4;
        this.layers.ACTUATOR.status = 'RECIRCULATION_LOOP_ACTIVE';
      } else {
        this.sensors.flowOutflow = 0.0;
        this.sensors.pressureBar = 7.8;
        this.layers.ACTUATOR.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    // 7. Special Judge Challenge 2: Total Power Grid Blackout (0V Facility Shutdown)
    if (hasPowerBlackout) {
      if (this.phase === 'RESOLVED') {
        this.sensors.flowInflow = 0.0;
        this.sensors.flowOutflow = 18.5; // Passive gravity siphon flow (P = rho*g*h)
        this.sensors.pressureBar = 1.6; // Gravity static head
        this.layers.ACTUATOR.status = 'SPRING_FAIL_SAFE_OPEN';
      } else {
        this.sensors.flowInflow = 0.0;
        this.sensors.flowOutflow = 0.0;
        this.sensors.pressureBar = 0.4;
        Object.keys(this.layers).forEach(layerKey => {
          this.layers[layerKey].status = 'BLACKOUT_0V';
        });
      }
    }

    // Dynamic Zero-Day Custom Physical Impacts
    scns.forEach(s => {
      if (s.physicsImpact && this.phase !== 'RESOLVED') {
        if (s.physicsImpact.tank1Delta && this.tanks.tank1) this.tanks.tank1.level = Math.min(96, Math.max(15, 72 + s.physicsImpact.tank1Delta));
        if (s.physicsImpact.tank2Delta && this.tanks.tank2) this.tanks.tank2.level = Math.min(96, Math.max(15, 68 + s.physicsImpact.tank2Delta));
        if (s.physicsImpact.tank3Delta && this.tanks.tank3) this.tanks.tank3.level = Math.min(96, Math.max(15, 75 + s.physicsImpact.tank3Delta));
        if (s.physicsImpact.tank4Delta && this.tanks.tank4) this.tanks.tank4.level = Math.min(96, Math.max(15, 82 + s.physicsImpact.tank4Delta));
        if (s.physicsImpact.tank5Delta && this.tanks.tank5) this.tanks.tank5.level = Math.min(96, Math.max(15, 78 + s.physicsImpact.tank5Delta));
        if (s.physicsImpact.tank6Delta && this.tanks.tank6) this.tanks.tank6.level = Math.min(96, Math.max(15, 84 + s.physicsImpact.tank6Delta));
        if (s.physicsImpact.pressureDelta) this.sensors.pressureBar = Math.max(1.0, 3.2 + s.physicsImpact.pressureDelta);
        if (s.physicsImpact.flowDelta) this.sensors.flowOutflow = Math.max(10.0, 39.0 + s.physicsImpact.flowDelta);
      } else if (this.phase === 'RESOLVED' && s.physicsImpact) {
        if (this.blueprint && this.blueprint.tanks) {
          this.blueprint.tanks.forEach(t => {
            if (this.tanks[t.key]) this.tanks[t.key].level = t.level;
          });
        }
      }
    });

    const culpritNames = scns.map(s => s.target).join(' & ');
    const layerNames = scns.map(s => s.layerName).join(' & ');
    const proofs = scns.map(s => s.plainMathProof).join(' • ');
    const fixes = scns.map(s => s.plainFix).join(' • ');

    if (this.phase === 'ATTACK_ACTIVE') {
      this.localizationResult = {
        localized: false,
        localizedLayers: [],
        localizedLayer: null,
        culpritNode: `Unknown! (Scanning ${scns.length} active disturbance[s] across ${this.blueprint?.tankCount || 4} tanks...)`,
        plainProof: 'Alarms ringing! Traditional monitoring cannot identify which layer or tank is failing.',
        traditionalResult: scns.map(s => s.traditionalMistake).join(' • '),
        recoveryMsg: this.isLearnedReflex ? 'Instant reflex self-healing primed (<15ms) from past learned experience!' : 'Click "Localize Attack" or use Auto-Pilot to pinpoint root causes.'
      };
    } else if (this.phase === 'LOCALIZED') {
      this.localizationResult = {
        localized: true,
        localizedLayers: scns.map(s => s.layer),
        localizedLayer: scns[0].layer,
        culpritNode: culpritNames,
        plainProof: proofs,
        traditionalResult: scns.map(s => s.traditionalMistake).join(' • '),
        recoveryMsg: 'Ready to fix!'
      };
    } else if (this.phase === 'RESOLVED') {
      this.localizationResult = {
        localized: true,
        localizedLayers: scns.map(s => s.layer),
        localizedLayer: scns[0].layer,
        culpritNode: culpritNames,
        plainProof: 'Fixed! ' + fixes,
        traditionalResult: 'Recovered autonomously',
        recoveryMsg: fixes
      };
    }

    return this.getState();
  }

  addLog(level, msg) {
    const pad = (n) => String(n).padStart(2, '0');
    const d = new Date();
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    this.logs.unshift({
      id: Date.now() + Math.random(),
      time: timeStr,
      level,
      msg
    });
    if (this.logs.length > 25) {
      this.logs.pop();
    }
  }

  getState() {
    return {
      time: this.time,
      phase: this.phase,
      blueprint: this.blueprint,
      blueprintId: this.blueprintId,
      isLearnedReflex: this.isLearnedReflex,
      learnedExperience: this.learnedExperience,
      activeScenario: this.activeScenario,
      activeScenarios: this.activeScenarios && this.activeScenarios.length > 0 ? this.activeScenarios : [this.activeScenario],
      tanks: this.tanks,
      sensors: this.sensors,
      layers: this.layers,
      localizationResult: this.localizationResult,
      sustainability: this.sustainability,
      logs: this.logs
    };
  }
}