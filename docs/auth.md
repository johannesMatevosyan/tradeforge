# Authentication & Authorization

## Overview

TradeForge uses token-based authentication to identify users and protect private resources.

The authentication flow is based on:

- **JWT access tokens**
- **Refresh tokens**
- **Role-based authorization**
- **Protected API routes**
- **Frontend route guards**

This approach keeps the system scalable and suitable for modern SPA + API architecture.

---

## Goals

The auth system should provide:

- secure user registration and login
- persistent user session
- protected access to trading and portfolio data
- role-based access control for admin or support features
- clear separation between authentication and authorization

---

## Main Concepts

### Authentication
Authentication answers:

> "Who is the user?"

Example:
- login with email and password
- server verifies credentials
- server returns tokens

### Authorization
Authorization answers:

> "What is the user allowed to do?"

Example:
- a normal user can create orders
- an admin can manage users or system settings

---

## Auth Flow

### 1. User registration
The user creates an account with:
- email
- password
- optional profile data

Backend actions:
- validate input
- check if email already exists
- hash password
- save user in database

### 2. User login
The user submits:
- email
- password

Backend actions:
- find user by email
- compare password hash
- generate JWT access token
- generate refresh token
- return auth payload

### 3. Access protected resources
The frontend sends the access token in request headers:

```http
Authorization: Bearer <access_token>