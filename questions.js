'use strict';

const TOPIC_META = {
  sensors:            { label: 'Sensors',            icon: '📡', color: '#2563EB' },
  motor_control:      { label: 'Motor Control',       icon: '⚡', color: '#D97706' },
  motion_controllers: { label: 'Motion Controllers',  icon: '🎛️', color: '#16A34A' },
  interfacing:        { label: 'Interfacing',          icon: '🔌', color: '#7C3AED' },
  drive_systems:      { label: 'Drive Systems',        icon: '⚙️', color: '#DC2626' },
  communication:      { label: 'Communication',        icon: '🔗', color: '#0891B2' },
  safety:             { label: 'Safety',               icon: '🛡️', color: '#CA8A04' },
  emc:                { label: 'EMC',                  icon: '📶', color: '#475569' },
  thermal:            { label: 'Thermal',              icon: '🌡️', color: '#EA580C' }
};

const QUESTIONS = [

/* ══════════════════════════════════════════════════════
   SENSORS
══════════════════════════════════════════════════════ */

{
  id: 'sns_001', topic: 'sensors', type: 'mc', difficulty: 'medium',
  question: 'What principle does an optical incremental encoder use to detect angular position?',
  options: [
    'A light beam reflects off a rotating mirror; the angle is derived by triangulation of the reflected spot.',
    'A rotating slotted disk and a fixed grating (reticle) create a Moiré pattern whose intensity modulation is detected as pulses.',
    'Magnetic poles on the shaft change the reluctance of an iron core, inducing voltage pulses in a pickup coil.',
    'An electrical contact slides along a resistive track; position is determined by measuring the resistance between contacts.'
  ],
  correct: 1,
  explanation: 'Optical incremental encoders use a rotating disk with fine slots and a stationary grating. The interference of the two patterns creates a sinusoidal light intensity variation; a photodetector converts this to a digital pulse train.',
  examRelevant: true
},
{
  id: 'sns_002', topic: 'sensors', type: 'mc', difficulty: 'medium',
  question: 'An incremental encoder produces 50 pulses per revolution on each of channels A and B. What is the maximum achievable position resolution when using quadrature (×4) decoding?',
  options: [
    '50 counts per revolution',
    '100 counts per revolution',
    '200 counts per revolution',
    '400 counts per revolution'
  ],
  correct: 2,
  explanation: 'Quadrature ×4 decoding counts both rising and falling edges on both A and B channels: 50 × 4 = 200 counts per revolution. ×2 decoding (edges on one channel only) gives 100 counts/rev.',
  examRelevant: true
},
{
  id: 'sns_003', topic: 'sensors', type: 'mc', difficulty: 'easy',
  question: 'What is the purpose of the Z (index) signal on an incremental encoder?',
  options: [
    'It carries the quadrature phase information needed to determine rotation direction.',
    'It generates one pulse per revolution to establish a known reference position (home/index).',
    'It signals that the encoder has detected an error or misalignment.',
    'It carries absolute position data as a serial stream once per revolution.'
  ],
  correct: 1,
  explanation: 'The Z channel produces exactly one narrow pulse per revolution at a fixed shaft angle, giving the controller a repeatable reference position for homing routines.',
  examRelevant: true
},
{
  id: 'sns_004', topic: 'sensors', type: 'mc', difficulty: 'medium',
  question: 'How is the direction of rotation detected using an incremental encoder with channels A and B?',
  options: [
    'The amplitude of channel A is higher than B when rotating clockwise.',
    'The A signal has a higher frequency than B in one direction and lower in the other.',
    'The phase relationship between A and B (which leads by 90°) indicates direction.',
    'The duty cycle of A changes from 30% to 70% depending on direction.'
  ],
  correct: 2,
  explanation: 'Channels A and B are 90° phase-shifted (quadrature). If A leads B the motor rotates in one direction; if B leads A it rotates the other. The controller evaluates which signal transitions first.',
  examRelevant: true
},
{
  id: 'sns_005', topic: 'sensors', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about temperature sensors:',
  statements: [
    { text: 'A PTC thermistor is well-suited for highly accurate analog temperature measurement because its resistance changes linearly with temperature.', correct: false },
    { text: 'A thermocouple generates a small voltage (not a current) that is proportional to the temperature difference between the measuring junction and the reference junction.', correct: true }
  ],
  explanation: 'PTC (Positive Temperature Coefficient) thermistors are non-linear and primarily used as protection switches, not precision measurement. Thermocouples generate a Seebeck-effect voltage (typically µV/°C); they are current sources only when loaded externally.',
  examRelevant: true
},
{
  id: 'sns_006', topic: 'sensors', type: 'mc', difficulty: 'medium',
  question: 'The ACS712 is a Hall-effect current sensor. What is its key operating principle?',
  options: [
    'The current through a shunt resistor creates a voltage drop measured differentially.',
    'A current-carrying conductor generates a magnetic field; the Hall element produces a proportional voltage output.',
    'An inductive coil around the conductor integrates the magnetic flux to measure AC current only.',
    'Two back-to-back diodes clip the waveform and the average is proportional to the RMS current.'
  ],
  correct: 1,
  explanation: 'The ACS712 integrates the current-carrying conductor and a Hall element in a single IC. Current creates a magnetic field; the Hall effect produces a voltage perpendicular to both the field and the bias current, giving an output proportional to the measured current.',
  examRelevant: true
},
{
  id: 'sns_007', topic: 'sensors', type: 'mc', difficulty: 'hard',
  question: 'The INA226 is used in a power monitoring application. Which interface does it use to communicate with a microcontroller, and what quantities can it simultaneously measure?',
  options: [
    'SPI; it measures only voltage with 12-bit resolution.',
    'UART; it measures current and power but not voltage.',
    'I2C; it measures bus voltage, shunt voltage (current), and can calculate power.',
    'CAN; it measures temperature and current for motor protection.'
  ],
  correct: 2,
  explanation: 'The INA226 uses I2C and contains a 16-bit ADC. It measures shunt voltage (to compute current via a known shunt resistor) and bus voltage, and internally multiplies them to compute power — all in one IC.',
  examRelevant: false
},
{
  id: 'sns_008', topic: 'sensors', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about encoder resolution and direction detection:',
  statements: [
    { text: 'With ×4 quadrature decoding, an encoder with 50 PPR achieves a resolution of 200 counts per revolution.', correct: true },
    { text: 'To detect direction of rotation with an incremental encoder, at least the Z (index) channel must be monitored.', correct: false }
  ],
  explanation: '×4 decoding uses both edges of both A and B: 50×4 = 200 counts/rev — correct. Direction is determined purely from the phase relationship of A and B; the Z channel is not involved in direction detection.',
  examRelevant: true
},
{
  id: 'sns_009', topic: 'sensors', type: 'open', difficulty: 'medium',
  question: 'An incremental encoder is rated at 1000 PPR (pulses per revolution). A motion controller uses ×4 quadrature decoding.\n\n(a) Calculate the angular resolution in degrees per count.\n(b) The shaft rotates at 3000 RPM. Calculate the pulse frequency on channel A.',
  sampleAnswer: '(a) Counts per rev = 1000 × 4 = 4000. Resolution = 360° / 4000 = 0.09° per count.\n(b) Channel A frequency = 1000 pulses/rev × (3000 rev / 60 s) = 1000 × 50 = 50,000 Hz = 50 kHz.',
  rubric: [
    'Multiplies PPR by 4 to get counts/rev (4000)',
    'Divides 360° by counts/rev to get 0.09°/count',
    'Converts RPM to rev/s (÷60)',
    'Multiplies PPR × rev/s for channel A frequency (50 kHz)'
  ],
  explanation: '×4 decoding counts all transitions on A and B, giving 4× the PPR. Channel A alone still produces PPR × rev/s = 50 kHz; ×4 decoding is done in the counter, not by the encoder hardware.',
  examRelevant: true
},
{
  id: 'sns_010', topic: 'sensors', type: 'flashcard', difficulty: 'easy',
  front: 'What is an incremental encoder?',
  back: 'A sensor that outputs a train of pulses as the shaft rotates. It measures relative position (counts from a reference). It cannot determine absolute position after power-up without a homing routine.',
  explanation: 'Incremental = counts pulses; needs homing to know absolute position.',
  examRelevant: false
},
{
  id: 'sns_011', topic: 'sensors', type: 'flashcard', difficulty: 'easy',
  front: 'Absolute encoder vs Incremental encoder — key difference',
  back: 'Absolute: outputs a unique code for every shaft position; retains position after power-off. Incremental: outputs pulses; loses position after power-off and requires homing.',
  explanation: 'Absolute encoders are more expensive but do not need homing sequences.',
  examRelevant: false
},
{
  id: 'sns_012', topic: 'sensors', type: 'flashcard', difficulty: 'medium',
  front: 'Hall-effect current sensor — operating principle',
  back: 'Current through a conductor creates a magnetic field. A Hall element placed in this field produces a voltage perpendicular to both the current and the field (Lorentz force). Output voltage is proportional to the measured current.',
  explanation: 'Key advantage: galvanic isolation — no electrical connection between measured circuit and measurement output.',
  examRelevant: false
},
{
  id: 'sns_013', topic: 'sensors', type: 'mc', difficulty: 'hard',
  question: 'A Hall-effect current sensor (ACS712-05B) has a sensitivity of 185 mV/A and an output of 2.5 V at 0 A. If the output reads 3.3 V, what is the measured current?',
  options: [
    'approximately 1.76 A',
    'approximately 4.32 A',
    'approximately 0.44 A',
    'approximately 3.24 A'
  ],
  correct: 1,
  explanation: 'ΔV = 3.3 V − 2.5 V = 0.8 V. I = ΔV / sensitivity = 0.8 / 0.185 ≈ 4.32 A. The 2.5 V midpoint represents 0 A; each 185 mV above/below represents ±1 A.',
  examRelevant: false
},
{
  id: 'sns_014', topic: 'sensors', type: 'tf', difficulty: 'hard',
  question: 'Evaluate both statements about Hall-effect current sensors:',
  statements: [
    { text: 'Hall-effect current sensors provide galvanic isolation between the power circuit and the measurement output, making them safe for high-voltage applications.', correct: true },
    { text: 'The ACS712 can only measure DC currents; it cannot measure AC currents because the Hall effect only responds to static magnetic fields.', correct: false }
  ],
  explanation: 'Galvanic isolation is a major advantage of Hall-effect sensors — true. The Hall element responds to the instantaneous magnetic field, which follows the AC waveform, so AC measurement is supported — the second statement is false.',
  examRelevant: false
},
{
  id: 'sns_015', topic: 'sensors', type: 'mc', difficulty: 'medium',
  question: 'A PTC thermistor is placed in the motor winding. Which of the following best describes its function?',
  options: [
    'It accurately measures the winding temperature with a linear 0–10 V output for the controller.',
    'Its resistance increases sharply above a threshold temperature, interrupting the motor drive circuit or triggering a protection signal.',
    'It generates a thermoelectric voltage proportional to the temperature, which is amplified and read by an ADC.',
    'It acts as a current limiter, reducing motor current proportionally as temperature rises.'
  ],
  correct: 1,
  explanation: 'PTC thermistors exhibit a sharp resistance increase at a specific trip temperature (e.g., 130°C). This is used as a binary protection device — when resistance spikes, the protection circuit trips — not as a precision analog measurement.',
  examRelevant: true
},
{
  id: 'sns_016', topic: 'sensors', type: 'mc', difficulty: 'easy',
  question: 'Which sensor type generates its output signal from the Seebeck effect (temperature difference between two junctions of dissimilar metals)?',
  options: [
    'PTC thermistor',
    'RTD (Pt100)',
    'Thermocouple',
    'Hall-effect temperature sensor'
  ],
  correct: 2,
  explanation: 'A thermocouple works on the Seebeck effect: two dissimilar metals joined at two points. The temperature difference between the measuring junction and the reference junction generates a small voltage (µV to mV range).',
  examRelevant: true
},
{
  id: 'sns_017', topic: 'sensors', type: 'open', difficulty: 'hard',
  question: 'A motor drive system requires current measurement with the following requirements: galvanic isolation, bandwidth > 50 kHz, measurement range ±50 A, and 3.3 V microcontroller interface.\n\nSelect a suitable sensor type and justify your choice. Identify one potential drawback.',
  sampleAnswer: 'A closed-loop Hall-effect current sensor (e.g., LEM LTS 50-NP) is suitable. It provides galvanic isolation inherently, has bandwidth > 100 kHz, supports ±50 A range, and outputs an analog voltage compatible with 3.3 V ADCs.\n\nPotential drawback: offset voltage drift with temperature can reduce DC accuracy; calibration or temperature compensation may be needed.',
  rubric: [
    'Selects Hall-effect sensor (not shunt resistor — lacks isolation; not Rogowski coil — DC not measured)',
    'Justifies galvanic isolation capability',
    'Confirms bandwidth is sufficient (Hall sensors typically >100 kHz)',
    'Notes analog output compatible with 3.3 V system',
    'Identifies a valid drawback (offset drift, sensitivity variation, cost)'
  ],
  explanation: 'Shunt resistors are cheap but lack isolation. CTs (current transformers) cannot measure DC. Hall-effect sensors satisfy all requirements but have temperature-dependent offset.',
  examRelevant: true
},
{
  id: 'sns_018', topic: 'sensors', type: 'mc', difficulty: 'medium',
  question: 'An encoder datasheet states: "Output type: open-collector, with pull-up resistor required." What does this mean for the circuit design?',
  options: [
    'The encoder output directly drives the logic input; no external components are needed.',
    'A pull-up resistor must connect the encoder output to the supply voltage; the encoder can only sink current (pull low), not source it.',
    'The encoder output is a current source; a parallel resistor to GND is needed to convert it to a voltage.',
    'Open-collector means the output is floating and cannot be used with standard logic inputs.'
  ],
  correct: 1,
  explanation: 'Open-collector outputs have an NPN transistor that can only pull the line low (sink current). To get a logic HIGH, an external pull-up resistor to Vcc is required. This is standard practice for encoder and sensor interfaces.',
  examRelevant: false
},
{
  id: 'sns_019', topic: 'sensors', type: 'flashcard', difficulty: 'medium',
  front: 'PTC thermistor — protection use case',
  back: 'PTC = Positive Temperature Coefficient. Resistance rises sharply at trip temperature (e.g., 130°C). Used as a binary protection element in motor windings — when hot, resistance spikes and triggers the drive\'s protection circuit. Not suitable for accurate analog temperature measurement due to non-linear characteristic.',
  explanation: 'PTC vs NTC: NTC decreases resistance with temperature (used for measurement); PTC increases sharply (used for protection).',
  examRelevant: false
},
{
  id: 'sns_020', topic: 'sensors', type: 'mc', difficulty: 'hard',
  question: 'A motion controller requires an absolute position measurement at startup (no homing possible). The shaft can be at any angle. Which encoder type is required?',
  options: [
    'Incremental encoder with only the A channel',
    'Incremental encoder with A, B and Z channels',
    'Absolute encoder (single-turn or multi-turn)',
    'Resolver, because it can determine position without any encoder signals'
  ],
  correct: 2,
  explanation: 'Only an absolute encoder provides a unique position code at every shaft angle immediately after power-up, without requiring a homing sequence. Incremental encoders (with or without Z) require homing before position is known.',
  examRelevant: false
},

/* ══════════════════════════════════════════════════════
   MOTOR CONTROL
══════════════════════════════════════════════════════ */

{
  id: 'mot_001', topic: 'motor_control', type: 'mc', difficulty: 'medium',
  question: 'Which motor type is characterised by: low torque ripple, good overload capacity, low-cost controller requirement, but relatively poor thermal performance due to rotor heat dissipation?',
  options: [
    'Brushless DC motor (BLDC)',
    'Synchronous reluctance motor (SyncRM)',
    'DC brushed motor',
    'Hybrid stepper motor'
  ],
  correct: 2,
  explanation: 'The DC brushed motor has an armature winding on the rotor where heat is hard to dissipate, giving poor thermal performance. It has smooth torque, good overload capacity, and can be controlled with a simple H-bridge — no complex commutation electronics needed.',
  examRelevant: true
},
{
  id: 'mot_002', topic: 'motor_control', type: 'mc', difficulty: 'medium',
  question: 'In an H-bridge motor drive, an inductor L is placed in series between the bridge output and the DC motor. What is the primary function of this inductor?',
  options: [
    'It stores energy during regenerative braking and returns it to the supply.',
    'It smooths the motor current by acting as a low-pass filter, reducing current ripple caused by PWM switching.',
    'It limits the peak current during fault conditions to protect the transistors.',
    'It resonates with the motor winding capacitance to improve PWM efficiency.'
  ],
  correct: 1,
  explanation: 'The inductor in series with the motor winding acts as a low-pass filter for current. PWM switching creates a pulsating voltage; the inductor opposes rapid current changes, smoothing the current ripple so the motor sees a nearly continuous current.',
  examRelevant: true
},
{
  id: 'mot_003', topic: 'motor_control', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about regenerative braking:',
  statements: [
    { text: 'During regenerative braking, the motor acts as a generator, converting kinetic energy into electrical energy that can be returned to the supply or dissipated in a brake resistor.', correct: true },
    { text: 'Regenerative braking causes significant heating in the motor because all of the kinetic energy is converted to heat in the motor windings.', correct: false }
  ],
  explanation: 'Regenerative braking converts kinetic energy to electrical energy — the motor acts as a generator. The electrical energy can go back to the DC bus (true regeneration) or be dumped in a brake resistor. Motor heating during regeneration is minimal compared to dynamic braking in a resistor; the second statement describes dynamic braking, not regenerative braking.',
  examRelevant: true
},
{
  id: 'mot_004', topic: 'motor_control', type: 'mc', difficulty: 'medium',
  question: 'Which statement correctly describes the BLDC motor compared to a DC brushed motor?',
  options: [
    'BLDC uses mechanical commutation (brushes/commutator) which is simpler and less expensive.',
    'BLDC has the rotor windings on the outside and stator magnets on the inside, requiring slip rings for current transfer.',
    'BLDC has permanent magnets on the rotor and windings on the stator; commutation is done electronically using rotor position feedback.',
    'BLDC produces higher torque ripple than DC brushed motors because of its square-wave commutation.'
  ],
  correct: 2,
  explanation: 'In a BLDC motor, the rotor carries permanent magnets and the stator carries the windings. Electronic commutation (typically via Hall sensors or encoder) replaces mechanical brushes, giving longer life and better thermal characteristics (heat dissipates from the stator).',
  examRelevant: true
},
{
  id: 'mot_005', topic: 'motor_control', type: 'mc', difficulty: 'hard',
  question: 'A DC motor has a rated armature voltage of 24 V and a back-EMF constant Ke = 0.08 V/(rad/s). At no load the speed is 280 rad/s. The armature resistance Ra = 0.5 Ω. What armature current flows at no load?',
  options: [
    'approximately 1.6 A',
    'approximately 3.2 A',
    'approximately 0 A',
    'approximately 4.8 A'
  ],
  correct: 1,
  explanation: 'BEMF at 280 rad/s: E = Ke × ω = 0.08 × 280 = 22.4 V. Armature current: Ia = (Va − E) / Ra = (24 − 22.4) / 0.5 = 1.6 / 0.5 = 3.2 A. At no load the current is small (only overcomes friction/iron losses) but not zero because BEMF < Va.',
  examRelevant: false
},
{
  id: 'mot_006', topic: 'motor_control', type: 'mc', difficulty: 'easy',
  question: 'What is "back-EMF" in a DC motor and what effect does it have on motor current?',
  options: [
    'The voltage spike caused by switching the H-bridge; it must be clamped with flywheel diodes.',
    'A voltage generated by the rotating motor that opposes the applied armature voltage, reducing the current drawn from the supply.',
    'The voltage stored in the motor inductance, which causes current to continue flowing after the supply is disconnected.',
    'The common-mode noise generated by PWM switching that appears at the motor terminals.'
  ],
  correct: 1,
  explanation: 'As the motor speeds up, the rotating magnetic field induces an EMF (Lenz\'s law) that opposes the supply voltage. Net armature voltage = Va − BEMF, so current = (Va − BEMF) / Ra decreases as speed increases.',
  examRelevant: false
},
{
  id: 'mot_007', topic: 'motor_control', type: 'flashcard', difficulty: 'easy',
  front: 'Back-EMF (Back Electromotive Force)',
  back: 'Voltage generated by a rotating motor that opposes the supply voltage. Proportional to shaft speed: E = Ke × ω. At higher speed → higher BEMF → less current → less torque. At stall, BEMF = 0 so current is maximum (= Va/Ra).',
  explanation: 'Back-EMF is the key relationship linking motor speed to current draw.',
  examRelevant: false
},
{
  id: 'mot_008', topic: 'motor_control', type: 'flashcard', difficulty: 'easy',
  front: 'PWM duty cycle effect on DC motor speed',
  back: 'Average voltage across motor = duty cycle × supply voltage. Higher duty cycle → higher average voltage → higher speed. Speed is approximately proportional to duty cycle at light load. Torque capability depends on peak current, which is limited by Ra and supply voltage.',
  explanation: 'PWM is the standard method to control DC motor speed with an H-bridge.',
  examRelevant: false
},
{
  id: 'mot_009', topic: 'motor_control', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about stepper motors:',
  statements: [
    { text: 'A stepper motor can be operated in open-loop position control without position feedback, making it suitable for low-speed, low-inertia positioning applications.', correct: true },
    { text: 'Stepper motors have negligible torque ripple compared to BLDC motors, which is why they are preferred in applications requiring smooth motion at all speeds.', correct: false }
  ],
  explanation: 'Stepper motors can run open-loop for simple positioning — true. However, steppers have significant torque ripple (detent torque and holding torque variation between steps). BLDC with sinusoidal commutation typically has smoother torque. The second statement is false.',
  examRelevant: true
},
{
  id: 'mot_010', topic: 'motor_control', type: 'mc', difficulty: 'medium',
  question: 'In a four-quadrant H-bridge drive, which quadrant represents regenerative braking of a motor that was running in the positive direction?',
  options: [
    'Quadrant 1: positive torque, positive speed',
    'Quadrant 2: negative torque, positive speed',
    'Quadrant 3: negative torque, negative speed',
    'Quadrant 4: positive torque, negative speed'
  ],
  correct: 1,
  explanation: 'Regenerative braking while moving in the positive direction: speed remains positive (machine still spinning forward) but torque is negative (the machine acts as a generator, opposing motion). This is quadrant 2.',
  examRelevant: true
},
{
  id: 'mot_011', topic: 'motor_control', type: 'open', difficulty: 'hard',
  question: 'A DC brushed motor is rated: Va_rated = 48 V, Ia_rated = 8 A, speed_rated = 3000 RPM, Ra = 0.6 Ω.\n\n(a) Calculate the back-EMF constant Ke in V/(rad/s).\n(b) Calculate the motor torque constant Kt in N·m/A (assume Kt = Ke in SI units).\n(c) Calculate the rated torque.',
  sampleAnswer: '(a) ω_rated = 3000 × 2π/60 = 314.2 rad/s. BEMF = Va − Ia × Ra = 48 − 8 × 0.6 = 48 − 4.8 = 43.2 V. Ke = BEMF / ω = 43.2 / 314.2 = 0.1375 V/(rad/s).\n(b) Kt = Ke = 0.1375 N·m/A.\n(c) T_rated = Kt × Ia = 0.1375 × 8 = 1.1 N·m.',
  rubric: [
    'Converts RPM to rad/s correctly (÷60, ×2π)',
    'Calculates BEMF = Va − Ia·Ra = 43.2 V',
    'Divides BEMF by ω to get Ke = 0.1375 V/(rad/s)',
    'States Kt = Ke (valid in SI units)',
    'Multiplies Kt × Ia for rated torque (1.1 N·m)'
  ],
  explanation: 'In SI units (V·s/rad for Ke, N·m/A for Kt) the constants are numerically equal. The voltage drop across Ra reduces available BEMF, which is why motors are slower under load.',
  examRelevant: true
},
{
  id: 'mot_012', topic: 'motor_control', type: 'flashcard', difficulty: 'medium',
  front: 'Torque ripple — definition and cause',
  back: 'Periodic variation in output torque as the shaft rotates. Caused by slot harmonics in the winding, commutation steps (BLDC/stepper), or magnet geometry. High torque ripple causes vibration and noise. BLDC with sinusoidal FOC control has low ripple; stepper motors and square-wave BLDC have higher ripple.',
  explanation: 'Low torque ripple is important in precision motion and audio/optical applications.',
  examRelevant: false
},
{
  id: 'mot_013', topic: 'motor_control', type: 'mc', difficulty: 'hard',
  question: 'Which motor type is most suitable for an application requiring: very precise open-loop positioning, medium speeds, no position sensor, low cost, but smooth motion is not critical?',
  options: [
    'BLDC motor with Hall sensor commutation',
    'Hybrid stepper motor driven open-loop',
    'DC brushed servo motor with encoder',
    'Synchronous reluctance motor with vector control'
  ],
  correct: 1,
  explanation: 'Stepper motors can hold precise positions open-loop (each step = fixed angle), are inexpensive, need no position sensor for basic operation, and accept digital step/direction inputs. They have high torque ripple and vibration, which is acceptable if the application allows it.',
  examRelevant: false
},
{
  id: 'mot_014', topic: 'motor_control', type: 'tf', difficulty: 'hard',
  question: 'Evaluate both statements about PWM motor control:',
  statements: [
    { text: 'Increasing the PWM switching frequency reduces current ripple in the motor winding but increases switching losses in the power transistors.', correct: true },
    { text: 'During the freewheeling (off) phase of PWM, current through the motor reverses direction immediately due to the supply voltage being removed.', correct: false }
  ],
  explanation: 'Higher PWM frequency → smaller current ripple (less time for current to rise/fall per cycle) but more switching events → more transistor switching losses. True. During the freewheeling phase, the motor inductance maintains current flow in the same direction through the freewheeling diodes — current does not reverse immediately. False.',
  examRelevant: false
},
{
  id: 'mot_015', topic: 'motor_control', type: 'open', difficulty: 'medium',
  question: 'List the main differences between a BLDC motor and a DC brushed motor in terms of: construction, commutation method, thermal performance, and typical control complexity.',
  sampleAnswer: 'Construction: BLDC has permanent magnets on rotor, windings on stator. Brushed has windings on rotor, magnets (or field winding) on stator, plus brushes and commutator.\nCommutation: BLDC uses electronic commutation (controller switches stator phases based on rotor position). Brushed uses mechanical commutation via brushes and commutator segments.\nThermal: BLDC windings are on the stator (easy to cool with heatsink/housing). Brushed windings are on the rotor (poor cooling, heat trapped in core).\nControl complexity: BLDC requires position feedback and multi-phase switching electronics. Brushed only needs a voltage/PWM control (H-bridge).',
  rubric: [
    'Correct construction difference (rotor/stator placement of magnets vs windings)',
    'Correct commutation method for each (electronic vs mechanical)',
    'States BLDC has better thermal performance (stator windings)',
    'Notes BLDC requires more complex controller (position feedback, phase switching)'
  ],
  explanation: 'BLDC trades mechanical commutation for electronic commutation, gaining reliability and thermal performance at the cost of controller complexity.',
  examRelevant: true
},

/* ══════════════════════════════════════════════════════
   MOTION CONTROLLERS
══════════════════════════════════════════════════════ */

{
  id: 'mc_001', topic: 'motion_controllers', type: 'mc', difficulty: 'medium',
  question: 'In a PID position controller, which term is responsible for eliminating steady-state position error?',
  options: [
    'The proportional term (Kp), because it generates a correction proportional to the current error.',
    'The derivative term (Kd), because it anticipates future error based on the rate of change.',
    'The integral term (Ki), because it accumulates error over time and continues to correct until the error is zero.',
    'None — a PID controller always has a residual steady-state error equal to 1/Kp.'
  ],
  correct: 2,
  explanation: 'The integral term sums up (integrates) the error over time. As long as there is any error, the integral output grows, continuing to push the output until the error reaches zero. This is how integral action eliminates steady-state error.',
  examRelevant: true
},
{
  id: 'mc_002', topic: 'motion_controllers', type: 'mc', difficulty: 'medium',
  question: 'Which velocity profile minimises jerk (rate of change of acceleration) for point-to-point motion, making it the most mechanically gentle option?',
  options: [
    'Constant velocity (bang-bang) profile',
    'Trapezoidal velocity profile',
    'Parabolic (S-curve) velocity profile',
    'Sinusoidal velocity profile'
  ],
  correct: 2,
  explanation: 'A parabolic (S-curve) velocity profile has smooth acceleration ramps, resulting in limited jerk. A trapezoidal profile has abrupt acceleration transitions (infinite jerk at the corners), which causes mechanical shock. S-curves are preferred for precision and sensitive loads.',
  examRelevant: true
},
{
  id: 'mc_003', topic: 'motion_controllers', type: 'tf', difficulty: 'hard',
  question: 'Evaluate both statements about PID control:',
  statements: [
    { text: 'A well-tuned PID controller will always achieve zero steady-state error for a step position input, provided the system is stable.', correct: true },
    { text: 'Adding a velocity feedforward signal to the PID controller guarantees stability regardless of how the PID gains are tuned.', correct: false }
  ],
  explanation: 'A stable PID controller with integral action will reach zero steady-state error for a constant setpoint — true. Feedforward improves tracking and reduces following error, but it does not guarantee stability; a poorly tuned PID can still oscillate or go unstable even with feedforward.',
  examRelevant: true
},
{
  id: 'mc_004', topic: 'motion_controllers', type: 'mc', difficulty: 'medium',
  question: 'What is the effect of increasing the derivative gain Kd in a PID controller?',
  options: [
    'It increases overshoot because the controller responds more aggressively to the error.',
    'It reduces steady-state error by integrating the error signal more aggressively.',
    'It adds damping by opposing rapid error changes, reducing overshoot and oscillation.',
    'It has no practical effect on motor control because motor back-EMF already provides natural damping.'
  ],
  correct: 2,
  explanation: 'Derivative action generates a correction proportional to the rate of change of error (d(error)/dt). When the error is decreasing rapidly (overshoot approaching), Kd provides a braking force, reducing overshoot and oscillation.',
  examRelevant: true
},
{
  id: 'mc_005', topic: 'motion_controllers', type: 'mc', difficulty: 'easy',
  question: 'What is velocity feedforward in a motion controller and what does it improve?',
  options: [
    'A filter on the motor encoder that removes velocity measurement noise to improve position accuracy.',
    'A control term added to the PID output that directly commands the motor based on the desired velocity, reducing following error during motion.',
    'A feedback signal from a tachometer that replaces the encoder for velocity control.',
    'An integral windup prevention circuit that clamps the integrator output during high-speed motion.'
  ],
  correct: 1,
  explanation: 'Velocity feedforward uses the desired velocity from the motion profile to pre-command the motor output, so the feedback loop only needs to correct small residual errors. This reduces following error (the lag between commanded and actual position during motion).',
  examRelevant: true
},
{
  id: 'mc_006', topic: 'motion_controllers', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about motion profiles:',
  statements: [
    { text: 'A trapezoidal velocity profile consists of three phases: constant acceleration, constant velocity, and constant deceleration.', correct: true },
    { text: 'For minimum travel time with a given maximum velocity and acceleration, the parabolic (S-curve) profile is always faster than the trapezoidal profile.', correct: false }
  ],
  explanation: 'Trapezoidal = accelerate → cruise → decelerate: three phases — true. For minimum time with same peak velocity and acceleration limits, the trapezoidal profile is actually faster than an S-curve because the S-curve has lower average acceleration during the ramp phases.',
  examRelevant: false
},
{
  id: 'mc_007', topic: 'motion_controllers', type: 'open', difficulty: 'hard',
  question: 'A position controller has the following response when a step position command of 1000 counts is given:\n- The axis overshoots by 80 counts before settling.\n- Settling time is 2.5 seconds.\n- There is no steady-state error.\n\nDescribe what PID adjustments you would make to: (a) reduce the overshoot while keeping similar settling time, and (b) speed up settling without increasing overshoot.',
  sampleAnswer: '(a) To reduce overshoot: Increase Kd (more damping). Alternatively, slightly reduce Kp. Kd opposes rapid error changes, acting as a brake as the axis approaches setpoint.\n(b) To speed up settling without more overshoot: Increase Kp slightly and also increase Kd proportionally to maintain damping ratio. Alternatively, improve the motion profile (use S-curve) to reduce the abruptness of the command. Adding acceleration feedforward reduces the following error so the P term is less stressed.',
  rubric: [
    'Correctly identifies Kd increase reduces overshoot (adds damping)',
    'Optionally mentions Kp reduction as alternative for overshoot',
    'States increasing Kp speeds up response',
    'States Kd must also increase to prevent new overshoot',
    'Bonus: mentions feedforward to reduce following error'
  ],
  explanation: 'Kp drives speed of response, Kd provides damping, Ki eliminates steady-state error. The tuning triangle: you cannot simultaneously improve all three without tradeoffs.',
  examRelevant: true
},
{
  id: 'mc_008', topic: 'motion_controllers', type: 'flashcard', difficulty: 'easy',
  front: 'Proportional (P) term in PID',
  back: 'Output = Kp × error. Gives a correction proportional to the current error. Larger Kp → faster response but more overshoot. Alone (P-only), always leaves a residual steady-state error for systems with load disturbances.',
  explanation: 'P-only control is fast but cannot eliminate steady-state error.',
  examRelevant: false
},
{
  id: 'mc_009', topic: 'motion_controllers', type: 'flashcard', difficulty: 'easy',
  front: 'Integral (I) term in PID',
  back: 'Output = Ki × ∫error dt. Accumulates error over time. Eliminates steady-state error. Risk: integral windup — if the system saturates, the integrator keeps growing, causing large overshoot when the system comes back into range. Anti-windup: clamp integrator when output saturates.',
  explanation: 'I term = the memory of past errors.',
  examRelevant: false
},
{
  id: 'mc_010', topic: 'motion_controllers', type: 'flashcard', difficulty: 'easy',
  front: 'Derivative (D) term in PID',
  back: 'Output = Kd × d(error)/dt. Responds to the rate of change of error. Acts as a predictive damper: if error is decreasing rapidly, D output brakes the response. Sensitive to measurement noise — often filtered. Helps reduce overshoot and oscillation.',
  explanation: 'D term = the prediction of where the error is heading.',
  examRelevant: false
},
{
  id: 'mc_011', topic: 'motion_controllers', type: 'mc', difficulty: 'medium',
  question: 'A motion controller digital output is specified as: "Source current: 5 mA max, sink current: 20 mA max." A solenoid requires 50 mA to actuate. What interface solution is needed?',
  options: [
    'Connect the solenoid directly; the 5 mA output is sufficient for actuation.',
    'Use a solid-state relay (SSR) or power transistor driven by the digital output, which drives the solenoid at the required current.',
    'Connect two outputs in parallel to achieve 10 mA source capability.',
    'Use a pull-down resistor on the output to boost the sink current to 50 mA.'
  ],
  correct: 1,
  explanation: 'The controller output cannot supply 50 mA. An SSR, MOSFET, or transistor driver is used: the low-current controller output drives the control input of the SSR/transistor, which in turn switches the solenoid at full current. This is standard interfacing practice.',
  examRelevant: true
},
{
  id: 'mc_012', topic: 'motion_controllers', type: 'tf', difficulty: 'hard',
  question: 'Evaluate both statements about encoder-based velocity control:',
  statements: [
    { text: 'Velocity can be estimated from an incremental encoder by measuring the time between successive pulses (period measurement) — this method gives better low-speed resolution than counting pulses in a fixed time window.', correct: true },
    { text: 'At very high speeds, period measurement of encoder pulses gives more accurate velocity readings than frequency counting.', correct: false }
  ],
  explanation: 'At low speeds, pulses are far apart — period measurement is accurate. At high speeds, the pulse period becomes very short (approaching the counter resolution) while frequency counting has many pulses per window — giving high accuracy at high speed. Each method is better suited to its respective speed range.',
  examRelevant: false
},
{
  id: 'mc_013', topic: 'motion_controllers', type: 'open', difficulty: 'medium',
  question: 'Explain what "integral windup" is in a PID controller and describe one method to prevent it.',
  sampleAnswer: 'Integral windup occurs when the system output is saturated (e.g., at maximum motor voltage) and the error persists. The integrator continues accumulating, growing very large. When the setpoint is finally reached, the oversized integral term causes the output to remain saturated in the opposite direction, leading to large overshoot and slow recovery.\n\nPrevention — Anti-windup: Clamp (limit) the integrator output to a maximum value, or disable integration when the output is saturated. A common implementation: if the controller output is at its limit (saturation), freeze or back-calculate the integrator so it does not continue growing.',
  rubric: [
    'Explains accumulation while output is saturated',
    'Explains consequence: large overshoot when setpoint is reached',
    'Describes at least one prevention method (clamping / back-calculation / conditional integration)',
    'Correctly identifies when it occurs (saturation condition)'
  ],
  explanation: 'Integral windup is a practical issue in all PI/PID controllers. Anti-windup is standard in industrial drives.',
  examRelevant: true
},

/* ══════════════════════════════════════════════════════
   INTERFACING
══════════════════════════════════════════════════════ */

{
  id: 'int_001', topic: 'interfacing', type: 'mc', difficulty: 'medium',
  question: 'A motion controller digital output drives an inductive load (solenoid valve). A diode is connected in parallel with the solenoid, with cathode at the positive supply. What is this diode\'s function?',
  options: [
    'It acts as a voltage regulator, clamping the solenoid supply to a safe level during normal operation.',
    'It provides a freewheeling path for the inductive current when the output transistor turns off, preventing a large voltage spike (flyback) from damaging the transistor.',
    'It rectifies the AC current through the solenoid to produce a DC magnetic field.',
    'It limits the maximum current through the solenoid to the diode\'s forward current rating.'
  ],
  correct: 1,
  explanation: 'When an inductive load is switched off, the inductor tries to maintain current flow (L·di/dt), generating a large reverse voltage spike. The flyback (freewheeling) diode provides a low-impedance path for this current, clamping the spike to about 0.7 V (diode forward drop), protecting the switch.',
  examRelevant: true
},
{
  id: 'int_002', topic: 'interfacing', type: 'mc', difficulty: 'medium',
  question: 'A motion controller\'s digital input circuit includes two diodes: one from the input pin to the supply rail (Vcc), and one from the input pin to GND. What is the purpose of these diodes?',
  options: [
    'They form a full-wave rectifier to convert AC sensor signals to DC for the input.',
    'They clamp the input voltage to the safe range (GND to Vcc), protecting the input IC from overvoltage and undervoltage (ESD/transients).',
    'They detect the polarity of the input signal to determine the direction of a connected motor.',
    'They provide the pull-up and pull-down bias currents required for CMOS logic inputs.'
  ],
  correct: 1,
  explanation: 'Protection diodes clamp input voltages: the diode to Vcc prevents the input rising above Vcc + 0.7 V; the diode to GND prevents it falling below −0.7 V. This protects the input logic gate from ESD, inductive transients, and wiring errors.',
  examRelevant: true
},
{
  id: 'int_003', topic: 'interfacing', type: 'mc', difficulty: 'medium',
  question: 'An opto-coupler (CNY17F-3) has its input LED connected to a 5 V logic output with a series resistor, and its phototransistor collector connected to a 3.3 V supply via a 10 kΩ pull-up resistor. The emitter is connected to GND. When the input is 0 V (LED off), what is the output voltage?',
  options: [
    '0 V, because the phototransistor is saturated with no light',
    '3.3 V, because the phototransistor is off and the pull-up holds the output high',
    '5 V, because the pull-up is referenced to the input-side supply',
    '1.65 V, because the output is in a high-impedance state and floats to mid-rail'
  ],
  correct: 1,
  explanation: 'When the input LED is off (0 V input), no light reaches the phototransistor, so it remains OFF (high impedance). The 10 kΩ pull-up to 3.3 V pulls the output to 3.3 V. No transistor current flows. Output = 3.3 V.',
  examRelevant: true
},
{
  id: 'int_004', topic: 'interfacing', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about solid-state relays (SSRs):',
  statements: [
    { text: 'A solid-state relay uses semiconductor switches (typically a triac or MOSFET) and can switch AC or DC loads without mechanical contacts.', correct: true },
    { text: 'An SSR has faster switching times than a mechanical relay and can be triggered directly from a 3.3 V or 5 V logic output without any additional driver circuit.', correct: false }
  ],
  explanation: 'SSRs use semiconductor switches — no moving parts, can handle AC or DC — true. SSRs do switch faster than mechanical relays. However, most SSRs require an input current of 5–15 mA to activate their internal LED; a logic output may need to be checked against the SSR datasheet — at 3.3 V with a series resistor it may or may not be sufficient. The statement is marked false because "without any additional driver circuit" is not always guaranteed.',
  examRelevant: true
},
{
  id: 'int_005', topic: 'interfacing', type: 'mc', difficulty: 'hard',
  question: 'A comparator circuit uses an op-amp with positive feedback (hysteresis). The non-inverting input is connected to a resistor divider (threshold), and the output feeds back through a resistor to the non-inverting input. What effect does this hysteresis have?',
  options: [
    'It makes the output continuously variable (linear), replacing the digital switching action with an analog amplification.',
    'It creates two different switching thresholds (upper and lower), preventing rapid oscillation when the input signal is near the threshold (noise immunity).',
    'It integrates the input signal and generates a time-delayed output proportional to input amplitude.',
    'It eliminates the need for a power supply for the comparator by deriving power from the hysteresis feedback loop.'
  ],
  correct: 1,
  explanation: 'Hysteresis creates a Schmitt trigger: one threshold for the low-to-high transition (upper threshold) and a different one for high-to-low (lower threshold). The gap between thresholds prevents noise near the switching point from causing multiple output transitions.',
  examRelevant: true
},
{
  id: 'int_006', topic: 'interfacing', type: 'open', difficulty: 'medium',
  question: 'A motion controller output can source 8 mA at 3.3 V. An LED indicator requires 20 mA at 2.1 V forward voltage. Design a simple transistor driver circuit to drive the LED from the controller output. Specify the transistor type, resistor values, and the protection measures needed.',
  sampleAnswer: 'Use an NPN transistor (e.g., BC547) as a switch. Controller output → base resistor Rb → transistor base. Transistor collector → LED + series resistor Rled → supply (e.g., 5 V). Emitter to GND.\n\nRb = (3.3 V − 0.7 V) / Ib. With DC gain hFE ≥ 100, Ib needed ≥ 20 mA / 100 = 0.2 mA. Choose Rb = (3.3 − 0.7) / 0.5 mA = 5.2 kΩ → use 4.7 kΩ.\nRled = (5 V − 2.1 V − Vce_sat) / 20 mA = (5 − 2.1 − 0.2) / 0.02 = 2.7 V / 0.02 = 135 Ω → use 150 Ω.\nNo flyback diode needed (LED is not inductive).',
  rubric: [
    'Selects NPN transistor as switch (not directly from output)',
    'Calculates base resistor to saturate transistor with 8 mA controller source',
    'Calculates LED series resistor for correct current (≈130–150 Ω)',
    'Notes no flyback diode needed for LED (resistive/capacitive load)'
  ],
  explanation: 'NPN transistor switches in common-emitter configuration: base current (controlled by Rb) drives collector current (LED current). Rb is chosen so the available 8 mA easily saturates the transistor.',
  examRelevant: true
},
{
  id: 'int_007', topic: 'interfacing', type: 'flashcard', difficulty: 'easy',
  front: 'Opto-coupler — purpose and operation',
  back: 'Provides galvanic isolation between two circuit sections (e.g., controller and high-voltage load). Input: LED. Output: phototransistor (or photodarlington). Light crosses the isolation barrier electrically. No direct electrical connection. Used to protect low-voltage controller from high-voltage transients.',
  explanation: 'Opto-couplers are standard for interfacing between different voltage domains and for EMC isolation.',
  examRelevant: false
},
{
  id: 'int_008', topic: 'interfacing', type: 'flashcard', difficulty: 'medium',
  front: 'Flyback (freewheeling) diode — where to place it',
  back: 'Connect in PARALLEL with the inductive load (relay coil, solenoid, motor winding). Cathode to + supply, anode to the switched side. When the switch opens, the inductor drives current through the diode instead of spiking the transistor. Without it: V_spike = L × di/dt, which can be hundreds of volts.',
  explanation: 'Always use a flyback diode when switching any inductive load.',
  examRelevant: false
},
{
  id: 'int_009', topic: 'interfacing', type: 'mc', difficulty: 'medium',
  question: 'A sensor outputs a signal that swings between 0 V and 10 V. The motion controller input accepts 0–5 V. What is the simplest and most common way to interface these?',
  options: [
    'Connect directly — modern motion controllers auto-adapt to input voltage ranges.',
    'Use a voltage divider (resistor divider) to scale the 10 V signal to 5 V.',
    'Use a Zener diode to clamp the signal to 5 V.',
    'Use a relay contact to isolate the two systems.'
  ],
  correct: 1,
  explanation: 'A resistor divider (e.g., 10 kΩ + 10 kΩ for 50% division) scales 10 V to 5 V precisely and linearly. A Zener would clip the signal non-linearly. A relay is not suitable for analog signals. Direct connection would damage the 5 V input.',
  examRelevant: false
},
{
  id: 'int_010', topic: 'interfacing', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about digital I/O in motion control:',
  statements: [
    { text: 'NPN-type proximity sensors sink current (pull the output low when activated) and require a pull-up resistor to the supply for the output to go high when the sensor is inactive.', correct: true },
    { text: 'PNP-type proximity sensors can be connected directly to NPN digital inputs of a motion controller without any interface components.', correct: false }
  ],
  explanation: 'NPN sensor: open-collector output; when activated, it pulls low. Pull-up to supply gives HIGH at rest — correct. PNP sensor: sources current from supply; its output goes HIGH when active. An NPN input expects a low to signal active — a PNP source connected directly may conflict. Typically a PNP sensor needs either a pull-down resistor or a different input polarity — not a direct connection without consideration.',
  examRelevant: false
},

/* ══════════════════════════════════════════════════════
   DRIVE SYSTEMS (Gearbox, Load, N²)
══════════════════════════════════════════════════════ */

{
  id: 'drv_001', topic: 'drive_systems', type: 'mc', difficulty: 'medium',
  question: 'A gearbox with ratio N = 10 (motor : load = 10 : 1) connects a motor to a load. If the load inertia is Jload = 0.5 kg·m², what is the reflected (equivalent) load inertia seen at the motor shaft?',
  options: [
    '5 kg·m²',
    '0.05 kg·m²',
    '0.005 kg·m²',
    '50 kg·m²'
  ],
  correct: 2,
  explanation: 'Reflected inertia = Jload / N² = 0.5 / 10² = 0.5 / 100 = 0.005 kg·m². The N² factor is crucial: a large gear ratio makes even a heavy load appear very light at the motor shaft in terms of inertia.',
  examRelevant: true
},
{
  id: 'drv_002', topic: 'drive_systems', type: 'mc', difficulty: 'medium',
  question: 'A gearbox has ratio N = 5 (N = ω_motor / ω_load). If the motor produces a torque of 2 N·m, what torque is available at the load shaft (ignoring gearbox losses)?',
  options: [
    '0.4 N·m',
    '2 N·m',
    '10 N·m',
    '25 N·m'
  ],
  correct: 2,
  explanation: 'Torque is multiplied by N: T_load = T_motor × N = 2 × 5 = 10 N·m. Speed is divided by N: ω_load = ω_motor / N. Power is conserved (ideally): P = T × ω.',
  examRelevant: true
},
{
  id: 'drv_003', topic: 'drive_systems', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about pneumatic vs electrical drive systems:',
  statements: [
    { text: 'Pneumatic drive systems are generally less energy-efficient than electrical drive systems because compressed air generation involves significant energy losses (typically 90% of compressor energy is lost as heat).', correct: true },
    { text: 'Pneumatic actuators are inherently safer in explosive atmospheres than electrical drives because air is not flammable.', correct: true }
  ],
  explanation: 'Pneumatic systems are indeed energy-inefficient (only ~10% of electrical input reaches the actuator as useful work) — correct. Pneumatic actuators do have an intrinsic safety advantage in explosive atmospheres (ATEX) — also correct. Both statements are true.',
  examRelevant: false
},
{
  id: 'drv_004', topic: 'drive_systems', type: 'open', difficulty: 'hard',
  question: 'A motor is coupled to a load through a gearbox with ratio N = 8. The motor has rotor inertia Jm = 0.002 kg·m². The load has inertia Jload = 0.8 kg·m² and requires a constant torque Tload = 16 N·m.\n\n(a) Calculate the total inertia seen at the motor shaft.\n(b) Calculate the required motor torque to accelerate the combined system at α_motor = 100 rad/s².\n(c) Calculate the torque required just to overcome the load (no acceleration).',
  sampleAnswer: '(a) J_reflected = Jload / N² = 0.8 / 64 = 0.0125 kg·m². J_total = Jm + J_reflected = 0.002 + 0.0125 = 0.0145 kg·m².\n(b) T_accel = J_total × α = 0.0145 × 100 = 1.45 N·m.\n(c) T_load_at_motor = Tload / N = 16 / 8 = 2 N·m. Total motor torque needed = 1.45 + 2.0 = 3.45 N·m.',
  rubric: [
    'Divides load inertia by N² (8² = 64)',
    'Adds motor inertia to reflected inertia',
    'Multiplies total inertia by angular acceleration for T_accel',
    'Divides load torque by N (not N²) for T_load at motor',
    'Sums acceleration torque and load torque'
  ],
  explanation: 'Inertia reflects as J/N². Torque reflects as T/N. These rules are fundamental to gearbox design. Inertia matching (J_motor ≈ J_reflected) gives best dynamic performance.',
  examRelevant: true
},
{
  id: 'drv_005', topic: 'drive_systems', type: 'flashcard', difficulty: 'medium',
  front: 'N² rule for reflected inertia',
  back: 'When a load is connected through a gearbox with ratio N (motor speed / load speed):\n• Reflected inertia = J_load / N²\n• Reflected torque = T_load / N\n• Reflected angular acceleration α_load = α_motor / N\nLarge N greatly reduces reflected inertia. Optimal motor sizing: J_motor ≈ J_reflected (inertia matching).',
  explanation: 'N² rule is fundamental to gearbox drive system design and appears on every exam.',
  examRelevant: false
},
{
  id: 'drv_006', topic: 'drive_systems', type: 'mc', difficulty: 'medium',
  question: 'What is the "inertia matching" condition for a motor-gearbox-load system, and why is it important?',
  options: [
    'The motor inertia should equal the load inertia (no gearbox) for maximum efficiency.',
    'The motor inertia should equal the reflected load inertia (J_load/N²) for maximum acceleration for a given motor torque.',
    'The gearbox ratio should be 1:1 to avoid any inertia mismatch between motor and load.',
    'The load inertia should be at least 10× the motor inertia to ensure smooth motion.'
  ],
  correct: 1,
  explanation: 'When J_motor = J_reflected = J_load/N², exactly half the motor torque accelerates the load and half accelerates the motor itself, giving the best compromise between acceleration capability and motor sizing. This is the inertia matching (or load matching) condition.',
  examRelevant: false
},
{
  id: 'drv_007', topic: 'drive_systems', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about gearbox-coupled drive systems:',
  statements: [
    { text: 'Increasing the gearbox ratio N reduces the reflected load inertia seen at the motor by a factor of N², making it easier for the motor to accelerate the load.', correct: true },
    { text: 'Increasing the gearbox ratio N also increases the available torque at the load by a factor of N, but decreases the load speed by a factor of N.', correct: true }
  ],
  explanation: 'Both correct. Reflected inertia = J_load/N² — increases N reduces inertia quadratically. Load torque = T_motor × N — increases N increases torque; load speed = motor_speed / N — increases N reduces load speed. A higher ratio makes the motor work in a more favourable regime but sacrifices speed.',
  examRelevant: true
},
{
  id: 'drv_008', topic: 'drive_systems', type: 'flashcard', difficulty: 'easy',
  front: 'Backlash in gearbox — definition and effect',
  back: 'Backlash: the angular play between meshing gear teeth. When direction reverses, the motor must travel through the backlash angle before the load starts moving again. Effect: position error at direction reversals, reduced precision, potential for oscillation in closed-loop systems.',
  explanation: 'Backlash is a key limitation of geared drives in precision positioning.',
  examRelevant: false
},
{
  id: 'drv_009', topic: 'drive_systems', type: 'open', difficulty: 'medium',
  question: 'Compare electrical, pneumatic, and hydraulic drive systems for a factory automation application. Consider: energy efficiency, controllability, power density, and suitability for precise positioning.',
  sampleAnswer: 'Electrical: High efficiency (>90% motor + drive), excellent controllability (servo systems), moderate power density, best for precise positioning (encoder feedback, closed-loop).\nPneumatic: Low efficiency (~10% of compressor energy reaches actuator), binary or proportional control (more complex for precise positioning), low power density, low cost for simple on/off applications.\nHydraulic: Moderate efficiency (~60–70%), excellent power density (very high force in small volume), good controllability with proportional valves, moderate precision, suitable for very high force applications (presses, heavy machinery). Risk of oil leaks.',
  rubric: [
    'Electric: high efficiency, excellent positioning precision',
    'Pneumatic: low efficiency, suitable for simple on/off, cheap',
    'Hydraulic: high power density, moderate efficiency, high force applications',
    'Correctly ranks efficiency: electric > hydraulic > pneumatic'
  ],
  explanation: 'For precision positioning in factory automation, electrical servo drives dominate. Pneumatic is used for simple clamping/actuating. Hydraulic is used for high force (metal forming, heavy lifting).',
  examRelevant: false
},

/* ══════════════════════════════════════════════════════
   COMMUNICATION
══════════════════════════════════════════════════════ */

{
  id: 'com_001', topic: 'communication', type: 'mc', difficulty: 'medium',
  question: 'What is the main advantage of EtherCAT over standard Ethernet for motion control communication?',
  options: [
    'EtherCAT uses a star topology with a central switch, making it easier to add devices.',
    'EtherCAT frames are processed on-the-fly by each slave as the frame passes through, giving deterministic, low-latency communication without a switch.',
    'EtherCAT supports wireless transmission, making cable runs unnecessary.',
    'EtherCAT uses 10 Mbit/s speed, reducing electromagnetic interference compared to 100 Mbit/s Ethernet.'
  ],
  correct: 1,
  explanation: 'EtherCAT slaves process the telegram while it passes through them (on-the-fly), returning it at near-wire-speed. This gives very low latency (< 1 µs per slave) and hard real-time determinism — impossible with standard Ethernet which requires a switch and cannot guarantee timing.',
  examRelevant: false
},
{
  id: 'com_002', topic: 'communication', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about motion controller communication:',
  statements: [
    { text: 'RS-485 supports multi-drop (multiple devices on one pair) and longer cable runs than RS-232, making it more suitable for industrial field bus applications.', correct: true },
    { text: 'A PWM signal from a motion controller can be used as an analog output for speed setpoints by low-pass filtering the PWM signal into a DC voltage.', correct: true }
  ],
  explanation: 'RS-485 is balanced differential, supports 32+ nodes on one bus, up to 1200 m — correct. PWM filtered through an RC low-pass filter gives a DC voltage proportional to duty cycle, which can serve as an analog setpoint (0–10 V or 0–5 V range) — correct. Both true.',
  examRelevant: false
},
{
  id: 'com_003', topic: 'communication', type: 'flashcard', difficulty: 'easy',
  front: 'EtherCAT — key feature',
  back: 'Industrial Ethernet protocol with on-the-fly processing. Each slave reads/writes to the frame as it passes, then forwards it. Single frame for all devices. Deterministic with cycle times as low as 100 µs. Very low jitter. Used in precision multi-axis motion control.',
  explanation: 'EtherCAT is the dominant real-time Ethernet protocol in modern servo drives.',
  examRelevant: false
},
{
  id: 'com_004', topic: 'communication', type: 'mc', difficulty: 'medium',
  question: 'A motion controller communicates with an absolute encoder using SSI (Synchronous Serial Interface). What characterises SSI communication?',
  options: [
    'SSI is a two-wire half-duplex protocol with data collision detection and re-transmission.',
    'SSI uses a clock line from the master and a data line from the encoder; position data is shifted out synchronously on each clock edge.',
    'SSI broadcasts position data continuously at a fixed baud rate without requiring a clock from the master.',
    'SSI uses I2C addressing, allowing multiple encoders on the same two-wire bus.'
  ],
  correct: 1,
  explanation: 'SSI: master generates the clock; encoder shifts out position bits synchronously (one bit per clock edge). Point-to-point connection (one encoder per SSI interface). The data frame starts on the first clock edge and ends after the configured number of bits (typically 25 for single-turn + multi-turn).',
  examRelevant: false
},
{
  id: 'com_005', topic: 'communication', type: 'flashcard', difficulty: 'medium',
  front: 'CAN bus — key properties for motion control',
  back: 'Multi-master differential bus. Speeds up to 1 Mbit/s (at short distances). Message-based (not addressed — messages have IDs, nodes subscribe to relevant IDs). Priority-based arbitration (low ID = high priority, wins bus access without collisions). CANopen and CiA 402 profile are common in motion control. Not hard real-time but deterministic enough for many applications.',
  explanation: 'CAN is very common in distributed drive systems and machine automation.',
  examRelevant: false
},
{
  id: 'com_006', topic: 'communication', type: 'open', difficulty: 'medium',
  question: 'A multi-axis motion control system requires synchronised motion of 6 axes with a cycle time of 1 ms. Compare CAN bus and EtherCAT for this application and recommend one.',
  sampleAnswer: 'CAN bus at 1 Mbit/s can handle approximately 1000 short messages/second. With 6 axes, each needing a setpoint update per ms, CAN may struggle to meet 1 ms cycle times reliably, especially with larger payloads. CAN is not inherently synchronised.\n\nEtherCAT operates at 100 Mbit/s with distributed clocks for sub-microsecond synchronisation across all slaves. It can easily update 6 axes in < 0.5 ms with high determinism.\n\nRecommendation: EtherCAT for this application — the 1 ms cycle time and 6-axis synchronisation requirement exceeds what CAN can reliably deliver.',
  rubric: [
    'Notes CAN bandwidth limitation for 6-axis at 1 ms',
    'Notes EtherCAT high bandwidth and on-the-fly processing',
    'Mentions EtherCAT distributed clocks for synchronisation',
    'Makes a clear recommendation with justification'
  ],
  explanation: 'EtherCAT is the standard choice for high-performance synchronised multi-axis motion. CAN is acceptable for lower performance or asynchronous systems.',
  examRelevant: false
},

/* ══════════════════════════════════════════════════════
   SAFETY
══════════════════════════════════════════════════════ */

{
  id: 'saf_001', topic: 'safety', type: 'mc', difficulty: 'medium',
  question: 'What does the STO (Safe Torque Off) safety function in a servo drive achieve?',
  options: [
    'It reduces the motor torque to 50% of rated when a safety guard is opened.',
    'It removes the enabling signal to the power switches, preventing the drive from generating torque, while keeping the drive powered and ready to restart quickly.',
    'It disconnects the mains supply to the entire drive cabinet for maximum safety.',
    'It applies the motor holding brake when the safety circuit is triggered.'
  ],
  correct: 1,
  explanation: 'STO (IEC 61800-5-2) disables the gate signals to the power transistors, so no current can flow to the motor and no torque is generated. The DC bus remains charged. The motor coasts to a stop. STO does NOT apply the brake or disconnect mains — it only removes the ability to generate torque.',
  examRelevant: false
},
{
  id: 'saf_002', topic: 'safety', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about pneumatic system safety:',
  statements: [
    { text: 'Compressed air in a pneumatic system can store significant energy. If a hose or fitting fails suddenly, the rapid release of stored energy creates a hazard (whipping hose, projectiles).', correct: true },
    { text: 'Pneumatic actuators are inherently safer than hydraulic actuators in a leak scenario because an air leak is not harmful to personnel or the environment.', correct: false }
  ],
  explanation: 'Stored compressed air energy creates real hazards at failure — true. However, a high-pressure air leak is also dangerous: it can cause cuts, inject air into the skin, become a projectile hazard, and create noise exceeding safety limits. The second statement is false — air leaks at industrial pressures are hazardous.',
  examRelevant: false
},
{
  id: 'saf_003', topic: 'safety', type: 'mc', difficulty: 'easy',
  question: 'Which overcurrent protection device provides the fastest response to a short-circuit fault, protecting semiconductor components?',
  options: [
    'Thermal overload relay (bimetallic)',
    'Slow-blow fuse',
    'Semiconductor (fast-blow) fuse',
    'Circuit breaker with thermal-magnetic release'
  ],
  correct: 2,
  explanation: 'Semiconductor (ultra-fast, current-limiting) fuses are specifically designed to interrupt fault current within microseconds — fast enough to protect transistors and diodes before they are destroyed. Standard fuses and circuit breakers are too slow for semiconductor protection.',
  examRelevant: false
},
{
  id: 'saf_004', topic: 'safety', type: 'open', difficulty: 'medium',
  question: 'A robot arm is controlled by a servo drive. List three potential safety hazards and for each, name a protection measure that should be implemented in the drive or machine design.',
  sampleAnswer: '1. Unexpected motion: Implement STO (Safe Torque Off) — when the safety guard is opened, STO removes gate pulses so no torque can be generated.\n2. Motor overheating: Install PTC thermistor in motor winding connected to drive protection input; drive shuts down if temperature trip is detected.\n3. Runaway speed (encoder failure): Implement overspeed monitoring — if encoder signal is lost or speed exceeds a limit, the drive triggers a controlled stop or STO.',
  rubric: [
    'Identifies 3 distinct hazards (motion, thermal, mechanical, electrical, runaway)',
    'STO or equivalent for unexpected motion hazard',
    'Thermal protection for overheating hazard',
    'Overspeed or encoder monitoring for control failure'
  ],
  explanation: 'Safety in drive systems combines electronic protection (STO, overcurrent) with physical measures (guards, brakes) and monitoring (overspeed, over-temperature).',
  examRelevant: true
},
{
  id: 'saf_005', topic: 'safety', type: 'flashcard', difficulty: 'medium',
  front: 'Safe Torque Off (STO) — IEC 61800-5-2',
  back: 'Safety function: disables gate drive signals to power transistors. Motor cannot generate torque. Motor coasts to rest (no active braking). DC bus remains energised. Drive can resume quickly after STO is released (no restart of DC bus needed). Does NOT apply holding brake or disconnect mains.',
  explanation: 'STO is the most common safety function in modern servo drives. Frequently tested in EDS exams.',
  examRelevant: false
},
{
  id: 'saf_006', topic: 'safety', type: 'mc', difficulty: 'medium',
  question: 'A motor is rated for 10 A continuous current. Under normal operation it draws 8 A. What type of protection is appropriate for this motor against sustained overload (not short circuit)?',
  options: [
    'Semiconductor fuse rated at 10 A, to interrupt immediately at rated current.',
    'Thermal overload relay or electronic overload protection in the drive, which trips with an inverse time characteristic (longer time for lower overcurrent).',
    'A simple MCB (miniature circuit breaker) set to exactly 8 A for instantaneous trip.',
    'No protection needed — modern motors can sustain indefinite overload without damage.'
  ],
  correct: 1,
  explanation: 'Thermal overload relays (bimetallic or electronic) have an inverse-time characteristic: they allow short overload currents for brief periods (starting), but trip if overload persists. This matches the motor\'s thermal capacity. A fast fuse or MCB at rated current would trip during normal acceleration.',
  examRelevant: false
},

/* ══════════════════════════════════════════════════════
   EMC
══════════════════════════════════════════════════════ */

{
  id: 'emc_001', topic: 'emc', type: 'mc', difficulty: 'medium',
  question: 'What is the skin effect in AC conductors, and what is its practical consequence for motor drive wiring?',
  options: [
    'AC current heats the conductor surface more than the core due to ohmic losses; this requires using hollow conductors above 1 kHz.',
    'At high frequencies, AC current flows predominantly near the conductor surface (skin depth decreases with frequency), increasing effective resistance and causing higher losses in motor drive cables.',
    'The skin effect causes the conductor to emit electromagnetic radiation from its surface, requiring shielded cables for all AC wiring.',
    'AC current alternates direction in the conductor, causing the centre to heat more than the surface due to proximity of opposing current flows.'
  ],
  correct: 1,
  explanation: 'Skin effect: at high frequencies, eddy currents oppose current flow in the centre of a conductor, so current concentrates near the surface. Skin depth δ = √(2ρ / (ωμ)). Higher frequency → shallower skin depth → less effective cross-section → higher AC resistance → more loss. Relevant for high-frequency PWM cables.',
  examRelevant: true
},
{
  id: 'emc_002', topic: 'emc', type: 'open', difficulty: 'hard',
  question: 'The skin depth in copper is given by δ = √(2ρ / (ωμ)), where ρ = 1.72×10⁻⁸ Ω·m (resistivity), μ₀ = 4π×10⁻⁷ H/m (permeability), and ω = 2πf.\n\nCalculate the skin depth in copper at:\n(a) 50 Hz (mains frequency)\n(b) 20 kHz (typical PWM switching frequency)',
  sampleAnswer: '(a) f = 50 Hz, ω = 2π × 50 = 314.2 rad/s.\nδ = √(2 × 1.72×10⁻⁸ / (314.2 × 4π×10⁻⁷)) = √(3.44×10⁻⁸ / 3.948×10⁻⁴) = √(8.71×10⁻⁵) = 9.33 mm.\n\n(b) f = 20 kHz, ω = 2π × 20000 = 125,664 rad/s.\nδ = √(2 × 1.72×10⁻⁸ / (125664 × 4π×10⁻⁷)) = √(3.44×10⁻⁸ / 0.1579) = √(2.18×10⁻⁷) = 0.467 mm ≈ 0.47 mm.',
  rubric: [
    'Correctly applies formula δ = √(2ρ/ωμ)',
    'Calculates ω = 2πf for each frequency',
    'Gets approximately 9–10 mm for 50 Hz',
    'Gets approximately 0.46–0.47 mm for 20 kHz',
    'Notes implication: at 20 kHz, only outer 0.47 mm carries current — significant in thick conductors'
  ],
  explanation: 'At 50 Hz skin depth is ~9 mm (most conductors smaller than this, so little effect). At 20 kHz it is ~0.47 mm — meaningful for conductors > 1 mm radius. PWM switching at high frequency significantly increases effective conductor resistance.',
  examRelevant: true
},
{
  id: 'emc_003', topic: 'emc', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about EMC in motor drive systems:',
  statements: [
    { text: 'Common-mode chokes on the motor output cables of a servo drive help reduce high-frequency common-mode currents that flow through motor cable capacitance to earth, which can cause EMC issues.', correct: true },
    { text: 'Using a higher PWM switching frequency always improves EMC performance because the noise energy is spread over more harmonics.', correct: false }
  ],
  explanation: 'Common-mode chokes suppress common-mode HF currents — correct. Higher PWM frequency moves the fundamental harmonic up in frequency where emissions may be harder to filter and still require compliance, and switching losses increase. Higher PWM frequency does not inherently improve EMC — it can shift problems, not eliminate them.',
  examRelevant: false
},
{
  id: 'emc_004', topic: 'emc', type: 'mc', difficulty: 'medium',
  question: 'What is the difference between "common-mode" and "differential-mode" noise in a power supply cable?',
  options: [
    'Common-mode noise is at high frequency; differential-mode noise is at low frequency.',
    'Common-mode noise appears on both conductors with the same phase (same direction); differential-mode noise appears between the conductors (opposite phases, different currents on each wire).',
    'Common-mode noise is generated by the motor; differential-mode noise is generated by the controller.',
    'Common-mode noise can only be suppressed with shielding; differential-mode can only be suppressed with capacitors.'
  ],
  correct: 1,
  explanation: 'Differential-mode noise: flows on L and N in opposite directions (signal current loop). Common-mode noise: flows on both L and N in the same direction, returning via earth. Different filter topologies target each: X-capacitors for differential, Y-capacitors and common-mode chokes for common-mode.',
  examRelevant: false
},
{
  id: 'emc_005', topic: 'emc', type: 'flashcard', difficulty: 'medium',
  front: 'Skin depth (δ) — formula and physical meaning',
  back: 'δ = √(2ρ / (ωμ))\nρ = resistivity (Ω·m), ω = 2πf, μ = permeability (H/m).\nPhysical meaning: depth at which current density falls to 1/e ≈ 37% of surface value. At frequency f, current is concentrated in the outer δ of the conductor. Higher frequency → smaller δ → higher effective resistance.',
  explanation: 'Copper at 50 Hz: δ ≈ 9 mm. At 20 kHz: δ ≈ 0.47 mm. At 1 MHz: δ ≈ 0.066 mm.',
  examRelevant: false
},
{
  id: 'emc_006', topic: 'emc', type: 'mc', difficulty: 'easy',
  question: 'Why is cable shielding grounded at one end only in some measurement signal applications?',
  options: [
    'Grounding at one end prevents shield corrosion by blocking electrochemical reactions.',
    'Single-ended grounding prevents ground loop currents: if both ends are grounded, any potential difference between the two ground points drives a current through the shield, inducing noise in the signal conductor.',
    'Single-ended grounding doubles the shield effectiveness by creating a resonant shield circuit.',
    'It is a cost-saving measure only — double-ended grounding is always technically preferred.'
  ],
  correct: 1,
  explanation: 'Ground loops form when two points connected to "ground" are at different potentials (common in large installations). A ground loop current through the shield generates a magnetic flux that couples noise into the signal wire. One-end grounding prevents the loop from forming.',
  examRelevant: false
},
{
  id: 'emc_007', topic: 'emc', type: 'flashcard', difficulty: 'easy',
  front: 'EMC filter in a motor drive — purpose and placement',
  back: 'Purpose: attenuates high-frequency conducted emissions generated by the drive\'s PWM switching before they propagate onto the mains supply network.\nPlacement: between the mains input and the drive. Contains common-mode choke (line to earth) and X/Y capacitors.\nAlso: motor output filters reduce dV/dt on motor cables, protecting motor winding insulation and reducing radiated emissions.',
  explanation: 'EMC filters are mandatory for CE marking of variable speed drives.',
  examRelevant: false
},
{
  id: 'emc_008', topic: 'emc', type: 'tf', difficulty: 'hard',
  question: 'Evaluate both statements about EMC in variable speed drives:',
  statements: [
    { text: 'Long motor cables increase the capacitance to earth, which increases common-mode leakage currents that flow through the drive\'s earth connection — this can cause nuisance tripping of RCDs (residual current devices).', correct: true },
    { text: 'Using unshielded motor cables is recommended for EMC compliance because shielded cables increase cable capacitance and worsen common-mode leakage currents.', correct: false }
  ],
  explanation: 'Long cables have higher distributed capacitance to earth → more HF leakage current → nuisance RCD trips — correct. Shielded cables contain and channel the HF currents back to the drive (via proper shield termination), reducing radiated emissions. They are recommended, not avoided. Second statement is false.',
  examRelevant: false
},

/* ══════════════════════════════════════════════════════
   THERMAL MANAGEMENT
══════════════════════════════════════════════════════ */

{
  id: 'thm_001', topic: 'thermal', type: 'mc', difficulty: 'easy',
  question: 'What does the thermal resistance Rth (in °C/W) of a motor describe?',
  options: [
    'The maximum temperature rise the motor can sustain before mechanical failure.',
    'The steady-state temperature rise (in °C) per watt of power dissipated in the motor.',
    'The rate at which the motor cools down after load is removed.',
    'The electrical resistance of the winding per degree of temperature change.'
  ],
  correct: 1,
  explanation: 'Rth (°C/W) is the thermal resistance from winding to ambient. ΔT = P × Rth. A motor with Rth = 3 °C/W dissipating 20 W will have a winding temperature 60°C above ambient at steady state.',
  examRelevant: true
},
{
  id: 'thm_002', topic: 'thermal', type: 'open', difficulty: 'medium',
  question: 'A motor has the following thermal specifications:\n• Thermal resistance winding-to-ambient: Rth = 2.5 °C/W\n• Maximum winding temperature: 130 °C\n• Ambient temperature: 40 °C\n\n(a) Calculate the maximum allowable power dissipation in the winding.\n(b) The motor has winding resistance Ra = 1.2 Ω. Calculate the maximum continuous current.',
  sampleAnswer: '(a) ΔT_max = T_winding_max − T_ambient = 130 − 40 = 90 °C.\nP_max = ΔT_max / Rth = 90 / 2.5 = 36 W.\n\n(b) P = I² × Ra. I = √(P/Ra) = √(36 / 1.2) = √30 = 5.48 A.',
  rubric: [
    'Calculates ΔT_max = 130 − 40 = 90°C',
    'Divides ΔT by Rth: P = 90/2.5 = 36 W',
    'Applies P = I²R: I = √(P/Ra)',
    'Gets I ≈ 5.48 A'
  ],
  explanation: 'Thermal resistance model: T_winding = T_ambient + P × Rth. Motor current limit is set by the thermal limit, not just the motor rating. Ambient temperature directly reduces the thermal headroom.',
  examRelevant: true
},
{
  id: 'thm_003', topic: 'thermal', type: 'mc', difficulty: 'medium',
  question: 'A motor has a thermal time constant τ_th = 20 minutes. At t = 0, the motor starts from cold (ambient temperature). After how many minutes does the motor reach approximately 63% of its final steady-state temperature rise?',
  options: [
    '10 minutes',
    '20 minutes',
    '40 minutes',
    '5 minutes'
  ],
  correct: 1,
  explanation: 'The thermal time constant τ_th is defined as the time to reach 1 − 1/e ≈ 63.2% of the final temperature rise. After one time constant (20 minutes in this case), the motor has reached 63% of ΔT_final. After 5τ (100 min) it is essentially at steady state.',
  examRelevant: true
},
{
  id: 'thm_004', topic: 'thermal', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about motor thermal management:',
  statements: [
    { text: 'A motor operating at 50% of rated current dissipates 25% of the rated copper losses (I²R), because power is proportional to the square of current.', correct: true },
    { text: 'Increasing motor speed always reduces the motor temperature because forced cooling increases proportionally with speed.', correct: false }
  ],
  explanation: 'P ∝ I²: at 50% I, power = (0.5)² = 25% of rated — correct. At higher speed, self-ventilated motors do cool better. However, increasing speed also increases switching frequency, iron losses, and friction losses, and at very high speeds bearing and windage losses dominate. The statement "always reduces temperature" is false — above base speed, losses can increase.',
  examRelevant: true
},
{
  id: 'thm_005', topic: 'thermal', type: 'open', difficulty: 'hard',
  question: 'A motor operates with an intermittent duty cycle: it runs for ton = 30 s at full power P = 500 W, then rests for toff = 90 s. The thermal time constant is τ = 10 minutes = 600 s. Rth = 0.15 °C/W, ambient = 25 °C.\n\n(a) Calculate the equivalent continuous power for thermal analysis.\n(b) Calculate the steady-state winding temperature under this duty cycle.',
  sampleAnswer: '(a) Duty cycle D = ton / (ton + toff) = 30 / 120 = 0.25.\nP_equivalent = P × D = 500 × 0.25 = 125 W.\n\n(b) Since τ >> (ton + toff): the motor temperature follows the average power.\nΔT = P_eq × Rth = 125 × 0.15 = 18.75 °C.\nT_winding = T_ambient + ΔT = 25 + 18.75 = 43.75 °C ≈ 44 °C.',
  rubric: [
    'Calculates duty cycle D = 30/120 = 0.25',
    'Multiplies peak power by duty cycle: P_eq = 125 W',
    'Applies steady-state formula: ΔT = P_eq × Rth',
    'Adds ambient to get final temperature'
  ],
  explanation: 'When the thermal time constant is much longer than the on/off cycle, the motor temperature responds to the average power. This allows motors to run at peak power for short bursts as long as the average thermal load is within limits.',
  examRelevant: true
},
{
  id: 'thm_006', topic: 'thermal', type: 'flashcard', difficulty: 'medium',
  front: 'Motor thermal time constant (τ_th)',
  back: 'Time to reach 63.2% of final temperature rise from cold, or cool to 36.8% of initial rise from hot. τ_th = Rth × Cth (thermal resistance × thermal capacity).\nLarge motor → large Cth → large τ_th (heats up slowly).\nAfter 5τ, motor is at steady state.',
  explanation: 'τ_th determines how fast the motor heats up. Important for duty cycle and intermittent load calculations.',
  examRelevant: false
},
{
  id: 'thm_007', topic: 'thermal', type: 'mc', difficulty: 'medium',
  question: 'A motor is rated for insulation class F (maximum winding temperature 155°C). At ambient 25°C, what is the maximum allowable winding temperature rise?',
  options: [
    '100 °C',
    '130 °C',
    '155 °C',
    '25 °C'
  ],
  correct: 1,
  explanation: 'Temperature rise = maximum winding temperature − ambient temperature = 155 − 25 = 130°C. Insulation classes define the absolute maximum temperature of the winding: class B = 130°C, F = 155°C, H = 180°C.',
  examRelevant: false
},
{
  id: 'thm_008', topic: 'thermal', type: 'flashcard', difficulty: 'easy',
  front: 'Motor insulation temperature classes',
  back: 'Class B: 130°C max winding temperature.\nClass F: 155°C max.\nClass H: 180°C max.\nHigher class = more heat-resistant insulation = allows higher current density or higher ambient. Standard industrial motors: class F. Servo motors often class H to allow compact construction with high peak currents.',
  explanation: 'Temperature class determines the maximum safe winding temperature. If exceeded, insulation degrades and motor fails.',
  examRelevant: false
},
{
  id: 'thm_009', topic: 'thermal', type: 'open', difficulty: 'medium',
  question: 'A power transistor in a motor drive dissipates 8 W of heat. The transistor is mounted on a heatsink with the following thermal resistances:\n• Junction-to-case: Rth_jc = 1.5 °C/W\n• Case-to-heatsink (thermal pad): Rth_cs = 0.5 °C/W\n• Heatsink-to-ambient: Rth_sa = 5 °C/W\nAmbient temperature: 30 °C. Maximum junction temperature: 150 °C.\n\nCalculate: (a) the junction temperature, (b) whether it is within specifications.',
  sampleAnswer: '(a) Total thermal resistance: Rth_total = Rth_jc + Rth_cs + Rth_sa = 1.5 + 0.5 + 5 = 7 °C/W.\nΔT = P × Rth_total = 8 × 7 = 56 °C.\nT_junction = T_ambient + ΔT = 30 + 56 = 86 °C.\n\n(b) 86 °C < 150 °C — within specification. Safety margin = 150 − 86 = 64°C.',
  rubric: [
    'Adds all three thermal resistances in series: Rth_total = 7 °C/W',
    'Multiplies P by Rth_total: ΔT = 56°C',
    'Adds ambient temperature: T_j = 86°C',
    'Compares to maximum (150°C) and states within spec'
  ],
  explanation: 'Thermal resistances in a heat path add in series (like electrical resistances). The total determines the temperature rise across the whole stack. Always verify T_junction < T_max with margin.',
  examRelevant: true
},
{
  id: 'thm_010', topic: 'thermal', type: 'tf', difficulty: 'medium',
  question: 'Evaluate both statements about thermal management in servo drives:',
  statements: [
    { text: 'Copper losses in a motor winding are proportional to I² × R. At rated current the losses are P_rated; at 2× rated current (short overload), losses are 4× P_rated.', correct: true },
    { text: 'A PTC thermistor in the motor winding protects against overheating by measuring the exact winding temperature and sending a proportional analog signal to the drive controller.', correct: false }
  ],
  explanation: 'I²R losses scale with I²: doubling current quadruples losses — correct. A PTC thermistor is a non-linear switching device, not a precision analog sensor. It switches from low to very high resistance at the trip temperature. It sends a binary-like protection signal, not a proportional analog temperature value.',
  examRelevant: true
}

]; // end QUESTIONS
