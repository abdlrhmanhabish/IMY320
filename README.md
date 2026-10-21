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
├── assets/                    # partner logos and photos/ for the hero, About page and courses
├── config/
│   ├── site.js                # platform name, tagline, nav links
│   ├── auth.js                # providers, legal links, password policy
│   └── credits.js             # every library and asset used, shown on the Credits page
├── styles/
│   ├── tokens.css             # primitive and semantic design tokens
│   └── global.css             # reset, base elements, focus ring, utilities
├── components/
│   ├── layout/                # Navbar, Footer, PageShell
│   ├── ui/                    # Button, Input, Card, Modal, Toast, Spinner, Carousel,
│   │                          # StepBar, LevelTag, Certificate, CourseReview,
│   │                          # CourseCard, Badge, Rating, EmptyState
│   └── auth/                  # AuthPanel, LoginForm, RegisterForm, ProviderButtons
├── pages/
│   ├── Landing/                # hero, featured courses, resume strip
│   ├── About.jsx
│   ├── Courses.jsx             # catalogue grid with search, filters and add to cart
│   ├── CourseDetail.jsx        # full course page and buying panel
│   ├── Cart.jsx                # cart with the saving shown in rands
│   ├── Checkout.jsx            # payment, the waiting screen and the receipt
│   ├── Learning.jsx            # dashboard, daily goal, streak, progress bars
│   ├── CoursePlayer.jsx        # lesson player and the completion celebration
│   └── CertificatePage.jsx     # the certificate for a finished course, to download or print
├── context/
│   ├── AuthContext.jsx        # session, kept in the browser
│   ├── CartContext.jsx        # cart, localStorage-backed
│   ├── ProgressContext.jsx    # enrolments, lesson ticks, daily goal, streak
│   └── ToastProvider.jsx      # the quiet end of the feedback ladder
├── hooks/
├── data/                      # courses.json, testimonials.json, users.json
└── utils/                     # fakeApi.js, money.js, progress.js, storage.js, search.js, certificate.js, validate.js
```

`docs/design/` holds the justification documents for Designs A to C and the Design D plan.
`docs/ux/` holds the UEQ research reports for each submission. The Design D evaluation is in
`docs/ux/Evaluation/`, with the test plan, session notes and UEQ answers in its `data/` folder.

## Testing the prototype

- Everything runs in your browser. Nothing you type is sent to a server and no real payment is taken. Do not enter a real password or real card details.
- Carts and progress are saved per account. Logging out clears them from the screen, and logging back in with the same email brings them back.