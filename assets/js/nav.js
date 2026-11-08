/* =====================================================================
   Site navigation: the single source of truth for the sidebar,
   breadcrumbs, prev/next pager, and search index.

   Every page is a Markdown file under content/. Its route is the file
   path without ".md"; a folder's index.md is the folder's own route.
     content/gen-one/spinner/index.md              ->  #/gen-one/spinner
     content/gen-one/sputterer/pvd-vacuum.md       ->  #/gen-one/sputterer/pvd-vacuum

   Hierarchy:  section (fab)  >  system (machine)  >  subsystem
     section: { section, children[] }
     page:    { icon?, title, path, children?[] }
   m(icon, title, path, [subsystems]) makes a machine page (a folder with
   index.md). Subsystems are [icon, title, slug] and live in that folder
   as <slug>.md. The emoji shows in the sidebar, on cards, and next to
   the page title.

   Add pages on purpose: create the .md file, then add an entry here.
   ===================================================================== */
(function () {
  const m = (icon, title, path, subs = []) => ({
    icon, title, path, dir: true,
    children: subs.map(([i, t, slug]) => ({ icon: i, title: t, path: `${path}/${slug}` })),
  });

  window.NAV = [
    {
      section: "Start here",
      children: [
        { icon: "🏠", title: "Home", path: "home" },
        { icon: "👥", title: "Team", path: "team" },
        {
          icon: "📝", title: "Updates", path: "updates", dir: true,
          children: [
            { title: "Leonard Jin", path: "updates/leonard-jin", dir: true },
          ],
        },
      ],
    },
    {
      section: "Gen One Fab",
      children: [
        { icon: "🔌", title: "Gen One overview", path: "gen-one", dir: true },
        m("📽️", "Maskless Litho Stepper", "gen-one/maskless-stepper", [
          ["🧑‍💻", "Alignment Firmware", "alignment-firmware"],
          ["📷", "Computer Vision Software", "computer-vision-software"],
        ]),
        m("☄️", "DC & RF Magnetron Sputterer", "gen-one/sputterer", [
          ["💨", "PVD Vacuum", "pvd-vacuum"],
        ]),
        m("🔥", "Tube Furnace", "gen-one/tube-furnace"),
        m("🌞", "Hot Plate", "gen-one/hot-plate"),
        m("🌀", "Spinner", "gen-one/spinner"),
        m("⚡", "Spin-On Doping", "gen-one/spin-on-doping"),
      ],
    },
    {
      section: "Gen Two Fab",
      children: [
        { icon: "📈", title: "Gen Two overview", path: "gen-two", dir: true },
        m("🪏", "ICP Reactive Ion Etcher", "gen-two/icp-rie"),
        m("🔊", "Ultrasonic Cleaner", "gen-two/ultrasonic-cleaner"),
        m("🔬", "Electron Microscope", "gen-two/electron-microscope"),
        m("🦾", "Wafer Robotic Arm", "gen-two/wafer-arm"),
        m("🏝️", "Microenvironment Clean Room", "gen-two/cleanroom-microenvironment"),
        m("⚗️", "Dopant Synthesis", "gen-two/dopant-synthesis"),
        m("🧪", "Polymer Synthesis", "gen-two/polymer-synthesis"),
        m("🖋️", "Inkjet Microplotter", "gen-two/microplotter"),
      ],
    },
    {
      section: "R&D Fab",
      children: [
        { icon: "🔭", title: "R&D overview", path: "rnd", dir: true },
        m("⚖️", "Laser Interferometry", "rnd/laser-interferometry"),
        m("📍", "Probe Station", "rnd/probe-station"),
        m("🫆", "CV Defect Inspection", "rnd/cv-defect-inspection"),
      ],
    },
  ];
})();
