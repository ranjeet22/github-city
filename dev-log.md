# Developer Log

## 2026-06-15

### Changes Made
* Initialized new React + TypeScript web app using Vite.
* Installed Three.js, React Three Fiber (`@react-three/fiber`, `@react-three/drei`), Tailwind CSS v4, and Lucide React.
* Configured Tailwind CSS v4 in Vite configuration and index stylesheet.
* Created modular folder structure with `.gitkeep` placeholders to reserve directories for components, pages, game, services, hooks, utils, and types.
* Created the homepage with GitHub username input, error handling/validation, and a "Generate City" button.
* Embedded a glowing, interactive R3F 3D city scene in the homepage background to showcase visual aesthetics.
* Updated `App.tsx` to handle simple routing and state management to transition between screens.

### Files Created
* `roadmap.md`
* `dev-log.md`
* `src/pages/Home.tsx`
* `src/types/lucide-react.d.ts`
* `src/components/.gitkeep`
* `src/services/.gitkeep`
* `src/game/.gitkeep`
* `src/hooks/.gitkeep`
* `src/utils/.gitkeep`
* `src/types/.gitkeep`

### Files Modified
* `vite.config.ts`
* `package.json`
* `src/index.css`
* `src/App.tsx`

### Notes
* Used React 19 compatibilities with legacy-peer-deps for React Three Fiber.
* Configured CSS-first Tailwind CSS v4.
* Included validation for username input to ensure proper GitHub username format is entered prior to generation triggering.

## 2026-06-15 (GitHub Fetching Integration)

### Changes Made
* Implemented GitHub contribution service mapping dates to week (x: 0-52) and day-of-week (z: 0-6) coordinates.
* Handled current and longest streak calculations for the contributions calendar.
* Built a mock generator fallback that produces organic contribution waves if network fetches fail or during local/offline sandboxing.
* Added a dashboard in `Home.tsx` to display total commits, current streaks, longest streaks, and source indicators.
* Rendered a scrollable grid data table below the input form with a toggle to filter active contribution days.
* Updated `App.tsx` state to receive and process type-safe contribution grids.

### Files Created
* `src/services/github.ts`

### Files Modified
* `src/pages/Home.tsx`
* `src/App.tsx`
* `roadmap.md`

### Notes
* Complied with TypeScript's `verbatimModuleSyntax` rules by using type-only `import type` imports for `GithubUserData`.
* Mapped calendar days chronologically from the start of the week (Sunday), ensuring clean grid dimensions.

## 2026-06-15 (Procedural 3D City Generator)

### Changes Made
* Created the `CityScene.tsx` 3D component rendering contribution grid cells as 3D blocks.
* Configured procedural scaling and color schemas matching github commits:
  * 0 commits: Small slate pad
  * 1-3 commits: Small building (Emerald)
  * 4-8 commits: Medium building (Blue)
  * 9-15 commits: Skyscraper (Violet)
  * 15+ commits: Mega tower (Pink)
* Set up ambient lighting, point lights, and a directional sun light that casts diagonal shadows across buildings and ground.
* Configured a dark slate ground plane with a futuristic neon blue gridhelper.
* Integrated `@react-three/drei` OrbitControls enabling damping and camera navigation boundaries.
* Updated `App.tsx` routing to transition into the 3D City Scene when data is available, with HUD information.

### Files Created
* `src/game/CityScene.tsx`

### Files Modified
* `src/App.tsx`
* `roadmap.md`

### Notes
* Centered the entire 53x7 city block around coordinate [0,0,0] by applying midpoint offsets in weeks (26) and days (3), facilitating rotation around the city midpoint.
* Configured directional light shadows with orthographic frustum sizing and bias to prevent shadow-map acne.

## 2026-06-15 (Improved City Generation)

