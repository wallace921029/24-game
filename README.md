# 24 Game

24 Game is a React single-page card puzzle app built with Vite. The app deals four playable cards and challenges the player to combine their values with arithmetic operators until the result is exactly 24.

The project includes:

- A card-based 24 Game play screen.
- A poker card component showcase.
- React Router routes for the home page, game page, and showcase page.
- A production Docker setup that builds the Vite app and serves the static output through NGINX.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- React Router 7
- Tailwind CSS 4
- shadcn-style UI components
- lucide-react icons
- NGINX for production static hosting

## Project Structure

```text
.
|-- public/                 # Static assets and web app icons
|-- src/
|   |-- components/         # UI, card, and game components
|   |-- hooks/              # Game state hooks
|   |-- lib/                # Shared utilities and deck logic
|   |-- pages/              # Route pages
|   |-- router/             # React Router configuration
|   |-- App.tsx             # App shell
|   `-- main.tsx            # Browser entry point
|-- Dockerfile              # Multi-stage production image
|-- docker-compose.yaml     # One-command Docker Compose deployment
|-- nginx.conf              # NGINX SPA hosting configuration
`-- package.json
```

## Requirements

For local development:

- Node.js LTS
- npm

For Docker deployment on Ubuntu 24.04:

- Docker Engine
- Docker Compose v2

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The development server uses the port configured in `vite.config.ts`. By default, the app is available at:

```text
http://localhost:5174
```

## Production Build

Create a production build:

```bash
npm run build
```

This runs TypeScript project checks with `tsc -b` and then bundles the app with Vite. The generated files are written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Docker Deployment

The production image uses a multi-stage build:

1. `node:lts-alpine` installs dependencies and builds the Vite app.
2. `nginx:stable-alpine` serves the generated `dist/` files.

NGINX does not publish an official `lts` image tag. This project uses the official `stable-alpine` tag so deployments track the current stable NGINX release line.

Build the image manually:

```bash
docker build -t 24-game:latest .
```

Run the container manually:

```bash
docker run -d --name 24-game -p 10024:80 --restart unless-stopped 24-game:latest
```

Open the app:

```text
http://localhost:10024
```

## Docker Compose Deployment

Start the app with Docker Compose:

```bash
docker compose up -d
```

The compose file publishes container port `80` on host port `10024`:

```yaml
ports:
  - "10024:80"
```

Open the app:

```text
http://localhost:10024
```

View logs:

```bash
docker compose logs -f
```

Stop the app:

```bash
docker compose down
```

Rebuild after source changes:

```bash
docker compose up -d --build
```

## Ubuntu 24.04 Server Setup

Install Docker Engine and the Compose plugin using Docker's official Ubuntu installation guide. After Docker is installed, deploy from the project directory:

```bash
docker compose up -d --build
```

The app will be available on port `10024` of the server:

```text
http://SERVER_IP:10024
```

If another service already uses port `10024`, change the left side of the port mapping in `docker-compose.yaml`, for example `"8080:80"`.

## Application Routes

- `/` - Home page
- `/24-game` - Main game page
- `/pokers` - Poker card showcase

The NGINX configuration includes SPA fallback routing, so direct navigation to `/24-game` and `/pokers` works in production.

## Health Check Endpoint

The container serves a simple health endpoint:

```text
GET /health
```

Expected response:

```text
ok
```
