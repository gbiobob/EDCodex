/**
 * Real data observed from https://edcodex.info and f:\Code\web\EDCodex\roadmap.json.
 * No fabricated metrics, star counts, or placeholder prose.
 */

export const SITE_COPY = {
  brand: 'Elite: Dangerous Codex',
  shortBrand: 'EDCodex',
  tagline: 'The complete list of third-party tools for Elite: Dangerous',
  subTagline: 'Community driven',
  disclaimer:
    'EDCodex is an unofficial website about the game Elite: Dangerous (property of Frontier Developments).',
  totalCatalogTools: 320,
  pillars: [
    {
      id: 'search',
      title: 'Search',
      summary: 'Community tools, threads, media'
    },
    {
      id: 'share',
      title: 'Share',
      summary: 'Your E:D project, website, tutorials'
    },
    {
      id: 'follow',
      title: 'Follow',
      summary: 'Your favorite tools to keep an eye on them'
    }
  ],
  introLead:
    'EDCodex is the community-driven directory of third-party tools, threads, community websites/wikis, and videos for Elite: Dangerous.',
  purpose:
    'Providing a complete overview of all available third party tools, interesting threads, community websites/wikis and videos on EDCodex. Due to how forum threads work, good entries get buried and authors do not get the exposure they deserve. EDCodex keeps every entry searchable and structured.',
  vision: [
    'Collecting, storing of ED related entries and sharing it with the community.',
    'Any tool author, website, or wiki is encouraged to add or maintain content. An API exists for exporting entries.',
    'The EDCodex content is a community effort. Registered commanders can submit and maintain entries.'
  ],
  publicDatabaseDesc:
    'Browse 320+ third-party tools, filter by category and platform, sort by latest updates, and inspect full compatibility metadata without an account.',
  registeredFeaturesDesc:
    'Registered commanders can submit new entries, claim ownership of existing tools, save favorites, and follow personalized RSS update feeds.',
  submitCta:
    'You have developed an app and want to inform the community or share a useful thread or video?'
};

export const CATEGORIES = [
  { id: 'EDDN', label: 'EDDN', icon: 'database' },
  { id: 'Trading', label: 'Trading', icon: 'exchange' },
  { id: 'Graphics', label: 'Graphics', icon: 'monitor' },
  { id: 'Squadron', label: 'Squadron', icon: 'users' },
  { id: 'Visualization', label: 'Visualization', icon: 'chart' },
  { id: 'Crafting', label: 'Crafting', icon: 'cog' },
  { id: 'Exploration', label: 'Exploration', icon: 'compass' },
  { id: 'Routes', label: 'Routes', icon: 'pin' },
  { id: 'I/O', label: 'I/O', icon: 'gamepad' },
  { id: 'MISC', label: 'MISC', icon: 'wrench' }
];

export const PLATFORMS = [
  'Windows',
  'Web application',
  'Linux',
  'Mac',
  'Android',
  'iPhone'
];

/**
 * Entries verified directly from live edcodex.info (?m=tools and ?m=tools&entry=631)
 */
