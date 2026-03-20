#!/bin/bash
# Setup script for Solidity Code Verification skill

set -e

echo "Installing ACP CLI for Solidity Code Verification..."

if [ ! -d "openclaw-acp" ]; then
  git clone https://github.com/Virtual-Protocol/openclaw-acp
  cd openclaw-acp
  npm install
  npm link
  cd ..
else
  echo "ACP CLI already installed"
fi

echo "Setting up ACP identity..."
acp setup

echo "Checking wallet balance..."
acp wallet balance --json

echo "Setup complete! Ready to submit Solidity code verification jobs."
