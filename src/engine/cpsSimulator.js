// AquaShield Cyber-Physical Simulation & Attack Localization Engine
// Designed for simple, clear, layman-friendly presentations without complex jargon

export const ATTACK_SCENARIOS = {
  NONE: {
    id: 'NONE',
    name: 'Normal Operation',
    layer: null,
    layerName: 'None (Plant Healthy)',
    target: 'All Systems Normal',
    description: 'Clean drinking water is flowing smoothly through all 4 tanks.',
    color: '#10b981'
  },
  SENSOR_SPOOF: {
    id: 'SENSOR_SPOOF',
    name: '1. Fake Sensor Reading',
    layer: 'SENSOR',
    layerName: 'Layer 1: Sensor',
    target: 'Water Level Sensor (Tank 2)',
    description: 'A hacker froze the water sensor to say 32%, even though the tank is actually filling up.',
    symptom: 'The sensor says the tank is empty, but the pump is pouring water in full blast.',
    traditionalMistake: 'Old security tools panic! They think the tank is drying up, pump in way too much water, and flood the whole facility.',
    plainMathProof: 'Water is flowing in, so the water level MUST rise. The sensor says it didn’t move. Therefore, the sensor is lying.',
    plainFix: 'We ignore the lying sensor, calculate the real water level using simple math, and keep the drinking water clean with zero downtime.',
    color: '#00f2fe'
  },
  NETWORK_REPLAY: {
    id: 'NETWORK_REPLAY',
    name: '2. Network Cable Attack',
    layer: 'COMMUNICATION_CHANNEL',
    layerName: 'Layer 2: Network Cable',
    target: 'Communication Wire (Network Cable)',
    description: 'A hacker slowed down the network wire, delaying messages and resending old data.',
    symptom: 'Messages from the water tanks are arriving late and out of order.',
    traditionalMistake: 'Old tools panic, think the entire internet is down, and shut down the whole plant, dumping 40,000 Liters of clean water.',
    plainMathProof: 'The water tanks and pumps are completely healthy. Only the message timestamps are late. This proves only the wire is having trouble.',
    plainFix: 'We automatically switch messages to a backup wireless wire in 38 milliseconds. The plant never stops.',
    color: '#3b82f6'
  },
  CONTROLLER_HIJACK: {
    id: 'CONTROLLER_HIJACK',
    name: '3. Computer Brain Hack',
    layer: 'CONTROLLER',
    layerName: 'Layer 3: Computer Brain (PLC)',
    target: 'Main Control Computer (PLC)',
    description: 'A hacker broke into the main computer and told it to push water pressure to a dangerous 8.5 bar.',
    symptom: 'Water pressure is shooting up dangerously close to bursting the pipes.',
    traditionalMistake: 'Old tools blame the water pumps, completely missing that the computer brain itself was commanded to do something dangerous.',
    plainMathProof: 'The water pipes physically cannot handle 8.5 bar. The computer command broke basic safety limits.',
    plainFix: 'Our emergency safety switch overrides the computer, clamps the pressure back to a safe 3.2 bar, and saves the pipes.',
    color: '#a855f7'
  },
  FIRMWARE_ROOTKIT: {
    id: 'FIRMWARE_ROOTKIT',
    name: '4. Corrupted Software Code',
    layer: 'FIRMWARE',
    layerName: 'Layer 4: Software Code (Firmware)',
    target: 'Motor Software Code',
    description: 'A hacker replaced the pump software with bad code that shakes the motor until it breaks, while lying to the screen that it is fine.',
    symptom: 'The water pump is vibrating violently, but the screen falsely says everything is normal.',
    traditionalMistake: 'Old tools trust what the screen says and never notice the motor physically shaking until it burns out.',
    plainMathProof: 'We checked the software’s digital fingerprint. The fingerprint did not match the original clean software code.',
    plainFix: 'We erased the hacked software and restored the clean original code in less than a second.',
    color: '#f59e0b'
  },
  ACTUATOR_JAM: {
    id: 'ACTUATOR_JAM',
    name: '5. Stuck Water Valve',
    layer: 'ACTUATOR',
    layerName: 'Layer 5: Physical Valve (Motor)',
    target: 'Emergency Release Valve',
    description: 'A mechanical valve physically jammed open at 100%, spilling clean water into the drain.',
    symptom: 'Water is pouring out of the pipe even though the computer commanded the valve to CLOSE.',
    traditionalMistake: 'Old tools blame the water sensor and think it is glitching, while 60,000 Liters of water leak away.',
    plainMathProof: 'The sensor was telling the truth: water was really leaking. The computer command was 0%, but the physical valve was stuck at 100%.',
    plainFix: 'We automatically divert water to a backup pipe and stop the water leak instantly.',
    color: '#ff2a5f'
  }
};

