# Spinner
The spinner will be used to coat 10 × 10 mm silicon chips with a thin, uniform layer of photoresist or spin-on dopant at a controlled speed (500–6000 RPM). It is designed in CAD and not yet built or tested.

![Spinner concept diagram](spinner_concept_diagram.png)

**Spinner BOM**

| Item | Qty | Unit Price | Line Total |
|---|---:|---:|---:|
| [SunnySky X2216 1250KV Brushless Motor](https://sunnyskyusa.com/products/sunnysky-x2216-brushless-motors) (SunnySky USA) | 1 | $18.99 | $18.99 |
| [Holybro Tekko32 F4 45A ESC (AM32)](https://www.readymaderc.com/products/details/87186-holybro-tekko32-f4-45a-esc-am32) (RMRC) | 1 | $22.50 | $22.50 |
| [Mean Well GST60A12-P1J 12 V 5 A Power Supply](https://www.digikey.com/en/products/detail/mean-well-usa-inc/GST60A12-P1J/7703712) (DigiKey) | 1 | $19.40 | $19.40 |
| Import tariff on power supply (about 21%) | 1 | $4.07 | $4.07 |
| [Pololu D24V10F5 5 V Regulator](https://www.pololu.com/product/2831) (Pololu) | 1 | $13.95 | $13.95 |
| [Omron SS-5GL Lid Interlock Switch](https://www.digikey.com/en/products/detail/omron-electronics-inc-emc-div/SS-5GL/272367) (DigiKey) | 1 | $2.09 | $2.09 |
| [E-Switch RA1113112R Power Rocker Switch](https://www.digikey.com/en/products/detail/e-switch/RA1113112R/3778055) (DigiKey) | 1 | $0.88 | $0.88 |
| [Adafruit 368 DC Jack to Screw Terminal](https://www.digikey.com/en/products/detail/adafruit-industries-llc/368/5629434) (DigiKey) | 1 | $2.00 | $2.00 |
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

An electrostatic chuck is designed and calculated for the final version (Phase 2, 10k RPM, no tape). It needs lab safety approval for high voltage before any testing. Schedule: [Wenteng Li's timeline](#/updates/wenteng-li).
