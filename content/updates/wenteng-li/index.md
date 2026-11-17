# Wenteng Li
I'm building the [spinner](#/gen-one/spinner). Below are my timeline and weekly updates.

## Spinner Timeline (updated 11/16/26)

**Phase 1 (V1):** build, test, then push to its limit (10k RPM). **Worst-case deadline: 12/12**, same as the tube furnace.

**Phase 2 (final version):** 10k RPM with an electrostatic chuck (no tape), done 3/6/27.

| Date | Milestone | How | Done when |
|---|---|---|---|
| 11/17 | Order parts | RMRC (ESC), SunnySky (motor), DigiKey (power supply, switches, DC jack), Pololu (5 V regulator). Parts list on the [spinner page](#/gen-one/spinner) | All 4 orders placed |
| 11/17 | Print pocket test coupon | PLA, Prusa MK3S, 0.15 mm layers, 40 min. 5 pockets (10.2/10.3/10.4 mm wide, 0.30–0.60 mm deep) | Pick the pocket where a chip drops in and doesn't rattle |
| 11/17–20 | Print enclosure | PLA at Anderson Labs: base (203 g), bottom cover (67 g), catch bowl (54 g), lid ring (13 g) | Parts printed, bowl sits on the 3 base posts |
| 11/18 | Cut clear lid | Ø93 × 3 mm polycarbonate disc, cut from sheet with a hole saw or band saw, edges sanded | Disc fits the lid ring pocket |
| 11/17–22 | Firmware (ESP32-S3) | DShot300 speed output, ESC telemetry decoding, PID loop, recipe ramps over USB serial | DShot signal seen on a scope |
| 11/20 | Wire electronics | Power supply → power switch → ESC; 5 V regulator → ESP32-S3; lid switch to a GPIO | 5 V and 12 V correct on a multimeter |
| 11/21–22 | Fit motor and chuck | Measure motor mounting holes and rotor screw pattern, update CAD, print chuck (12 g) | Chuck spins true by eye, no rubbing |
| 11/23 | Bench speed test | Configure ESC (AM32), run setpoints 500–6000 RPM | See "Speed" test below |
| 11/24 | Full assembly | Motor 4 × M3 into base, chuck 4 × M3 onto rotor, bowl, lid | Opening the lid stops the motor |
| 11/25 | PVA test coats | 10 × 10 mm chips, 1000–6000 RPM | Full coverage, chip stays in pocket |
| **11/30** | **AZ P4210 coats, V1 done** | See "Coating" test below | Thickness and uniformity measured |
| 12/1–12/4 | **Limit test: 10k RPM** | See below | Holds 10,000 RPM with a chip, 10 runs |
| 12/5 | Docs updated | Spinner page: SOP, test results, actual cost | Page updated |

**If a part is late:** anything not shipped by 11/24 gets reordered from another US vendor. Parts must arrive by 12/5 to keep 12/12.

### Lead times (checked 11/16)

All Phase 1 parts are in stock and ship from the US, so everything should arrive within 1 week. The only long-lead item is the Phase 2 PCB order, planned at 3 weeks worst case.

| Phase | Vendor | Parts | Stock | Expected arrival | Worst case |
|---|---|---|---|---|---|
| 1 | DigiKey | Power supply, switches, DC jack | In stock, ships from Minnesota | 11/19–20 | 1 week |
| 1 | RMRC | ESC | In stock, same-day ship | 11/20–23 | 1 week |
| 1 | SunnySky USA | Motor | In stock, ships from Ohio | 11/20–23 | 1 week |
| 1 | Pololu | 5 V regulator | Same-day ship | 11/20–23 | 1 week |
| 2 | DigiKey | HV supply, capacitor, resistors | In stock | 2–3 days | 1 week |
| 2 | JLCPCB | Electrostatic chuck PCBs (from China) | Made to order | 2–3 weeks | **3 weeks** (ordered 1/26, needed 2/16) |

Ordering depends on funding approval; a late approval moves every date by the same amount.

### Tests

| Test | Method | Pass |
|---|---|---|
| Speed | Setpoints 500, 1000, 2000, 4000, 6000 RPM, 30 s hold each. Read RPM from ESC telemetry; cross-check with a phone spectrum app (motor tone = RPM × 7 / 60 for a 14-pole motor) | Within ±1% of setpoint |
| Ramp and stop | 1500 RPM/s ramp; open the lid at 6000 RPM | Ramp follows the recipe; motor stops, chip stays in place |
| Coating | AZ P4210, 30 s at 1000, 2000, 4000, 6000 RPM, 3 chips each. Thickness by stylus profilometer at center and 2 mm from the edge | 4000 RPM within 20% of the datasheet curve; center vs. edge within 5%; 3 chips within 5% |

### Phase 1 limit test: 10k RPM (12/1–12/4)

Same motor, ESC and enclosure; no new parts expected.

- **Motor headroom:** 1250 KV × 12 V = 15,000 RPM with no load. Loaded speed not tested yet. If it can't reach 10,000 RPM, switch to a 16 V supply (ESC is rated 3–6S).
- **Chuck strength:** a solid PLA chuck (Ø40 mm) at 10,000 RPM sees about 0.2 MPa, far below PLA strength (about 50 MPa). Reprint at 100% infill so it's balanced.
- **Steps:** raise speed 6000 → 8000 → 10,000 RPM with a dummy chip and lid closed; then 10 runs of 60 s at 10,000 RPM.
- **Pass:** speed within ±1%, chip never leaves the pocket, no visible wobble.
- **Coat:** AZ P4210 at 8000 and 10,000 RPM to extend the thickness curve.

### While waiting for parts

List V2 ideas on the spinner page: balanced aluminum chuck, built-in tachometer, resist drain to a waste bottle.

## Phase 2 Timeline: Final Version (10k RPM, electrostatic chuck)

Dates after 12/12 are estimates; HV testing waits for lab approval.

| Date | Milestone | How | Done when |
|---|---|---|---|
| 12/5–12/12 | V2 requirements | From Phase 1 results: max speed, wobble, chip holding at 10k RPM. Submit lab request for high-voltage use | Requirements list on the spinner page; HV request sent |
| 1/20–1/23 | Final design | Electrostatic chuck Rev B (from Rev A, sized for a 1 kV supply), balanced hub, fixes from Phase 1 | KiCad DRC 0 errors; CAD updated |
| 1/26 | Order parts | DigiKey: XP Power Q10-12 HV supply ($188.80), 10 nF 2 kV capacitor, 10 MΩ resistors. PCBs from JLCPCB (2–3 weeks) | Orders placed |
| 2/16 | Charging station + hold test | Spring probes + HV supply + 10 MΩ series resistor; measure hold force and 120 s voltage decay | Holds chip for 120 s with margin ≥ 2× |
| 2/23 | Spin test | Electrostatic chuck on the motor, no tape, 6000 → 10,000 RPM | Chip held at 10,000 RPM, 10 runs |
| **3/6** | **AZ P4210 coats, Phase 2 done** | Same coating test as Phase 1, add 8000 and 10,000 RPM | Thickness curve 1000–10,000 RPM; docs updated |

## Weekly Update #1 (11/16/26)
- Spinner docs page, concept diagram and BOM done (~$84 to buy).
- Checked stock and shipping for every part; all ship from within the US.
- Next: order parts 11/17, assemble by 11/24.
