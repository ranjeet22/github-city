# GitHub City Project Roadmap

- [x] Project initialization (Vite, React, TypeScript, Tailwind CSS v4, Three.js, R3F)
- [x] Create GitHub contribution integration service (API client, mock data fallback, grid mapping, and stats UI table)
  - [x] Fix Express 5 wildcard routes and standardize API error handling (resolves 502 error)
- [x] Build procedural 3D city generator (mapping grid contribution cells to R3F buildings, shadows, lighting, orbit controls)
- [x] Improve city generation (roads, sidewalks, streetlights, city blocks, building variations, fog)
- [ ] Add landmarks representing repositories, languages, and achievements
- [x] Implement player movement and vehicle controls (drivable Car, WASD keyboard physics, AABB building collisions, and invisible platform boundaries)
- [x] Implement camera views and smooth follow behavior (3D third-person follow camera, smooth camera lerps)
- [x] Add visual polish (glowing materials, weather/time-of-day cycles, shaders)
  - [x] Add settings toggles (clouds, fog, stars), screenshot capture, and cinematic drone tour camera
- [ ] Optimize 3D performance (instanced rendering, lazy-loading, draw call minimization)
- [ ] Build interactive UI overlays, dashboard stats, and achievement systems
- [x] Add sound effects and ambient synthwave soundtrack
  - [x] Integrate HTML5 background music loop, persistent AudioManager, and cinematic game intro overlay