### Changes Made
* Refactored building layout coordinates to split the 7-day week into two symmetric blocks (Block A: days 0–2, Block B: days 3–6) separated by a 2.4-unit wide cross avenue.
* Increased week-to-week column spacing to 2.4 units, leaving streets running north-south between weeks.
* Added flat raise-pad sidewalks (size: `1.4` x `1.4` x `0.08`, dark slate) under every building and empty lot.
* Placed a double row of streetlights (cylindrical posts, horizontal armatures, lamp heads, glowing basic material bulbs) every 4 weeks along the edges of the sidewalks lining the main avenue.
* Added localized yellow `pointLight` nodes on each streetlight (non-shadow-casting to protect frame rates).
* Introduced tier-specific procedural variations:
  * Mega Towers: Double-tiered structures topped with a thin antenna spire and a flashing red warning beacon (animated via `useFrame` clock time).
  * Skyscrapers: Setback top tier decorated with vertical cyan neon facade strips.
  * Medium Buildings: Deterministic rooftop detailing rendering HVAC boxes or architectural rims.
  * Small Buildings: Standard boxes with randomized height variances (+/- 15%).
* Added a dark blue linear fog (`#020617`, near: 20, far: 85) to the Canvas scene to blend distant structures seamlessly into the background and make neon glowing facades cinematic.

### Files Created
* None

### Files Modified
* `src/game/CityScene.tsx`
* `roadmap.md`

### Notes
* Created deterministic cell randomness by seeding cell indices: `rand = Math.sin(x * 12.9 + z * 78.2) * 43758.5`.
* Solved WebGL performance choke points by setting streetlight PointLights to `castShadow={false}`, retaining shadow rendering on the main sun DirectionalLight.

## 2026-06-15 (Drivable Vehicle Controls)

### Changes Made
* Created reusable `Car.tsx` component rendering a low-poly vehicle (red chassis, black cabin, glass front screen, 4 cylindrical wheels, headlights).
* Added keydown/keyup event listeners mapped to a persistent `keys` ref (forward: W/Up, backward: S/Down, steer left: A/Left, steer right: D/Right, brake: Space).
* Implemented kinematics: velocity with acceleration, deceleration friction, hard braking, and steering yaw rates scaling with speed.
* Animates wheel rolling based on velocity and steers front wheels left/right based on keyboard directions.
* Added headlights (glowing meshes + spotLights pointing forward) and red tail lights.
* Implemented AABB sliding collision detection against all active buildings in the grid. Splitting movement into independent X and Z steps allows the car to slide smoothly along walls instead of sticking.
* Built a third-person follow camera that calculates a target behind and above the car and smoothly lerps to it, directing its lookAt target at the car's current position.
* Added a camera mode toggle to the City HUD, allowing users to switch dynamically between WASD driving mode and free OrbitControls camera mode.

### Files Created
* `src/game/Car.tsx`

### Files Modified
* `src/game/CityScene.tsx`
* `roadmap.md`

### Notes
* Tracked vehicle physics state in Refs instead of React component state to prevent costly component re-renders at 60 FPS.
* Solved type-safety checks by importing `CollisionBox` as a type-only import (`import type`) to comply with `verbatimModuleSyntax`.

## 2026-06-15 (Driving Mode Bug Fixes)

### Changes Made
* Resolved Camera Lock in Driving Mode:
  - Replaced the hardcoded camera follow position with an interactive third-person system.
  - Linked pointer events (`pointerdown`, `pointermove`, `pointerup` on `gl.domElement`) to a manual `yawOffset` and `pitch` tracking system.
  - Bound mouse wheel scrolling to a follow `distance` controller, clamped between `3.0` and `15.0` units.
  - Programmed automatic centering decay that smoothly re-aligns the camera directly behind the vehicle after 1.5 seconds of pointer inactivity while driving.
  - Constructed a 10-step linear camera ray-marching algorithm that samples coordinates from the car's focal center to the camera. If a building footprint collision is found, the camera distance is compressed to stay outside of the building's bounding box and height.
