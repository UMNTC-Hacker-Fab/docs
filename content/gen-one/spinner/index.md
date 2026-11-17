# Spinner
The spinner will be used to coat 10 × 10 mm silicon chips with a thin, uniform layer of photoresist or spin-on dopant at a controlled speed (500–6000 RPM). It is designed in CAD and not yet built or tested.

![Spinner concept diagram](spinner_concept_diagram.png)

## Timeline

Updated 11/17/26.

Parts are ordered and printing starts when sponsor funding arrives (**day F**). Firmware starts now since it costs nothing.

**Phase 1 (V1):** build, test, then push to its limit (10k RPM). **Worst-case deadline: 12/12**, same as the tube furnace. To keep it, funding must arrive by **11/28**.

**Phase 2 (final version):** 10k RPM with an electrostatic chuck (no tape), done 3/6/27.

| Date | Milestone |
|---|---|
| 11/17 on | Firmware (ESP32-S3) |
| F | Order parts; print pocket test coupon |
| F to F+3 | Print enclosure |
| F+1 | Cut clear lid |
| F+3 | Wire electronics (DigiKey parts arrive) |
| F+4 to F+5 | Fit motor and chuck (motor, ESC, regulator arrive) |
| F+6 | Bench speed test |
| F+7 | Full assembly |
| F+8 | PVA test coats |
| **F+10** | **AZ P4210 coats, V1 done** |
| F+11 to F+14 | **Limit test: 10k RPM** |
| F+15 | Docs updated |

Example: funding on 11/20 → V1 done 11/30, limit test done 12/4.

**If a part is late:** anything not shipped within 7 days of ordering gets reordered from another US vendor.

### Lead times (checked 11/16)

All Phase 1 parts are in stock and ship from the US, so everything should arrive within 1 week of ordering. The only long-lead item is the Phase 2 PCB order, planned at 3 weeks worst case.

| Phase | Vendor | Parts | Stock | Arrival after ordering | Worst case |
|---|---|---|---|---|---|
| 1 | DigiKey | Power supply, switches, DC jack | In stock, ships from Minnesota | 2–3 days | 1 week |
| 1 | RMRC | ESC | In stock, same-day ship | 3–6 days | 1 week |
| 1 | SunnySky USA | Motor | In stock, ships from Ohio | 3–6 days | 1 week |
| 1 | Pololu | 5 V regulator | Same-day ship | 3–6 days | 1 week |
| 2 | DigiKey | HV supply, capacitor, resistors | In stock | 2–3 days | 1 week |
| 2 | JLCPCB | Electrostatic chuck PCBs (from China) | Made to order | 2–3 weeks | **3 weeks** (ordered 1/26, needed 2/16) |

### Tests

| Test | Method | Pass |
|---|---|---|
| Speed | Setpoints 500, 1000, 2000, 4000, 6000 RPM, 30 s hold each. Read RPM from ESC telemetry; cross-check with a phone spectrum app (motor tone = RPM × 7 / 60 for a 14-pole motor) | Within ±1% of setpoint |
| Ramp and stop | 1500 RPM/s ramp; open the lid at 6000 RPM | Ramp follows the recipe; motor stops, chip stays in place |
| Coating | AZ P4210, 30 s at 1000, 2000, 4000, 6000 RPM, 3 chips each. Thickness by stylus profilometer at center and 2 mm from the edge | 4000 RPM within 20% of the datasheet curve; center vs. edge within 5%; 3 chips within 5% |

### Phase 1 limit test: 10k RPM (F+11 to F+14)

Same motor, ESC and enclosure; no new parts expected.

- **Motor headroom:** 1250 KV × 12 V = 15,000 RPM with no load. Loaded speed not tested yet. If it can't reach 10,000 RPM, switch to a 16 V supply (ESC is rated 3–6S).
- **Chuck strength:** a solid PLA chuck (Ø40 mm) at 10,000 RPM sees about 0.2 MPa, far below PLA strength (about 50 MPa). Reprint at 100% infill so it's balanced.
- **Steps:** raise speed 6000 → 8000 → 10,000 RPM with a dummy chip and lid closed; then 10 runs of 60 s at 10,000 RPM.
- **Pass:** speed within ±1%, chip never leaves the pocket, no visible wobble.
- **Coat:** AZ P4210 at 8000 and 10,000 RPM to extend the thickness curve.

### While waiting for parts

List V2 ideas on the spinner page: balanced aluminum chuck, built-in tachometer, resist drain to a waste bottle.

### Phase 2 timeline: final version (10k RPM, electrostatic chuck)

Dates after 12/12 are estimates; HV testing waits for lab approval.

| Date | Milestone |
|---|---|
| 12/5–12/12 | V2 requirements |
| 1/20–1/23 | Final design |
| 1/26 | Order parts |
| 2/16 | Charging station + hold test |
| 2/23 | Spin test |
| **3/6** | **AZ P4210 coats, Phase 2 done** |

