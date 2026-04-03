# Architecture

## Overview
TradeForge is built using Nx monorepo with Angular frontend and NestJS backend.

## Components
- Frontend (Angular)
- Backend API (NestJS)
- WebSocket Gateway (real-time trading)
- Redis (caching / pub-sub)

## Communication
- REST APIs for CRUD
- WebSockets for real-time updates