* Resolved Wheel Visual Orientation & Rotation:
  - Repositioned the 4 wheels by wrapping the raw `cylinderGeometry` meshes inside parent `<group>` containers.
  - Applied static `rotation={[0, 0, Math.PI / 2]}` on the cylinder meshes to orient their axles horizontally along the X-axis of the groups.
  - Updated the animation loops to apply rolling (`rotation.x`) and steering (`rotation.y`) transformations directly on the parent `<group>` refs, avoiding Euler axis conflicts and visual wobbles.

### Files Created
* None

### Files Modified
* `src/game/Car.tsx`
* `src/game/CityScene.tsx`

### Notes
* Maintained type-safety requirements and full compatibility with TypeScript's `verbatimModuleSyntax` rules.
* Restored smooth steering rotation and wheel rolling along the correct axles.

## 2026-06-15 (Environment Polish & UI Features)

### Changes Made
* Implemented Day/Night Toggle System:
  - Added `isNight` boolean state controlled by a dual-button grid layout in the HUD card.
  - Dynamically switches fog color (`#020617` night, `#94a3b8` day) and range properties for seamless horizon blending.
  - Modulates ambient lighting intensity (`0.15` night, `0.75` day) and directional light color/intensity (warm yellow sunlight vs cool blue moonlight).
  - Toggles point lights for neon reflections (bright at night, dim during the day).
* Added Skybox & Starfield Domes:
  - Integrated `@react-three/drei` `<Sky>` component with realistic scattering shader parameters during the day.
  - Integrated `<Stars>` particle starfield rendering 3000 fading, glowing stars during the night.
* Added PBR Reflection Effects:
  - Enabled Drei's `<Environment>` component loading `'night'` and `'sunset'` presets, wrapped inside `<Suspense fallback={null}>` for offline-safe non-blocking loads.
  - Heightened reflectivity and glossiness (`roughness={0.15}`, `metalness={0.85}`) on all building surfaces and window glass to dynamically mirror environment reflections.
* Implemented Building Windows Glow:
  - Generated a grid-like window texture programmatically using an HTML5 `CanvasTexture` (64x64px grid).
  - Programmed building meshes to clone and tile this window texture dynamically based on their specific 3D dimensions.
  - Linked emissive materials to night state, causing windows to glow warm amber (`#ffeaa7`, intensity `1.5`) only at night, and turn dark during the day.
* Integrated FPS Counter Overlay:
  - Created a lightweight HTML performance counter overlay using a `requestAnimationFrame` loop.
  - Displays real-time frame rates inside a glassmorphic pill container with a green/amber/red status light indicating performance levels.
* Updated Car Light Transitions:
  - Hooked car spotlights and taillights to the `isNight` state, enabling bright projection beams (`intensity={3.5}`) and active red tail glow only during the night.

### Files Created
* None

### Files Modified
* `src/game/Car.tsx`
* `src/game/CityScene.tsx`
* `roadmap.md`

### Notes
* Window texture generation is fully offline-ready and programmatically generated.
* Handled component suspension safely using `<Suspense>` wrapper around environment maps.

## 2026-06-15 (Daytime Sky Visual Enhancement)

### Changes Made
* Implemented Custom Gradient Sky Dome:
  - Replaced Drei's default `<Sky>` atmospheric dome with a custom `<SkyGradient>` component.
  - Renders a large sphere (radius `180`, back-side rendering) surrounding the scene.
  - Wrote a custom GLSL vertex/fragment shader that paints a vertical 3-color stop gradient based on normalized height coordinates.
  - Programmed smooth color uniform transitions in `useFrame` between Day (Horizon: `#e0f2fe`, Mid: `#7dd3fc`, Zenith: `#0284c7`) and Night (Horizon: `#020617`, Mid: `#0f172a`, Zenith: `#1e293b`).