**Spinner BOM**

| Item | Qty | Unit Price | Line Total |
|---|---:|---:|---:|
| [SunnySky X2216 1250KV Brushless Motor](https://sunnyskyusa.com/products/sunnysky-x2216-brushless-motors) | 1 | $18.99 | $18.99 |
| [Holybro Tekko32 F4 45A ESC (AM32)](https://www.readymaderc.com/products/details/87186-holybro-tekko32-f4-45a-esc-am32) | 1 | $22.50 | $22.50 |
| [Mean Well GST60A12-P1J 12 V 5 A Power Supply](https://www.digikey.com/en/products/detail/mean-well-usa-inc/GST60A12-P1J/7703712) | 1 | $19.40 | $19.40 |
| Import tariff on power supply (about 21%) | 1 | $4.07 | $4.07 |
| [Pololu D24V10F5 5 V Regulator](https://www.pololu.com/product/2831) | 1 | $13.95 | $13.95 |
| [Omron SS-5GL Lid Interlock Switch](https://www.digikey.com/en/products/detail/omron-electronics-inc-emc-div/SS-5GL/272367) | 1 | $2.09 | $2.09 |
| [E-Switch RA1113112R Power Rocker Switch](https://www.digikey.com/en/products/detail/e-switch/RA1113112R/3778055) | 1 | $0.88 | $0.88 |
| [Adafruit 368 DC Jack to Screw Terminal](https://www.digikey.com/en/products/detail/adafruit-industries-llc/368/5629434) | 1 | $2.00 | $2.00 |
| **Total Build Price** | | | **$83.88** |

Already on hand (no cost): ESP32-S3 dev board, PLA for printed parts (about 350 g, Anderson Labs), Ø93 × 3 mm polycarbonate lid, double-sided Kapton tape, M3 screws and wire, AC power cord (C13; if none, [Mean Well YP12-YC12](https://www.digikey.com/en/products/detail/mean-well-usa-inc/YP12-YC12/7707223)). Not included: shipping, tax. All parts ship from US vendors. Prices checked 11/16/26; nothing ordered yet.

## Chuck
The chip sits in a 10.3 mm recessed pocket on a printed PLA chuck (Ø40 mm) and is held down with double-sided Kapton tape. The pocket takes the sideways force when spinning; the tape keeps the chip from lifting. The pocket size will be chosen by printing a test coupon with 5 pocket sizes (10.2, 10.3 and 10.4 mm at 0.45 mm deep; 10.3 mm at 0.30 and 0.60 mm deep).

## Motor & Drive
The chuck screws onto the rotor of a SunnySky X2216 1250KV brushless motor, driven by a Holybro Tekko32 ESC running open-source AM32 firmware. The ESC reports the actual RPM over a serial telemetry wire, so no separate tachometer is needed. The motor mounting holes (assumed 16 × 19 mm) will be measured when it arrives.

## Controller
![Spinner control diagram](spinner_control_diagram.jpg)

An ESP32-S3 runs a PID speed loop: it sends DShot300 speed commands to the ESC and reads RPM back from the telemetry wire. A recipe runs 300 RPM start, 1500 RPM/s ramp, 5–180 s hold, then a controlled ramp down, the same profile as the [CMU Hacker Fab spin coater](https://docs.hackerfab.org/home/fab-toolkit/spincoater). Recipes are set and RPM is logged from a laptop over USB serial. Opening the lid triggers a slow stop instead of a hard brake.

| Signal | From | To | Notes |
|---|---|---|---|
| Speed command (DShot300) | ESP32-S3 GPIO | ESC signal pad | Pin to be assigned |
| RPM telemetry (UART, 115200 8N1) | ESC TX pad | ESP32-S3 GPIO | Check 3.3 V level with a scope first |
| Lid interlock | Omron SS-5GL | ESP32-S3 GPIO to GND | Open lid = stop |
| USB serial | ESP32-S3 USB | Laptop | Recipes in, RPM log out |

## Enclosure & Catch Bowl
A printed base (150 × 150 × 45 mm) holds the motor and electronics. Three posts hold a catch bowl (Ø95.5 × 34 mm) around the chuck, with the chip top 8.8 mm below the bowl rim. A clear polycarbonate lid presses the interlock switch when closed. Overall size with lid: 150 × 150 × 102 mm.

## Electrostatic Chuck (Phase 2)
![Electrostatic chuck concept sketch](electrostatic_chuck_sketch.jpg)

An electrostatic chuck is designed and calculated for the final version (Phase 2, 10k RPM, no tape). It needs lab safety approval for high voltage before any testing. Schedule: Phase 2 in the [timeline](#/gen-one/spinner#timeline).