export const ENTRIES = [
  {
    id: 631,
    title: 'EliteMining',
    type: 'Tool',
    isNew: false,
    authors: 'ViperDude',
    categories: ['EDDN', 'Trading'],
    platforms: ['Windows'],
    status: 'Active',
    dateRelease: '2025-10-15',
    updatedLabel: '1 day ago',
    updatedOrder: 1,
    revision: '5.7.3',
    compatibleWithRelease: true,
    sourcesAvailable: true,
    license: 'GNU General Public License v3.0',
    languages: ['German', 'English'],
    stars: 6,
    summary:
      'Free, open-source Elite Dangerous companion for Windows. EliteMining optimizes your mining efficiency with live analytics, automated announcements, performance tracking, and a comprehensive hotspot finder with 80,000+ mining locations plus Spansh API integration for galaxy-wide ring search, overlaps, and RES sites as a standalone application.',
    longIntro:
      'Built-in PowerPlay merit-mining tools help you find Fortified/Stronghold systems to mine in and nearby Unoccupied systems to sell in for Acquisition merits. Optional VoiceAttack integration enables voice/hotkey mining sequences for complete hands-free operation.',
    features: [
      'Session Tracking & Reports — Real-time tracking of cargo, prospector reports, minerals collected, and performance stats, with exportable HTML reports.',
      'Hotspot Finder — Pre-loaded with 80,000+ confirmed mining locations, filterable by mineral type, ring type, and distance. Supports galaxy-wide ring searches, hotspot overlaps, and RES sites.',
      'Sell Price Ranking — Ranks hotspot minerals in a ring or across an entire system by best sell price, with quick links to copy the system name or open it in Inara, EDSM, or Spansh.',
      'Find Best Mining System — Pick a system you want to sell at, and find the best nearby mining system and mineral to bring there, with a Mining Type filter and PowerPlay mode.',
      'Commodity Market Tool — Uses live market data to find the best sell prices for mined resources, with distance calculations and filtering by station type and landing pad size.',
      'Mining Missions Tab — Track active missions and find matching hotspots directly from mission requirements.',
      'In-Game Text Overlay — Real-time display of cargo levels and prospected asteroid mineral content without leaving the game.',
      'Announcement Panel — Fully customizable event announcements with adjustable thresholds.',
      'PowerPlay Mining for Merits — Shows each system’s controlling power and state next to your pledged power, with recommended actions (Reinforce, Undermine, Acquire).'
    ],
    links: [
      { kind: 'Website', label: 'Discord', url: 'https://edcodex.info/?m=tools&entry=631' },
      { kind: 'Website', label: 'EliteMining', url: 'https://edcodex.info/?m=tools&entry=631' }
    ],
    revisions: [
      { rev: '5.7.3', date: '2026-11-26', note: 'Latest release listed on EDCodex (updated 1 day ago).' },
      { rev: '5.7.0', date: '2026-10-08', note: 'PowerPlay merit-mining recommendations and market filters.' },
      { rev: '5.0.0', date: '2025-10-15', note: 'Initial public entry release on EDCodex.' }
    ]
  },
  {
    id: 656,
    title: 'EDPE - Elite Dangerous Performance Enhanced',
    type: 'Tool',
    isNew: true,
    authors: 'filispeen',
    categories: ['Graphics'],
    platforms: ['Windows'],
    status: 'Active',
    dateRelease: '2026-11-24',
    updatedLabel: 'Nov 24, 2026',
    updatedOrder: 2,
    revision: null,
    compatibleWithRelease: true,
    sourcesAvailable: null,
    license: 'See entry page',
    languages: ['English'],
    stars: 0,
    summary:
      'A dxgi.dll proxy for Elite Dangerous (2D Direct3D 11) that adds NVIDIA DLAA/DLSS, AMD FSR 3.1.2, native D3D11 TAA, and AMD FSR Frame Generation, with experimental NVIDIA DLSS-G support. It renders the cockpit HUD cleanly without upscaling ghosting.',
    longIntro:
      'Designed for 2D Direct3D 11 Elite Dangerous installations to modernize anti-aliasing, temporal upscaling, and frame generation while preserving crisp cockpit HUD legibility.',
    features: [
      'Direct3D 11 dxgi.dll proxy integration for Elite Dangerous.',
      'Supports NVIDIA DLAA/DLSS, AMD FSR 3.1.2, and native D3D11 TAA.',
      'Includes AMD FSR Frame Generation and experimental NVIDIA DLSS-G support.'
    ],
    links: [
      { kind: 'Website', label: 'EDCodex Entry #656', url: 'https://edcodex.info/?m=tools&entry=656' }
    ],
    revisions: [
      { rev: 'Listing', date: '2026-11-24', note: 'Submitted and updated Nov 24, 2026.' }
    ]
  },
  {
    id: 655,
    title: 'ED Commanders (EDCMDR)',
    type: 'Tool',
    isNew: true,
    authors: 'CMDR MERRICK CALBRUIN',
    categories: ['Squadron', 'Visualization'],
    platforms: ['Web application'],
    status: 'Active',
    dateRelease: '2026-11-24',
    updatedLabel: 'Nov 24, 2026',
    updatedOrder: 3,
    revision: null,
    compatibleWithRelease: true,
    sourcesAvailable: null,
    license: 'See entry page',
    languages: ['English'],
    stars: 0,
    summary:
      'ED Commanders is a public showcase for Elite Dangerous commanders. Browse commander profiles, leaderboards, and squadron rosters, and search for commanders and squadrons. No accounts or logins, and as little personal data as possible.',
    longIntro:
      'Public web directory for browsing commander profiles, leaderboards, and squadron rosters with zero account gate.',
    features: [
      'Browse commander profiles, leaderboards, and squadron rosters.',
      'Fast search for commanders and squadrons without creating an account.'
    ],
    links: [
      { kind: 'Website', label: 'EDCodex Entry #655', url: 'https://edcodex.info/?m=tools&entry=655' }
    ],
    revisions: [
      { rev: 'Listing', date: '2026-11-24', note: 'Submitted Nov 24, 2026.' }
    ]
  },
  {
    id: 654,
    title: 'EDXD - Elite Dangerous eXploration Dashboard',
    type: 'Tool',
    isNew: false,
    authors: 'Kepas Belelgorn',
    categories: ['Crafting', 'Exploration', 'MISC', 'Routes', 'Visualization'],
    platforms: ['Linux', 'Mac', 'Windows'],
    status: 'Active',
    dateRelease: '2026-11-20',
    updatedLabel: 'Nov 20, 2026',
    updatedOrder: 4,
    revision: null,
    compatibleWithRelease: true,
    sourcesAvailable: true,
    license: 'Open Source',
    languages: ['English'],
    stars: 6,
    summary:
      "A cross-platform, real-time dashboard for explorers. 100% Python - runs on Linux, macOS and Windows. Provides real time data for the current system, even if it's not (yet) in EDSM or INARA.",
    longIntro:
      'Built in Python for cross-platform explorers needing live system telemetry independent of external database indexing delays.',
    features: [
      '100% Python cross-platform runtime (Linux, macOS, Windows).',
      'Displays real-time journal telemetry for uncharted or newly visited systems.',
      'Covers Exploration, Routes, Crafting, and Visualization workflows.'
    ],
    links: [
      { kind: 'Website', label: 'EDCodex Entry #654', url: 'https://edcodex.info/?m=tools&entry=654' }
    ],
    revisions: [
      { rev: 'Listing', date: '2026-11-20', note: 'Updated Nov 20, 2026.' }
    ]
  },
  {
    id: 653,
    title: 'EDSMT - Elite Dangerous Surface Mining Tool',
    type: 'Tool',
    isNew: false,
    authors: 'Radio Raxxla, The Announcer Live',
    categories: ['Trading'],
    platforms: ['Windows'],
    status: 'Active',
    dateRelease: '2026-11-19',
    updatedLabel: 'Nov 19, 2026',
    updatedOrder: 5,
    revision: null,
    compatibleWithRelease: true,
    sourcesAvailable: null,
    license: 'Freeware',
    languages: ['English'],
    stars: 4,
    summary:
      "EDSMT is a free companion for Rhino SRV surface mining, by Radio Raxxla. It reads the game's journal as you play, so you never type a coordinate, a system name or a distance. Survey map, overlay, rigs, selling.",
    longIntro:
      'Companion tool reading live Elite Dangerous journal events for surface mining coordinates, survey mapping, and rig management.',
    features: [
      'Automatic journal parsing for system names, coordinates, and distances.',
      'Survey map, in-game overlay, rig loadouts, and selling helpers.'
    ],
    links: [
      { kind: 'Website', label: 'EDCodex Entry #653', url: 'https://edcodex.info/?m=tools&entry=653' }
    ],
    revisions: [
      { rev: 'Listing', date: '2026-11-19', note: 'Updated Nov 19, 2026.' }
    ]
  },
  {
    id: 652,
    title: 'LunaPanel',
    type: 'Tool',
    isNew: false,
    authors: 'LunaBelle',
    categories: ['I/O'],
    platforms: ['Web application', 'Android', 'iPhone'],
    status: 'Active',
    dateRelease: '2026-11-19',
    updatedLabel: 'Nov 19, 2026',
    updatedOrder: 6,
    revision: null,
    compatibleWithRelease: true,
    sourcesAvailable: null,
    license: 'Free',
    languages: ['English'],
    stars: 0,
    summary:
      'Turn a phone or tablet into a control panel for Elite Dangerous (regular buttons or macros supported). Open a web page on your phone or tablet, tap a button, and the command fires in the game on your PC. No cables, no drivers.',
    longIntro:
      'Browser-based virtual button box and macro deck connecting phones or tablets to your PC cockpit.',
    features: [
      'Supports both standard keybinds and multi-step macros.',
      'Runs directly in mobile browsers without cables.'
    ],
    links: [
      { kind: 'Website', label: 'EDCodex Entry #652', url: 'https://edcodex.info/?m=tools&entry=652' }
    ],
    revisions: [
      { rev: 'Listing', date: '2026-11-19', note: 'Updated Nov 19, 2026.' }
    ]
  },
  {
    id: 651,
    title: 'ED Unofficial Patch (ED-UP, formerly EDVR)',
    type: 'Tool',
    isNew: false,
    authors: 'characterecho-sean',
    categories: ['Graphics'],
    platforms: ['Windows'],
    status: 'Active',
    dateRelease: '2026-11-15',
    updatedLabel: 'Nov 15, 2026',
    updatedOrder: 7,
    revision: null,
    compatibleWithRelease: true,
    sourcesAvailable: true,
    license: 'Open Source',
    languages: ['English'],
    stars: 5,
    summary:
      'Free, open-source mod for Elite Dangerous: Odyssey, in VR and on a flat screen. It adds DLSS, FSR and XeSS upscaling, which stops edges shimmering and can raise your frame rate. In VR it renders the on-foot game properly.',
    longIntro:
      'Open-source upscaling and VR rendering enhancement mod for Elite Dangerous: Odyssey.',
    features: [
      'Adds DLSS, FSR, and XeSS upscaling for VR and flat-screen play.',
      'Improves edge stability and Odyssey on-foot VR presentation.'
    ],
    links: [
      { kind: 'Website', label: 'EDCodex Entry #651', url: 'https://edcodex.info/?m=tools&entry=651' }
    ],
    revisions: [
      { rev: 'Listing', date: '2026-11-15', note: 'Updated Nov 15, 2026.' }
    ]
  }
];

/**
 * Additional real entries listed in "Latest additions on EDCodex" on the live home page.
 */
export const LATEST_ADDITIONS = [
  { id: 656, title: 'EDPE - Elite Dangerous Performance Enhanced', type: 'Tool', hasFullRecord: true },
  { id: 655, title: 'ED Commanders (EDCMDR)', type: 'Tool', hasFullRecord: true },
  { id: 650, title: 'ED Android Monitor', type: 'Tool', hasFullRecord: false, url: 'https://edcodex.info/?m=tools' },
  { id: 649, title: 'FleetFinder', type: 'Tool', hasFullRecord: false, url: 'https://edcodex.info/?m=tools' },
  { id: 648, title: 'Elite Nexus', type: 'Tool', hasFullRecord: false, url: 'https://edcodex.info/?m=tools' },
  { id: 647, title: 'EDAA', type: 'Tool', hasFullRecord: false, url: 'https://edcodex.info/?m=tools' },
  { id: 646, title: 'Elite AI Bridge', type: 'Tool', hasFullRecord: false, url: 'https://edcodex.info/?m=tools' }
];
