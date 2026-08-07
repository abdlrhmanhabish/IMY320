# ONLINE TEACHING SERVICE 

**IMY 320: Multimedia Trends. University of Pretoria, 2026. UX Design Project.**


|  |  |
|---|---|
| Platform| |
| Subject|  |
| Module | IMY 320, University of Pretoria |
| Repository | https://github.com/abdlrhmanhabish/IMY320 |

## Group members

| Name | Student number |
|---|---|
| Abdelrahman Ahmed | 24898008 |
| Cleopatra Kwenda | 23547121 |
|  |  |
|  |  |
|  |  |

## About the project

## Tech stack

- **React 19** and **Vite 8** (JavaScript with `.jsx`, not TypeScript)
- **react-router-dom** for routing
- **Plain CSS**: a global stylesheet design-token file. No Tailwind, no
  CSS-in-JS, no component library.
- Local JSON in `src/data/` for mock data, `localStorage` for the simulated session

## Getting started

Requires **Node 20 or newer**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # static analysis
```


## Directory map

```
src/
├── main.jsx
├── App.jsx                    # router
├── config/
│   ├── site.js                # platform name, tagline, nav links
│   ├── auth.js                # providers, legal links, password policy
│   └── credits.js             # EVERY library and asset used, rendered in the footer
├── styles/
│   ├── tokens.css             # primitive and semantic design tokens
│   └── global.css             # reset, base elements, focus ring, utilities
├── components/
│   ├── layout/                # Navbar, Footer, PageShell
│   ├── ui/                    # Button, Input, Card, Modal, Toast, Spinner, Carousel
│   └── auth/                  # AuthPanel, LoginForm, RegisterForm, ProviderButtons
├── pages/
│   ├── Landing.jsx
│   ├── About.jsx
│   └── Auth.jsx
├── context/
│   └── AuthContext.jsx        # fake session, localStorage-backed
├── hooks/
├── data/                      # courses.json, testimonials.json, users.json
└── utils/                     # fakeApi.js, promise plus artificial delay
```

`docs/ux/` holds the three UEQ reports and the design-justification document.
