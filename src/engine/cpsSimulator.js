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

  // STEP 1: Launch an attack
  launchAttack(scenarioKey) {
    const scn = ATTACK_SCENARIOS[scenarioKey] || ATTACK_SCENARIOS.NONE;
    if (scn.id === 'NONE') {
      this.reset();
      return;
    }
    this.activeScenario = scn;
    this.phase = 'ATTACK_ACTIVE';
    this.localizationResult.localized = false;

    this.addLog('ALERT', `[ATTACK LAUNCHED] ${scn.name}. Alarms ringing!`);
    this.addLog('WARN', `Old Security Tools: "Something is wrong! But we don't know where the attack came from!"`);
  }

  // STEP 2: Run Attack Localization Algorithm
  localizeAttack() {
    if (this.phase !== 'ATTACK_ACTIVE') return;
    this.phase = 'LOCALIZED';
    this.localizationResult.localized = true;
    const scn = this.activeScenario;

    this.addLog('INFO', `[CHECKING LAWS OF PHYSICS] Comparing incoming water vs outgoing water...`);
    this.addLog('ALERT', `[FOUND THE PROBLEM] Root cause is in ${scn.layerName} -> ${scn.target}! Other 4 layers are completely safe.`);
  }

  // STEP 3: Deploy Resilient Self-Healing Fix
  deployFix() {
    if (this.phase !== 'LOCALIZED') return;
    this.phase = 'RESOLVED';
    const scn = this.activeScenario;

    this.sustainability.litersProtected += 250;
    this.sustainability.energySavedKwh += 1.2;

    this.addLog('INFO', `[SELF-HEALED] ${scn.plainFix}`);
    this.addLog('INFO', `Clean water never stopped flowing. Zero seconds of downtime!`);
  }

  restoreBaseline() {
    this.reset();
    this.addLog('INFO', 'Plant reset to clean baseline operation. Everything is safe.');
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

    const scn = this.activeScenario;

    if (this.phase === 'NOMINAL') {
      this.localizationResult = {
        localized: false,
        localizedLayer: null,
        culpritNode: null,
        plainProof: 'All 5 layers are checked and healthy.',
        traditionalResult: 'System Nominal',
        recoveryMsg: null
      };
      return this.getState();
    }

    if (scn.id === 'SENSOR_SPOOF') {
      if (this.phase === 'RESOLVED') {
        this.sensors.levelT2_observed = this.sensors.levelT2_true;
        this.layers.SENSOR.status = 'HEALED_WITH_MATH';
      } else {
        this.sensors.levelT2_observed = 32.0;
        this.layers.SENSOR.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    } else if (scn.id === 'NETWORK_REPLAY') {
      if (this.phase === 'RESOLVED') {
        this.layers.COMMUNICATION_CHANNEL.status = 'BACKUP_WIRE_ACTIVE';
      } else {
        this.layers.COMMUNICATION_CHANNEL.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    } else if (scn.id === 'CONTROLLER_HIJACK') {
      if (this.phase === 'RESOLVED') {
        this.sensors.pressureBar = 3.2;
        this.layers.CONTROLLER.status = 'SAFETY_CLAMPED';
      } else {
        this.sensors.pressureBar = 8.2;
        this.layers.CONTROLLER.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    } else if (scn.id === 'FIRMWARE_ROOTKIT') {
      if (this.phase === 'RESOLVED') {
        this.layers.FIRMWARE.status = 'ORIGINAL_RESTORED';
      } else {
        this.layers.FIRMWARE.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    } else if (scn.id === 'ACTUATOR_JAM') {
      if (this.phase === 'RESOLVED') {
        this.sensors.flowOutflow = 39.0;
        this.layers.ACTUATOR.status = 'BACKUP_PIPE_OPEN';
      } else {
        this.sensors.flowOutflow = 65.0;
        this.layers.ACTUATOR.status = this.phase === 'LOCALIZED' ? 'COMPROMISED' : 'SUSPECT';
      }
    }

    if (this.phase === 'ATTACK_ACTIVE') {
      this.localizationResult = {
        localized: false,
        localizedLayer: null,
        culpritNode: 'Unknown! (Checking all 5 layers...)',
        plainProof: 'Alarms are ringing! But no one knows which layer broke.',
        traditionalResult: scn.traditionalMistake,
        recoveryMsg: 'Click "Localize Attack" or use Auto-Pilot to find the problem.'
      };
    } else if (this.phase === 'LOCALIZED') {
      this.localizationResult = {
        localized: true,
        localizedLayer: scn.layer,
        culpritNode: scn.target,
        plainProof: scn.plainMathProof,
        traditionalResult: scn.traditionalMistake,
        recoveryMsg: 'Ready to fix!'
      };
    } else if (this.phase === 'RESOLVED') {
      this.localizationResult = {
        localized: true,
        localizedLayer: scn.layer,
        culpritNode: scn.target,
        plainProof: 'Fixed! ' + scn.plainFix,
        traditionalResult: scn.traditionalMistake,
        recoveryMsg: scn.plainFix
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
      tanks: this.tanks,
      sensors: this.sensors,
      layers: this.layers,
      localizationResult: this.localizationResult,
      sustainability: this.sustainability,
      logs: this.logs
    };
  }
}