* Implemented Drifting Clouds System:
  - Created `<Clouds>` and `<Cloud>` subcomponents that procedurally generate 12 clouds at randomized starting locations.
  - Positioned clouds at varying heights (`22` to `34` units) and scales (`0.7` to `2.2`) above the city footprint.
  - Constructed stylized low-poly clouds using clusters of 3 overlapping box meshes.
  - Added continuous X-axis drifting animations in `useFrame` with individual cloud speeds (`0.3` to `1.2` units/sec) and edge wrapping (`x > 85` wraps to `-85`).
  - Added smooth day/night opacity transition, fading clouds to a dim ghost opacity (`0.08`) at night and restoring full stylized opacity (`0.85`) during the day.
  - Enabled meshes to cast shadows, letting clouds cast subtle soft shadows onto the city floor and building roofs.

### Files Created
* None

### Files Modified
* `src/game/CityScene.tsx`

### Notes
* Starfield particles (`radius={100}`) naturally overlay in front of the sky sphere (`radius={180}`), retaining the night sky experience.
* Visual assets are purely procedural, preserving high performance and offline-compatibility.

## 2026-06-15 (Real GitHub Data Integration)

### Changes Made
* Created Secure Backend Proxy Layer:
  - Installed `express` and `dotenv` to implement the server-side API proxy.
  - Implemented `/api/github/:username` GET endpoint inside `server.js` using Node's global `fetch` (Node 18+).
  - Wired the proxy to fetch from the official GitHub GraphQL API (`https://api.github.com/graphql`) using the server-side `GITHUB_TOKEN` from the `.env` file, keeping the token hidden from the browser.
  - Flattened the contribution calendar to exactly 371 days (53 weeks * 7 days) and calculated contribution grid coordinates, `totalContributions`, `currentStreak`, and `longestStreak` on the backend.
  - Added an in-memory cache on the server (10 minutes TTL) to prevent repeated API hits and avoid rate limit blocks during sessions.
  - Configured `server.js` to serve static compiled client assets from the `dist` folder when in production mode.
* Created Concurrent Dev Server Runner:
  - Created `dev.js` utilizing native `child_process` to spin up both the Express API server (port `3001`) and the Vite dev server (port `5173`) with a single `npm run dev` execution.
* Configured Vite Proxy:
  - Modified `vite.config.ts` to proxy all frontend `/api` requests to `http://localhost:3001` in development.
* Implemented Frontend Mode Selection UI:
  - Updated `Home.tsx` to add radio button inputs letting users choose between "Real GitHub Data" and "Demo Data".
  - Made the GitHub Username optional in Demo Mode, auto-filling to "DemoUser" if left blank, while keeping it strictly required and validated in Real GitHub Mode.
  - Updated the Home dashboard stats card to display "Using Real GitHub Data" or "Using Demo Data" depending on the dataset source, and removed the "Mock Sandbox Fallback" indicator.
  - Updated `github.ts` to fetch from `/api/github/:username` in Real mode, and throw error messages back to the UI (e.g. "GitHub user ... not found") on failure instead of falling back silently.

### Files Created
* `server.js`
* `dev.js`

### Files Modified
* `package.json`
* `vite.config.ts`
* `src/services/github.ts`
* `src/pages/Home.tsx`

### Notes
* Validated security: GITHUB_TOKEN remains entirely server-side and is never exposed to frontend assets or network inspect logs.
* Backward compatibility is preserved, and the existing mock data city generation continues to work natively.

## 2026-06-15 (Express 5 Compatibility & GitHub API Debugging Fix)

### Changes Made
* Resolved Express 5 Catch-All Crash:
  - Fixed startup crash in `server.js` by changing the wildcard fallback route from `app.get('*', ...)` to `app.get('*any', ...)` to satisfy Express v5 (`path-to-regexp` v8) parameter requirements. This resolved the "API returned status 502" error caused by Vite's proxy failing to connect to the crashed backend server on port 3001.
* Enhanced Backend Error Handling:
  - Standardized error codes and messages returned by the API proxy in `server.js` to conform with user debugging requirements.
  - Returns explicit, user-friendly errors: `"GitHub token missing"`, `"GitHub token invalid"`, `"Rate limit exceeded"`, `"GitHub user not found"`, `"Contribution data unavailable"`, and `"GitHub API request failed"`.
