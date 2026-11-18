# Fab Timeline

```timeline
@ 2026-11-23 | Funding
@ 2026-11-30 | Patterning | Maskless Litho Stepper
@ 2026-12-12 | Doping | Tube Furnace / Spin Coater / Hot Plate
@ 2027-03-12 | Sputtering + Etching | DC & RF Magnetron Sputterer / ICP-RIE
@ 2027-03-26 | First IC Out

# Patterning
## Maskless Litho Stepper | gen-one/maskless-stepper#timeline
active  | CAD design / Nov 17
+ planned | 3D printing / Nov 18–20
+ planned | Assembly + test / Nov 23–24
planned |
planned |
planned |

# Doping
## Tube Furnace | gen-one/tube-furnace#timeline
planned | Ordering / Nov 23–30
planned | Build / Dec 7–10
+ planned | Safety test / Dec 12
planned |
planned |

## Spin Coater | gen-one/spinner#timeline
active  | V1 build / Nov 17–24
+ planned | Coat tests / Nov 25–30
planned | 10k RPM test / Dec 1–4
+ planned | V2 specs / Dec 5–12
planned | V2 design / Jan 20–26
+ planned | E-chuck tests / Feb 16–23
+ planned | V2 coat tests / Mar 6
planned |

## Hot Plate | gen-one/hot-plate
planned | No timeline yet
planned |
planned |
planned |

## Doping Synthesis | gen-two/doping-synthesis
planned | Create safety information / Nov 17-24
planned | Create prelab 1-making solution / Nov 24-Dec 18
planned | Preform lab 1-making solution / Jan 12-Feb 16

# Sputtering + Etching
## DC & RF Magnetron Sputterer | gen-one/sputterer#timeline
planned |
active  | Purchasing / Nov 16–Dec 11
planned | Parts delivery / Dec 14–25
+ planned | Prep / Dec 28–Jan 8
+ planned | Build / Jan 11–Feb 12
+ planned | Testing / Feb 15–Mar 5
planned |

## ICP-RIE
planned | No timeline yet
planned |
planned |
planned |
```

## Updating the chart

Edit the `timeline` block in [`content/timeline.md`](https://github.com/UMNTC-Hacker-Fab/docs/edit/main/content/timeline.md).

- **Milestones:** `@ YYYY-MM-DD | Process | Machine / Machine`, one line each. Machines are optional; separate several with ` / ` and each gets its own line. Milestones are evenly spaced and sorted by date.
- **Categories:** `# Name` draws a gray band across the chart.
- **Machines:** `## Machine | page path` adds a row; the name links to that page. The 4 lines under it are its 4 columns, in order: `status | line one / line two`. Status is `done`, `active` (in progress), `planned`, or `-` for an empty column. Keep each line under about 22 characters.
