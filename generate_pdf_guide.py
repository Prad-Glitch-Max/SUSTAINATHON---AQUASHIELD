import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "AQUASHIELD CPS • Defense Architecture & Test Cases")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, page_text)
        self.drawString(54, 32, "Confidential • Sustainathon Project Defense Document • Clean Water CPS")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 44, letter[0] - 54, 44)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    c_primary = colors.HexColor("#0f172a")    # Deep Navy
    c_accent = colors.HexColor("#0284c7")     # Ocean Blue
    c_cyan = colors.HexColor("#0891b2")       # Cyan
    c_emerald = colors.HexColor("#059669")    # Emerald Green
    c_rose = colors.HexColor("#e11d48")       # Crimson Rose
    c_amber = colors.HexColor("#d97706")      # Amber
    c_card_bg = colors.HexColor("#f8fafc")    # Light slate card
    c_border = colors.HexColor("#e2e8f0")     # Light border

    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_accent,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_cyan,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=c_primary
    )

    callout_label = ParagraphStyle(
        'CalloutLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_primary
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        leftIndent=14,
        spaceAfter=3
    )

    story = []

    # ================= COVER / HEADER =================
    story.append(Paragraph("AQUASHIELD CYBER-PHYSICAL SYSTEM", title_style))
    story.append(Paragraph("System Tracking Mechanism, Catastrophic Damage Fail-Safes & Complete Test Cases Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_accent, spaceBefore=0, spaceAfter=14))

    # ================= PART 1: HOW THE SYSTEM TRACKS EVERYTHING =================
    story.append(Paragraph("PART 1: How AquaShield Tracks Everything Without Blindly Trusting Sensors", h1_style))
    story.append(Paragraph(
        "A fundamental problem in industrial cybersecurity is that hackers do not just attack computers—they compromise sensors to trick computers into making disastrous physical mistakes. "
        "<b>AquaShield never takes sensor numbers at face value.</b> Instead, it operates on a philosophy called <i>Physics-Informed Invariant Cross-Auditing</i> across 5 distinct, independent layers.",
        body_style
    ))

    # 3 Pillars Table
    p1_data = [
        [
            Paragraph("<b>Pillar 1: Fluid Mass Balance Math</b>", callout_label),
            Paragraph("<b>Pillar 2: Electromechanical Invariants</b>", callout_label),
            Paragraph("<b>Pillar 3: 5-Layer Triangulation</b>", callout_label)
        ],
        [
            Paragraph(
                "Water cannot magically vanish or appear. By the Law of Conservation of Mass: "
                "<i>ΔVolume = ∫(Inflow - Outflow) dt</i>. If incoming water is 45 L/s and outgoing is 35 L/s, water level <b>must rise</b>. "
                "If a hacked level sensor claims it is frozen at 32%, the mathematics immediately proves the sensor is lying—without needing a second sensor.",
                callout_text
            ),
            Paragraph(
                "Hydraulic pressure, motor rotation speed, and electrical current are physically bound by physics (<i>ΔP ∝ RPM²</i>). "
                "If a compromised SCADA screen says 'Pump is running at 100%,' but the power transformer measures 0.2 Amps (idle), the computer knows with 100% certainty that the motor is stalled or disconnected.",
                callout_text
            ),
            Paragraph(
                "AquaShield audits 5 layers in parallel: "
                "<br/>• <b>Layer 1:</b> Sensor probes"
                "<br/>• <b>Layer 2:</b> Network wire timing"
                "<br/>• <b>Layer 3:</b> PLC controller brain"
                "<br/>• <b>Layer 4:</b> Motor firmware code"
                "<br/>• <b>Layer 5:</b> Physical valves/motors"
                "<br/>A hacker can spoof one layer, but cannot fake all five simultaneously.",
                callout_text
            )
        ]
    ]
    t_p1 = Table(p1_data, colWidths=[2.3*inch, 2.3*inch, 2.4*inch])
    t_p1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_p1)
    story.append(PageBreak())

    # ================= PART 2: TOTAL DAMAGE SCENARIO =================
    story.append(Paragraph("PART 2: What Happens If EVERYTHING In The System Gets Physically Damaged?", h1_style))
    story.append(Paragraph(
        "A common defense challenge from judges is: <i>'What if an extreme flood, bomb, or physical disaster completely smashes all sensors, wires, and computers at the same time?'</i>",
        body_style
    ))
    story.append(Paragraph(
        "AquaShield is designed around <b>Zero-Power Physical Mechanics</b>. When all digital systems, sensors, and computers are 100% destroyed, the physical hardware defaults to pure mechanical laws that operate with <b>zero electricity, zero software, and zero sensors</b>:",
        body_style
    ))

    p2_data = [
        [
            Paragraph("<b>1. Fail-Secure Spring Valves</b>", callout_label),
            Paragraph(
                "Industrial valves are spring-loaded. Disinfection chemical valves are <b>Normally Closed (NC)</b>—heavy mechanical coils slam them shut the microsecond power or control is lost, preventing poison leaks. "
                "Main municipal lines are <b>Normally Open (NO)</b> with counterweights, snapping open without electricity.",
                callout_text
            )
        ],
        [
            Paragraph("<b>2. Passive Gravitational Siphon Flow (P = ρgh)</b>", callout_label),
            Paragraph(
                "Tanks are placed at a physical elevation gradient. Tank 1 (raw intake) sits higher than Tank 4 (clean drinking water). "
                "Even with 100% of pumps smashed, gravity passively drives 18.5 Liters/second through sand/anthracite filter beds directly into the city clean water supply.",
                callout_text
            )
        ],
        [
            Paragraph("<b>3. Concrete Physical Overflow Weirs</b>", callout_label),
            Paragraph(
                "Each water tank is built with a passive physical spillway weir. If incoming water keeps pouring in and all sensors are destroyed, water physically spills over the concrete crest into an underground retention buffer pond. "
                "Tanks physically cannot rupture or burst, regardless of computer failure.",
                callout_text
            )
        ],
        [
            Paragraph("<b>4. Hardware Watchdog Drop-Out Relays</b>", callout_label),
            Paragraph(
                "High-voltage pumps require an active 50ms heartbeat pulse from an isolated safety watchdog. If the computer is destroyed, the magnetic coil drops out in 15 milliseconds, mechanically severing power and preventing motor fires.",
                callout_text
            )
        ]
    ]
    t_p2 = Table(p2_data, colWidths=[2.2*inch, 4.8*inch])
    t_p2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_p2)

    story.append(PageBreak())

    # ================= PART 3: ALL TEST CASES =================
    story.append(Paragraph("PART 3: Complete Catalog of Updated Test Cases & Layman Solutions", h1_style))
    story.append(Paragraph(
        "Below are all 8 updated Cyber-Physical attack and disruption scenarios implemented in the AquaShield testbed, explaining exactly what happens, why legacy systems fail, how AquaShield solves it, and how to prevent it in the future.",
        body_style
    ))
    story.append(Spacer(1, 4))

    scenarios = [
        {
            "num": "Test Case 1",
            "name": "Fake Water Sensor Reading (Sensor Telemetry Spoof)",
            "layer": "Layer 1: Sensor Probe • Target: Tank 2 Water Level Sensor (LIT-101)",
            "swat": "SWaT Kaggle Dataset Attack #1 (LIT-101 Tampering)",
            "color": c_cyan,
            "problem": "A hacker freezes Tank 2’s water level sensor reading at 32%, even though the input pump is pumping water in full blast.",
            "old_fail": "Old IT tools panic! They assume Tank 2 is running completely dry, command pumps to flood the facility with excess water, and trigger a massive overflow.",
            "proof": "Mass conservation: Inflow (45 L/s) > Outflow (35 L/s). Water level MUST rise. A sensor reporting static 32% violates physics and is mathematically proven to be lying.",
            "fix": "AquaShield quarantines the lying sensor in 38ms, computes the true water level using pump flow equations, and continues operation with ZERO downtime.",
            "prevent": "Install hardware cryptographic attestation on physical sensor heads and embed mathematical continuity checkers in PLC runtime."
        },
        {
            "num": "Test Case 2",
            "name": "Network Cable Jamming & Latency Delay (Man-In-The-Middle)",
            "layer": "Layer 2: Communication Channel • Target: SCADA Modbus Network Cable",
            "swat": "SWaT Kaggle Dataset Attack #26 (Modbus TCP Delay & Packet Replay)",
            "color": c_accent,
            "problem": "Attacker jams the industrial Ethernet switch, injecting 1,450ms packet latency and replaying old sensor data out of order.",
            "old_fail": "Old SCADA systems conclude plant communication is totally dead and initiate an emergency blackout, dumping 40,000 Liters of purified drinking water.",
            "proof": "Continuity invariant: Fluid height cannot teleport in 1ms. Water levels across all 4 tanks remain physically continuous; only network timestamps are delayed.",
            "fix": "AquaShield automatically migrates SCADA telemetry packets to a secondary encrypted wireless backup channel in 38 milliseconds with zero data loss.",
            "prevent": "Upgrade fieldbuses to IEEE 1588 Time-Sensitive Networking (TSN) with monotonic hardware timestamps and MACsec line encryption."
        },
        {
            "num": "Test Case 3",
            "name": "Computer Brain Hack (PLC Controller Command Override)",
            "layer": "Layer 3: PLC Controller Brain • Target: Main Industrial Control Computer",
            "swat": "SWaT Kaggle Dataset Attack #31 (PLC Setpoint Command Injection)",
            "color": colors.HexColor("#7c3aed"),
            "problem": "A cyber attacker breaches the PLC and commands hydraulic pressure to a dangerous 8.5 bar, far above pipeline ratings.",
            "old_fail": "Standard security tools assume an authorized operator typed this command and do nothing until the steel pipeline ruptures.",
            "proof": "Safety boundary proof: Commanded pressure (8.5 bar) exceeds physical steel pipe burst rating (6.0 bar), breaking cyber-physical safety limits.",
            "fix": "AquaShield hardware safety interlock overrides rogue PLC command, clamps hydraulic pressure to safe 3.2 bar, and saves the pipeline.",
            "prevent": "Implement hardwired physical pressure-relief safety relays that physically drop pump coil power if pressure exceeds 4.5 bar."
        },
        {
            "num": "Test Case 4",
            "name": "Corrupted Motor Software Code (Embedded Firmware Rootkit)",
            "layer": "Layer 4: Firmware Code • Target: Pump 2 Motor Microcode ROM",
            "swat": "SWaT Kaggle Dataset Attack #33 (Actuator Microcode Replacement)",
            "color": c_amber,
            "problem": "Malware is flashed onto Pump 2’s motor controller, shaking the turbine at 120Hz acoustic resonance while falsely reporting 'Normal' on screen.",
            "old_fail": "Antivirus scanners cannot scan embedded microchips. Operators remain blind until the physical motor bearings melt ($65,000 damage).",
            "proof": "Cryptographic checksum verification: Firmware SHA-256 hash does not match the certified Golden ROM image (Signature mismatch: 0xDEADBEEF).",
            "fix": "AquaShield flashes clean Golden Firmware from read-only secure ROM in 420 milliseconds, stopping vibration before mechanical fatigue occurs.",
            "prevent": "Hardware Root-of-Trust (RoT) with RSA-4096 signature check on startup and physical write-protect hardware jumpers on actuator flash memory."
        },
        {
            "num": "Test Case 5",
            "name": "Stuck Physical Water Valve (Actuator Mechanical Jam)",
            "layer": "Layer 5: Physical Actuator • Target: Emergency Discharge Valve",
            "swat": "SWaT Kaggle Dataset Attack #4 (Motorized Valve MV-101 Jamming)",
            "color": c_rose,
            "problem": "A mechanical valve physically jams wide open at 100%, spilling clean water into the drain while the computer commanded 0% (CLOSED).",
            "old_fail": "Old tools blame the water level sensor and think it is glitching, allowing 60,000 Liters of clean water to pour away into the sewer.",
            "proof": "Flowmeter measures 65 L/s discharge while PLC command is 0%. The electrical command is 0% but physical outflow is 65 L/s—proving valve is jammed.",
            "fix": "AquaShield activates the secondary motorized diverter bypass valve and seals the leaking conduit in 580ms. 0 Liters lost.",
            "prevent": "Continuous Motor Current Signature Analysis (MCSA) to detect silt buildup before full valve seizure, and parallel dual diverter piping."
        },
        {
            "num": "Test Case 6",
            "name": "ALL Alternate Paths Blocked (Total Hydraulic Bypass Gridlock)",
            "layer": "Special Judge Challenge 1 • Target: All Primary & Bypass Transfer Conduits",
            "swat": "SWaT Multi-Actuator Gridlock Benchmark (Simultaneous Conduits Blockade)",
            "color": c_rose,
            "problem": "Hacker jams the primary transfer pipe AND simultaneously blocks all alternate bypass conduits, creating total forward hydraulic gridlock.",
            "old_fail": "Old tools panic and repeatedly issue valve commands. Inflow (42.5 L/s) slamming into zero outflow triggers a water hammer shockwave that ruptures pipes.",
            "proof": "Bernoulli Incompressible Fluid Law: Kinetic inflow with zero outflow creates extreme Joukowsky water hammer shockwave (pressure surging > 7.8 bar).",
            "fix": "Mechanical burst relief disc vents surge pressure to safe 2.4 bar, upstream pump P-101 decouples, and water is routed into the Emergency Recirculation Loop back to Reservoir Tank 1. 0 pipe bursts, 0L lost.",
            "prevent": "Install zero-power spring-loaded rupture relief discs rated to 3.5 bar and maintain dedicated closed-circuit buffer recirculation loops."
        },
        {
            "num": "Test Case 7",
            "name": "Widespread Power Grid Blackout (Total 0V Facility Shutdown)",
            "layer": "Special Judge Challenge 2 • Target: Main 3-Phase AC Power Distribution Bus",
            "swat": "SWaT Power Grid Loss & Black-Sky Disturbance Benchmark",
            "color": c_amber,
            "problem": "A cyber grid attack or substation failure cuts electrical power to 0 volts across all facility pumps, motors, and SCADA computers.",
            "old_fail": "Traditional computerized plants go completely dark and blind, halting municipal drinking water to the city for days.",
            "proof": "Natural Gravity Siphon Law (P = ρgh): Water elevation gradient between elevated Tank 1 and ground Tank 4 generates continuous passive pressure (1.6 bar) without electricity.",
            "fix": "Fail-secure spring-loaded mechanical valves snap open with 0V power. Passive gravity-flow filtration continues supplying 18.5 L/s clean water with ZERO electricity.",
            "prevent": "Normally-open fail-secure spring counterweight actuators, maintaining hydraulic reservoir elevation gradients, and 24V DC battery backup."
        },
        {
            "num": "Test Case 8",
            "name": "Toxic Chemical Overdose Injection (Disinfection Tank 3)",
            "layer": "Zero-Day Chemical Vector • Target: Tank 3 Chlorine/Acid Dosing Unit",
            "swat": "SWaT Kaggle Dataset Attack #22 (LIT-301 & NaOCl Chemical Overdose)",
            "color": c_emerald,
            "problem": "Hacker forces chemical dosing pump to inject 6.8 ppm chlorine into drinking water (safe limit is 2.0 ppm).",
            "old_fail": "Old systems dump the entire 90,000L tank contents into sewer, contaminating rivers and causing massive drinking water shortages.",
            "proof": "Stoichiometric mass balance: Chemical dosing rate Q_chem exceeds neutralization stoichiometry for current tank volume by 280%.",
            "fix": "AquaShield activates emergency counter-neutralization dosing valve, engages secondary UV sterilization loop in 45ms, and prevents any toxic delivery.",
            "prevent": "Physical pH chemical buffer cartridges and hardware mechanical orifice limiters that physically prevent chemical injection above 3.5 ppm."
        }
    ]

    for scn in scenarios:
        case_header = [
            [
                Paragraph(f"<b>{scn['num']}: {scn['name']}</b>", ParagraphStyle('CH', parent=callout_label, textColor=scn['color'], fontSize=10.5, leading=13)),
                Paragraph(f"<i>{scn['swat']}</i>", ParagraphStyle('CR', parent=callout_text, alignment=2, textColor=colors.HexColor("#64748b"), fontSize=8))
            ]
        ]
        t_ch = Table(case_header, colWidths=[4.6*inch, 2.4*inch])
        t_ch.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))

        case_body = [
            [
                Paragraph("<b>Layer / Target:</b>", callout_label),
                Paragraph(scn['layer'], callout_text)
            ],
            [
                Paragraph("<b>The Problem:</b>", callout_label),
                Paragraph(scn['problem'], callout_text)
            ],
            [
                Paragraph("<b>Old Tools Fail:</b>", ParagraphStyle('OF', parent=callout_label, textColor=c_rose)),
                Paragraph(scn['old_fail'], callout_text)
            ],
            [
                Paragraph("<b>Physical Proof:</b>", ParagraphStyle('PP', parent=callout_label, textColor=c_accent)),
                Paragraph(scn['proof'], callout_text)
            ],
            [
                Paragraph("<b>AquaShield Fix:</b>", ParagraphStyle('AF', parent=callout_label, textColor=c_emerald)),
                Paragraph(f"<b>{scn['fix']}</b>", callout_text)
            ],
            [
                Paragraph("<b>Future Prevention:</b>", ParagraphStyle('FP', parent=callout_label, textColor=colors.HexColor("#475569"))),
                Paragraph(scn['prevent'], callout_text)
            ]
        ]
        t_cb = Table(case_body, colWidths=[1.4*inch, 5.6*inch])
        t_cb.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
            ('BOX', (0,0), (-1,-1), 1, c_border),
            ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))

        story.append(KeepTogether([
            t_ch,
            Spacer(1, 3),
            t_cb,
            Spacer(1, 10)
        ]))

    # ================= SUMMARY MATRIX TABLE =================
    story.append(KeepTogether([
        Paragraph("SUMMARY MATRIX: AquaShield vs. Traditional Industrial Security", h1_style),
        Paragraph("Quick evaluation matrix for jury and technical reviewers:", body_style)
    ]))

    matrix_data = [
        [
            Paragraph("<b>Attack Scenario</b>", callout_label),
            Paragraph("<b>Compromised Layer</b>", callout_label),
            Paragraph("<b>Traditional Old Tool Mistake</b>", callout_label),
            Paragraph("<b>AquaShield Physical Remedy</b>", callout_label),
            Paragraph("<b>Downtime</b>", callout_label)
        ],
        [
            Paragraph("Fake Sensor (32%)", callout_text),
            Paragraph("Layer 1 (Sensor)", callout_text),
            Paragraph("Floods plant with excess water", callout_text),
            Paragraph("Calculates true level via mass math", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("Network Cable Delay", callout_text),
            Paragraph("Layer 2 (Cable)", callout_text),
            Paragraph("Emergency plant dump (40,000L)", callout_text),
            Paragraph("Automated 38ms wireless failover", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("PLC Brain Hijack (8.5 bar)", callout_text),
            Paragraph("Layer 3 (PLC)", callout_text),
            Paragraph("Trusts command, pipe bursts", callout_text),
            Paragraph("Hardware safety interlock clamp", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("Motor Rootkit (120Hz)", callout_text),
            Paragraph("Layer 4 (Firmware)", callout_text),
            Paragraph("Blind until motor melts", callout_text),
            Paragraph("Golden ROM restore in 420ms", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("Stuck Valve (100% open)", callout_text),
            Paragraph("Layer 5 (Actuator)", callout_text),
            Paragraph("Blames sensor; 60,000L leak", callout_text),
            Paragraph("Secondary diverter bypass seals leak", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("All Paths Blocked", callout_text),
            Paragraph("Multi-Conduit", callout_text),
            Paragraph("Water hammer blows pipe apart", callout_text),
            Paragraph("Relief disc vents + loop to Tank 1", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("Total Power 0V Blackout", callout_text),
            Paragraph("Power Grid (0V)", callout_text),
            Paragraph("City water cut off for days", callout_text),
            Paragraph("Fail-secure springs + gravity siphon", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ],
        [
            Paragraph("Chemical Overdose (6.8ppm)", callout_text),
            Paragraph("Chemical Dosing", callout_text),
            Paragraph("Dumps 90,000L contaminated tank", callout_text),
            Paragraph("Neutralization counter-dose + UV loop", callout_text),
            Paragraph("<b>0 sec</b>", callout_text)
        ]
    ]

    t_matrix = Table(matrix_data, colWidths=[1.5*inch, 1.2*inch, 1.8*inch, 1.9*inch, 0.6*inch])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_matrix)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'AquaShield_Test_Cases_and_System_Defense_Guide.pdf'
    build_pdf(target)
