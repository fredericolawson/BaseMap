# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BaseMap is a client-side Next.js application that analyzes Airtable base schemas using Google Gemini AI. It follows a security-first architecture where all operations occur in the browser - no server-side processing or data storage.

## Key Commands

- `npm run dev`: Start development server with Turbopack (faster builds)
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code quality checks
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting without changes

## Architecture Overview

### Core Design Pattern

- **Client-side only**: All API calls (Airtable, Gemini) are made directly from the browser
- **Zero server storage**: Credentials and schema data remain in browser localStorage
- **Component composition**: Page components are broken into focused, single-responsibility components

### Key Directories

- `src/app/`: Next.js App Router pages (main page, security page)
- `src/components/`: Reusable UI components using shadcn/ui library
- `src/hooks/`: Custom React hooks for API interactions and state management
- `src/types/`: TypeScript interfaces for schema and API response structures

### Component Architecture

The main page (`src/app/page.tsx`) composes several focused components:

- `Manager`: Handles Airtable and Gemini credential management and operations
- `SchemaViewer`: Displays fetched Airtable schema in JSON format
- `GeminiAnalysis`: Renders AI analysis with markdown formatting
- `PurgeStorage`: Allows users to clear stored credentials

### Custom Hooks Pattern

State management and API interactions are handled through specialized hooks:

- `useSchemaFetcher`: Manages Airtable API calls and schema extraction
- `useGeminiAnalysis`: Handles Google Gemini API integration
- `useLocalStorage`: Manages browser localStorage for credentials and preferences
- `useSchemaActions`: Provides JSON download/copy functionality

### Key Type Definitions

- `Schema`: Core data structure containing tables and relationships
- `Table`/`Field`: Airtable schema components with type safety
- `Relationship`: Represents links between tables (oneToMany, manyToOne, oneToOne)

## UI Framework

- Uses **shadcn/ui** components library built on Radix UI primitives
- **TailwindCSS** for styling with `cn()` utility for conditional classes
- Component configuration in `components.json` with aliases set up for imports

## Security Model

- All credentials stored in browser localStorage only
- Direct API communication: Browser ↔ Airtable/Gemini APIs
- No intermediate servers or data persistence outside user's browser
- Minimum permission scope recommended for Airtable PATs (`schema.bases:read`)

## Development Notes

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Uses Next.js 15 with App Router
- React 19 for component development
- Zod for runtime type validation
- Prettier for code formatting

## Development Philosophy

- **Responsibility Boundary Principle**: Fix issues at their source rather than adding compensatory logic elsewhere
- **Clean Interface Boundaries**: Each layer should fulfill its responsibilities completely with clear boundaries
- **Error Visibility**: Prioritize making errors visible over making systems appear to work