* Verified Token and Calendar Fetching:
  - Created and executed a test verification script to perform a minimal GraphQL query and successfully fetch real contribution calendar data for `torvalds`, `gaearon`, and `sindresorhus`.

### Files Modified
* `server.js`

### Notes
* Validated that Vite correctly proxies requests from port `5174` to port `3001`.
* Non-existent users are gracefully reported as `"GitHub user not found"` with HTTP status 404.

## 2026-06-15 (Immersion & Cinematic Experience Update)

### Changes Made
* Procedural Twinkling Star Field:
  - Created a custom `<ProceduralStars>` component generating 600 stars distributed randomly on a hemisphere of radius `145` (upper hemisphere).
  - Used a single `THREE.Points` mesh for optimal rendering performance (1 draw call).
  - Programmed a low-frequency twinkling effect in `useFrame` by modulating material opacity between `0.6` and `0.9` over time.
  - Enabled stars only when in Night Mode and visible state is checked. Added `depthWrite={false}` and `blending={THREE.AdditiveBlending}` to prevent clipping conflicts.
* Custom Settings Toggles (Clouds, Fog, Stars):
  - Created `cloudsVisible`, `fogEnabled`, and `starsVisible` states.
  - Integrated conditional rendering for `<Clouds>`, `<fog>`, and `<ProceduralStars>` with immediate live response.
* Canvas Screenshot Capture (Hide HTML Overlay):
  - Added `gl={{ preserveDrawingBuffer: true }}` to the canvas properties to prevent WebGL buffer clearing.
  - Implemented `takeScreenshot` utilizing `canvas.toDataURL('image/png')` to download a PNG named `github-city-username-timestamp.png`.
  - The capture automatically contains only the clean 3D render since HTML UI overlays sit outside the canvas DOM tree.
* Cinematic Tour Camera Mode (Drone Showcase):
  - Added `'cinematic'` camera mode disabling manual car controls and rendering `<CinematicCamera>`.
  - Programmed 3 distinct drone flight paths:
    1. *Avenue Glide*: Low slow glide down the avenue.
    2. *Orbit Overview*: Panoramic orbital rotation of the city block from above.
    3. *Skyline Sweep*: Diagonal height pan showcasing spires and building setback geometries.
  - Added smooth lerp tracking for camera positions and looking targets to transition between paths without sudden jumps.
* Quick Settings panel & UI Hide Toggle:
  - Created a Display Settings control grid on the HUD card for ON/OFF toggles and action triggers.
  - Added `uiHidden` mode hiding all stats, scales, help text, and button overlays, displaying only a mini `👁 Show UI` floating button in the corner to restore visibility.

### Files Modified
* `src/game/CityScene.tsx`
* `roadmap.md`

### Notes
* Maintained high frame rates by avoiding heavy post-processing libraries and keeping custom R3F elements lightweight.
* Preserved standard keyboard driving physics and free camera orbit modes completely.

## 2026-06-15 (Game Intro & Audio Immersion Update)

### Changes Made
* Cinematic Game Intro Overlay:
  - Created a full-screen, self-contained overlay in `CityScene.tsx` displaying the high-quality logo asset `public/Logo/GITHUB CITY.png`.
  - Added modular CSS animations (`logoIntro` and `backdropIntro`) that fade in the logo (0.5s to 2.5s), hold it with a neon purple drop shadow and scale animation (2.5s to 5.0s), and fade it out along with a black backdrop (5.0s to 6.0s).
  - Unmounts the overlay completely after 6 seconds to free resources.
  - Linked `showIntro` to the scene rendering, forcing the cinematic drone camera path to settle the city view and disabling manual car controls during the intro overlay.
