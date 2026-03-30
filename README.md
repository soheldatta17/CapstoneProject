# EventZen System

A full-stack event management platform for the complete lifecycle of event planning, publishing, ticketing, and attendance tracking.

---

## Table of Contents

1. [Overview](#overview)
2. [Admin Frontend](#admin-frontend)
3. [Consumer Frontend](#consumer-frontend)
4. [Backend API](#backend-api)
5. [Architecture](#architecture)
6. [Technology Stack](#technology-stack)
7. [Installation & Setup](#installation--setup)
8. [Features](#features)
9. [Security](#security)

---

## Overview

EventZen is a comprehensive event management platform composed of three tightly integrated components:

- **Admin Frontend** — Web application for event organizers and administrators
- **Consumer Frontend** — Public-facing web application for event attendees
- **Backend API** — RESTful microservices architecture supporting both frontends

---

## Admin Frontend

**Purpose**: Administrative control panel for event organisers, providing complete event management, financial oversight, and performance monitoring.

**Technology**: React.js, TypeScript, Tailwind CSS

### 1. Dashboard Module
**Features**:
- KPI Cards: Active Events, Recent Bookings, Total Revenue, Pending Requests
- Analytics Charts: Weekly Growth, Sales Trends, Registration Trends
- Real-time Activity Feed
- System-wide statistics and insights

### 2. Events Management Module
**Features**:
- Tabular event list with search, filter, and sort
- Status tracking (Upcoming, Ongoing, Completed, Cancelled)
- Quick inline edit/delete actions
- Event card grid display
- My Events view (admin-specific)

### 3. Create Event Module
**Features**:
- Event details form (name, description, category)
- Date & time configuration with timezone support
- Location setup (online or in-person)
- Multi-tier ticketing configuration
- Media uploads (banner, promotional, sponsor logos)
- Availability window management

### 4. Event Details Module
**Features**:
- Event summary with configuration details
- Attendee roster with full user information
- Sales metrics per ticket tier
- Revenue statistics and occupancy rate
- Real-time attendance tracking

### 5. Calendar Module
**Features**:
- Month/week/day calendar views
- Color-coded event visualization
- Conflict detection for overlapping events
- Venue double-booking prevention
- Click-to-navigate to event details

### 6. Authentication Module
**Features**:
- Secure email/password login
- Admin onboarding with approval workflow
- JWT token-based session management
- Remember me functionality
- Multi-device session tracking
- Secure logout

### 7. Profile Module
**Features**:
- Personal information management
- Profile picture upload and cropping
- Password change functionality
- Two-factor authentication setup
- Login history and active sessions
- Role and permission visibility

### 8. Billing & Finance Module
**Features**:
- Complete transaction history log
- Invoice generation and PDF export
- Revenue summaries (daily, weekly, monthly, yearly)
- Revenue breakdown by event and ticket tier
- Outstanding payments tracking
- Commission calculations
- Refund management

---

## Consumer Frontend

**Purpose**: Public-facing interface for event discovery and ticket booking

**Technology**: React.js, TypeScript, Tailwind CSS

### 1. Public Discovery Module
**Features**:
- Hero landing page with call-to-action
- Featured events carousel
- Platform statistics display
- Category-based browsing
- Unauthenticated event exploration
- Search functionality
- Event filtering and sorting

### 2. Authentication Module
**Features**:
- User registration with email verification
- Phone number verification
- Social login integration
- Password recovery
- Secure JWT-based login

### 3. User Portal
**Features**:
- Personalized dashboard
- Upcoming booked events display
- Event recommendations
- Personal statistics (tickets purchased, events attended)
- Profile management with picture upload
- Notification preferences
- Account settings

### 4. Event Interaction Module
**Features**:
- Full event details page with images
- Event description and metadata
- Location mapping for in-person events
- Organizer information
- Review and rating system
- Interactive ticket tier selection
- Quantity selector (1-99)
- Advanced seat picker for assigned seating
- Price breakdown display
- Promo code application
- Checkout confirmation

### 5. Ticket & Schedule Management
**Features**:
- My Tickets listing with status indicators
- Booking ID and seat assignment display
- QR code generation for entry passes
- Ticket PDF download and sharing
- Personalized event calendar
- Refund request option
- Past events archive
- Ticket status tracking

---

## Backend API

**Purpose**: RESTful microservices providing business logic and data management

**Technology**: Node.js/Express, TypeScript, PostgreSQL

### 1. Authentication Service
**Endpoint**: `/api/auth`

**Capabilities**:
- User registration with email verification
- Secure login with password hashing
- JWT token generation and refresh
- Password recovery via email
- Logout and session termination
- Multi-user authentication support

**Key Endpoints**:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
```

### 2. User Management Service
**Endpoint**: `/api/users`

**Capabilities**:
- User profile retrieval and updates
- Avatar management with image upload
- Password management
- User preferences and settings
- Account deactivation
- User role management

**Key Endpoints**:
```
GET /api/users/{userId}
PATCH /api/users/{userId}
POST /api/users/{userId}/avatar
PATCH /api/users/{userId}/password
GET /api/users/dashboard
```

### 3. Events Engine
**Endpoint**: `/api/events`

**Capabilities**:
- Complete event CRUD operations
- Advanced filtering and search (by category, date, status)
- Real-time capacity management
- Overbooking prevention
- Event status lifecycle management
- Multi-day event support
- Event publishing and archiving

**Key Endpoints**:
```
GET /api/events (with filters)
POST /api/events
GET /api/events/{eventId}
PATCH /api/events/{eventId}
DELETE /api/events/{eventId}
GET /api/events/{eventId}/attendees
GET /api/events/{eventId}/sales-metrics
```

### 4. Speakers Management
**Endpoint**: `/api/speakers`

**Capabilities**:
- Speaker profile creation and management
- Bio and image management
- Event-to-speaker association
- Session scheduling for speakers
- Speaker availability tracking

**Key Endpoints**:
```
POST /api/speakers
GET /api/speakers/{speakerId}
PATCH /api/speakers/{speakerId}
POST /api/events/{eventId}/speakers
GET /api/events/{eventId}/speakers
```

### 5. Venues Management
**Endpoint**: `/api/venues`

**Capabilities**:
- Venue registry maintenance
- Capacity and facility tracking
- Virtual and physical venue support
- Location details management
- Venue availability checking
- Venue-event association

**Key Endpoints**:
```
GET /api/venues
POST /api/venues
GET /api/venues/{venueId}
PATCH /api/venues/{venueId}
GET /api/venues/{venueId}/availability
```

### 6. Billing & Transactions
**Endpoint**: `/api/billing`

**Capabilities**:
- Payment processing and tracking
- Transaction recording (successful, pending, failed)
- Financial aggregation and reporting
- Revenue computation by event/tier
- Refund processing
- Invoice generation
- Payment method management

**Key Endpoints**:
```
POST /api/billing/transactions
GET /api/billing/transactions
GET /api/billing/summary
POST /api/billing/refund
GET /api/billing/invoice/{transactionId}
```

### 7. Dashboard Analytics
**Endpoint**: `/api/dashboard`

**Capabilities**:
- Metrics compilation (events, revenue, users)
- Real-time KPI calculation
- Activity logging and feed
- Trend analysis
- Performance metrics
- Occupancy and capacity analytics

**Key Endpoints**:
```
GET /api/dashboard/metrics
GET /api/dashboard/activity
GET /api/dashboard/trends
GET /api/dashboard/summary
```

---

## Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│         Presentation Layer (Frontends)                  │
│  ┌──────────────────┐        ┌──────────────────┐      │
│  │  Admin Frontend  │        │ Consumer Frontend│      │
│  │    (React)       │        │    (React)       │      │
│  └────────┬─────────┘        └────────┬─────────┘      │
└───────────┼──────────────────────────┼────────────────┘
            │                          │
            └──────────────┬───────────┘
                           │ REST API
            ┌──────────────▼───────────┐
            │    API Gateway / Router   │
            └──────────────┬───────────┘
                           │
┌──────────────────────────▼────────────────────────────────┐
│       Business Logic Layer (Services)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐       │
│  │ Events  │ │ Billing │ │ Users   │ │Dashboard │       │
│  │ Service │ │ Service │ │ Service │ │ Service  │       │
│  └─────────┘ └─────────┘ └─────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│  │ Auth     │ │ Speakers │ │  Venues  │                 │
│  │ Service  │ │ Service  │ │ Service  │                 │
│  └──────────┘ └──────────┘ └──────────┘                 │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│         Data Access Layer (Database)                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │        PostgreSQL Relational Database            │    │
│  │  ┌────────┐ ┌────────┐ ┌──────┐ ┌──────────┐   │    │
│  │  │ Users  │ │ Events │ │Tickets│ │Venues    │   │    │
│  │  └────────┘ └────────┘ └──────┘ └──────────┘   │    │
│  │  ┌──────────────┐ ┌──────────────┐             │    │
│  │  │ Transactions │ │EventSpeakers │             │    │
│  │  └──────────────┘ └──────────────┘             │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Design Principles
- **Modularity**: Each service independently deployable
- **Separation of Concerns**: Clear layer boundaries
- **Scalability**: Horizontal scaling of services
- **Data Consistency**: Single source of truth
- **Security**: Multi-layer authentication and authorization

---

## Features

### Admin Features
✓ Complete event lifecycle management
✓ Real-time dashboard with KPIs
✓ Attendee management and check-in
✓ Financial reporting and analytics
✓ Capacity and inventory management
✓ Calendar-based scheduling
✓ Multi-tier ticketing
✓ Venue and speaker management
✓ Audit logs

### Consumer Features
✓ Event discovery and browsing
✓ Advanced search and filtering
✓ User authentication
✓ Interactive seat selection
✓ Secure payment processing
✓ Ticket management with QR codes
✓ Personal event calendar
✓ Order history
✓ Notifications

### System Features
✓ Real-time ticket tracking
✓ Overbooking prevention
✓ Email notifications
✓ Analytics and reporting
✓ API rate limiting
✓ Multi-event support

---
