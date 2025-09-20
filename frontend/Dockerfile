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

# ✅ STEP 7: Runtime Stage - Nginx Web Server
# FROM nginx:alpine AS runtime
#
# WHY NGINX?
# - Excellent for serving static files (HTML, CSS, JS, images)
# - High performance and low memory usage
# - Built-in compression, caching, and security features
# - Industry standard for production web servers
#
# WHY nginx:alpine?
# - Alpine Linux: Very lightweight (~15MB)
# - Security-focused: Minimal attack surface
# - Fast startup time
# - Perfect for containerized applications
FROM nginx:alpine AS runtime

# ✅ STEP 8: Copy Built Files to Nginx
# COPY --from=build /app/dist /usr/share/nginx/html
#
# WHAT DOES --from=build DO?
# - Copies files from the "build" stage (not from host)
# - Multi-stage build magic: uses output from previous stage
# - Only the built static files are copied, not source code or node_modules
#
# WHY /usr/share/nginx/html?
# - Nginx's default directory for serving static files
# - Any files placed here are served at the root URL (/)
# - Standard convention for Nginx static file serving
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ STEP 9: SPA Routing Configuration (Optional)
# For single-page apps (SPA) you may add a custom nginx config with try_files
# to ensure client-side routing works (e.g., React Router). See guide for example.
#
# WHY IS THIS NEEDED?
# - React Router handles routing on client-side
# - When user visits /about, server needs to serve index.html
# - Without this, direct URL access to /about would return 404
# - try_files directive: try /about, then fallback to /index.html

# ✅ STEP 10: Port Configuration
# EXPOSE 80
#
# WHAT DOES EXPOSE 80 DO?
# - Documents that container listens on port 80 (HTTP default)
# - Does NOT actually publish the port (use -p 80:80 for that)
# - Helps developers understand the application
# - Used by docker-compose and orchestration tools
EXPOSE 80

# ✅ STEP 11: Start Nginx Server
# CMD ["nginx", "-g", "daemon off;"]
#
# WHAT DOES THIS COMMAND DO?
# - nginx: Start the Nginx web server
# - -g "daemon off;": Run Nginx in foreground mode
# - Required for Docker containers (containers need foreground process)
# - Without this, Nginx would start in background and container would exit
#
# WHY FOREGROUND MODE?
# - Docker containers need a foreground process to stay running
# - If main process exits, container stops
# - Nginx normally runs as daemon (background), but we force foreground
CMD ["nginx", "-g", "daemon off;"]

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