* Reusable Audio Manager (`src/services/audio.ts`):
  - Designed a singleton `AudioManager` wrapping HTML5 `Audio`.
  - Configured looping, soft non-distracting default volume (`0.22`), and error catching for browser autoplay policies.
  - Pauses playback automatically when unmounting `CityScene` and resumes when entering.
* Floating Sound Button & Settings Synchronicity:
  - Added a small floating sound button next to the "Exit City" back button displaying status emojis (🔊 / 🔇).
  - Integrated a `Music [ON/OFF]` button inside the Quick Settings control card, laying out all settings in a clean 2x2 grid.
  - Wired state synchronization to update both the floating header icon and settings panel immediately.
  - Saved and loaded mute preferences using `localStorage`.

### Files Created
* `src/services/audio.ts`

### Files Modified
* `src/game/CityScene.tsx`
* `roadmap.md`

### Notes
* Pre-loaded the logo asset by copying it to the static `public` directory.
* Fetched and embedded bedroom-cyberpunk ambient loop under `public/music.mp3` for offline compatibility.

## 2026-06-15 (Background Music Replacement)

### Changes Made
* Background Music Asset Swap:
  - Copied user-provided background music `City bird sounds.mp3` from the `Music` folder to `public/music.mp3`, overwriting the old bedroom-cyberpunk track.
  - Retained full integration with the existing `AudioManager` singleton, looping playback configuration, persistent localStorage mute controls, and scene transition listeners.

### Files Modified
* `public/music.mp3` (overwritten)

### Notes
* Keeps the background music offline-compatible by maintaining local references under the `public` directory.
* Confirmed successful production build compiling with the updated audio asset.

## 2026-06-15 (Prevent Vehicle Leaving the City)

### Changes Made
* Platform boundary constraints added:
  - Calculated platform size as 160x160 from `CityScene.tsx` (centered at [0,0,0], bounds: [-80, 80]).
  - Programmed bounds checks on `nextX` and `nextZ` in the movement phase of `Car.tsx` using a safety limit of `76.0` (4.0 units inside the platform edge).
  - Wired the boundary check to trigger sliding dynamics by independently constraining X and Z motion and reducing velocity by 0.35 (simulating impact absorption) when boundaries are hit.
  - Implemented boundary fallback checking in the combined corner-collision stage.

### Files Modified
* `src/game/Car.tsx`
* `roadmap.md`

### Notes
* The boundary is entirely invisible, preserving visual aesthetics.
* The vehicle stops and slides smoothly along the edges, preventing falling into empty space.

## 2026-07-30 (Mobile virtual joystick & controls responsive updates)

### Changes Made
* Mobile Virtual Joystick & Brake Controller:
  - Added touch capability check: checks for touch screen and screen width <= 1024px to target mobile/tablet users, while keeping it disabled for laptops and desktops.
  - Implemented custom React virtual touch joystick inside [Car.tsx](file:///c:/Users/lenovo/Desktop/Github%20City/src/game/Car.tsx) using Drei's `<Html>` overlay wrapper with absolute positioning.
  - Mapped normalized joystick drag values (X and Y coordinates) dynamically to the existing physics controller keys (`forward`, `backward`, `left`, `right`) with a threshold of 0.2, allowing analog-to-digital steering and acceleration mapping.
  - Added a dedicated, glassmorphic "Brake" virtual touch button in the bottom right of the screen.
  - Configured `touchAction: 'none'` on touch targets to prevent browser scroll gestures from interfering with vehicle movement.
* Responsive UI overlaps prevention:
  - Hides the bottom-left Building Class Scale legend panel on screens below 768px (`hidden md:flex` in [CityScene.tsx](file:///c:/Users/lenovo/Desktop/Github%20City/src/game/CityScene.tsx)) to avoid overlapping with the joystick overlay.

### Files Modified
* `src/game/Car.tsx`
* `src/game/CityScene.tsx`

### Notes
* Verified build compiles successfully with no TypeScript errors.
* Preserved standard WASD keyboard inputs for laptops/desktops.