export class CPSSimulator {
  constructor() {
    this.reset();
  }

  reset() {
    this.activeScenarios = [];
    this.activeScenario = ATTACK_SCENARIOS.NONE;
    this.phase = 'NOMINAL'; // 'NOMINAL' | 'ATTACK_ACTIVE' | 'LOCALIZED' | 'RESOLVED'
    this.time = 0;
    
    // Plant Physical State
    this.tanks = {
      tank1: { id: 'TNK-101', name: 'Raw Water Intake', level: 72, capacity: 50000, color: '#38bdf8' },
      tank2: { id: 'TNK-102', name: 'Filtration Tank', level: 68, capacity: 40000, color: '#00f2fe' },
      tank3: { id: 'TNK-103', name: 'Disinfection Tank', level: 75, capacity: 45000, color: '#34d399' },
      tank4: { id: 'TNK-104', name: 'Clean Drinking Water', level: 82, capacity: 60000, color: '#10b981' }
    };

    // Sensor Readings
    this.sensors = {
      levelT2_true: 68.0,
      levelT2_observed: 68.0,
      flowInflow: 42.5,
      flowOutflow: 38.0,
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
      { id: 1, time: '10:00:01', level: 'INFO', msg: 'Water plant running normally. All 5 layers safe.' },
      { id: 2, time: '10:00:02', level: 'INFO', msg: 'Clean drinking water flowing to the city.' }
    ];
  }

  // STEP 1: Launch one or MULTIPLE attacks simultaneously!
  launchAttack(scenarioKeys) {
    const keys = Array.isArray(scenarioKeys) ? scenarioKeys : [scenarioKeys];
    const scenarios = keys
      .map(k => ATTACK_SCENARIOS[k])
      .filter(s => s && s.id !== 'NONE');

    if (scenarios.length === 0) {
      this.reset();
      return;
    }

    this.activeScenarios = scenarios;
    this.activeScenario = scenarios[0]; // Primary scenario for backward compatibility
    this.phase = 'ATTACK_ACTIVE';
    this.localizationResult.localized = false;

    if (scenarios.length === 1) {
      this.addLog('ALERT', `[ATTACK LAUNCHED] ${scenarios[0].name}. Alarms ringing!`);
    } else {
      const names = scenarios.map(s => s.name).join(', ');
      this.addLog('ALERT', `[MULTI-VECTOR ATTACK LAUNCHED] ${scenarios.length} layers breached simultaneously: ${names}!`);
    }
    this.addLog('WARN', `Old Security Tools: "Multiple alarms triggering! Complete system panic—we cannot isolate root causes!"`);
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
    const hasSensor = scns.some(s => s.id === 'SENSOR_SPOOF');
    const hasNetwork = scns.some(s => s.id === 'NETWORK_REPLAY');
    const hasController = scns.some(s => s.id === 'CONTROLLER_HIJACK');
    const hasFirmware = scns.some(s => s.id === 'FIRMWARE_ROOTKIT');
    const hasActuator = scns.some(s => s.id === 'ACTUATOR_JAM');

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
    if (hasActuator) {
      if (this.phase === 'RESOLVED') {
        this.sensors.flowOutflow = 39.0;
        this.layers.ACTUATOR.status = 'BACKUP_PIPE_OPEN';
      } else {
        this.sensors.flowOutflow = 65.0;
        this.layers.ACTUATOR.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    const culpritNames = scns.map(s => s.target).join(' & ');
    const layerNames = scns.map(s => s.layerName).join(' & ');
    const proofs = scns.map(s => s.plainMathProof).join(' • ');
    const fixes = scns.map(s => s.plainFix).join(' • ');

    if (this.phase === 'ATTACK_ACTIVE') {
      this.localizationResult = {
        localized: false,
        localizedLayers: [],
        localizedLayer: null,
        culpritNode: `Unknown! (Scanning ${scns.length} active disturbance[s] across 5 layers...)`,
        plainProof: 'Alarms ringing! Traditional monitoring cannot identify which layer is failing.',
        traditionalResult: scns.map(s => s.traditionalMistake).join(' • '),
        recoveryMsg: 'Click "Localize Attack" or use Auto-Pilot to pinpoint root causes.'
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
