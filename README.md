# ONLINE TEACHING SERVICE 

**IMY 320: Multimedia Trends. University of Pretoria, 2026. UX Design Project.**


|  |  |
|---|---|
| Platform| SkillUP |
| Subject| Career Skills |
| Module | IMY 320, University of Pretoria |
| Repository | https://github.com/abdlrhmanhabish/IMY320 |

## Group members

| Name | Student number |
|---|---|
| Abdelrahman Ahmed | 24898008 |
| Cleopatra Kwenda | 23547121 |
| Mosa Leiee | 24735672 |
| Kundai Ndemera | 23941996 |
| Ndamulelo Vele | 23554607 |

## About the project

SkillUP is a website design for teaching career skills online. People can sign up, log in, browse the catalogue, add courses to a cart, check out and work through the lessons while their progress is tracked. This is a front end only project, so there is no real backend. Course data, logins and payments are faked so the pages still feel real to use. The main aim of the project is to develop a platform that provides excellent user experience through research and improvement.

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
│   ├── Landing/                # hero, featured courses, resume strip
│   ├── About.jsx
│   ├── Courses.jsx             # catalogue with search, filters and add to cart
│   ├── CourseDetail.jsx        # full course page and buying panel
│   ├── Cart.jsx                # cart with the saving shown in rands
│   ├── Checkout.jsx            # payment, the waiting screen and the receipt
│   ├── Learning.jsx            # dashboard, daily goal, streak, progress bars
│   └── CoursePlayer.jsx        # lesson player and the completion celebration
├── context/
│   ├── AuthContext.jsx        # fake session, localStorage-backed
│   ├── CartContext.jsx        # cart, localStorage-backed
│   ├── ProgressContext.jsx    # enrolments, lesson ticks, daily goal, streak
│   └── ToastProvider.jsx      # the quiet end of the feedback ladder
├── hooks/
├── data/                      # courses.json, testimonials.json, users.json
└── utils/                     # fakeApi.js, money.js, progress.js
```

`docs/ux/` holds the UEQ research reports for each submission and `docs/design/` holds the
justification documents.

## Testing the prototype

- Any email with a password of eight characters or more logs in. Use `locked@skillup.example` to see a failed login, and `taken@skillup.example` to see a rejected sign up.
- At checkout, any sixteen digits work. A card number ending in `0000` is declined so the error path can be checked.
- Run `window.forceApiFailure(true)` in the browser console to make every request fail, and `window.forceApiFailure(false)` to put it back.