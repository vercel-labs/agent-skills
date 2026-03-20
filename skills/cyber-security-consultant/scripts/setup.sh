#!/bin/bash
# Setup script for Cyber Security Consultant skill
# Installs and configures the ACP CLI for use with Cybercentry services

set -e

echo "Installing ACP CLI for Cyber Security Consultant..."

# Clone and install ACP CLI
if [ ! -d "openclaw-acp" ]; then
  git clone https://github.com/Virtual-Protocol/openclaw-acp
  cd openclaw-acp
  npm install
  npm link
  cd ..
else
  echo "ACP CLI already installed"
fi

# Initialize ACP identity
echo "Setting up ACP identity..."
acp setup

# Verify USDC balance
echo "Checking wallet balance..."
acp wallet balance --json

echo "Setup complete! Ready to submit cyber security consultant jobs."
