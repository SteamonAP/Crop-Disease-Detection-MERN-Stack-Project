# Use Python 3.10 as base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY model/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Copy backend files
COPY sp-backend/package*.json ./sp-backend/
WORKDIR /app/sp-backend
RUN npm install

# Copy frontend files
COPY sp-frontend/package*.json ./sp-frontend/
WORKDIR /app/sp-frontend
RUN npm install

# Copy all project files
COPY . .

# Build frontend
WORKDIR /app/sp-frontend
RUN npm run build

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app/sp-backend
CMD ["node", "src/app.js"]
