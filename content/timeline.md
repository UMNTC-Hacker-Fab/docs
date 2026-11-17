# Fab timeline

The big milestones on the way to our first integrated circuit: each process, the machines that have to be done for it, and the date. Below them is one row per machine. Detailed plans live on each machine's page and in weekly updates.

```timeline
@ 2026-11-23 | Funding
@ 2026-11-30 | Patterning | Maskless litho stepper
@ 2026-12-12 | Doping | Tube furnace / Spin coater / Hot plate
@ 2027-03-12 | Sputtering + Etching | DC & RF Magnetron Sputterer / ICP-RIE
@ 2027-03-26 | First IC out

# Patterning
## Maskless litho stepper | gen-one/maskless-stepper#timeline
active  | CAD design / Nov 17
+ planned | 3D printing / Nov 18–20
+ planned | Assembly + test / Nov 23–24
planned |
planned |
planned |

# Doping
## Tube furnace | gen-one/tube-furnace
planned |
planned |
planned |
planned |

## Spin coater | gen-one/spinner
planned |
planned |
planned |
planned |

## Hot plate | gen-one/hot-plate
planned |
planned |
planned |
planned |

# Sputtering + Etching
## DC & RF Magnetron Sputterer | gen-one/sputterer
planned |
planned |
planned |
planned |

## ICP-RIE | gen-two/icp-rie
planned |
planned |
planned |
planned |
```

## Updating the chart

Edit the `timeline` block in [`content/timeline.md`](https://github.com/UMNTC-Hacker-Fab/docs/edit/main/content/timeline.md).

- **Milestones:** `@ YYYY-MM-DD | Process | Machine / Machine`, one line each. Machines are optional; separate several with ` / ` and each gets its own line. Milestones are evenly spaced and sorted by date.
- **Categories:** `# Name` draws a gray band across the chart.
- **Machines:** `## Machine | page path` adds a row; the name links to that page. The 4 lines under it are its 4 columns, in order: `status | line one / line two`. Status is `done`, `active` (in progress), `planned`, or `-` for an empty column. Keep each line under about 22 characters.
