<div align="center">

#  Research Paper Finder

**Search, filter, and save real research papers using React and the OpenAlex API**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.19+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![OpenAlex API](https://img.shields.io/badge/API-OpenAlex-E4572E?style=for-the-badge)

![Last Commit](https://img.shields.io/github/last-commit/YOUR-USERNAME/research-paper-finder?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/YOUR-USERNAME/research-paper-finder?style=flat-square)
![Top Language](https://img.shields.io/github/languages/top/YOUR-USERNAME/research-paper-finder?style=flat-square)

[Live Demo]([https://YOUR-LIVE-LINK](https://polite-grass-058b97700.5.azurestaticapps.net/)) · [Report a Bug](https://github.com/Phonkboisad/research-paper-finder/issues)

</div>

---
##  About

Research Paper Finder is a simple web app built with **Vite + React**. It fetches real research papers from the free [OpenAlex API](https://openalex.org) and shows them as cards. You can filter papers by research domain, sort them, and save your favourites in the browser with `localStorage`.

##  Features

-  **Search** papers by any research topic
-  **React components** for the search bar, filters, and paper cards
-  **Loading and error messages** while data is fetched
-  **Filter by research domain** (Computer Science, Medicine, Physics…)
-  **Open access only** filter for free-to-read papers
- ↕ **Sort** by relevance, most cited, newest, or oldest
-  **Save favourite papers** with `localStorage` (they stay after a page refresh)
-  **Responsive layout**: 1 column on mobile, 2 on tablet, 3 on desktop

##  Tech Stack

| Tool | Purpose |
|---|---|
| [Vite](https://vite.dev) | Creates the project and runs the dev server |
| [React](https://react.dev) | Builds the UI with components and state |
| [Tailwind CSS](https://tailwindcss.com) | Styling with utility classes |
| [OpenAlex API](https://developers.openalex.org) | Free research paper data |
| `localStorage` | Saves favourite papers in the browser |

##  Project Structure

```
research-paper-finder/
├── public/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx    # Search input + Show Saved button
│   │   ├── Filters.jsx      # Domain, sort, and open access filters
│   │   └── PaperCard.jsx    # One card for each paper
│   ├── App.jsx              # State, API fetch, filter/sort logic
│   ├── main.jsx             # Entry point, renders <App />
│   └── index.css            # Imports Tailwind
├── .env.example             # Template for the API key
├── index.html
├── package.json
└── vite.config.js           # React + Tailwind plugins
```

##  Reproducibility

These are the versions used to build and test this project.

| Requirement | Version |
|---|---|
| Node.js | 20.19+ or 22.12+ |
| npm | 10+ |
| React / React DOM | 19.x |
| Vite | 8.x |
| Tailwind CSS (`@tailwindcss/vite`) | 4.x |

Exact package versions are locked in `package-lock.json`. Use `npm ci` instead of `npm install` to get the **exact same** dependency tree:

```bash
npm ci
```

### How this project was created from scratch

```bash
# 1. Create a new Vite + React project
npm create vite@latest research-paper-finder
#    → Framework: React
#    → Variant: JavaScript

# 2. Install packages
cd research-paper-finder
npm install

# 3. Install Tailwind CSS for Vite
npm install tailwindcss @tailwindcss/vite
```

Then:
- `vite.config.js` adds the `tailwindcss()` plugin
- `src/index.css` contains `@import "tailwindcss";`

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Phonkboisad/research-paper-finder.git
cd research-paper-finder
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Add your API key

OpenAlex works without a key for a few searches per day. For regular use, get a **free key** at [openalex.org/settings/api](https://openalex.org/settings/api).

Copy the example file:

```bash
cp .env.example .env.local
```

Then open `.env.local` and paste your key:

```
VITE_OPENALEX_KEY=your_key_here
```

> ⚠️ `.env.local` is listed in `.gitignore`, so your key is **never uploaded** to GitHub. Restart `npm run dev` after changing it.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
npm run preview
```

## 🔌 How the API Works

The app calls the OpenAlex **works** endpoint:

```
https://api.openalex.org/works?search=machine%20learning&per_page=24&select=id,title,...
```

```js
async function searchPapers() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    setPapers(data.results.map(...));   // turn results into simple paper objects
  } catch {
    setError("Could not load papers.");
  } finally {
    setLoading(false);
  }
}
```

- `select=` asks only for the fields we need, so responses are smaller
- OpenAlex sends abstracts as an *inverted index* (`{ word: [positions] }`). The `getAbstract()` function rebuilds the normal text.
- The research domain comes from `primary_topic.field.display_name`

##  Testing Core Flows

Manual test checklist:

| # | Test | Expected Result |
|---|---|---|
| 1 | Search with an empty box | "Please enter a research topic." |
| 2 | Search "machine learning" | Loading message, then paper cards |
| 3 | Change the domain filter | Only papers from that domain |
| 4 | Tick "Open access only" | Only free papers ("Read Free Paper") |
| 5 | Sort by "Most cited" | Highest citation count first |
| 6 | Click "Save Paper" → "Show Saved" | Paper appears in the saved list |
| 7 | Refresh the page → "Show Saved" | Saved papers are still there |
| 8 | Turn off Wi-Fi and search | Red error message |

##  Debugging with Browser Tools

Open DevTools with **F12**:

- **Console**: shows JavaScript errors
- **Network**: filter by `openalex` to see each API request, its status (`200`, `429`), and the JSON response
- **Application → Local Storage**: see the `savedPapers` key and its saved data
- **React Developer Tools** (browser extension): inspect components, props, and state

## Responsive Design

| Screen | Layout |
|---|---|
| Mobile | 1 column, buttons stacked |
| Tablet (`sm`) | 2 columns, buttons in a row |
| Desktop (`lg`) | 3 columns |

Test it in DevTools with the **device toolbar** (Ctrl + Shift + M).

##  Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section>`, `<form>`, `<article>`
- The search runs from a real `<form>`, so **Enter** works and every control is keyboard accessible
- Inputs and dropdowns have `aria-label` attributes for screen readers
- Visible focus ring on the search input
- External links open in a new tab with `rel="noopener"`
- Checked with **Lighthouse** (DevTools → Lighthouse → Accessibility)

##  Deployment

This project can be deployed for free on **Vercel**:

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repository
3. Framework preset: **Vite** (build: `npm run build`, output: `dist`)
4. Under **Environment Variables**, add `VITE_OPENALEX_KEY` with your key
5. Click **Deploy**

> Note: Vite puts `VITE_` variables into the browser code, so the key can be seen by visitors. That's fine for a free OpenAlex key, but never use this method for secret or paid keys.

##  Acknowledgements

- Paper data from [OpenAlex](https://openalex.org) (CC0 licensed)


<div align="center">

Made with React + Vite

</div>
