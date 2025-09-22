# =============================================================================
# FRONTEND DOCKERFILE EXPLANATION - DETAILED COMMENTS
# =============================================================================

# ✅ STEP 1: Build Stage - Multi-Stage Docker Build
# FROM node:20-alpine AS build
#
# WHAT IS MULTI-STAGE BUILD?
# - Uses multiple FROM instructions in one Dockerfile
# - Each stage can have different base images and purposes
# - Final image only contains what's needed for runtime
# - Reduces final image size significantly
#
# WHY node:20-alpine FOR BUILD?
# - Need Node.js to compile React/Vite application
# - Alpine: Lightweight (~5MB base)
# - Node.js 20: Latest LTS with modern features
# - "AS build": Names this stage for reference in later stages
FROM node:20-alpine AS build

# ✅ STEP 2: Working Directory Setup
# WORKDIR /app
#
# WHAT DOES THIS DO?
# - Creates /app directory inside the build container
# - Sets /app as current working directory for all commands
# - All subsequent COPY and RUN commands execute from /app
# - Separate from host machine directory structure
WORKDIR /app

# ✅ STEP 3: Dependency Installation (Docker Layer Caching)
# COPY package*.json ./
#
# WHY COPY PACKAGE FILES FIRST?
# - Docker layer caching optimization
# - Dependencies change less frequently than source code
# - When only source code changes, Docker reuses cached dependency layer
# - Saves build time and bandwidth
# - Copies package.json and package-lock.json only
COPY package*.json ./

# ✅ STEP 4: Install ALL Dependencies (Including Dev Dependencies)
# RUN npm ci
#
# WHY npm ci (NOT npm ci --only=production)?
# - Frontend needs devDependencies for building (Vite, React, etc.)
# - Build tools like Vite, Babel, PostCSS are in devDependencies
# - These are required to compile JSX, CSS, and create production bundle
# - Final image won't include these (they're only in build stage)
#
# WHAT IS npm ci?
# - CI/CD optimized command
# - Uses package-lock.json for exact versions
# - Faster and more reliable than npm install
RUN npm ci

# ✅ STEP 5: Copy Source Code
# COPY . .
#
# WHY COPY SOURCE CODE AFTER DEPENDENCIES?
# - Source code changes frequently
# - Dependencies layer stays cached when only code changes
# - Optimizes build performance
# - Copies all frontend source files to /app
COPY . .

# ✅ STEP 6: Build Production Bundle
# RUN npm run build
#
# WHAT DOES npm run build DO?
# - Compiles React JSX to JavaScript
# - Bundles all CSS, images, and assets
# - Minifies and optimizes code for production
# - Creates static files in /app/dist directory
# - These static files can be served by any web server
#
# BUILD OUTPUT EXAMPLE:
# /app/dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-abc123.js
#   │   └── index-def456.css
#   └── vite.svg
RUN npm run build

# =============================================================================
# RUNTIME STAGE - PRODUCTION WEB SERVER
# =============================================================================

# ✅ STEP 7: Development Stage - Vite Dev Server
# FROM node:20-alpine AS runtime
#
# WHY DEVELOPMENT MODE?
# - For development, we want hot reload and fast refresh
# - Vite dev server provides instant updates when code changes
# - Better development experience with source maps and debugging
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# ✅ STEP 8: Port Configuration
# EXPOSE 5173
#
# WHAT DOES EXPOSE 5173 DO?
# - Vite dev server default port
# - Documents that container listens on port 5173
# - Matches the development setup
EXPOSE 5173

# ✅ STEP 9: Start Vite Dev Server
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
#
# WHAT DOES THIS COMMAND DO?
# - npm run dev: Start Vite development server
# - --host 0.0.0.0: Allow connections from outside container
# - Required for Docker containers to accept external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# =============================================================================
# MULTI-STAGE BUILD BENEFITS:
# =============================================================================
# Build Stage: ~200MB (Node.js + dependencies + source code)
# Runtime Stage: ~20MB (Nginx + static files only)
# 
# Final image is 90% smaller than single-stage build!
# =============================================================================
#
# BUILD COMMAND: docker build -t todo-frontend .
# RUN COMMAND: docker run -p 3000:80 todo-frontend
# ACCESS: http://localhost:3000
# =============================================================================