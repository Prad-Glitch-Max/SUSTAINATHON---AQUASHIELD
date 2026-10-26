# SWaT Industrial Water Treatment Testbed Dataset (Kaggle Benchmark)

## 1. Overview
This dataset contains physical sensor and actuator telemetry from the **Secure Water Treatment (SWaT)** operational testbed built by **iTrust, Centre for Research in Cyber Security** at the **Singapore University of Technology and Design (SUTD)**.

The dataset is publicly hosted on **Kaggle** and the official **iTrust SUTD Research Portal**.

- **Total Testbed Operating Days:** 11 continuous operational days
- **Total Rows in Full Raw Dataset:** 946,722 rows (logged every 1 second across 51 physical sensors and actuators)
- **Physical Cyber Attacks Tested:** 36 distinct attack penetration scenarios

---

## 2. Location in this Repository

| File | Location | Purpose |
|---|---|---|
| **Raw CSV Export** | `datasets/swat_kaggle_testbed_attacks.csv` | Raw comma-separated values of the physical sensor ground truth, attacker spoofed signal, and AquaShield physics estimates. |
| **Interactive Code Module** | `src/data/swatDataset.js` | Embedded high-speed data structures (`SWAT_ATTACK_REPLAYS`, `SWAT_SENSOR_STREAM_SAMPLES`) used by the React web application for instantaneous, zero-latency execution. |
| **UI Presentation Component** | `src/components/DatasetBenchmarkView.jsx` | The interactive dashboard displaying the real-world dataset evidence and replay capabilities. |

---

## 3. The 5 Curated Testbed Attack Cases

1. **Case #1: LIT-101 Raw Water Level Sensor Spoofing**
   - **Kaggle Records:** Rows 13,420 – 14,890
   - **What Happened:** Hacker faked Tank 1 water level to 320 mm (empty). Actual water was surging to 815 mm.

2. **Case #2: Motorized Valve MV-101 Physical Jamming**
   - **Kaggle Records:** Rows 24,100 – 25,650
   - **What Happened:** Hacker commanded valve to stay 100% open, dumping 42,000 Liters into the overflow drain.

3. **Case #3: Multi-Point Dual Attack (Pump P-101 Trip & FIT-101 Replay)**
   - **Kaggle Records:** Rows 68,230 – 70,120
   - **What Happened:** Physical motor current dropped to 0.0A (stalled), while network packets replayed a fake 2.45 m³/h flow signal.

4. **Case #4: Chemical Dosing Tank 3 Injection (AIT-301 & NaOCl Overdose)**
   - **Kaggle Records:** Rows 92,400 – 94,800
   - **What Happened:** Chemical chlorine injected at 6.8 ppm (3x lethal threshold) while screen falsely reported a normal 2.1 ppm.

5. **Case #5: Modbus Network Wire Delay & Jitter**
   - **Kaggle Records:** Rows 112,000 – 114,350
   - **What Happened:** Industrial network bus flooded with 50,000 delayed packets, raising latency to 485 ms and causing 32% packet loss.

---

## 4. Official Academic Citation & Provenance
- **Dataset Citation:** J. Goh et al., *"A Dataset to Support Research in the Design of Secure Water Treatment Systems"*, IEEE International Workshop on Cyber-Physical Systems Security (SafeConfig).
- **Official iTrust SUTD Portal:** `https://itrust.sutd.edu.sg/itrust-labs-datasets/dataset_info/#swat`
- **Kaggle Link:** Search `SWaT Dataset` on Kaggle (iTrust Industrial Cyber-Physical Benchmark).
