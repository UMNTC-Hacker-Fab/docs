/* =====================================================================
   Site navigation: the single source of truth for the sidebar,
   breadcrumbs, prev/next pager, and search index.

   Every page is a Markdown file under content/. Its route is the file
   path without ".md"; a folder's index.md is the folder's own route.
     content/gen-one/spinner/index.md              ->  #/gen-one/spinner
     content/gen-one/sputterer/build/safety.md     ->  #/gen-one/sputterer/build/safety

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
      section: "Start Here",
      children: [
        { icon: "🏠", title: "Home", path: "home" },
        { icon: "👥", title: "Team", path: "team" },
        { icon: "🗓️", title: "Fab Timeline", path: "timeline" },
        {
          icon: "📝", title: "Updates", path: "updates", dir: true,
          children: [
            { title: "Example Member", path: "updates/example-member", dir: true },
            { title: "Leonard Jin", path: "updates/leonard-jin", dir: true },
            { title: "Arjun Senthilvel", path: "updates/arjun-senthilvel", dir: true },
            { title: "Wenteng Li", path: "updates/wenteng-li", dir: true },
            { title: "Bear BlinSchauer", path: "updates/bear-blinschauer", dir: true },
            { title: "Andrew Choi", path: "updates/andrew-choi", dir: true },
            { title: "Natalie Sinn", path: "updates/natalie-sinn", dir: true },
          ],
        },
      ],
    },
    {
      section: "Gen One Fab",
      children: [
        { icon: "🔌", title: "Gen One Overview", path: "gen-one", dir: true },
        m("📽️", "Maskless Litho Stepper", "gen-one/maskless-stepper"),
        {
          icon: "☄️", title: "DC & RF Magnetron Sputterer", path: "gen-one/sputterer", dir: true,
          children: [
            m("🔧", "Build", "gen-one/sputterer/build", [
              ["🧲", "Magnetron & Target", "magnetron"],
              ["⚡", "DC & RF Power", "power"],
              ["⚠️", "Safety", "safety"],
            ]),
            m("📐", "Theory", "gen-one/sputterer/theory"),
          ],
        },
        m("🔥", "Tube Furnace", "gen-one/tube-furnace"),
        m("🌞", "Hot Plate", "gen-one/hot-plate"),
        m("🌀", "Spinner", "gen-one/spinner"),
      ],
    },
    {
      section: "Gen Two Fab",
      children: [
        { icon: "📈", title: "Gen Two Overview", path: "gen-two", dir: true },
      ],
    },
    {
      section: "R&D Fab",
      children: [
        { icon: "🔭", title: "R&D Overview", path: "rnd", dir: true },
      ],
    },
  ];
})();
