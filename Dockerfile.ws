FROM node:20-alpine
RUN apk add --no-cache openssl
RUN corepack enable

WORKDIR /app

# workspace manifest 먼저 복사 (레이어 캐시 활용)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ws/package.json ./apps/ws/
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

# ws 앱과 의존 패키지만 설치
RUN pnpm install --frozen-lockfile --filter @fsd/ws...

# 소스 복사
COPY apps/ws ./apps/ws
COPY packages/api ./packages/api
COPY packages/shared ./packages/shared
COPY packages/config ./packages/config

# 빌드 (prisma generate + tsc)
RUN pnpm --filter @fsd/ws build

ENV NODE_ENV=production
WORKDIR /app/apps/ws
EXPOSE 3002
CMD ["node", "dist/index.js"]
