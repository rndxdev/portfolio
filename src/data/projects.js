export const projects = [
  {
    title: "SIT (Safe Ice Tool)",
    description:
      "Stay In The Knowledge — or sit at home if conditions aren't safe. A community-driven ice safety platform that helps anglers and outdoor enthusiasts share real-time ice conditions.",
    tech: ["Laravel", "Vue.js", "Tailwind CSS", "PostgreSQL"],
    github: "https://github.com/rndxdev/safe-ice-tool",
    live: "https://safeicetool.org",
    featured: true,
  },
  {
    title: "BeeManager",
    description:
      "A landing page for a new and upcoming native mobile app — monitor, manage, and optimize your hives with precision. Like having a master beekeeper in your pocket.",
    tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    github: null,
    live: "https://beemanager.org",
    featured: true,
  },
  {
    title: "BattMon",
    description:
      "A lightweight Linux battery monitoring tool for developers. Get real-time battery stats right from your terminal.",
    tech: ["C", "Linux"],
    github: "https://github.com/rndxdev/battmon",
    live: null,
    featured: false,
  },
  {
    title: "DevDash",
    description:
      "A terminal-based developer dashboard for Linux. Quick access to system info and productivity metrics without leaving the command line.",
    tech: ["C", "Linux"],
    github: "https://github.com/rndxdev/devdash",
    live: null,
    featured: false,
  },
  {
    title: "Swarmada",
    type: "game",
    description:
      "A survival arcade game where you pilot the last Vanguard fighter against endless alien waves. Features procedural graphics, synthesized audio, boss encounters, upgrades, and a replay-verified global leaderboard — no third-party assets.",
    tech: ["Python", "Pygame", "WebAssembly", "Pygbag"],
    github: "https://github.com/rndxdev/swarmada",
    live: "https://rndxdev.github.io/swarmada/",
    featured: false,
  },
  {
    title: "Portfolio",
    description:
      "This site — a Vue 3 SPA with a markdown-based blog, Tailwind CSS, and deployed on Netlify. Designed for speed and simplicity.",
    tech: ["Vue 3", "Tailwind CSS", "Vite", "Markdown"],
    github: "https://github.com/rndxdev/portfolio",
    live: null,
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
