// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change everything on the site.
//  Anything marked TODO is a placeholder for you to replace.
// ─────────────────────────────────────────────────────────────
const GH = "https://github.com/abhinandand91-debug/";
const ITCH = "https://xstonecold.itch.io/";

window.CONTENT = {
  name: "Abhinandan Dharmadhikari",
  role: "Senior Unity Developer",
  tagline: "Senior Unity engineer with 10+ years in C#. I architected a combat flight simulator for defence training, built real-time multiplayer at Mobile Premier League and shipped 9+ mobile games. Now I build Unity tools that make games run faster. Worked in India and Dubai; open to relocating anywhere or working remotely.",
  location: "Sangli, India · Open to relocation worldwide or remote · Available immediately",
  stats: [
    { n: "10+", l: "YEARS IN UNITY & C#" },
    { n: "9+", l: "MOBILE GAMES SHIPPED" },
    { n: "100K+", l: "MULTIPLAYER MATCHES / DAY" },
    { n: "28→52", l: "FPS ON MID-RANGE ANDROID" },
  ],
  langs: "EN_FLUENT / HI_NATIVE / MR_NATIVE / KN_CONVERSATIONAL",
  cv: "assets/cv.pdf",
  email: "abhinandand91@gmail.com",
  links: [
    { label: "GitHub", value: "abhinandand91-debug", href: GH },
    { label: "itch.io", value: "xstonecold.itch.io", href: ITCH },
    { label: "LinkedIn", value: "in/abhinandand91", href: "https://www.linkedin.com/in/abhinandand91" }
  ],

  // Category tiles under the hero. Each project's `dir` must match one of these ids.
  directions: [
    { id: "work", title: "Studio Work", text: "Simulation, multiplayer and live games shipped at studios" },
    { id: "games", title: "Indie Games", text: "Mobile and browser games, playable on itch.io" },
    { id: "tools", title: "Unity Tools", text: "Editor tooling, profilers and packages for Unity teams" },
    { id: "prototypes", title: "Prototypes & Apps", text: "Vertical slices, experiments and app MVPs" },
  ],

  // Projects. Fields:
  //   source:  "itch" | "github" | "private"  (drives the SOURCE filter and badge)
  //   links:   buttons on the card. Leave out for private repos (visitors would get a 404).
  //   img:     optional cover image in assets/
  projects: [
    // ── Studio work (from the CV; no public links) ──
    {
      title: "Combat Flight Simulator", dir: "work", source: "work",
      text: "New Space Research and Technologies: a 3D combat flight simulator used to train defence personnel. I owned the architecture; enemy aircraft AI was trained with Unity ML-Agents. Also built the programme's drone simulation, with low-latency UDP controls and LOD work for a steady frame rate.",
      tags: ["Unity", "C#", "ML-Agents", "UDP", "Simulation"],
    },
    {
      title: "MPL Bingo", dir: "work", source: "work",
      text: "Mobile Premier League: real-time multiplayer bingo for India and the US. Matchmaking for 100K+ matches a day at under 150 ms average latency, bot detection for anti-cheat, and tuning for low-end phones.",
      tags: ["Unity", "C#", "Multiplayer", "WebSockets", "Anti-cheat"],
    },
    {
      title: "Winpatti: Multiplayer 3 Card Poker", dir: "work", source: "work",
      text: "Mobile Premier League: a server-authoritative game model players can't tamper with, sync that stays playable on slow networks, and a frame-rate lift from 28 to 52 FPS on mid-range Android.",
      tags: ["Unity", "C#", "Multiplayer", "Performance"],
    },
    {
      title: "MPL Unity SDK", dir: "work", source: "work",
      text: "A shared SDK bridging native Android and iOS with Unity, used across MPL's Unity games. Designed its APIs so game teams could adopt it without reworking their code.",
      tags: ["Unity", "C#", "Java", "Android", "iOS", "SDK"],
    },
    {
      title: "Agapi Slot Game", dir: "work", source: "work",
      text: "Agapi, Dubai: a mobile slot game delivered from concept to release on a tight deadline in Cocos Creator, an engine learned on the job. Reels, win evaluation, free spins, bonus features and a modular framework for the team.",
      tags: ["Cocos Creator", "TypeScript", "Android"],
    },
    {
      title: "Star Chef", dir: "work", source: "work", img: "assets/star-chef.jpg",
      text: "99 Games: gameplay systems, UI and Spine animation for a live-service cooking game, with 3 years of LiveOps and faster asset loading.",
      tags: ["Unity", "C#", "Spine", "Firebase", "LiveOps"],
    },
    {
      title: "Sheroes: Be the Biz Mogul", dir: "work", source: "work", // TODO: add img: "assets/sheroes.jpg" once the file is saved there
      text: "99 Games: a business-mogul simulation. Resource management, construction, character simulation and progression systems.",
      tags: ["Unity", "C#", "Simulation", "Mobile"],
    },
    {
      title: "Dhoom 3, Fruit Link & Bubble Shooter", dir: "work", source: "work",
      text: "99 Games: procedural track generation, object pooling and difficulty curves (Dhoom 3), and procedural levels, scoring and balancing bots with hack detection (Fruit Link, Bubble Shooter). Plus Editor tools used across the studio.",
      tags: ["Unity", "C#", "Procedural", "Editor tools"],
    },

    // ── itch.io games ──
    {
      title: "Teen Patti Poker Royale", dir: "games", source: "itch", img: "assets/teen-patti-royale.jpg",
      text: "The classic Indian three-card game at a luxury private table, against four sharp bots.",
      tags: ["Unity", "C#", "Card Game", "WebGL"],
      links: [{ label: "PLAY ON ITCH", href: ITCH + "teen-patti-royale" }],
    },
    {
      title: "Bubble Pip", dir: "games", source: "itch", img: "assets/bubble-pip.jpg",
      text: "Aim, bounce and pop: help Pip the red-panda wizard clear 60 levels of bubbles across four worlds.",
      tags: ["Unity", "C#", "Puzzle", "WebGL"],
      links: [{ label: "PLAY ON ITCH", href: ITCH + "bubble-pip" }],
    },
    {
      title: "Neon Drop", dir: "games", source: "itch", img: "assets/neon-drop.jpg",
      text: "A synthwave rhythm brick-breaker: release on the beat for double damage and push the groove up to x4. Endless mode plus a new daily board for everyone. Browser and Android.",
      tags: ["Unity", "C#", "Android", "WebGL", "Audio sync"],
      links: [{ label: "PLAY ON ITCH", href: ITCH + "neon-drop" }],
    },
    {
      title: "Onet Connect", dir: "games", source: "itch", img: "assets/onet-connect.jpg",
      text: "Match animal pairs with paths of up to three lines. 60 solver-checked levels, boosters and a gravity twist. Pure C# rules with tests.",
      tags: ["Unity", "C#", "Puzzle", "Tests"],
      links: [
        { label: "PLAY ON ITCH", href: ITCH + "onet-connect" },
        { label: "SOURCE", href: GH + "onet-connect-unity-showcase" },
      ],
    },
    {
      title: "Mega Merge 2048", dir: "games", source: "itch", img: "assets/mega-merge-2048.jpg",
      text: "Shoot numbered blocks, chain merges and build huge combos up to 2048 and beyond.",
      tags: ["Unity", "C#", "Puzzle", "Android"],
      links: [{ label: "PLAY ON ITCH", href: ITCH + "mega-merge-2048" }],
    },
    {
      title: "Ultimate Bingo", dir: "games", source: "itch", img: "assets/ultimate-bingo.jpg",
      text: "Fast, timed 75-ball bingo: mark called numbers, complete patterns and chase the high score. Layered, local-first architecture.",
      tags: ["Unity", "C#", "Android"],
      links: [{ label: "PLAY ON ITCH", href: ITCH + "ultimate-bingo" }],
    },

    // ── Tools ──
    {
      title: "Frame Guru", dir: "tools", source: "private", img: "assets/frameguru.jpg",
      text: "Finds out why a Unity game drops frames on a real Android phone. It explains each FPS drop, tunes settings live with no rebuild, and measures which fix is worth the most frames on that device. Coming to the Unity Asset Store.",
      tags: ["Unity", "C#", "Android", "Profiling", "Editor tools"],
      links: [], // TODO: Asset Store link once live
    },
    {
      title: "Unity Perf Monitor", dir: "tools", source: "github",
      text: "An in-game performance overlay that names the bottleneck (GPU, main thread, render thread, memory) and fails CI when a build gets slower.",
      tags: ["Unity", "C#", "Profiling", "CI"],
      links: [{ label: "GITHUB", href: GH + "unity-perf-monitor" }],
    },
    {
      title: "LiveOpsKit", dir: "tools", source: "github",
      text: "Unity Editor tools that stop LiveOps and release mistakes: a pre-build release checker, a LiveOps config validator and a time-travel clock.",
      tags: ["Unity", "C#", "Editor tools", "UPM"],
      links: [{ label: "GITHUB", href: GH + "LiveOpsKit" }],
    },
    {
      title: "AddrKit", dir: "tools", source: "github",
      text: "A friendly toolkit on top of Unity Addressables: one-line loading, owner-based auto release, generated keys, folder rules, an analyzer and debug tools.",
      tags: ["Unity", "C#", "Addressables", "UPM"],
      links: [{ label: "GITHUB", href: GH + "AddrKit" }],
    },
    {
      title: "Serialized Field Guard", dir: "tools", source: "private",
      text: "Detects renamed serialized fields, counts the assets they would break, adds FormerlySerializedAs automatically and ships a git pre-commit hook.",
      tags: ["Unity", "C#", "Editor tools", "Git"],
    },

    // ── More games and prototypes ──
    {
      title: "Slot Machines (3×5 and 3×3)", dir: "games", source: "github",
      text: "Classic 20-payline slot machines in Unity 6 with clean, SOLID C#, code-generated placeholder art and sound, and tests. Also ported to Cocos Creator 3.8 in TypeScript.",
      tags: ["Unity", "C#", "Cocos Creator", "TypeScript", "Tests"],
      links: [
        { label: "3×5 SOURCE", href: GH + "slot-3x5-unity-showcase" },
        { label: "3×3 SOURCE", href: GH + "slot-3x3-unity-showcase" },
      ],
    },
    {
      title: "1947", dir: "games", source: "github",
      text: "A 2D vertical space shooter built with Unity.",
      tags: ["Unity", "C#", "2D"],
      links: [{ label: "GITHUB", href: GH + "1947Game" }],
    },
    {
      title: "ToneBlaster", dir: "prototypes", source: "private",
      text: "A voice-controlled artillery prototype: players hum musical notes to aim and fire. Each note maps to a ground zone, and damage depends on landing precision.",
      tags: ["Unity", "C#", "Audio", "Pitch detection"],
    },
    {
      title: "The Last Light", dir: "prototypes", source: "private",
      text: "Colony Memory: a vertical slice built in Unity.", // TODO: one more sentence on the genre and what you built
      tags: ["Unity", "C#"],
    },

    // ── Apps ──
    {
      title: "ChargeMate", dir: "prototypes", source: "private",
      text: "An EV charging app MVP with its own backend.", // TODO: check the wording, and remove if this is client work under NDA
      tags: ["Kotlin", "Flutter", "TypeScript", "Mobile"],
    },
  ],

  // Oldest first; the last entry is shown as current
  experience: [
    { from: "11.2015", to: "08.2020", company: "99 Games", role: "Game Developer → Senior Game Developer", place: "Udupi, India",
      points: ["Star Chef LiveOps for 3 years", "Editor tools used across projects", "Mentored junior developers"] },
    { from: "08.2020", to: "03.2022", company: "New Space Research", role: "Autonomy Researcher", place: "Bangalore, India",
      points: ["Owned combat flight simulator architecture", "Enemy AI with Unity ML-Agents", "Drone simulation over UDP"] },
    { from: "02.2022", to: "10.2025", company: "Mobile Premier League", role: "Senior Development Engineer III", place: "Bangalore, India",
      points: ["100K+ matches/day under 150 ms", "Server-authoritative poker", "Unity SDK for native Android/iOS"] },
    { from: "12.2025", to: "07.2026", company: "Agapi", role: "Senior Game Developer", place: "Dubai, UAE",
      points: ["Slot game from concept to release", "Cocos Creator + TypeScript"] },
    { from: "2026", to: "PRESENT", company: "Independent", role: "Agentic-first games & Unity tools", place: "Remote",
      points: ["6 games on itch.io", "Frame Guru for the Asset Store"] },
  ],

  stack: {
    "Engines & Languages": ["Unity 3D & 2D", "C#", "Java", "C / C++", "TypeScript", "Cocos Creator"],
    "Multiplayer & Networking": ["Server-authoritative state", "Matchmaking", "Anti-cheat", "WebSockets", "Socket.IO", "TCP / UDP", "Photon", "Mirror"],
    "Performance": ["Unity Profiler", "Memory & allocation control", "Object pooling", "Addressables", "Low-end device tuning", "LODs"],
    "Simulation & AI": ["Unity ML-Agents", "Physics-driven systems", "Low-latency input", "Rewired"],
    "SDK & Mobile": ["Unity SDK development", "Native Android / iOS bridging", "Plugin & API design", "Firebase Analytics", "Crashlytics"],
    "Architecture & Delivery": ["SOLID & design patterns", "Event-driven systems", "ScriptableObjects", "Editor tools", "Git", "Jenkins", "JIRA / Scrum", "LiveOps", "AI coding agents"],
  },

  education: [
    { year: "2020", title: "AI / ML and Game Development", place: "Bangalore", details: "Course in machine learning and game development, applied right after in ML-Agents work on the combat flight simulator." },
    { year: "2018–19", title: "Guest Lecturer", place: "NITTE College and MIT Manipal", details: "Guest lectures on game development for engineering students." },
    { year: "2018", title: "Speaker: \"Game Programming Design Patterns\"", place: "IGDC 2018, Hyderabad", details: "Talk at the India Game Developer Conference on applying design patterns to game code." },
    { year: "2015", title: "Diploma in Embedded C / C++", place: "Bangalore", details: "Embedded C and C++ programming, 2014–2015." },
    { year: "2014", title: "B.E., Electronics and Telecommunication", place: "Shivaji University (Bharati Vidyapeeth College of Engineering, Kolhapur)", details: "Bachelor of Engineering, graduated 2014." },
  ],

  // Character sheet in the STACK section: bars are years of hands-on experience (from the CV)
  character: {
    cls: "Senior Unity Developer",
    level: 11, // years since starting in Unity (2015)
    attrs: [
      { name: "Unity & C#", years: 11 },
      { name: "Mobile games", years: 11 },
      { name: "Editor tools", years: 11 },
      { name: "Real-time multiplayer", years: 4 },
      { name: "Native SDK (Android / iOS)", years: 4 },
      { name: "3D simulation & ML-Agents", years: 2 },
      { name: "Cocos Creator / TypeScript", years: 1 },
      { name: "AI coding agents", years: 1 },
    ],
  },

  // ARCADE: itch.io browser builds. `upload` is the itch upload id used for embedding.
  arcade: [
    { title: "Neon Drop", genre: "Rhythm brick-breaker", upload: "20053216", img: "assets/neon-drop.jpg", page: ITCH + "neon-drop" },
    { title: "Bubble Pip", genre: "Bubble shooter", upload: "20103182", img: "assets/bubble-pip.jpg", page: ITCH + "bubble-pip" },
    { title: "Onet Connect", genre: "Tile puzzle", upload: "20053334", img: "assets/onet-connect.jpg", page: ITCH + "onet-connect" },
    { title: "Mega Merge 2048", genre: "Merge puzzle", upload: "20052362", img: "assets/mega-merge-2048.jpg", page: ITCH + "mega-merge-2048" },
    { title: "Ultimate Bingo", genre: "Timed bingo", upload: "20053120", img: "assets/ultimate-bingo.jpg", page: ITCH + "ultimate-bingo" },
    { title: "Teen Patti Poker Royale", genre: "Card game", upload: "20127799", img: "assets/teen-patti-royale.jpg", page: ITCH + "teen-patti-royale" },
  ],
};
