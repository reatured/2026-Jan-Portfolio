import type { LegacyProjectContent } from "./legacy-project-types"

// Generated from the January portfolio by scripts/import-legacy-projects.py.
// Editorial mappings and exclusions are recorded in scripts/legacy-project-editorial.json.
export const legacyProjects: Record<string, LegacyProjectContent> = {
  "realhand-teleop": {
    "sourceId": "28",
    "sourceSlug": "real-time-3d-robot-hand-control",
    "title": "Robot Hand Real-Time Teleoperation Interface",
    "subtitle": "Real-Time Teleoperation via Computer Vision and URDF Control",
    "discipline": "robotics engineer / perception & cv engineer",
    "study": {
      "overview": "A browser demo that maps camera-tracked hand movement to 31 articulated robot hand models.",
      "role": "Software Engineer at RealHand",
      "ownership": "Software Engineer at RealHand",
      "features": [],
      "delivery": [],
      "media": {
        "src": "/flag-realhand.jpg",
        "width": 1600,
        "height": 900,
        "alt": "Robot Hand Real-Time Teleoperation Interface — original project image",
        "caption": "RealHand browser demo"
      }
    },
    "notes": [
      {
        "heading": "Camera → joints → 3D",
        "items": [
          "MediaPipe Hands extracts 21 hand landmarks from the webcam feed.",
          "The mapping layer converts 3D keypoint positions into joint rotations for URDF models with different link geometries and joint hierarchies.",
          "React and Zustand keep the camera, model controls, and shared scene state connected."
        ]
      },
      {
        "heading": "Browser stack",
        "items": [
          "React, Zustand, Three.js, React Three Fiber, React Three Drei, URDF models, MediaPipe Hands.",
          "Radix UI and Tailwind CSS for the interface; GitHub Actions for delivery."
        ]
      }
    ],
    "media": [
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/xwrGzC8Z14s",
        "sourceUrl": "https://www.youtube.com/watch?v=xwrGzC8Z14s",
        "caption": "RealHand browser hand demo",
        "thumbnail": "/flag-realhand.jpg"
      }
    ],
    "links": [
      {
        "label": "Try live demo",
        "href": "https://www.realhand.com/demo"
      },
      {
        "label": "YouTube Demo",
        "href": "https://www.youtube.com/watch?v=xwrGzC8Z14s"
      }
    ],
    "year": 2025
  },
  "ar-drawing": {
    "sourceId": "02",
    "sourceSlug": "ar-drawing-tool",
    "title": "AR Drawing Tool",
    "subtitle": "Real-Time Hand Tracking to Procedural 3D Geometry Pipeline",
    "discipline": "perception & cv engineer",
    "study": {
      "overview": "Hand gestures become textured 3D strokes on Spectacles, backed by a reusable procedural mesh plugin.",
      "role": "AR Engine Engineer Intern at Snap Inc.",
      "ownership": "AR Engine Engineer Intern at Snap Inc.",
      "features": [],
      "delivery": [],
      "media": {
        "src": "/projects/archive/aad27f594d40b586-thumb.webp",
        "width": 1920,
        "height": 1080,
        "alt": "AR Drawing Tool — original project image",
        "caption": "AR Drawing Tool"
      }
    },
    "notes": [
      {
        "heading": "From hand path to mesh",
        "items": [
          "Read finger joint positions with the Lens Studio hand tracking API.",
          "Construct triangle strips along the tracked trajectory, with normals and UV coordinates for rendering.",
          "Filter and smooth tracking jitter before producing the drawing geometry."
        ]
      },
      {
        "heading": "Drawing experiments",
        "items": [
          "Explore six procedural creation variants, random colors, and customized textures.",
          "Keep textures stable as the mesh changes; the gallery includes the resolved texture-shifting experiment.",
          "Test erase mode on Spectacles and publish the Lens with a Snapcode."
        ]
      },
      {
        "heading": "Reusable developer tools",
        "paragraphs": [
          "Built the configurable JavaScript mesh plugin and accompanying official developer guide, samples, tutorials, recordings, and code examples. The drawing Lens reached 200K plays and views in its first month."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/aad27f594d40b586.webp",
        "thumbnail": "/projects/archive/aad27f594d40b586-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "AR Drawing Tool"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/1A2lCiQwVko",
        "sourceUrl": "https://www.youtube.com/watch?v=1A2lCiQwVko",
        "caption": "AR Drawing Tool Demo - Snap Inc. Internship",
        "thumbnail": "/projects/archive/aad27f594d40b586-thumb.webp"
      },
      {
        "type": "video",
        "src": "/projects/archive/6b6225f555100cce.mp4",
        "thumbnail": "/projects/archive/6b6225f555100cce-thumb.webp",
        "width": 500,
        "height": 266,
        "animated": true,
        "caption": "Procedural mesh creation — early variant"
      },
      {
        "type": "video",
        "src": "/projects/archive/b8083eb10eb2c08f.mp4",
        "thumbnail": "/projects/archive/b8083eb10eb2c08f-thumb.webp",
        "width": 500,
        "height": 266,
        "animated": true,
        "caption": "Procedural mesh creation — second variant"
      },
      {
        "type": "video",
        "src": "/projects/archive/4b5fc3b58952c527.mp4",
        "thumbnail": "/projects/archive/4b5fc3b58952c527-thumb.webp",
        "width": 480,
        "height": 312,
        "animated": true,
        "caption": "Procedural mesh creation — variant 5"
      },
      {
        "type": "video",
        "src": "/projects/archive/ad88d5fe2790ac57.mp4",
        "thumbnail": "/projects/archive/ad88d5fe2790ac57-thumb.webp",
        "width": 320,
        "height": 586,
        "animated": true,
        "caption": "Procedural mesh creation — variant 3"
      },
      {
        "type": "video",
        "src": "/projects/archive/a7178037ca373720.mp4",
        "thumbnail": "/projects/archive/a7178037ca373720-thumb.webp",
        "width": 254,
        "height": 468,
        "animated": true,
        "caption": "Procedural mesh creation — variant 6"
      },
      {
        "type": "video",
        "src": "/projects/archive/ba64e460a232b678.mp4",
        "thumbnail": "/projects/archive/ba64e460a232b678-thumb.webp",
        "width": 320,
        "height": 572,
        "animated": true,
        "caption": "Procedural mesh creation — variant 4"
      },
      {
        "type": "video",
        "src": "/projects/archive/676d1a8f66ae2824.mp4",
        "thumbnail": "/projects/archive/676d1a8f66ae2824-thumb.webp",
        "width": 254,
        "height": 468,
        "animated": true,
        "caption": "Random color generation across the procedural mesh"
      },
      {
        "type": "video",
        "src": "/projects/archive/c70ad42a57594184.mp4",
        "thumbnail": "/projects/archive/c70ad42a57594184-thumb.webp",
        "width": 254,
        "height": 468,
        "animated": true,
        "caption": "Drawing with customized textures applied"
      },
      {
        "type": "video",
        "src": "/projects/archive/b14c0745f28af628.mp4",
        "thumbnail": "/projects/archive/b14c0745f28af628-thumb.webp",
        "width": 254,
        "height": 468,
        "animated": true,
        "caption": "Texture shifting artifact resolved"
      },
      {
        "type": "video",
        "src": "/projects/archive/4ec01710995a4032.mp4",
        "thumbnail": "/projects/archive/4ec01710995a4032-thumb.webp",
        "width": 800,
        "height": 598,
        "animated": true,
        "caption": "Erase mode tested on Snapchat Spectacles"
      },
      {
        "type": "image",
        "src": "/projects/archive/4473d1bc400de748.webp",
        "thumbnail": "/projects/archive/4473d1bc400de748-thumb.webp",
        "width": 320,
        "height": 320,
        "caption": "Snapcode for the published lens"
      },
      {
        "type": "image",
        "src": "/projects/archive/d299f43678bb5c90.webp",
        "thumbnail": "/projects/archive/d299f43678bb5c90-thumb.webp",
        "width": 315,
        "height": 2560,
        "caption": "AR Drawing18"
      }
    ],
    "links": [
      {
        "label": "Demo Video",
        "href": "https://youtu.be/1A2lCiQwVko"
      },
      {
        "label": "Official Docs",
        "href": "https://developers.snap.com/lens-studio/4.55.1/references/guides/lens-features/scene-set-up/3d/procedural-mesh"
      }
    ],
    "year": 2022
  },
  "glass-bridge": {
    "sourceId": "26",
    "sourceSlug": "snapchat-turn-based-endless-runner",
    "title": "Snapchat Glass Bridge Challenge",
    "subtitle": "A turn-based glass-bridge game played through Snapchat messages.",
    "discipline": "xr developer / game developer",
    "study": {
      "overview": "A Squid Game-inspired, turn-based endless runner played asynchronously through Snapchat messages.",
      "role": "Lens Studio Developer · System Design",
      "ownership": "Lens Studio Developer · System Design",
      "features": [
        {
          "title": "Turn manager",
          "contribution": "Built a custom game manager around Lens Studio’s turn-based features.",
          "stack": [
            "Lens Studio",
            "TypeScript ES2019"
          ]
        },
        {
          "title": "Async competition",
          "contribution": "Designed turns and message passing so friends compete without playing at the same time.",
          "stack": [
            "Async multiplayer",
            "Snapchat messaging"
          ]
        },
        {
          "title": "Modular gameplay",
          "contribution": "Separated the game stages and systems with an event-driven handler pattern.",
          "stack": [
            "Handler pattern",
            "Events"
          ]
        },
        {
          "title": "Player identity",
          "contribution": "Integrated Bitmoji so the player avatar feels native to Snapchat.",
          "stack": [
            "Bitmoji SDK",
            "Lens Studio"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Platform",
          "value": "Snapchat"
        },
        {
          "label": "Mode",
          "value": "Turn-based multiplayer"
        },
        {
          "label": "Output",
          "value": "Published Lens"
        }
      ],
      "media": {
        "src": "/projects/archive/74c63d38a9e5cfbb-thumb.webp",
        "width": 960,
        "height": 540,
        "alt": "Snapchat Glass Bridge Challenge — original project image",
        "caption": "Snapchat Glass Bridge Challenge"
      }
    },
    "notes": [
      {
        "heading": "Two-player loop",
        "items": [
          "Player 1 attempts the bridge until success; the game records the number of attempts.",
          "Share the challenge and game data through a Snapchat message.",
          "Player 2 receives the same challenge; fewer attempts wins.",
          "Sessions target two to three minutes in a Bitmoji fantasy world."
        ]
      },
      {
        "heading": "Game-manager architecture",
        "items": [
          "TurnBasedHandler.ts owns turn logic and multiplayer data.",
          "LevelHandler.ts generates platforms and levels.",
          "UIHandler.ts manages interface states.",
          "TurnBasedBlock.ts handles block collisions."
        ]
      },
      {
        "heading": "Events and handlers",
        "paragraphs": [
          "Handlers communicate through the GameManager and events instead of direct references. An event bus coordinates stage transitions, with listeners registered and removed as stages start and end. The architecture is intended to support more complex mechanics and future async games."
        ]
      },
      {
        "heading": "Prototype milestones",
        "items": [
          "Early prototype: endless platform rows, each with one safe block and one fake block.",
          "August 29, 2025: added models and UI; two-player Snapchat data transfer updated the receiving player’s interface.",
          "September 3, 2025: explored endless levels with additional rows. Cooperative replay and competitive attempts/distance were alternative directions under consideration."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/74c63d38a9e5cfbb.webp",
        "thumbnail": "/projects/archive/74c63d38a9e5cfbb-thumb.webp",
        "width": 960,
        "height": 540,
        "caption": "Snapchat Glass Bridge Challenge"
      },
      {
        "type": "image",
        "src": "/projects/archive/d8f9c00c968d9046.webp",
        "thumbnail": "/projects/archive/d8f9c00c968d9046-thumb.webp",
        "width": 960,
        "height": 540,
        "caption": "Snapchat Glass Bridge Challenge - Image 1"
      },
      {
        "type": "image",
        "src": "/projects/archive/ea7825cd5b466d3d.webp",
        "thumbnail": "/projects/archive/ea7825cd5b466d3d-thumb.webp",
        "width": 832,
        "height": 1248,
        "caption": "Snapchat Glass Bridge Challenge - Image 2"
      },
      {
        "type": "image",
        "src": "/projects/archive/f4f320097f69e3ec.webp",
        "thumbnail": "/projects/archive/f4f320097f69e3ec-thumb.webp",
        "width": 2432,
        "height": 2560,
        "caption": "Snapchat Glass Bridge Challenge - Image 3"
      },
      {
        "type": "image",
        "src": "/projects/archive/978721fab94b667a.webp",
        "thumbnail": "/projects/archive/978721fab94b667a-thumb.webp",
        "width": 2494,
        "height": 1714,
        "caption": "Snapchat Glass Bridge Challenge - Image 4"
      },
      {
        "type": "image",
        "src": "/projects/archive/0dd524769daa7a8e.webp",
        "thumbnail": "/projects/archive/0dd524769daa7a8e-thumb.webp",
        "width": 1179,
        "height": 2556,
        "caption": "Snapchat Glass Bridge Challenge - Image 5"
      },
      {
        "type": "video",
        "src": "/projects/archive/0b2044d569f21311.mp4",
        "thumbnail": "/projects/archive/0b2044d569f21311-thumb.webp",
        "width": 480,
        "height": 848,
        "caption": "Snapchat Glass Bridge Challenge - Video"
      },
      {
        "type": "video",
        "src": "/projects/archive/71476386e74118c7.mp4",
        "thumbnail": "/projects/archive/71476386e74118c7-thumb.webp",
        "width": 480,
        "height": 848,
        "caption": "Snapchat Glass Bridge Challenge - Video"
      },
      {
        "type": "video",
        "src": "/projects/archive/6a8fbcc362b3c2ac.mp4",
        "thumbnail": "/projects/archive/6a8fbcc362b3c2ac-thumb.webp",
        "width": 480,
        "height": 848,
        "caption": "Snapchat Glass Bridge Challenge - Video"
      },
      {
        "type": "video",
        "src": "/projects/archive/d99a3999fcc3dfdd.mp4",
        "thumbnail": "/projects/archive/d99a3999fcc3dfdd-thumb.webp",
        "width": 480,
        "height": 848,
        "caption": "Snapchat Glass Bridge Challenge - Video"
      }
    ],
    "links": [],
    "year": 2025
  },
  "gogreennext": {
    "sourceId": "29",
    "sourceSlug": "gogreennext-modular-map-tiles",
    "title": "GoGreenNext - Modular Map Tiles",
    "subtitle": "3D Modeling for NYU Game Project",
    "discipline": "3d designer",
    "study": {
      "overview": "A reusable environment tile kit for an NYU game team, built for fast level assembly and consistent landscapes.",
      "role": "3D Artist · Environment Design",
      "ownership": "3D Artist · Environment Design",
      "features": [
        {
          "title": "Modular geometry",
          "contribution": "Modeled tiles with standardized dimensions and matching edges.",
          "stack": [
            "Blender",
            "Modular modeling"
          ]
        },
        {
          "title": "Grid assembly",
          "contribution": "Designed the pieces to connect cleanly in a grid-based level-building workflow.",
          "stack": [
            "Grid layout",
            "Edge matching"
          ]
        },
        {
          "title": "Environment variation",
          "contribution": "Created terrain, vegetation, and structural variations without losing the kit’s common visual language.",
          "stack": [
            "Blender",
            "Environment art"
          ]
        },
        {
          "title": "Game-ready assets",
          "contribution": "Prepared low-poly geometry, UVs, and exportable pieces for integration into the team’s game engine.",
          "stack": [
            "Blender",
            "UV mapping",
            "Low-poly modeling"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Team",
          "value": "NYU game project"
        },
        {
          "label": "Tool",
          "value": "Blender"
        },
        {
          "label": "Output",
          "value": "Modular map-tile collection"
        }
      ],
      "media": {
        "src": "/projects/archive/592235028a1e8b86-thumb.webp",
        "width": 1500,
        "height": 852,
        "alt": "GoGreenNext - Modular Map Tiles — original project image",
        "caption": "Modular Map Tiles"
      }
    },
    "notes": [
      {
        "heading": "Tile families",
        "items": [
          "Base tiles: ground, grass, and dirt paths.",
          "Corners: 90-degree turns and transitions.",
          "Junctions: T-intersections and crossroads.",
          "Edges: map borders and boundaries.",
          "Features: trees, rocks, and structures."
        ]
      },
      {
        "heading": "Production workflow",
        "items": [
          "Define a standardized grid template.",
          "Model base geometry in Blender.",
          "Create terrain, path, and structure variations.",
          "Test edge matching and connections.",
          "Export assets for game-engine integration."
        ]
      },
      {
        "heading": "System constraints",
        "items": [
          "Consistent scale, proportions, and snappable alignment.",
          "Low-poly geometry for game performance.",
          "UV mapping for texture flexibility.",
          "Geometry prepared for level-of-detail variants."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/592235028a1e8b86.webp",
        "thumbnail": "/projects/archive/592235028a1e8b86-thumb.webp",
        "width": 1500,
        "height": 852,
        "caption": "Modular Map Tiles"
      },
      {
        "type": "image",
        "src": "/projects/archive/28d459280371c809.webp",
        "thumbnail": "/projects/archive/28d459280371c809-thumb.webp",
        "width": 1446,
        "height": 1053,
        "caption": "GoGreenNext - Modular Map Tiles - Image 1"
      },
      {
        "type": "image",
        "src": "/projects/archive/b6e0181b762dc803.webp",
        "thumbnail": "/projects/archive/b6e0181b762dc803-thumb.webp",
        "width": 799,
        "height": 1032,
        "caption": "GoGreenNext - Modular Map Tiles - Image 2"
      },
      {
        "type": "image",
        "src": "/projects/archive/91420571403b589c.webp",
        "thumbnail": "/projects/archive/91420571403b589c-thumb.webp",
        "width": 1951,
        "height": 1108,
        "caption": "GoGreenNext - Modular Map Tiles - Image 3"
      },
      {
        "type": "image",
        "src": "/projects/archive/a98cd43ad045f103.webp",
        "thumbnail": "/projects/archive/a98cd43ad045f103-thumb.webp",
        "width": 1999,
        "height": 1602,
        "caption": "GoGreenNext - Modular Map Tiles - Image 4"
      },
      {
        "type": "image",
        "src": "/projects/archive/9ff9463ad4553418.webp",
        "thumbnail": "/projects/archive/9ff9463ad4553418-thumb.webp",
        "width": 1114,
        "height": 1718,
        "caption": "GoGreenNext - Modular Map Tiles - Image 5"
      },
      {
        "type": "image",
        "src": "/projects/archive/b40075b0632297e9.webp",
        "thumbnail": "/projects/archive/b40075b0632297e9-thumb.webp",
        "width": 845,
        "height": 525,
        "caption": "GoGreenNext - Modular Map Tiles - Image 6"
      },
      {
        "type": "image",
        "src": "/projects/archive/601d5e58994387b9.webp",
        "thumbnail": "/projects/archive/601d5e58994387b9-thumb.webp",
        "width": 1999,
        "height": 1367,
        "caption": "GoGreenNext - Modular Map Tiles - Image 7"
      },
      {
        "type": "image",
        "src": "/projects/archive/2f5bc19ce7e15f70.webp",
        "thumbnail": "/projects/archive/2f5bc19ce7e15f70-thumb.webp",
        "width": 1999,
        "height": 1482,
        "caption": "GoGreenNext - Modular Map Tiles - Image 8"
      },
      {
        "type": "image",
        "src": "/projects/archive/63d969e847806cb3.webp",
        "thumbnail": "/projects/archive/63d969e847806cb3-thumb.webp",
        "width": 1999,
        "height": 1506,
        "caption": "GoGreenNext - Modular Map Tiles - Image 9"
      },
      {
        "type": "image",
        "src": "/projects/archive/edaf1e1a7cd604d6.webp",
        "thumbnail": "/projects/archive/edaf1e1a7cd604d6-thumb.webp",
        "width": 849,
        "height": 1999,
        "caption": "GoGreenNext - Modular Map Tiles - Image 10"
      },
      {
        "type": "image",
        "src": "/projects/archive/27cf2d2d7c13d05e.webp",
        "thumbnail": "/projects/archive/27cf2d2d7c13d05e-thumb.webp",
        "width": 1999,
        "height": 1792,
        "caption": "GoGreenNext - Modular Map Tiles - Image 11"
      },
      {
        "type": "image",
        "src": "/projects/archive/4d1dac40d11dffac.webp",
        "thumbnail": "/projects/archive/4d1dac40d11dffac-thumb.webp",
        "width": 1844,
        "height": 1999,
        "caption": "GoGreenNext - Modular Map Tiles - Image 12"
      },
      {
        "type": "image",
        "src": "/projects/archive/b7c1e74819ea0897.webp",
        "thumbnail": "/projects/archive/b7c1e74819ea0897-thumb.webp",
        "width": 1999,
        "height": 1250,
        "caption": "GoGreenNext - Modular Map Tiles - Image 13"
      },
      {
        "type": "image",
        "src": "/projects/archive/b8192cd7842d4053.webp",
        "thumbnail": "/projects/archive/b8192cd7842d4053-thumb.webp",
        "width": 1632,
        "height": 1454,
        "caption": "GoGreenNext - Modular Map Tiles - Image 14"
      },
      {
        "type": "image",
        "src": "/projects/archive/ca9933fe3c3dd631.webp",
        "thumbnail": "/projects/archive/ca9933fe3c3dd631-thumb.webp",
        "width": 1999,
        "height": 1605,
        "caption": "GoGreenNext - Modular Map Tiles - Image 15"
      },
      {
        "type": "image",
        "src": "/projects/archive/7cb0a76e2c6ab4ea.webp",
        "thumbnail": "/projects/archive/7cb0a76e2c6ab4ea-thumb.webp",
        "width": 550,
        "height": 345,
        "caption": "GoGreenNext - Modular Map Tiles - Image 16"
      },
      {
        "type": "image",
        "src": "/projects/archive/2692f2a96d7a9a50.webp",
        "thumbnail": "/projects/archive/2692f2a96d7a9a50-thumb.webp",
        "width": 1930,
        "height": 1476,
        "caption": "GoGreenNext - Modular Map Tiles - Image 17"
      },
      {
        "type": "image",
        "src": "/projects/archive/7a04cc729f32768c.webp",
        "thumbnail": "/projects/archive/7a04cc729f32768c-thumb.webp",
        "width": 1999,
        "height": 1988,
        "caption": "GoGreenNext - Modular Map Tiles - Image 18"
      },
      {
        "type": "image",
        "src": "/projects/archive/4099501db02d029d.webp",
        "thumbnail": "/projects/archive/4099501db02d029d-thumb.webp",
        "width": 1974,
        "height": 1830,
        "caption": "GoGreenNext - Modular Map Tiles - Image 19"
      },
      {
        "type": "image",
        "src": "/projects/archive/455a56a495962ae5.webp",
        "thumbnail": "/projects/archive/455a56a495962ae5-thumb.webp",
        "width": 1881,
        "height": 1999,
        "caption": "GoGreenNext - Modular Map Tiles - Image 20"
      },
      {
        "type": "image",
        "src": "/projects/archive/1495c2e9dd465654.webp",
        "thumbnail": "/projects/archive/1495c2e9dd465654-thumb.webp",
        "width": 1807,
        "height": 1999,
        "caption": "GoGreenNext - Modular Map Tiles - Image 21"
      },
      {
        "type": "image",
        "src": "/projects/archive/7421592b228d7925.webp",
        "thumbnail": "/projects/archive/7421592b228d7925-thumb.webp",
        "width": 1706,
        "height": 1342,
        "caption": "GoGreenNext - Modular Map Tiles - Image 22"
      },
      {
        "type": "image",
        "src": "/projects/archive/1fddc3b06868cf13.webp",
        "thumbnail": "/projects/archive/1fddc3b06868cf13-thumb.webp",
        "width": 723,
        "height": 686,
        "caption": "GoGreenNext - Modular Map Tiles - Image 23"
      },
      {
        "type": "image",
        "src": "/projects/archive/758d601b44203725.webp",
        "thumbnail": "/projects/archive/758d601b44203725-thumb.webp",
        "width": 592,
        "height": 367,
        "caption": "GoGreenNext - Modular Map Tiles - Image 24"
      },
      {
        "type": "image",
        "src": "/projects/archive/a117de4657158033.webp",
        "thumbnail": "/projects/archive/a117de4657158033-thumb.webp",
        "width": 1999,
        "height": 1984,
        "caption": "GoGreenNext - Modular Map Tiles - Image 25"
      },
      {
        "type": "image",
        "src": "/projects/archive/ab2b37f112744afa.webp",
        "thumbnail": "/projects/archive/ab2b37f112744afa-thumb.webp",
        "width": 1999,
        "height": 1831,
        "caption": "GoGreenNext - Modular Map Tiles - Image 26"
      },
      {
        "type": "image",
        "src": "/projects/archive/6ba62b77e9ed7b8f.webp",
        "thumbnail": "/projects/archive/6ba62b77e9ed7b8f-thumb.webp",
        "width": 880,
        "height": 486,
        "caption": "GoGreenNext - Modular Map Tiles - Image 27"
      },
      {
        "type": "image",
        "src": "/projects/archive/8aa10c5d1e8bd757.webp",
        "thumbnail": "/projects/archive/8aa10c5d1e8bd757-thumb.webp",
        "width": 1999,
        "height": 1741,
        "caption": "GoGreenNext - Modular Map Tiles - Image 28"
      },
      {
        "type": "image",
        "src": "/projects/archive/ac83c17e744170c4.webp",
        "thumbnail": "/projects/archive/ac83c17e744170c4-thumb.webp",
        "width": 1999,
        "height": 1662,
        "caption": "GoGreenNext - Modular Map Tiles - Image 29"
      },
      {
        "type": "image",
        "src": "/projects/archive/9bf163b7f9d6b8cb.webp",
        "thumbnail": "/projects/archive/9bf163b7f9d6b8cb-thumb.webp",
        "width": 1999,
        "height": 1904,
        "caption": "GoGreenNext - Modular Map Tiles - Image 30"
      },
      {
        "type": "image",
        "src": "/projects/archive/8e28ad43adf74eb4.webp",
        "thumbnail": "/projects/archive/8e28ad43adf74eb4-thumb.webp",
        "width": 1999,
        "height": 1611,
        "caption": "GoGreenNext - Modular Map Tiles - Image 31"
      },
      {
        "type": "image",
        "src": "/projects/archive/dd6491d610fb5c04.webp",
        "thumbnail": "/projects/archive/dd6491d610fb5c04-thumb.webp",
        "width": 1999,
        "height": 1683,
        "caption": "GoGreenNext - Modular Map Tiles - Image 32"
      },
      {
        "type": "image",
        "src": "/projects/archive/dbd81cb57a1a5f07.webp",
        "thumbnail": "/projects/archive/dbd81cb57a1a5f07-thumb.webp",
        "width": 1999,
        "height": 1614,
        "caption": "GoGreenNext - Modular Map Tiles - Image 33"
      },
      {
        "type": "image",
        "src": "/projects/archive/bdfcee288ebd101b.webp",
        "thumbnail": "/projects/archive/bdfcee288ebd101b-thumb.webp",
        "width": 1999,
        "height": 1558,
        "caption": "GoGreenNext - Modular Map Tiles - Image 34"
      },
      {
        "type": "image",
        "src": "/projects/archive/e834b58aea87e980.webp",
        "thumbnail": "/projects/archive/e834b58aea87e980-thumb.webp",
        "width": 1706,
        "height": 1184,
        "caption": "GoGreenNext - Modular Map Tiles - Image 35"
      },
      {
        "type": "image",
        "src": "/projects/archive/22e7fd8e05732245.webp",
        "thumbnail": "/projects/archive/22e7fd8e05732245-thumb.webp",
        "width": 1220,
        "height": 1704,
        "caption": "GoGreenNext - Modular Map Tiles - Image 36"
      },
      {
        "type": "image",
        "src": "/projects/archive/b8977e22aaba8e5b.webp",
        "thumbnail": "/projects/archive/b8977e22aaba8e5b-thumb.webp",
        "width": 1948,
        "height": 1999,
        "caption": "GoGreenNext - Modular Map Tiles - Image 37"
      },
      {
        "type": "image",
        "src": "/projects/archive/30a2501016c99cda.webp",
        "thumbnail": "/projects/archive/30a2501016c99cda-thumb.webp",
        "width": 810,
        "height": 486,
        "caption": "GoGreenNext - Modular Map Tiles - Image 38"
      },
      {
        "type": "image",
        "src": "/projects/archive/e615b076470ea985.webp",
        "thumbnail": "/projects/archive/e615b076470ea985-thumb.webp",
        "width": 618,
        "height": 319,
        "caption": "GoGreenNext - Modular Map Tiles - Image 39"
      }
    ],
    "links": [],
    "year": 2025
  },
  "curaloop": {
    "sourceId": "27",
    "sourceSlug": "curaloop-ai-companion",
    "title": "CuraLoop: AI Companion for Alzheimer's Care",
    "subtitle": "Real-Time AI Pipeline with Human-in-the-Loop Monitoring",
    "discipline": "full stack engineer",
    "study": {
      "overview": "A one-day hackathon prototype using AI chat and games to surface behavioral trends for Alzheimer’s caregivers to review.",
      "role": "Full Stack / AI Integration · 3-person hackathon team",
      "ownership": "Full Stack / AI Integration · 3-person hackathon team",
      "features": [
        {
          "title": "Chat & game input",
          "contribution": "Built the mobile interaction and captured chat patterns and game performance for review.",
          "stack": [
            "React Native",
            "TypeScript",
            "Expo"
          ]
        },
        {
          "title": "AI trend pipeline",
          "contribution": "Connected behavioral signals to a FastAPI inference layer that produces trend summaries.",
          "stack": [
            "FastAPI",
            "Python",
            "Claude Sonnet"
          ]
        },
        {
          "title": "Human review",
          "contribution": "Designed the reviewer workflow so people can inspect, confirm, or override AI suggestions.",
          "stack": [
            "Human-in-the-loop",
            "Trend analysis"
          ]
        },
        {
          "title": "Hackathon delivery",
          "contribution": "Integrated the interface and backend into a deployed demo during the Seattle Humans & AI hackathon.",
          "stack": [
            "Vercel",
            "Full stack integration"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Event",
          "value": "Humans & AI · Seattle"
        },
        {
          "label": "Sprint",
          "value": "6 hours · 3-person team"
        },
        {
          "label": "Format",
          "value": "Caregiver-support prototype"
        }
      ],
      "media": {
        "src": "/projects/archive/2632a0f8911f118f-thumb.webp",
        "width": 528,
        "height": 999,
        "alt": "CuraLoop: AI Companion for Alzheimer's Care — original project image",
        "caption": "CuraLoop: AI Companion for Alzheimer's Care"
      }
    },
    "notes": [
      {
        "heading": "Patient-facing prototype",
        "items": [
          "Senior-friendly home screen with large controls for check-ins, games, chat, progress, and reminders.",
          "Daily memory and orientation questions establish a longitudinal record.",
          "Claude Sonnet chat explores memory prompts, conversation history, emotional tone, and gentle redirection."
        ]
      },
      {
        "heading": "Cognitive games",
        "items": [
          "Memory matching, pattern recognition, word recall, visual-spatial puzzles, and attention activities.",
          "Game performance and difficulty feed the prototype’s behavioral trend analysis."
        ]
      },
      {
        "heading": "Reviewer workflow",
        "items": [
          "Present activity logs, conversation transcripts, cognitive trends, and emotional indicators for a doctor or caregiver to review.",
          "Flag trends for human confirmation; minor changes are logged, while major alerts require approval.",
          "The product concept includes plan revisions and report exports after review."
        ]
      },
      {
        "heading": "Data and feedback loop",
        "paragraphs": [
          "User interactions → timestamped logging → AI trend analysis → proposed alerts → human review → approved changes → future feedback. This describes the hackathon prototype’s intended caregiver workflow."
        ]
      },
      {
        "heading": "Mobile and backend architecture",
        "items": [
          "React Native, TypeScript, and Expo for check-ins, games, chat, alerts, and offline synchronization.",
          "FastAPI/Python for user management, analytics, alert generation, and the reviewer API.",
          "Claude Sonnet for conversations and trend summaries; Vercel for the demo deployment."
        ]
      },
      {
        "heading": "Six-hour implementation sprint",
        "items": [
          "A three-person team built the prototype during a one-day Seattle hackathon.",
          "Streaming Claude responses and client-side caching reduced perceived response latency.",
          "Rolling averages and anomaly detection supported the trend prototype within the time limit.",
          "Tiered alerts maintained a human review step for major changes."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/2632a0f8911f118f.webp",
        "thumbnail": "/projects/archive/2632a0f8911f118f-thumb.webp",
        "width": 528,
        "height": 999,
        "caption": "CuraLoop: AI Companion for Alzheimer's Care"
      },
      {
        "type": "image",
        "src": "/projects/archive/f621d8f9d6b2a889.webp",
        "thumbnail": "/projects/archive/f621d8f9d6b2a889-thumb.webp",
        "width": 528,
        "height": 999,
        "caption": "CuraLoop: AI Companion for Alzheimer's Care - Image 2"
      },
      {
        "type": "image",
        "src": "/projects/archive/6b98d947314c4e00.webp",
        "thumbnail": "/projects/archive/6b98d947314c4e00-thumb.webp",
        "width": 528,
        "height": 999,
        "caption": "CuraLoop: AI Companion for Alzheimer's Care - Image 3"
      },
      {
        "type": "image",
        "src": "/projects/archive/9ab4cb80b2a76809.webp",
        "thumbnail": "/projects/archive/9ab4cb80b2a76809-thumb.webp",
        "width": 528,
        "height": 999,
        "caption": "CuraLoop: AI Companion for Alzheimer's Care - Image 4"
      }
    ],
    "links": [
      {
        "label": "Live Demo",
        "href": "https://chatbot-app-three-beta.vercel.app/"
      },
      {
        "label": "GitHub Repo",
        "href": "https://github.com/reatured/Oct-4-Hackathon-2025-"
      }
    ],
    "year": 2025
  },
  "b612": {
    "sourceId": "23",
    "sourceSlug": "b612-soccer",
    "title": "B612 Soccer",
    "subtitle": "Minimalist 2-player soccer on a looping planet — solo-built in 48 hours for GMTK 2025 (Top 2%)",
    "discipline": "game developer",
    "study": {
      "overview": "Two players kick a ball around a looping planet. A shot can orbit the world and return as an unexpected goal.",
      "role": "Solo Developer · Game Design · Illustration",
      "ownership": "Solo Developer · Game Design · Illustration",
      "features": [
        {
          "title": "Planet physics",
          "contribution": "Built circular movement, radial gravity, directional kicks, bounce, and orbiting ball behavior.",
          "stack": [
            "Unity",
            "C#",
            "Polar coordinates"
          ]
        },
        {
          "title": "Match system",
          "contribution": "Implemented 100-second matches, scoring, restart, and a multi-ball mode with up to six balls.",
          "stack": [
            "Unity",
            "Game state"
          ]
        },
        {
          "title": "Hand-drawn art",
          "contribution": "Sketched sprites, UI, and backgrounds on paper, scanned them, and processed them for the game.",
          "stack": [
            "Pencil sketch",
            "Photoshop"
          ]
        },
        {
          "title": "Solo production",
          "contribution": "Built, illustrated, integrated audio, and submitted the entire game in two days of the four-day jam.",
          "stack": [
            "Game design",
            "Audio integration"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Event",
          "value": "GMTK 2025 · “Loop”"
        },
        {
          "label": "Result",
          "value": "Top 2%"
        },
        {
          "label": "Build time",
          "value": "48 hours · Solo"
        }
      ],
      "media": {
        "src": "/projects/archive/1b62ec9083c19032-thumb.webp",
        "width": 2560,
        "height": 1920,
        "alt": "B612 Soccer — original project image",
        "caption": "B612 Soccer"
      }
    },
    "notes": [
      {
        "heading": "Development Challenge",
        "paragraphs": [
          "As a 1-person team, I had only 2 days out of the 4-day jam to design, build, illustrate, and submit the entire project. Everything you see was made in that thrilling, exhausting sprint."
        ]
      },
      {
        "heading": "GMTK 2025 Jam Results",
        "table": {
          "headings": [
            "Criteria",
            "Rank",
            "Score"
          ],
          "rows": [
            [
              "Enjoyment",
              "#158",
              "4.195"
            ],
            [
              "Creativity",
              "#238",
              "4.341"
            ],
            [
              "Artwork",
              "#219",
              "4.439"
            ],
            [
              "Audio",
              "#122",
              "4.146"
            ],
            [
              "Narrative",
              "#392",
              "3.756"
            ]
          ]
        }
      },
      {
        "heading": "About the Theme: \"Loop\"",
        "items": [
          "Literal Loop: The ball and players both orbit the planet for truly loopy gameplay.",
          "Perspective: Side view, all mechanics in polar physics.",
          "Visuals: Black/white line art, blue space ambiance.",
          "Pick-Up Play: 100-second matches, first to 10 goals, perfect for friends."
        ]
      },
      {
        "heading": "Core Mechanics",
        "items": [
          "360° Movement: Players run, jump, and kick around the full planet.",
          "Kicking: Directional kicks add momentum — maybe even scoring on your own goal!",
          "Physics: Natural ball orbiting, bounce, and wrapping.",
          "Goals: Clear crossbars, animated feedback.",
          "Multi-ball: Up to 6 balls for bonus chaos.",
          "Player 1 WASD",
          "Player 2 Arrow Keys",
          "Pause ESC"
        ]
      },
      {
        "heading": "Art, Audio & Asset Production",
        "items": [
          "Hand-drawn assets: All sprites, UI, and backgrounds sketched by pencil, scanned with a printer, and processed in Photoshop.",
          "Minimalist UI: Clean, intuitive scoreboard and feedback.",
          "FX: Impact effects, sparkles, blue overlays.",
          "Audio: Every SFX and music track manually integrated."
        ]
      },
      {
        "heading": "My Solo Process (48 hours)",
        "items": [
          "Day 1: Built planet, core movement, and UI framework.",
          "Day 2: Implemented all scoring, game flow, multi-ball, and polish. Practically no sleep!",
          "Full 360° movement and orbiting gameplay",
          "Score system, restart game loop",
          "Multi-ball chaos (up to 6 balls)",
          "Animated, hand-drawn UI and visual feedback",
          "All design, code, illustration, and polish by Lingyi Zhou"
        ]
      },
      {
        "heading": "Credits",
        "paragraphs": [
          "Everything (Design, Code, Art, Submission): Lingyi Zhou",
          "Special Thanks: Skinnytigerr (feedback & playtesting)"
        ]
      },
      {
        "heading": "Reflection",
        "paragraphs": [
          "Making B612 Soccer in just two days, solo, was an exhilarating ride — every design, art, and coding challenge hit all at once. The end result is a chaotic, replayable multiplayer game that I'm proud to share."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/1b62ec9083c19032.webp",
        "thumbnail": "/projects/archive/1b62ec9083c19032-thumb.webp",
        "width": 2560,
        "height": 1920,
        "caption": "B612 Soccer"
      },
      {
        "type": "image",
        "src": "/projects/archive/f46b735d26b3c2a0.webp",
        "thumbnail": "/projects/archive/f46b735d26b3c2a0-thumb.webp",
        "width": 2000,
        "height": 1295,
        "caption": "Main menu and in-game art showcase"
      },
      {
        "type": "image",
        "src": "/projects/archive/e43b1a54b160c616.webp",
        "thumbnail": "/projects/archive/e43b1a54b160c616-thumb.webp",
        "width": 1800,
        "height": 1166,
        "caption": "Pencil line visual style and blue ambient backgrounds"
      },
      {
        "type": "image",
        "src": "/projects/archive/522a2594c9ba0b4f.webp",
        "thumbnail": "/projects/archive/522a2594c9ba0b4f-thumb.webp",
        "width": 1800,
        "height": 1166,
        "caption": "Single- and multi-ball chaos in action"
      },
      {
        "type": "image",
        "src": "/projects/archive/0fe003a6d986b951.webp",
        "thumbnail": "/projects/archive/0fe003a6d986b951-thumb.webp",
        "width": 1800,
        "height": 1166,
        "caption": "UI elements, scoreboard, and particle FX"
      }
    ],
    "links": [
      {
        "label": "Play in Browser",
        "href": "https://reatured.itch.io/b612-soccer"
      },
      {
        "label": "GMTK Jam Page",
        "href": "https://itch.io/jam/gmtk-2025/rate/3778309"
      }
    ],
    "year": 2025
  },
  "just-another-day": {
    "sourceId": "05",
    "sourceSlug": "just-another-day",
    "title": "Just Another Day",
    "subtitle": "Five mini-games, one emotional arc.",
    "discipline": "game developer / 3d designer",
    "study": {
      "overview": "Five mini-games connected by an emotional storyline, designed to build toward a cathartic ending.",
      "role": "Game Developer · Storytelling",
      "ownership": "Game Developer · Storytelling",
      "features": [
        {
          "title": "Five mini-games",
          "contribution": "Structured the experience as short gameplay pieces, each serving a different story beat.",
          "stack": [
            "Unity",
            "C#"
          ]
        },
        {
          "title": "Narrative pacing",
          "contribution": "Connected the mini-games so the emotional intensity can rise and fall across the full experience.",
          "stack": [
            "Narrative design",
            "Game pacing"
          ]
        },
        {
          "title": "Mood-driven visuals",
          "contribution": "Built custom HLSL effects and Blender assets to reflect each mini-game’s emotional tone.",
          "stack": [
            "HLSL",
            "Blender"
          ]
        },
        {
          "title": "Playable release",
          "contribution": "Published the game and documented the result with a trailer, repository, and procedural-art example.",
          "stack": [
            "itch.io",
            "Game production"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Structure",
          "value": "5 connected mini-games"
        },
        {
          "label": "Focus",
          "value": "Emotional storytelling"
        },
        {
          "label": "Available",
          "value": "Playable build + source"
        }
      ],
      "media": {
        "src": "/projects/archive/207b25fa387bcafe-thumb.webp",
        "width": 1920,
        "height": 1080,
        "alt": "Just Another Day — original project image",
        "caption": "Just Another Day"
      }
    },
    "notes": [
      {
        "heading": "Five symbolic mini-games",
        "paragraphs": [
          "Each mini-game represents a different emotional state. The overall pacing builds toward catharsis rather than relying on one repeated mechanic."
        ]
      },
      {
        "heading": "Procedural stitching",
        "paragraphs": [
          "A recurring procedural stitching mechanic ties the separate narrative segments together. Scene transitions maintain emotional continuity."
        ]
      },
      {
        "heading": "Technical production",
        "items": [
          "Unity and C# for the gameplay and scene flow.",
          "Custom HLSL shaders for mood-driven visual effects.",
          "Blender for the 3D assets."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/207b25fa387bcafe.webp",
        "thumbnail": "/projects/archive/207b25fa387bcafe-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "Just Another Day"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/9LFHeKrCo6o",
        "sourceUrl": "https://www.youtube.com/watch?v=9LFHeKrCo6o",
        "caption": "Just Another Day - Game Trailer",
        "thumbnail": "/projects/archive/207b25fa387bcafe-thumb.webp"
      },
      {
        "type": "image",
        "src": "/projects/archive/e0c81d5b8c8ea015.webp",
        "thumbnail": "/projects/archive/e0c81d5b8c8ea015-thumb.webp",
        "width": 1922,
        "height": 809,
        "caption": "Just Another Day Hero image"
      },
      {
        "type": "video",
        "src": "/projects/archive/c278bb6fb7d82d36.mp4",
        "thumbnail": "/projects/archive/c278bb6fb7d82d36-thumb.webp",
        "width": 818,
        "height": 674,
        "animated": true,
        "caption": "Procedural Sushi"
      }
    ],
    "links": [
      {
        "label": "Play on Itch.io",
        "href": "https://reatured.itch.io/just-another-day"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/reatured/Just-Another-Day"
      }
    ]
  },
  "hardware-store": {
    "sourceId": "01",
    "sourceSlug": "hardware-store-smart-search",
    "title": "Hardware Store Smart Search",
    "subtitle": "Find hardware-store customers through searchable map data.",
    "discipline": "full stack engineer",
    "study": {
      "overview": "A lead-generation tool for a hardware manufacturer, turning Google Maps business listings into a searchable list of potential store customers.",
      "role": "Full Stack Developer",
      "ownership": "Full Stack Developer",
      "features": [
        {
          "title": "Business discovery",
          "contribution": "Collected map business listings and organized potential hardware-store leads by location and relevance.",
          "stack": [
            "Python",
            "Map data"
          ]
        },
        {
          "title": "Search workflow",
          "contribution": "Built the interface for finding and reviewing store leads around the world.",
          "stack": [
            "React",
            "JavaScript"
          ]
        },
        {
          "title": "Data quality",
          "contribution": "Added deduplication and caching so repeated searches avoid duplicate results and unnecessary work.",
          "stack": [
            "Python",
            "Caching"
          ]
        },
        {
          "title": "AI-assisted outreach",
          "contribution": "Integrated Perplexity analysis to enrich store profiles and generate tailored cold-email drafts.",
          "stack": [
            "Perplexity API",
            "FastAPI"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Use case",
          "value": "Manufacturer sales leads"
        },
        {
          "label": "Data",
          "value": "Google Maps business listings"
        },
        {
          "label": "Versions",
          "value": "v1.0 and v3.0 demos"
        }
      ],
      "media": {
        "src": "/projects/archive/98a9abdd53714d00-thumb.webp",
        "width": 1280,
        "height": 720,
        "alt": "Hardware Store Smart Search — original project image",
        "caption": "Hardware Store Smart Search"
      }
    },
    "notes": [
      {
        "heading": "Find and enrich store leads",
        "items": [
          "Search hardware stores by city, region, or country.",
          "Collect matching Google Maps business listings.",
          "Deduplicate and cache results locally.",
          "Use Perplexity to analyze relevance and contact information.",
          "Generate cold-email drafts tailored to each store profile."
        ]
      },
      {
        "heading": "Example workflow",
        "paragraphs": [
          "Enter a location and query, such as “hardware stores in Berlin.” Review the deduplicated business results, enrich the relevant profiles, and prepare outreach drafts from that data."
        ]
      },
      {
        "heading": "Version history",
        "items": [
          "v1.0: basic search and results display.",
          "v3.0: AI analysis, deduplication, caching, and email generation."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/98a9abdd53714d00.webp",
        "thumbnail": "/projects/archive/98a9abdd53714d00-thumb.webp",
        "width": 1280,
        "height": 720,
        "caption": "Hardware Store Smart Search"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/rr9zS1zC-ok",
        "sourceUrl": "https://www.youtube.com/watch?v=rr9zS1zC-ok",
        "caption": "Hardware Store Smart Search v3.0 Demo",
        "thumbnail": "/projects/archive/98a9abdd53714d00-thumb.webp"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/ZmJKlsY6oFo",
        "sourceUrl": "https://www.youtube.com/watch?v=ZmJKlsY6oFo",
        "caption": "Hardware Store Smart Search v1.0 Demo",
        "thumbnail": "/projects/archive/98a9abdd53714d00-thumb.webp"
      }
    ],
    "links": [
      {
        "label": "Live App",
        "href": "https://reatured.github.io/Search-on-google-map"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/reatured/Search-on-google-map"
      },
      {
        "label": "v3.0 Demo",
        "href": "https://youtu.be/rr9zS1zC-ok"
      },
      {
        "label": "v1.0 Demo",
        "href": "https://youtu.be/ZmJKlsY6oFo"
      }
    ]
  },
  "ping-pong": {
    "sourceId": "16",
    "sourceSlug": "ping-pong-game",
    "title": "Ping Pong Game",
    "subtitle": "A custom p5.js game engine with a 3D illusion.",
    "discipline": "game developer",
    "study": {
      "overview": "A p5.js ping-pong game with a custom engine, an automated opponent, and a 2D court that feels three-dimensional.",
      "role": "Game Engine Developer",
      "ownership": "Game Engine Developer",
      "features": [
        {
          "title": "Custom engine",
          "contribution": "Built the asset, sound, level, and control systems rather than relying on a game engine.",
          "stack": [
            "p5.js",
            "JavaScript"
          ]
        },
        {
          "title": "Court perspective",
          "contribution": "Used perspective cues to create a 3D illusion on a 2D canvas.",
          "stack": [
            "Canvas drawing",
            "Perspective math"
          ]
        },
        {
          "title": "Automated opponent",
          "contribution": "Added an opponent so the game works as a complete single-player experience.",
          "stack": [
            "Opponent logic",
            "Game loop"
          ]
        },
        {
          "title": "Gameplay feedback",
          "contribution": "Integrated sound, scoring, and challenge variations, documented through five gameplay clips.",
          "stack": [
            "Audio",
            "Interaction design"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2021"
        },
        {
          "label": "Runtime",
          "value": "Browser / p5.js"
        },
        {
          "label": "Output",
          "value": "Playable game"
        }
      ],
      "media": {
        "src": "/projects/archive/d0d18ec47c57e1b0-thumb.webp",
        "width": 474,
        "height": 286,
        "alt": "Ping Pong Game — original project image",
        "caption": "Ping Pong Game"
      }
    },
    "notes": [
      {
        "heading": "Approach",
        "items": [
          "Built the game engine to manage assets, sound, levels, and controls.",
          "Used perspective tricks to make the court feel dimensional without leaving the 2D canvas.",
          "Added an AI opponent so the game can stand on its own as a complete experience."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/d0d18ec47c57e1b0.mp4",
        "thumbnail": "/projects/archive/d0d18ec47c57e1b0-thumb.webp",
        "width": 474,
        "height": 286,
        "animated": true,
        "caption": "Ping Pong Game"
      },
      {
        "type": "video",
        "src": "/projects/archive/36630d08747831b9.mp4",
        "thumbnail": "/projects/archive/36630d08747831b9-thumb.webp",
        "width": 640,
        "height": 640,
        "caption": "Play some Ping Pong   p5  p5js"
      },
      {
        "type": "video",
        "src": "/projects/archive/bc9580d00a3eef69.mp4",
        "thumbnail": "/projects/archive/bc9580d00a3eef69-thumb.webp",
        "width": 640,
        "height": 360,
        "caption": "Ping Pong Losable"
      },
      {
        "type": "video",
        "src": "/projects/archive/81abdd3f5e432506.mp4",
        "thumbnail": "/projects/archive/81abdd3f5e432506-thumb.webp",
        "width": 640,
        "height": 360,
        "caption": "Ping Pong Sound On"
      },
      {
        "type": "video",
        "src": "/projects/archive/613cf767a1e366ca.mp4",
        "thumbnail": "/projects/archive/613cf767a1e366ca-thumb.webp",
        "width": 640,
        "height": 360,
        "caption": "2d capsule collider biu  p5js"
      },
      {
        "type": "video",
        "src": "/projects/archive/2f8284a600277d0d.mp4",
        "thumbnail": "/projects/archive/2f8284a600277d0d-thumb.webp",
        "width": 640,
        "height": 360,
        "caption": "Ping Pong Challenge"
      }
    ],
    "links": [
      {
        "label": "Play Now",
        "href": "https://editor.p5js.org/lz2729/full/t0642p3hV"
      }
    ],
    "year": 2021
  },
  "no-job-too-small": {
    "sourceId": "17",
    "sourceSlug": "no-job-too-small",
    "title": "No Job Too Small",
    "subtitle": "An oversized intern turns a tiny office into a physics playground.",
    "discipline": "game developer",
    "study": {
      "overview": "Play an oversized intern in a tiny 90s office, where ordinary tasks turn into physical comedy.",
      "role": "Lead Coder · LookAway Games",
      "ownership": "Lead Coder · LookAway Games",
      "features": [
        {
          "title": "Scale-driven play",
          "contribution": "Programmed the oversized-intern mechanics and the office tasks built around the player’s unusual proportions.",
          "stack": [
            "Unity",
            "C#"
          ]
        },
        {
          "title": "Physics systems",
          "contribution": "Built the physical interactions so the player can use brute force or careful precision to complete tasks.",
          "stack": [
            "Unity physics",
            "C#"
          ]
        },
        {
          "title": "Game architecture",
          "contribution": "Led the core gameplay programming and systems architecture within the LookAway Games team.",
          "stack": [
            "Unity",
            "Game state"
          ]
        },
        {
          "title": "Visual integration",
          "contribution": "Integrated the 90s office presentation and shader effects into the collaborative jam build.",
          "stack": [
            "HLSL",
            "Blender assets"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Event",
          "value": "GMTK Game Jam 2024"
        },
        {
          "label": "Result",
          "value": "Top 1% of 3,300+ entries"
        },
        {
          "label": "Play",
          "value": "Browser build on itch.io"
        }
      ],
      "media": {
        "src": "/projects/archive/5a1a1354617ad71c-thumb.webp",
        "width": 1280,
        "height": 720,
        "alt": "No Job Too Small — original project image",
        "caption": "No Job Too Small"
      }
    },
    "notes": [
      {
        "heading": "Theme and mechanics",
        "items": [
          "GMTK Game Jam 2024 theme: Built to Scale.",
          "The oversized player is the scale problem in a tiny 90s-style office.",
          "Ordinary office tasks become scale-based puzzles and physics challenges.",
          "Both smashing through obstacles and careful, precise interaction are valid approaches."
        ]
      },
      {
        "heading": "Team and credits",
        "paragraphs": [
          "Developed collaboratively under LookAway Games. Lingyi Zhou served as Lead Coder, responsible for core gameplay programming, physics systems, and game architecture."
        ]
      },
      {
        "heading": "Jam result",
        "paragraphs": [
          "Ranked in the top 1% of more than 3,300 entries. The original playable build, jam results page, and gameplay video are linked from the overview."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/5a1a1354617ad71c.webp",
        "thumbnail": "/projects/archive/5a1a1354617ad71c-thumb.webp",
        "width": 1280,
        "height": 720,
        "caption": "No Job Too Small"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/zskrUChpBL0",
        "sourceUrl": "https://www.youtube.com/watch?v=zskrUChpBL0",
        "caption": "No Job Too Small - GMTK 2024 Gameplay",
        "thumbnail": "/projects/archive/5a1a1354617ad71c-thumb.webp"
      }
    ],
    "links": [
      {
        "label": "Play on Itch.io",
        "href": "https://lookaway-games.itch.io/no-job-too-small"
      },
      {
        "label": "GMTK Jam Page",
        "href": "https://itch.io/jam/gmtk-2024/rate/2909373"
      },
      {
        "label": "Gameplay Video",
        "href": "https://youtu.be/zskrUChpBL0"
      }
    ],
    "year": 2024
  },
  "drag-task": {
    "sourceId": "03",
    "sourceSlug": "personal-schedule-assistant",
    "title": "Drag Task In - Personal Schedule Assistant",
    "subtitle": "Drag-and-drop schedule builder",
    "discipline": "full stack engineer",
    "study": {
      "overview": "A drag-and-drop schedule builder with offline editing, cross-device sync, and a clean printable view.",
      "role": "Full Stack Developer",
      "ownership": "Full Stack Developer",
      "features": [
        {
          "title": "Time-block editing",
          "contribution": "Made the schedule directly editable through drag and drop instead of a series of forms.",
          "stack": [
            "React",
            "@dnd-kit"
          ]
        },
        {
          "title": "Offline planning",
          "contribution": "Supported editing while offline, keeping planning available without a continuous connection.",
          "stack": [
            "React",
            "Offline state"
          ]
        },
        {
          "title": "Sync & persistence",
          "contribution": "Connected the schedule to a backend and persistent storage for automatic cross-device sync.",
          "stack": [
            "FastAPI",
            "Supabase"
          ]
        },
        {
          "title": "Print-ready layout",
          "contribution": "Built a focused interface and export view for taking the schedule off screen.",
          "stack": [
            "Tailwind CSS",
            "Print styles"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Interaction",
          "value": "Drag and drop"
        },
        {
          "label": "Data",
          "value": "Offline editing + device sync"
        },
        {
          "label": "Initial version",
          "value": "Built in under 4 hours"
        }
      ],
      "media": {
        "src": "/projects/archive/de475d8b43887fc3-thumb.webp",
        "width": 1920,
        "height": 1080,
        "alt": "Drag Task In - Personal Schedule Assistant — original project image",
        "caption": "Drag Task In - Personal Schedule Assistant"
      }
    },
    "notes": [
      {
        "heading": "Scheduling workflow",
        "items": [
          "Drag time blocks with @dnd-kit.",
          "Sync changes automatically across devices through Supabase.",
          "Keep editing offline and synchronize when the connection returns.",
          "Export a clean print-ready schedule."
        ]
      },
      {
        "heading": "Design and build",
        "paragraphs": [
          "The first version was designed and developed in under four hours. Its interaction was modeled on moving sticky notes around a desk: direct editing with minimal menus and configuration."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/de475d8b43887fc3.webp",
        "thumbnail": "/projects/archive/de475d8b43887fc3-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "Drag Task In - Personal Schedule Assistant"
      },
      {
        "type": "image",
        "src": "/projects/archive/e2a1ac4a21efca77.webp",
        "thumbnail": "/projects/archive/e2a1ac4a21efca77-thumb.webp",
        "width": 2560,
        "height": 1955,
        "caption": "Drag Task In - Personal Schedule Assistant - Image 2"
      }
    ],
    "links": [
      {
        "label": "Live App",
        "href": "https://v0-personal-work-dashboard-gules.vercel.app/"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/reatured/Personal-Schedule-Assistance/tree/main"
      }
    ]
  },
  "flerken": {
    "sourceId": "25",
    "sourceSlug": "marvels-flerken-ar-filter",
    "title": "Marvel’s Flerken AR Filter",
    "subtitle": "An official cat-detection effect for The Marvels.",
    "discipline": "xr developer",
    "study": {
      "overview": "An official campaign effect for The Marvels: detect a cat in the camera feed and transform it into a Flerken.",
      "role": "AR Developer · Moviebill / Really AR",
      "ownership": "AR Developer · Moviebill / Really AR",
      "features": [
        {
          "title": "Cat detection",
          "contribution": "Connected object detection to the camera effect so the transformation follows the cat.",
          "stack": [
            "Object detection",
            "JavaScript"
          ]
        },
        {
          "title": "Flerken transformation",
          "contribution": "Built the 3D visual effect and shader treatment around the campaign’s central gag.",
          "stack": [
            "HLSL",
            "Visual effects"
          ]
        },
        {
          "title": "Platform adaptation",
          "contribution": "Developed the effect across Lens Studio and Effect House for the campaign’s mobile platforms.",
          "stack": [
            "Lens Studio",
            "Effect House"
          ]
        },
        {
          "title": "Campaign interaction",
          "contribution": "Designed the detection-to-transformation sequence for immediate recognition and a shareable result.",
          "stack": [
            "AR interaction",
            "Camera feedback"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Campaign",
          "value": "The Marvels · 2023"
        },
        {
          "label": "Distribution",
          "value": "TikTok / Regal Cinema app"
        },
        {
          "label": "Output",
          "value": "Commercial AR effect"
        }
      ],
      "media": {
        "src": "/projects/archive/2269d0ded11b276a-thumb.webp",
        "width": 640,
        "height": 1138,
        "alt": "Marvel’s Flerken AR Filter — original project image",
        "caption": "Flerken AR Filter Demo"
      }
    },
    "notes": [
      {
        "heading": "Official campaign",
        "paragraphs": [
          "Developed during Lingyi’s time at Moviebill / Really AR for The Marvels theatrical campaign in 2023."
        ]
      },
      {
        "heading": "Camera-to-effect pipeline",
        "items": [
          "Detect a cat in the live camera feed.",
          "Anchor the tentacle-sprouting Flerken transformation to the detected cat.",
          "Use JavaScript and HLSL for the effect logic and visual treatment."
        ]
      },
      {
        "heading": "Platform delivery",
        "items": [
          "TikTok through Effect House.",
          "Regal Cinema app through Lens Studio."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/2269d0ded11b276a.mp4",
        "thumbnail": "/projects/archive/2269d0ded11b276a-thumb.webp",
        "width": 640,
        "height": 1138,
        "caption": "Flerken AR Filter Demo"
      }
    ],
    "links": [],
    "year": 2023
  },
  "curtain-hook": {
    "sourceId": "04",
    "sourceSlug": "3d-printed-hook",
    "title": "No-Drill Curtain Hook",
    "subtitle": "Renter-Friendly Compression-Fit Curtain Solution",
    "discipline": "robotics engineer / 3d & simulation designer",
    "study": {
      "overview": "A two-part curtain hook that locks into the ceiling–wall seam with compression, without drilling or adhesive.",
      "role": "Mechanical Design · CAD · Rapid Prototyping",
      "ownership": "Mechanical Design · CAD · Rapid Prototyping",
      "features": [
        {
          "title": "Find an attachment",
          "contribution": "Studied the existing ceiling seam after adhesive hooks failed, using the room’s structure as the constraint.",
          "stack": [
            "Physical inspection",
            "Mechanical design"
          ]
        },
        {
          "title": "Sliding assembly",
          "contribution": "Designed a top hook and a horizontal locking part, widening the contact area to spread the load.",
          "stack": [
            "Fusion 360",
            "Parametric CAD"
          ]
        },
        {
          "title": "Tune the fit",
          "contribution": "Printed and tested three iterations to balance a secure compression fit with installation by hand.",
          "stack": [
            "FDM printing",
            "Tolerance testing"
          ]
        },
        {
          "title": "Fabricate & install",
          "contribution": "Printed the final PLA hook with 40% infill and three perimeters; the two-part system removes without wall damage.",
          "stack": [
            "PLA",
            "Fusion 360"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Iterations",
          "value": "3 print-and-fit cycles"
        },
        {
          "label": "Installation",
          "value": "Under 30 seconds"
        },
        {
          "label": "Original result",
          "value": "Holding curtains for over a year"
        }
      ],
      "media": {
        "src": "/projects/archive/eee41b6c85ec68be-thumb.webp",
        "width": 1189,
        "height": 1512,
        "alt": "No-Drill Curtain Hook — original project image",
        "caption": "No-Drill Curtain Hook"
      }
    },
    "notes": [
      {
        "heading": "The Problem",
        "paragraphs": [
          "Rented apartments make curtain hanging deceptively hard. Drilling voids the deposit. Adhesive hooks fail under curtain weight. Command strips pull paint. After the third hook failure, I looked at the wall differently — not as a surface to attach to, but as a structure to work with."
        ]
      },
      {
        "heading": "The Insight",
        "paragraphs": [
          "The seam between the ceiling panel and the wall molding is a tight, load-bearing gap that runs the entire length of the room. It can't be seen from below, but it's there — and it's exactly the right width to grip a precisely modeled hook under compression."
        ]
      },
      {
        "heading": "Design",
        "items": [
          "Two-part sliding assembly: The top hook locks into the ceiling seam. The second part slides in horizontally and locks the first part in place — no tools, no adhesive.",
          "Compression grip: The hook holds through geometric interference, not friction or glue. The tighter the fit, the more load it bears.",
          "Load distribution: The contact surface was widened across the seam length to spread curtain weight and prevent point-load failure.",
          "Iterative tolerance testing: Three print iterations tuned the fit — too loose slips, too tight won't install. Final version installs by hand with a firm push."
        ]
      },
      {
        "heading": "Result",
        "paragraphs": [
          "The hook has been holding curtains for over a year with zero wall damage. The whole system installs and uninstalls in under 30 seconds. Cost: one spool of PLA and a few hours in Fusion 360."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/eee41b6c85ec68be.webp",
        "thumbnail": "/projects/archive/eee41b6c85ec68be-thumb.webp",
        "width": 1189,
        "height": 1512,
        "caption": "No-Drill Curtain Hook"
      },
      {
        "type": "image",
        "src": "/projects/archive/b0417a3e031e2cd7.webp",
        "thumbnail": "/projects/archive/b0417a3e031e2cd7-thumb.webp",
        "width": 1080,
        "height": 1080,
        "caption": "No-Drill Curtain Hook - Image 2"
      },
      {
        "type": "image",
        "src": "/projects/archive/d5178bbf3ff73167.webp",
        "thumbnail": "/projects/archive/d5178bbf3ff73167-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "No-Drill Curtain Hook - Image 3"
      },
      {
        "type": "image",
        "src": "/projects/archive/97aa3a1ff681c764.webp",
        "thumbnail": "/projects/archive/97aa3a1ff681c764-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "No-Drill Curtain Hook - Image 4"
      },
      {
        "type": "image",
        "src": "/projects/archive/91f38520c565ead2.webp",
        "thumbnail": "/projects/archive/91f38520c565ead2-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "No-Drill Curtain Hook - Image 5"
      },
      {
        "type": "image",
        "src": "/projects/archive/77b59a0c56afa14f.webp",
        "thumbnail": "/projects/archive/77b59a0c56afa14f-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "No-Drill Curtain Hook - Image 6"
      },
      {
        "type": "image",
        "src": "/projects/archive/9ae947de33e190f9.webp",
        "thumbnail": "/projects/archive/9ae947de33e190f9-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "No-Drill Curtain Hook - Image 7"
      },
      {
        "type": "image",
        "src": "/projects/archive/0f3a19af9fc600fb.webp",
        "thumbnail": "/projects/archive/0f3a19af9fc600fb-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "No-Drill Curtain Hook - Image 8"
      },
      {
        "type": "image",
        "src": "/projects/archive/e61e4c32b40575c7.webp",
        "thumbnail": "/projects/archive/e61e4c32b40575c7-thumb.webp",
        "width": 1000,
        "height": 697,
        "caption": "Hook prototype — second view"
      },
      {
        "type": "image",
        "src": "/projects/archive/396e008d349df2aa.webp",
        "thumbnail": "/projects/archive/396e008d349df2aa-thumb.webp",
        "width": 750,
        "height": 1000,
        "caption": "Hook installed on ceiling seam"
      },
      {
        "type": "image",
        "src": "/projects/archive/7a4cc9cdf6c25cca.webp",
        "thumbnail": "/projects/archive/7a4cc9cdf6c25cca-thumb.webp",
        "width": 1000,
        "height": 746,
        "caption": "Fusion 360 model screenshot"
      }
    ],
    "links": [],
    "year": 2024
  },
  "vr-quest": {
    "sourceId": "08",
    "sourceSlug": "vr-experience-oculus-quest",
    "title": "VR Experience on Oculus Quest",
    "subtitle": "Spatial Object Manipulation and Embodied Interaction System",
    "discipline": "spatial computing developer",
    "study": {
      "overview": "A Quest interaction demo combining six-degree-of-freedom object manipulation with spatial memory tasks.",
      "role": "XR Developer",
      "ownership": "XR Developer",
      "features": [
        {
          "title": "Grab & place",
          "contribution": "Implemented object grasping, transport, and release with physics-based behavior.",
          "stack": [
            "Unity",
            "XR Interaction Toolkit"
          ]
        },
        {
          "title": "Spatial memory",
          "contribution": "Designed tasks that ask users to remember positions and orientations in a 3D workspace.",
          "stack": [
            "C#",
            "Spatial interaction"
          ]
        },
        {
          "title": "Collision feedback",
          "contribution": "Connected object placement to collision detection so virtual objects respond to the environment.",
          "stack": [
            "Unity physics",
            "Collision detection"
          ]
        },
        {
          "title": "Navigation & comfort",
          "contribution": "Supported room-scale movement, teleportation, and smooth locomotion on standalone Quest hardware.",
          "stack": [
            "Oculus Quest",
            "Unity XR"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Platform",
          "value": "Oculus Quest"
        },
        {
          "label": "Interaction",
          "value": "6-DOF pick and place"
        },
        {
          "label": "Available",
          "value": "Demo video + source"
        }
      ],
      "media": {
        "src": "/projects/archive/81d4229dee407180-thumb.webp",
        "width": 1280,
        "height": 720,
        "alt": "VR Experience on Oculus Quest — original project image",
        "caption": "VR Experience on Oculus Quest"
      }
    },
    "notes": [
      {
        "heading": "Spatial storytelling",
        "items": [
          "Room-scale movement maps the player’s physical movement into the virtual space.",
          "Environmental layout and interactive objects communicate narrative elements.",
          "Players can pick up, examine, and use objects to progress."
        ]
      },
      {
        "heading": "Locomotion and input",
        "items": [
          "Teleportation and smooth locomotion support different comfort preferences.",
          "Hand and controller inputs support natural object manipulation.",
          "Six-degree-of-freedom grasping and placement use physics and collision feedback."
        ]
      },
      {
        "heading": "Standalone testing",
        "paragraphs": [
          "Built with Unity’s XR framework and tested across Oculus Quest hardware configurations, with attention to tracking stability and standalone rendering constraints."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/81d4229dee407180.webp",
        "thumbnail": "/projects/archive/81d4229dee407180-thumb.webp",
        "width": 1280,
        "height": 720,
        "caption": "VR Experience on Oculus Quest"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/lpLAXMpaFw4",
        "sourceUrl": "https://www.youtube.com/watch?v=lpLAXMpaFw4",
        "caption": "VR Experience on Oculus Quest Demo",
        "thumbnail": "/projects/archive/81d4229dee407180-thumb.webp"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/reatured/Oculus-VR-Demo"
      }
    ]
  },
  "city-posters": {
    "sourceId": "09",
    "sourceSlug": "3d-poster-design-landmarks",
    "title": "3D Poster Design with Landmarks",
    "subtitle": "Blender + Google Maps Data — City Landmarks at Local Time of Day",
    "discipline": "3d & simulation designer",
    "study": {
      "overview": "A1 city posters that turn real map data into realistic and graphic 3D views, lit for each city’s local time of day.",
      "role": "3D Artist",
      "ownership": "3D Artist",
      "features": [
        {
          "title": "Geographic source",
          "contribution": "Imported real-world building references from Google Maps to anchor the compositions in recognizable places.",
          "stack": [
            "Google Maps API",
            "Blender"
          ]
        },
        {
          "title": "Two visual styles",
          "contribution": "Built and rendered landmarks in realistic and graphic treatments.",
          "stack": [
            "Blender",
            "3D composition"
          ]
        },
        {
          "title": "Local atmosphere",
          "contribution": "Used HDRIs and custom lighting to reflect different times of day and city atmospheres.",
          "stack": [
            "HDRI",
            "Custom lighting"
          ]
        },
        {
          "title": "Print production",
          "contribution": "Arranged New York, San Francisco, Cologne, and Macau into large-format poster designs.",
          "stack": [
            "A1 layout",
            "Rendering"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Cities",
          "value": "New York, San Francisco, Cologne, Macau"
        },
        {
          "label": "Format",
          "value": "A1 posters"
        },
        {
          "label": "Styles",
          "value": "Realistic + graphic"
        }
      ],
      "media": {
        "src": "/projects/archive/f1b3ee87d42d35fb-thumb.webp",
        "width": 1920,
        "height": 1080,
        "alt": "3D Poster Design with Landmarks — original project image",
        "caption": "3D Poster Design with Landmarks — A1 Series"
      }
    },
    "notes": [
      {
        "heading": "Approach",
        "items": [
          "Imported geographic references from Google Maps to anchor each poster in a real place.",
          "Built the landmarks in Blender and rendered them in both realistic and stylized formats.",
          "Used HDRIs and custom lighting to give each city a distinct atmosphere."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/f1b3ee87d42d35fb.webp",
        "thumbnail": "/projects/archive/f1b3ee87d42d35fb-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "3D Poster Design with Landmarks — A1 Series"
      },
      {
        "type": "image",
        "src": "/projects/archive/ad1fd19973a4d2c7.webp",
        "thumbnail": "/projects/archive/ad1fd19973a4d2c7-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "3D Poster alternate version"
      },
      {
        "type": "image",
        "src": "/projects/archive/55b087ae796ade79.webp",
        "thumbnail": "/projects/archive/55b087ae796ade79-thumb.webp",
        "width": 1808,
        "height": 2560,
        "caption": "New York — midday render"
      },
      {
        "type": "image",
        "src": "/projects/archive/9df992cabb9c1a0a.webp",
        "thumbnail": "/projects/archive/9df992cabb9c1a0a-thumb.webp",
        "width": 1808,
        "height": 2560,
        "caption": "Cologne — late afternoon render"
      },
      {
        "type": "image",
        "src": "/projects/archive/1dff72a24565a361.webp",
        "thumbnail": "/projects/archive/1dff72a24565a361-thumb.webp",
        "width": 1808,
        "height": 2560,
        "caption": "Macau — dusk render"
      },
      {
        "type": "image",
        "src": "/projects/archive/c88bdbddbb6a64fe.webp",
        "thumbnail": "/projects/archive/c88bdbddbb6a64fe-thumb.webp",
        "width": 1808,
        "height": 2560,
        "caption": "San Francisco — morning haze render"
      },
      {
        "type": "image",
        "src": "/projects/archive/d6b5bce3dc76878f.webp",
        "thumbnail": "/projects/archive/d6b5bce3dc76878f-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "Blender scene setup — Google Maps data import"
      },
      {
        "type": "image",
        "src": "/projects/archive/a0dc1672a9f546f2.webp",
        "thumbnail": "/projects/archive/a0dc1672a9f546f2-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "Process shot — realistic style"
      },
      {
        "type": "image",
        "src": "/projects/archive/2a7cb2e1a33ba14e.webp",
        "thumbnail": "/projects/archive/2a7cb2e1a33ba14e-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "Process shot — graphic style"
      },
      {
        "type": "image",
        "src": "/projects/archive/5227b8fc26717eb0.webp",
        "thumbnail": "/projects/archive/5227b8fc26717eb0-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "Lighting rig — HDRI setup"
      },
      {
        "type": "image",
        "src": "/projects/archive/e2d224cebf6ad99d.webp",
        "thumbnail": "/projects/archive/e2d224cebf6ad99d-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "Render comparison"
      },
      {
        "type": "image",
        "src": "/projects/archive/611129c56bdf12fd.webp",
        "thumbnail": "/projects/archive/611129c56bdf12fd-thumb.webp",
        "width": 1920,
        "height": 2560,
        "caption": "Final print layout"
      }
    ],
    "links": [],
    "year": 2024
  },
  "teddy-bear": {
    "sourceId": "10b",
    "sourceSlug": "3d-modeled-teddy-bear",
    "title": "3D Modeled Teddy Bear",
    "subtitle": "Soft forms, subdivision, and fabric-like materials.",
    "discipline": "3d & simulation designer",
    "study": {
      "overview": "A Blender character study focused on soft toy proportions, subdivision, and fabric-like shading.",
      "role": "3D Sculpting",
      "ownership": "3D Sculpting",
      "features": [
        {
          "title": "Form & silhouette",
          "contribution": "Blocked out the bear and adjusted proportions to make the soft toy read clearly.",
          "stack": [
            "Blender",
            "Proportional editing"
          ]
        },
        {
          "title": "Soft surfaces",
          "contribution": "Refined the mesh with subdivision and surface cleanup.",
          "stack": [
            "Subdivision modifiers",
            "Mesh topology"
          ]
        },
        {
          "title": "Fabric treatment",
          "contribution": "Developed a basic fabric-like shader and material finish.",
          "stack": [
            "Blender materials",
            "Shading"
          ]
        },
        {
          "title": "Presentation",
          "contribution": "Rendered the model from multiple views to evaluate its form and finish.",
          "stack": [
            "Lighting",
            "Rendering"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2023"
        },
        {
          "label": "Tool",
          "value": "Blender"
        },
        {
          "label": "Focus",
          "value": "Character-modeling fundamentals"
        }
      ],
      "media": {
        "src": "/projects/archive/6590baa5ee0463a0-thumb.webp",
        "width": 1920,
        "height": 1080,
        "alt": "3D Modeled Teddy Bear — original project image",
        "caption": "3D Modeled Teddy Bear"
      }
    },
    "notes": [
      {
        "heading": "Approach",
        "items": [
          "Used Blender to block out the form and refine the silhouette.",
          "Worked through subdivision and surface cleanup to make the model feel softer.",
          "Explored basic texturing and shading to finish the piece cleanly."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/6590baa5ee0463a0.webp",
        "thumbnail": "/projects/archive/6590baa5ee0463a0-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "3D Modeled Teddy Bear"
      },
      {
        "type": "image",
        "src": "/projects/archive/9cccee6b9a168ac6.webp",
        "thumbnail": "/projects/archive/9cccee6b9a168ac6-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "3D Modeled Teddy Bear - Image 2"
      },
      {
        "type": "image",
        "src": "/projects/archive/ba22ed95b19ad697.webp",
        "thumbnail": "/projects/archive/ba22ed95b19ad697-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "3D Modeled Teddy Bear - Image 3"
      },
      {
        "type": "image",
        "src": "/projects/archive/0aa263050c0f065f.webp",
        "thumbnail": "/projects/archive/0aa263050c0f065f-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "3D Modeled Teddy Bear - Image 4"
      }
    ],
    "links": [],
    "year": 2023
  },
  "portfolio-website": {
    "sourceId": "07",
    "sourceSlug": "portfolio-website",
    "title": "Portfolio Website",
    "subtitle": "The original portfolio and its content-editing system.",
    "discipline": "full stack engineer / frontend developer",
    "study": {
      "overview": "The previous portfolio: a responsive, content-driven site with project discovery, rich media pages, and an editing interface.",
      "role": "Frontend Development · UI/UX Design",
      "ownership": "Frontend Development · UI/UX Design",
      "features": [
        {
          "title": "Project discovery",
          "contribution": "Built category-based project browsing and routed detail pages from a shared content model.",
          "stack": [
            "React",
            "TypeScript",
            "React Router"
          ]
        },
        {
          "title": "Responsive interface",
          "contribution": "Built the shared layout and responsive components using the site’s Material UI theme.",
          "stack": [
            "Material UI",
            "Emotion"
          ]
        },
        {
          "title": "Content editing",
          "contribution": "Built an admin interface backed by local JSON persistence and a media-upload server.",
          "stack": [
            "Node.js",
            "Express",
            "Multer"
          ]
        },
        {
          "title": "Rich media",
          "contribution": "Integrated video, interactive embeds, local shader previews, and metadata for project pages.",
          "stack": [
            "WebGL2",
            "Vite",
            "React Query"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Version",
          "value": "January portfolio"
        },
        {
          "label": "Content",
          "value": "Config-driven project pages"
        },
        {
          "label": "Tools",
          "value": "Editing + media upload"
        }
      ],
      "media": {
        "src": "/projects/archive/182a12db379c62e7-thumb.webp",
        "width": 1280,
        "height": 720,
        "alt": "Portfolio Website — original project image",
        "caption": "Portfolio Website preview"
      }
    },
    "notes": [
      {
        "heading": "Content architecture",
        "paragraphs": [
          "Project metadata lives in config/data.json, with rich descriptions in config/richContent.json. Shared types keep the homepage cards, project pages, and admin editing form aligned."
        ]
      },
      {
        "heading": "Editing and media",
        "paragraphs": [
          "The React admin UI uses an Express server to edit JSON content and upload local media. Project pages render image galleries, native video, third-party embeds, and eleven local GLSL shaders."
        ]
      },
      {
        "heading": "Frontend delivery",
        "paragraphs": [
          "The previous site uses React, TypeScript, Material UI/Emotion, React Router, React Query, and Vite. These stacks are verified in that project’s package.json and source, rather than its imported global skills list."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/182a12db379c62e7.webp",
        "thumbnail": "/projects/archive/182a12db379c62e7-thumb.webp",
        "width": 1280,
        "height": 720,
        "caption": "Portfolio Website preview"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/BlBrOzKWt9Q",
        "sourceUrl": "https://www.youtube.com/watch?v=BlBrOzKWt9Q",
        "caption": "Portfolio Website video",
        "thumbnail": "/projects/archive/182a12db379c62e7-thumb.webp"
      }
    ],
    "links": [],
    "year": 2025
  },
  "spaceman": {
    "sourceId": "18",
    "sourceSlug": "spaceman-rescue",
    "title": "Spaceman Rescue",
    "subtitle": "Space-themed adventure with innovative gameplay mechanics",
    "discipline": "3d designer / game developer",
    "study": {
      "overview": "A space-themed adventure connecting narrative, puzzles, and a 3D world built in Unity and Blender.",
      "role": "3D Modeling · Narrative Design · Unity Development",
      "ownership": "3D Modeling · Narrative Design · Unity Development",
      "features": [
        {
          "title": "Adventure loop",
          "contribution": "Developed the gameplay and interactions that connect the space adventure.",
          "stack": [
            "Unity",
            "C#"
          ]
        },
        {
          "title": "Narrative puzzles",
          "contribution": "Designed puzzles and encounters to support the story’s progression.",
          "stack": [
            "Narrative design",
            "Game design"
          ]
        },
        {
          "title": "3D production",
          "contribution": "Created the scene assets and assembled the game’s visual world.",
          "stack": [
            "Blender",
            "Unity"
          ]
        },
        {
          "title": "Presentation",
          "contribution": "Balanced environmental detail with clear gameplay; documented the result in a trailer and process material.",
          "stack": [
            "Level composition",
            "Visual iteration"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Format",
          "value": "3D adventure"
        },
        {
          "label": "Engine",
          "value": "Unity"
        },
        {
          "label": "Media",
          "value": "Trailer + development material"
        }
      ],
      "media": {
        "src": "/projects/archive/e52dd2c77eac6285-thumb.webp",
        "width": 1280,
        "height": 720,
        "alt": "Spaceman Rescue — original project image",
        "caption": "Spaceman Rescue preview"
      }
    },
    "notes": [
      {
        "heading": "Approach",
        "items": [
          "Used Unity to hold the gameplay together while Blender handled the 3D asset work.",
          "Designed puzzles and interactions to support the narrative instead of interrupting it.",
          "Balanced visual ambition with a clear play loop so the experience stays readable."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/005748863e64acb7.mp4",
        "thumbnail": "/projects/archive/005748863e64acb7-thumb.webp",
        "width": 520,
        "height": 292,
        "animated": true,
        "caption": "SpaceMan Rescue Trailer"
      },
      {
        "type": "image",
        "src": "/projects/archive/9cff27e8d2f6e8cb.webp",
        "thumbnail": "/projects/archive/9cff27e8d2f6e8cb-thumb.webp",
        "width": 1023,
        "height": 528,
        "caption": "Visual inspiration · WALL·E"
      },
      {
        "type": "image",
        "src": "/projects/archive/e52dd2c77eac6285.webp",
        "thumbnail": "/projects/archive/e52dd2c77eac6285-thumb.webp",
        "width": 1280,
        "height": 720,
        "caption": "Spaceman Rescue preview"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/0RuU2hqkGwI",
        "sourceUrl": "https://www.youtube.com/watch?v=0RuU2hqkGwI",
        "caption": "Spaceman Rescue video",
        "thumbnail": "/projects/archive/e52dd2c77eac6285-thumb.webp"
      }
    ],
    "links": [],
    "year": 2025
  },
  "vr-magic": {
    "sourceId": "19",
    "sourceSlug": "vr-magic",
    "title": "VR Magic",
    "subtitle": "Hand Tracking and Gesture-Driven Spatial Interaction in VR",
    "discipline": "xr developer / 3d designer",
    "study": {
      "overview": "A VR spellcasting experiment where hand gestures trigger visual effects and spatial sound.",
      "role": "VR Developer · Visual Effects",
      "ownership": "VR Developer · Visual Effects",
      "features": [
        {
          "title": "Gesture input",
          "contribution": "Connected hand tracking and motion-driven gestures to the spell interaction.",
          "stack": [
            "Unity",
            "C#",
            "Hand tracking"
          ]
        },
        {
          "title": "Spatial effects",
          "contribution": "Built responsive particles and visual effects around the user’s hand movement.",
          "stack": [
            "Real-time VFX",
            "Unity"
          ]
        },
        {
          "title": "Audio feedback",
          "contribution": "Layered spatial audio cues into the interaction to reinforce spell timing and presence.",
          "stack": [
            "Spatial audio",
            "Event feedback"
          ]
        },
        {
          "title": "3D presentation",
          "contribution": "Combined the effects, scene, and interaction into a headset experience.",
          "stack": [
            "VR interaction",
            "3D modeling"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Format",
          "value": "VR interaction study"
        },
        {
          "label": "Feedback",
          "value": "Hand motion, VFX, and audio"
        },
        {
          "label": "Media",
          "value": "Video + effects demo"
        }
      ],
      "media": {
        "src": "/projects/archive/aaa266765af83164-thumb.webp",
        "width": 1280,
        "height": 720,
        "alt": "VR Magic — original project image",
        "caption": "VR Magic preview"
      }
    },
    "notes": [
      {
        "heading": "Approach",
        "items": [
          "Built the experience in Unity with C# and VR-specific interaction patterns.",
          "Used hand tracking and motion-driven feedback to make spellcasting feel responsive.",
          "Layered in visual effects and audio cues to strengthen the illusion of magic."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/aaa266765af83164.webp",
        "thumbnail": "/projects/archive/aaa266765af83164-thumb.webp",
        "width": 1280,
        "height": 720,
        "caption": "VR Magic preview"
      },
      {
        "type": "youtube",
        "src": "https://www.youtube-nocookie.com/embed/TrZ-S4a9k4I",
        "sourceUrl": "https://www.youtube.com/watch?v=TrZ-S4a9k4I",
        "caption": "VR Magic video",
        "thumbnail": "/projects/archive/aaa266765af83164-thumb.webp"
      },
      {
        "type": "video",
        "src": "/projects/archive/fa6d19586c56d307.mp4",
        "thumbnail": "/projects/archive/fa6d19586c56d307-thumb.webp",
        "width": 472,
        "height": 262,
        "animated": true,
        "caption": "Unity VFX Demo"
      }
    ],
    "links": [],
    "year": 2025
  },
  "dragon-roaster": {
    "sourceId": "20",
    "sourceSlug": "dragon-roaster-early-2021",
    "title": "Dragon Roaster",
    "subtitle": "Control a dragon’s fire with webcam body tracking.",
    "discipline": "xr developer / 3d designer",
    "study": {
      "overview": "A PC game where webcam body tracking controls a dragon’s fire: roast the meat and avoid burning the watermelon.",
      "role": "Unity Developer · Motion-Based Interaction",
      "ownership": "Unity Developer · Motion-Based Interaction",
      "features": [
        {
          "title": "Webcam input",
          "contribution": "Integrated a simplified body-tracking setup so players control the game through their movements.",
          "stack": [
            "Unity",
            "Webcam body tracking"
          ]
        },
        {
          "title": "Flame control",
          "contribution": "Mapped the angle between the neck and hands to flame power; opening the hands controls fire breath.",
          "stack": [
            "C#",
            "Pose-angle mapping"
          ]
        },
        {
          "title": "Cooking gameplay",
          "contribution": "Built a scoring loop around accurately roasting meat while avoiding the watermelon.",
          "stack": [
            "Unity",
            "Game logic"
          ]
        },
        {
          "title": "One-week prototype",
          "contribution": "Analyzed the available motion-tracking implementation and connected it to a playable PC game.",
          "stack": [
            "Unity Barracuda",
            "Code integration"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Built",
          "value": "1 week · 2021"
        },
        {
          "label": "Platform",
          "value": "PC + webcam"
        },
        {
          "label": "Input",
          "value": "Body tracking"
        }
      ],
      "media": {
        "src": "/projects/archive/bcbd8d3ca0e808f2-thumb.webp",
        "width": 520,
        "height": 292,
        "alt": "Dragon Roaster — original project image",
        "caption": "Dragon Roaster Gameplay"
      }
    },
    "notes": [
      {
        "heading": "Motion-controlled cooking",
        "items": [
          "Open the hands to control the dragon’s fire breath.",
          "The neck-to-hand angle sets flame power.",
          "Roast meat accurately to score; avoid burning the watermelon."
        ]
      },
      {
        "heading": "Development",
        "paragraphs": [
          "Built in one week in early 2021 using Unity and C#. The project used a simplified webcam-based body-tracking setup and analysis of the linked ThreeDPoseUnityBarracuda implementation."
        ]
      },
      {
        "heading": "Original performance observation",
        "paragraphs": [
          "The original page reports about 28 FPS on a GTX 1070 and identifies the high compute requirement as a limitation of this prototype. This is the recorded 2021 setup, not a current benchmark."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/bcbd8d3ca0e808f2.mp4",
        "thumbnail": "/projects/archive/bcbd8d3ca0e808f2-thumb.webp",
        "width": 520,
        "height": 292,
        "animated": true,
        "caption": "Dragon Roaster Gameplay"
      },
      {
        "type": "image",
        "src": "/projects/archive/ec25d68087ef8c86.webp",
        "thumbnail": "/projects/archive/ec25d68087ef8c86-thumb.webp",
        "width": 794,
        "height": 446,
        "caption": "Dragon Roaster"
      },
      {
        "type": "image",
        "src": "/projects/archive/18e9f49cd91dafb0.webp",
        "thumbnail": "/projects/archive/18e9f49cd91dafb0-thumb.webp",
        "width": 794,
        "height": 446,
        "caption": "Dragon Roaster 1"
      },
      {
        "type": "image",
        "src": "/projects/archive/1921297687989c67.webp",
        "thumbnail": "/projects/archive/1921297687989c67-thumb.webp",
        "width": 794,
        "height": 446,
        "caption": "Dragon Roaster 2"
      },
      {
        "type": "image",
        "src": "/projects/archive/b0f2b99f4ac145ae.webp",
        "thumbnail": "/projects/archive/b0f2b99f4ac145ae-thumb.webp",
        "width": 794,
        "height": 446,
        "caption": "Dragon Roaster 3"
      }
    ],
    "links": [
      {
        "label": "itch.io: Dragon Roaster",
        "href": "https://reatured.itch.io/dragon-roaster"
      },
      {
        "label": "Motion Tracking Script",
        "href": "https://github.com/digital-standard/ThreeDPoseUnityBarracuda"
      }
    ],
    "year": 2021
  },
  "vr-chess": {
    "sourceId": "21",
    "sourceSlug": "vr-chess-2021",
    "title": "VR Chess",
    "subtitle": "Controller-free hand tracking on a life-sized chessboard.",
    "discipline": "xr developer / game developer",
    "study": {
      "overview": "An Oculus Quest chess prototype using controller-free hand gestures to grab and drop life-sized pieces in a virtual room.",
      "role": "VR Developer · Unity Developer",
      "ownership": "VR Developer · Unity Developer",
      "features": [
        {
          "title": "Life-sized board",
          "contribution": "Modeled the chessboard and full-sized pieces for an immersive room-scale scene.",
          "stack": [
            "Blender",
            "Unity"
          ]
        },
        {
          "title": "Hand-gesture input",
          "contribution": "Used Quest hand tracking to select and grab pieces without controller buttons.",
          "stack": [
            "Oculus Quest",
            "Hand tracking"
          ]
        },
        {
          "title": "Grab & drop",
          "contribution": "Implemented gesture-driven picking up and dropping pieces onto the board.",
          "stack": [
            "C#",
            "VR interaction"
          ]
        },
        {
          "title": "Headset iteration",
          "contribution": "Tested and recorded the interaction on Oculus Quest while the controller-free tracking feature was still new.",
          "stack": [
            "Unity",
            "Quest testing"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2021"
        },
        {
          "label": "Platform",
          "value": "Oculus Quest"
        },
        {
          "label": "Input",
          "value": "Hands · No controllers"
        }
      ],
      "media": {
        "src": "/projects/archive/55cfccafcbc18f7e-thumb.webp",
        "width": 452,
        "height": 254,
        "alt": "VR Chess — original project image",
        "caption": "Unity Procedural Animation Demo"
      }
    },
    "notes": [
      {
        "heading": "Spatial chess",
        "paragraphs": [
          "Walk around the full-sized chessboard, view the modeled pieces from any angle, and move them by hand. The pieces and board were modeled in Blender."
        ]
      },
      {
        "heading": "Gesture implementation",
        "paragraphs": [
          "Quest had recently introduced controller-free hand tracking. The experiment replaced controller-button input with hand gestures for grabbing and dropping chess pieces; its demo was recorded directly in Oculus Quest."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/55cfccafcbc18f7e.mp4",
        "thumbnail": "/projects/archive/55cfccafcbc18f7e-thumb.webp",
        "width": 452,
        "height": 254,
        "animated": true,
        "caption": "Unity Procedural Animation Demo"
      },
      {
        "type": "image",
        "src": "/projects/archive/4d6087ca5f6b88f2.webp",
        "thumbnail": "/projects/archive/4d6087ca5f6b88f2-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "ChessSceneFinished20 01 047"
      },
      {
        "type": "image",
        "src": "/projects/archive/66033bb4462b69ef.webp",
        "thumbnail": "/projects/archive/66033bb4462b69ef-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "ChessSceneFinishedDisplay20 01 047"
      },
      {
        "type": "image",
        "src": "/projects/archive/98497f8488c6c8a1.webp",
        "thumbnail": "/projects/archive/98497f8488c6c8a1-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "ChessSceneFinishedView220 01 047"
      }
    ],
    "links": [],
    "year": 2021
  },
  "shaders": {
    "sourceId": "24",
    "sourceSlug": "my-shader-projects",
    "title": "My Shader Projects",
    "subtitle": "GPU Programming and Math-Driven Real-Time Rendering",
    "discipline": "3d designer / game developer",
    "study": {
      "overview": "Eleven GLSL experiments in procedural patterns, signed-distance shapes, lighting, noise, and animation, running directly in a WebGL2 canvas.",
      "role": "Shader Programming · Graphics Development",
      "ownership": "Shader Programming · Graphics Development",
      "features": [
        {
          "title": "Procedural studies",
          "contribution": "Wrote eleven fragment shaders exploring patterns, noise, distance fields, filters, and math-driven motion.",
          "stack": [
            "GLSL",
            "ShaderToy"
          ]
        },
        {
          "title": "Local renderer",
          "contribution": "Built shader compilation, program linking, and a fullscreen-triangle rendering path.",
          "stack": [
            "WebGL2",
            "JavaScript"
          ]
        },
        {
          "title": "Shader uniforms",
          "contribution": "Connected time, resolution, frame, mouse, and date uniforms to the ShaderToy-style mainImage entry point.",
          "stack": [
            "GLSL uniforms",
            "GPU rendering"
          ]
        },
        {
          "title": "Efficient previews",
          "contribution": "Used visibility-based startup and a capped device-pixel ratio to keep embedded studies practical on the web.",
          "stack": [
            "IntersectionObserver",
            "DPR cap 2"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Collection",
          "value": "11 local shader studies"
        },
        {
          "label": "Runtime",
          "value": "WebGL2"
        },
        {
          "label": "Sources",
          "value": "ShaderToy links + GLSL"
        }
      ]
    },
    "notes": [
      {
        "heading": "Pattern and color",
        "items": [
          "Cellular Wave Pattern; Pattern Practice; Pattern Practice Variation.",
          "Noise Practice; Distance Practice; Filter Effects; Teach Shader."
        ]
      },
      {
        "heading": "Shape and light",
        "items": [
          "See Through Practice; Capsule Practice; Sphere with Shade; 3D Practice.",
          "The gallery runs the original GLSL source locally. Only the selected study creates a WebGL canvas."
        ]
      },
      {
        "heading": "Renderer",
        "paragraphs": [
          "A fullscreen triangle drives the fragment shader. ShaderToy-compatible uniforms provide resolution, time, delta time, frame count, mouse, and date. The original renderer uses IntersectionObserver for lazy startup and caps device pixel ratio at 2."
        ]
      }
    ],
    "media": [
      {
        "type": "shader",
        "src": "Wtffzn",
        "sourceUrl": "https://www.shadertoy.com/view/Wtffzn",
        "caption": "Cellular Wave Pattern"
      },
      {
        "type": "shader",
        "src": "ttXfzj",
        "sourceUrl": "https://www.shadertoy.com/view/ttXfzj",
        "caption": "See Through Practice"
      },
      {
        "type": "shader",
        "src": "wlfBRN",
        "sourceUrl": "https://www.shadertoy.com/view/wlfBRN",
        "caption": "Capsule Practice"
      },
      {
        "type": "shader",
        "src": "WlXfz4",
        "sourceUrl": "https://www.shadertoy.com/view/WlXfz4",
        "caption": "Sphere with Shade"
      },
      {
        "type": "shader",
        "src": "tlXfzH",
        "sourceUrl": "https://www.shadertoy.com/view/tlXfzH",
        "caption": "3D Practice"
      },
      {
        "type": "shader",
        "src": "WllBzr",
        "sourceUrl": "https://www.shadertoy.com/view/WllBzr",
        "caption": "Pattern Practice"
      },
      {
        "type": "shader",
        "src": "3t2cDd",
        "sourceUrl": "https://www.shadertoy.com/view/3t2cDd",
        "caption": "Noise Practice"
      },
      {
        "type": "shader",
        "src": "3l2cWd",
        "sourceUrl": "https://www.shadertoy.com/view/3l2cWd",
        "caption": "Distance Practice"
      },
      {
        "type": "shader",
        "src": "3sKfzz",
        "sourceUrl": "https://www.shadertoy.com/view/3sKfzz",
        "caption": "Filter Effects"
      },
      {
        "type": "shader",
        "src": "wtsfzr",
        "sourceUrl": "https://www.shadertoy.com/view/wtsfzr",
        "caption": "Pattern Practice Variation"
      },
      {
        "type": "shader",
        "src": "cs23DW",
        "sourceUrl": "https://www.shadertoy.com/view/cs23DW",
        "caption": "Teach Shader"
      }
    ],
    "links": [
      {
        "label": "ShaderToy",
        "href": "https://www.shadertoy.com/"
      }
    ],
    "year": 2025
  },
  "magic-wand": {
    "sourceId": "11",
    "sourceSlug": "magic-wand-cartoon-shader-blender",
    "title": "Magic Wand · Cartoon Shader",
    "subtitle": "A custom toon material, from color ramps to outlines.",
    "discipline": "3d & simulation designer",
    "study": {
      "overview": "A stylized Blender wand with a custom toon shader, stepped lighting, and an inverted-hull outline.",
      "role": "3D Modeling · Shader Development",
      "ownership": "3D Modeling · Shader Development",
      "features": [
        {
          "title": "Cel-shaded diffuse",
          "contribution": "Used a stepped color ramp to divide lighting into two or three hard shading zones.",
          "stack": [
            "Blender nodes",
            "Color ramps"
          ]
        },
        {
          "title": "Stylized reflection",
          "contribution": "Mapped the Fresnel output through a second ramp for a sharp, flat specular catch.",
          "stack": [
            "Fresnel",
            "Shader nodes"
          ]
        },
        {
          "title": "Outline geometry",
          "contribution": "Duplicated and expanded the mesh with flipped normals to create the black silhouette.",
          "stack": [
            "Inverted hull",
            "Mesh normals"
          ]
        },
        {
          "title": "Glow & rendering",
          "contribution": "Added a restrained emissive wand tip and rendered the material in real time.",
          "stack": [
            "Eevee",
            "Emission"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2024"
        },
        {
          "label": "Style",
          "value": "Non-photorealistic rendering"
        },
        {
          "label": "Renderer",
          "value": "Eevee"
        }
      ],
      "media": {
        "src": "/projects/archive/97c83a6ba6a938cc-thumb.webp",
        "width": 600,
        "height": 338,
        "alt": "Magic Wand · Cartoon Shader — original project image",
        "caption": "Magic Wand – Cartoon Shader in Blender"
      }
    },
    "notes": [
      {
        "heading": "Shader Breakdown",
        "items": [
          "Color ramp on diffuse: Instead of a smooth light-to-shadow gradient, a stepped color ramp snaps shading into 2–3 hard zones — the classic cel-shaded look.",
          "Specular highlight: A second color ramp on the Fresnel output creates a sharp, stylized gloss catch with a flat white zone rather than a gradient bloom.",
          "Outline (inverted hull): A duplicate mesh scaled outward with face normals flipped renders as a solid black outline around the wand — the outline thickens automatically with camera distance.",
          "Emission accent: The wand tip uses an emission node at low intensity for a subtle magical glow without breaking the toon aesthetic."
        ]
      },
      {
        "heading": "Renderer",
        "paragraphs": [
          "All rendering done in Eevee — the real-time renderer is ideal for NPR work because shader feedback is instant, and Eevee's rasterization pipeline handles the inverted hull outline cleanly without Cycles noise."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/97c83a6ba6a938cc.mp4",
        "thumbnail": "/projects/archive/97c83a6ba6a938cc-thumb.webp",
        "width": 600,
        "height": 338,
        "animated": true,
        "caption": "Magic Wand – Cartoon Shader in Blender"
      }
    ],
    "links": [],
    "year": 2024
  },
  "procedural-modeling": {
    "sourceId": "12",
    "sourceSlug": "procedural-modeling-blender-geometry-nodes",
    "title": "Procedural Modeling in Blender",
    "subtitle": "One node graph, adjustable buildings and structures.",
    "discipline": "3d & simulation designer",
    "study": {
      "overview": "Procedural buildings and abstract structures generated entirely through Blender Geometry Nodes.",
      "role": "Procedural Modeling · Generative Design",
      "ownership": "Procedural Modeling · Generative Design",
      "features": [
        {
          "title": "Building generator",
          "contribution": "Extruded floors from a footprint curve and instanced windows on face centers.",
          "stack": [
            "Geometry Nodes",
            "Curve extrusion"
          ]
        },
        {
          "title": "Design variation",
          "contribution": "Randomized building heights and used grid-based instancing for variations.",
          "stack": [
            "Instancing",
            "Random fields"
          ]
        },
        {
          "title": "Abstract structures",
          "contribution": "Applied sine waves and noise-driven transforms to repeated geometry.",
          "stack": [
            "Math nodes",
            "Noise fields"
          ]
        },
        {
          "title": "Live parameters",
          "contribution": "Exposed floor count, window density, and scale as group inputs for immediate updates.",
          "stack": [
            "Group inputs",
            "Parametric design"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2024"
        },
        {
          "label": "Workflow",
          "value": "Non-destructive node graphs"
        },
        {
          "label": "Tool",
          "value": "Blender"
        }
      ],
      "media": {
        "src": "/projects/archive/bea44128b566a955-thumb.webp",
        "width": 1920,
        "height": 1080,
        "alt": "Procedural Modeling in Blender — original project image",
        "caption": "Procedural Modeling in Blender – Geometry Nodes"
      }
    },
    "notes": [
      {
        "heading": "What Was Built",
        "items": [
          "Procedural buildings: A node graph that reads a footprint curve and extrudes floors, adds windows by instancing on face centers, and randomizes height per instance — one graph, infinite building variations.",
          "Abstract structures: Grid-based instancing with math-driven transforms (sine waves, noise fields) to create organic-looking formations from purely geometric logic.",
          "Parametric controls: All key values exposed as group inputs — floor count, window density, building scale — adjustable in real time with immediate mesh updates."
        ]
      },
      {
        "heading": "Why Geometry Nodes",
        "paragraphs": [
          "Traditional modeling requires re-doing work whenever a design changes. A procedural graph is non-destructive by nature — adjusting one parameter ripples through the entire model. For architecture and generative design, this is the correct workflow."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/bea44128b566a955.webp",
        "thumbnail": "/projects/archive/bea44128b566a955-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "Procedural Modeling in Blender – Geometry Nodes"
      }
    ],
    "links": [],
    "year": 2024
  },
  "chess-scene": {
    "sourceId": "13",
    "sourceSlug": "chess-scene-vr-modeling-blender",
    "title": "Chess Scene · VR Modeling",
    "subtitle": "Model on desktop, refine the scale from inside VR.",
    "discipline": "3d & simulation designer / spatial computing developer",
    "study": {
      "overview": "A chess room modeled in Blender and reviewed inside Oculus Quest to refine human-scale proportions.",
      "role": "3D Modeling · VR Design",
      "ownership": "3D Modeling · VR Design",
      "features": [
        {
          "title": "Scene construction",
          "contribution": "Built chess pieces, furniture, room geometry, lighting, and materials on desktop.",
          "stack": [
            "Blender",
            "Scene modeling"
          ]
        },
        {
          "title": "Immersive review",
          "contribution": "Exported the scene to Oculus Quest to judge depth and scale from inside the room.",
          "stack": [
            "Oculus Quest",
            "VR review"
          ]
        },
        {
          "title": "Spatial corrections",
          "contribution": "Revised chair scale, ceiling height, and object spacing based on the immersive review.",
          "stack": [
            "Scale validation",
            "Spatial design"
          ]
        },
        {
          "title": "Iterative delivery",
          "contribution": "Repeated the desktop-to-VR feedback loop through two complete review cycles.",
          "stack": [
            "Blender",
            "Design iteration"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2021"
        },
        {
          "label": "Course focus",
          "value": "Spatial design"
        },
        {
          "label": "Review",
          "value": "2 immersive review cycles"
        }
      ],
      "media": {
        "src": "/projects/archive/66033bb4462b69ef-thumb.webp",
        "width": 2500,
        "height": 1406,
        "alt": "Chess Scene · VR Modeling — original project image",
        "caption": "Chess Scene – VR Modeling in Blender"
      }
    },
    "notes": [
      {
        "heading": "The VR Design Loop",
        "items": [
          "Model in Blender: Initial scene layout, chess pieces, room geometry, and lighting built on desktop.",
          "Export to VR: Scene exported and loaded into an Oculus Quest workspace for immersive review.",
          "Iterate from inside: In VR, proportions that looked correct on a monitor revealed themselves to be off — a chair too large, a ceiling too low. Changes were noted and applied back in Blender.",
          "Repeat: Two full review cycles before the scene felt correctly scaled for a human body inside it."
        ]
      },
      {
        "heading": "What VR Revealed",
        "paragraphs": [
          "Screen-based 3D modeling collapses depth cues. VR restores them. The most important spatial relationships — how far a table sits from a wall, whether a ceiling feels oppressive or open — are nearly impossible to judge on a flat monitor. VR made those calls obvious."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/66033bb4462b69ef.webp",
        "thumbnail": "/projects/archive/66033bb4462b69ef-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "Chess Scene – VR Modeling in Blender"
      },
      {
        "type": "image",
        "src": "/projects/archive/4d6087ca5f6b88f2.webp",
        "thumbnail": "/projects/archive/4d6087ca5f6b88f2-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "Chess scene full view"
      },
      {
        "type": "image",
        "src": "/projects/archive/98497f8488c6c8a1.webp",
        "thumbnail": "/projects/archive/98497f8488c6c8a1-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "Chess scene alternate angle"
      },
      {
        "type": "image",
        "src": "/projects/archive/af9f2dffbe9549b0.webp",
        "thumbnail": "/projects/archive/af9f2dffbe9549b0-thumb.webp",
        "width": 1920,
        "height": 1080,
        "caption": "VR modeling frame"
      },
      {
        "type": "video",
        "src": "/projects/archive/55cfccafcbc18f7e.mp4",
        "thumbnail": "/projects/archive/55cfccafcbc18f7e-thumb.webp",
        "width": 452,
        "height": 254,
        "animated": true,
        "caption": "Procedural animation demo"
      }
    ],
    "links": [],
    "year": 2021
  },
  "bowling-scene": {
    "sourceId": "14",
    "sourceSlug": "bowling-scene-blender",
    "title": "Bowling Scene",
    "subtitle": "Material contrast, atmospheric light, and impact motion.",
    "discipline": "3d & simulation designer",
    "study": {
      "overview": "A stylized bowling alley rendered around glossy lanes, warm overhead lights, and the energy of a strike.",
      "role": "3D Modeling · Lighting · Post-Processing",
      "ownership": "3D Modeling · Lighting · Post-Processing",
      "features": [
        {
          "title": "Material contrast",
          "contribution": "Shaded glossy wood lanes, ceramic-like pins, and a dark resin ball.",
          "stack": [
            "Blender",
            "Material nodes"
          ]
        },
        {
          "title": "Atmospheric light",
          "contribution": "Balanced warm overhead fluorescents with side fills and elongated lane reflections.",
          "stack": [
            "Area lighting",
            "Reflections"
          ]
        },
        {
          "title": "Impact motion",
          "contribution": "Used motion blur on the ball and scattering pins to capture the moment of impact.",
          "stack": [
            "Eevee",
            "Motion blur"
          ]
        },
        {
          "title": "Final treatment",
          "contribution": "Added restrained bloom and corner chromatic aberration to the final render.",
          "stack": [
            "Compositor",
            "Bloom"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2023"
        },
        {
          "label": "Renderer",
          "value": "Eevee"
        },
        {
          "label": "Output",
          "value": "Stylized scene render"
        }
      ],
      "media": {
        "src": "/projects/archive/ede1434fd7f2f19a-thumb.webp",
        "width": 2500,
        "height": 1406,
        "alt": "Bowling Scene — original project image",
        "caption": "Bowling Scene with Blender"
      }
    },
    "notes": [
      {
        "heading": "Scene Details",
        "items": [
          "Lane materials: Glossy polyurethane finish on the wood-grain lanes with a subtle anisotropic reflection that catches overhead lights in long streaks.",
          "Pin and ball shading: Pins use a ceramic-like shader with high specular. The ball uses a dark resin look with subtle subsurface scattering for depth.",
          "Lighting: Bank of overhead fluorescents with slight warm color cast, supplemented by side ambient fills to keep the gutter gutters from going fully dark."
        ]
      },
      {
        "heading": "Post-Processing",
        "items": [
          "Motion blur: Applied to the ball and scattering pins to freeze the impact moment with energy rather than static stillness.",
          "Bloom: Subtle glow around the fluorescent tubes and specular hot-spots — enough to feel cinematic, not enough to blow out the whites.",
          "Chromatic aberration: Slight lens fringe at corners for a shot-on-camera feel."
        ]
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/projects/archive/ede1434fd7f2f19a.webp",
        "thumbnail": "/projects/archive/ede1434fd7f2f19a-thumb.webp",
        "width": 2500,
        "height": 1406,
        "caption": "Bowling Scene with Blender"
      }
    ],
    "links": [],
    "year": 2023
  },
  "door-stop": {
    "sourceId": "15",
    "sourceSlug": "door-stop-functional-3d-design",
    "title": "Door Stop · Functional 3D Design",
    "subtitle": "A parametric TPU wedge tested on real doors and floors.",
    "discipline": "robotics engineer / 3d & simulation designer",
    "study": {
      "overview": "A custom TPU door stop designed around door gap, floor grip, and flexible compression.",
      "role": "Mechanical Design · CAD · 3D Printing",
      "ownership": "Mechanical Design · CAD · 3D Printing",
      "features": [
        {
          "title": "Wedge geometry",
          "contribution": "Modeled a 12° taper and rounded contact edge to transfer the door load into the floor.",
          "stack": [
            "Fusion 360",
            "Parametric CAD"
          ]
        },
        {
          "title": "Grip & compression",
          "contribution": "Designed a ribbed sole and chose flexible TPU for increased floor contact under load.",
          "stack": [
            "TPU",
            "Ribbed geometry"
          ]
        },
        {
          "title": "Print setup",
          "contribution": "Used Shore 95A TPU, 0.2 mm layers, 25% gyroid infill, and a 0.4 mm nozzle.",
          "stack": [
            "FDM printing",
            "PrusaSlicer"
          ]
        },
        {
          "title": "Physical validation",
          "contribution": "Tested three door weights on tile and hardwood to check grip and compression.",
          "stack": [
            "Fit testing",
            "Material testing"
          ]
        }
      ],
      "delivery": [
        {
          "label": "Year",
          "value": "2025"
        },
        {
          "label": "Material",
          "value": "Shore 95A TPU"
        },
        {
          "label": "Test coverage",
          "value": "3 door weights / 2 floor types"
        }
      ],
      "media": {
        "src": "/projects/archive/4d2c5d7d38d28123-thumb.webp",
        "width": 1350,
        "height": 1224,
        "alt": "Door Stop · Functional 3D Design — original project image",
        "caption": "Door Stop – Functional 3D Design"
      }
    },
    "notes": [
      {
        "heading": "The Problem",
        "paragraphs": [
          "Standard rubber door stops fail on smooth floors — they slide, especially under heavy doors. Buying a better one online means guessing about floor material, door gap height, and base thickness. Modeling one means designing exactly for the situation."
        ]
      },
      {
        "heading": "Design Decisions",
        "items": [
          "Material — TPU over PLA: PLA is rigid and slides on tile and hardwood. TPU is flexible and naturally grippy. The sole of the door stop compresses slightly under door weight, increasing contact area and friction with zero slipping.",
          "Wedge geometry: Modeled at 12° taper angle — shallow enough that door weight drives the stop into the floor rather than kicking it forward, steep enough to work across varying door gap heights.",
          "Ribbed sole pattern: Lateral ribs on the bottom face increase grip surface area on both hard floors and low-pile carpet without needing adhesive or suction.",
          "Filleted top edge: Rounded contact face prevents the door edge from riding up and over the stop under lateral load."
        ]
      },
      {
        "heading": "Testing",
        "paragraphs": [
          "Tested across three door weights and two floor types (tile, hardwood). The TPU compression and ribbed sole held across all conditions. Final filament: Shore 95A TPU at 0.2mm layer height, 25% gyroid infill for flex without collapse."
        ]
      }
    ],
    "media": [
      {
        "type": "video",
        "src": "/projects/archive/4d2c5d7d38d28123.mp4",
        "thumbnail": "/projects/archive/4d2c5d7d38d28123-thumb.webp",
        "width": 1350,
        "height": 1224,
        "animated": true,
        "caption": "Door Stop – Functional 3D Design"
      }
    ],
    "links": [],
    "year": 2025
  }
}
