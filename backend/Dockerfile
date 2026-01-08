# Base image with Node.js
FROM node:18-bullseye-slim

# Install Python and dependencies for pdfplumber
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create symlink for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Install Python dependencies
RUN pip3 install --no-cache-dir pdfplumber

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/exams

# Set environment variables
ENV NODE_ENV=production
ENV PYTHONIOENCODING=utf-8

# Start application
CMD ["node", "src/server.js"]
