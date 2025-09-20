# =============================================================================
# DOCKERFILE EXPLANATION - DETAILED COMMENTS
# =============================================================================

# ✅ STEP 1: Base Image Selection
# FROM node:20-alpine AS base
# 
# WHY node:20-alpine?
# - Alpine Linux: ~5MB base (vs Ubuntu ~70MB) = 93% smaller!
# - Security-focused: Minimal attack surface, fewer vulnerabilities
# - Fast boot time: Quick container startup
# - Node.js 20: LTS version with latest features and security updates
#
# WHY "AS base"?
# - Multi-stage build capability (though not used in this simple Dockerfile)
# - Can reference this stage later if needed
# - Good practice for future scalability
FROM node:20-alpine AS base

# ✅ STEP 2: Working Directory Setup
# WORKDIR /app
#
# WHAT DOES THIS DO?
# - Creates /app directory inside the container (not on your host machine)
# - Sets /app as the current working directory for all subsequent commands
# - Container directory: /app (Linux path)
#
# WHY /app?
# - Standard convention for application directories
# - Clean separation from system directories
# - Security: Avoids cluttering root directory
WORKDIR /app

# ✅ STEP 3: Dependency Installation (Docker Layer Caching Strategy)
# COPY package*.json ./
#
# WHY COPY PACKAGE FILES FIRST?
# - Docker layer caching optimization
# - When source code changes but dependencies don't, Docker reuses cached layers
# - Saves build time and bandwidth
# - Only package.json and package-lock.json are copied (not entire source code)
COPY package*.json ./

# ✅ STEP 4: Production Dependencies Installation
# RUN npm ci --only=production
#
# WHAT IS npm ci?
# - CI/CD optimized command (faster than npm install)
# - Uses package-lock.json for exact version matching
# - Deletes node_modules first, then fresh install
# - More reliable for production builds
#
# WHAT IS --only=production?
# - Installs ONLY production dependencies
# - Skips devDependencies (nodemon, eslint, jest, etc.)
# - Reduces image size by ~80% (from ~250MB to ~50MB)
# - Improves security (fewer packages = smaller attack surface)
# - Faster container startup
RUN npm ci --only=production

# ✅ STEP 5: Application Source Code
# COPY . .
#
# WHY COPY SOURCE CODE LAST?
# - Source code changes frequently
# - Dependencies layer stays cached when only code changes
# - Optimizes build performance
# - Copies all files from host to /app in container
COPY . .

# ✅ STEP 6: Environment Configuration
# ENV PORT=5000
#
# WHAT DOES THIS DO?
# - Sets environment variable PORT=5000 inside container
# - Express.js reads process.env.PORT to determine which port to listen on
# - Makes application configurable without code changes
# - Can be overridden at runtime: docker run -e PORT=3000
ENV PORT=5000

# ✅ STEP 7: Port Documentation
# EXPOSE 5000
#
# WHAT DOES EXPOSE DO?
# - Documents which port the container listens on
# - Does NOT actually publish the port (that's done with -p flag)
# - Helps other developers understand the application
# - Used by docker-compose and orchestration tools
EXPOSE 5000

# ✅ STEP 8: Application Startup
# CMD ["node", "index.js"]
#
# WHAT DOES CMD DO?
# - Defines the default command to run when container starts
# - Only one CMD per Dockerfile (last one wins)
# - Can be overridden: docker run <image> npm start
# - Uses exec form (recommended) for better signal handling
CMD ["node", "index.js"]

# =============================================================================
# BUILD COMMAND: docker build -t todo-backend .
# RUN COMMAND: docker run -p 5000:5000 todo-backend
# =============================================================================