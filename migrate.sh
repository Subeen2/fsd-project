#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd /Users/subeen/projects/fsd-project/apps/web

export DATABASE_URL="$1"
export DIRECT_URL="$2"

npx prisma db push
