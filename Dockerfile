FROM ubuntu:22.04

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common \
    python3.10 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node --version

# Verify versions
RUN python3 --version && pip3 --version && node --version

WORKDIR /app

COPY . /app/

RUN chmod +x install.sh run.sh

CMD ["bash"]