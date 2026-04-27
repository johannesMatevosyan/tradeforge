# TradeForge — Real-Time Trading Platform

## Overview
TradeForge is a full-stack trading platform that simulates real-world trading workflows with live market data, order execution, and portfolio tracking.

The project is designed to demonstrate scalable architecture, real-time systems, and clean separation of concerns using modern Angular and NestJS patterns.

---

## ✨ Key Features

### 📊 Real-Time Market Data
- WebSocket-based price streaming (NestJS Gateway)
- Live updates every 1–2 seconds
- Price movement indicators (up/down)

### 💱 Order Management
- MARKET and LIMIT order support
- Frontend + backend validation
- Order execution simulation based on live prices

### ⚙️ Execution Engine
- Backend-driven matching logic:
  - BUY LIMIT → executes when price ≤ limit
  - SELL LIMIT → executes when price ≥ limit
- Automatic order status updates (OPEN → FILLED)

### 📈 Portfolio & Positions
- Derived positions from executed orders
- Live market value calculation
- Real-time unrealized P/L (profit/loss)

### 📊 Portfolio Summary
- Total market value
- Total P/L (live updates)
- Open positions count
- Open orders count

### 👀 Watchlist
- User-specific watchlist (persisted in DB)
- Live price updates with direction indicators
- Click-to-trade (select symbol → prefill order form)

---

## 🏗 Architecture

TradeForge is built using an Nx monorepo with clear domain separation:

```txt
apps/
  frontend/        → Angular application
  backend/         → NestJS API + WebSocket server

libs/
  market-data/     → price streaming (WS)
  orders/          → order form, history, execution logic
  watchlist/       → user watchlist
  shared-types/    → shared domain models
  shared-ui/       → reusable UI components
