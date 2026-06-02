# TowerBrook People Expert Engine

The TowerBrook People Engine is a full-stack web app built to discover, research, and analyze companies and people based on investment themes.

## Tech Stack

- Backend: Node Express API server with endpoints to get data from the database and call agents.
- Frontend: React + TanStack Router + Material UI with theme cards, people and company tables, detail views, saved items, and notes.
- Backend: Supabase PostgreSQL database.
- AI: Created agents with Gemini & Tavily in the backend. Gemini is used to clean and structure scraped market data, while Tavily powers the initial theme search.

## Key design choices

- Full-stack web app: Most versatile option to allow non-technical users to use the system (don't need to install a program).
- Specialized agents: Tavily Research was much better at analyzing companies and people, whereas Gemini was used to structure and act as a general agent
- Detailed Analysis: People are linked to a company and an investment theme, so front-line users can explore experts, analyze companies, and capture notes or follow-up actions. A "fit" score for each company is also used to provide a quick overview.

## How to run

### Backend

1. `cd backend`
2. `pnpm install`
3. Set environment variables
4. Start the backend:
    - `pnpm run dev`

### Frontend

1. `cd frontend`
2. `pnpm install`
3. Set environment variables
4. `pnpm run dev`

## Demo

The website can be found at [https://towerbrook-exercise-frontend.onrender.com/](https://towerbrook-exercise-frontend.onrender.com/). Note that there is cold startup latency; Render's spin down after periods of inactivity it will take up to a minute to start it up again.

If none of the tables or pages are loading, please wait. It's just render's free plan latency.

## AI usage

- `backend/src/agents/scraper.ts` uses Gemini to clean Tavily search results into a structured people-and-company schema.
- The app also includes agent routes for research, call prep, and company fit analysis.
- Claude and Copilot were used to generate and check over code.

## Data

The data lives in a Supabase PostgreSQL database. A sample of rows are found in `data/`.

## Improvements

- Add an embedding model for companies and people, allowing detection of similar companies the user has saved, researched, etc. That can be used to create a more quantative matrix.
- Give agents tools for company database APIs, e.g. Crunchbase, Pitchbook, for more reliable data. This would require payment for the API.
- Make the agents more open-ended; the agents didn't write prompts that produced high-quality data.
- Make the system more automous, research and pull new data periodically instead of user prompted. This would just require a lot more tokens.
