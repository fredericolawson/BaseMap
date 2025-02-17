# Basemap: Airtable Schema Visualizer

## Overview
Basemap is a minimalist, pixel art-styled web application that visualizes the schema of any Airtable base in JSON format. The app provides a simple interface for users to input their Airtable Personal Access Token (PAT) and Base ID, then displays a clean, organized representation of the base's structure.

## Core Features

### 1. Authentication Input
- Simple form with two fields:
  - Airtable Personal Access Token (PAT) input
  - Base ID input
- Validation for both fields
- Secure handling of PAT (never stored, only used for immediate requests)

### 2. Schema Visualization
- JSON representation of the base schema including:
  - Tables
  - Fields per table
  - Field types
  - Field configurations
  - Relationships between tables
- Collapsible/expandable JSON structure
- Syntax highlighting for better readability

## Technical Architecture

### Frontend Stack
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Pixel art aesthetic using:
  - Custom pixel art icons
  - Pixel-perfect borders and UI elements
  - Retro-styled buttons and inputs

### API Integration
- Direct integration with Airtable API
- Endpoints:
  - Base Metadata: `GET https://api.airtable.com/v0/meta/bases/{baseId}`
    - Returns base information, tables, and fields
  - Table List: `GET https://api.airtable.com/v0/meta/bases/{baseId}/tables`
    - Returns all tables in the base
  - Table Metadata: `GET https://api.airtable.com/v0/meta/bases/{baseId}/tables/{tableId}`
    - Returns detailed schema for specific tables
- Authentication:
  - Uses Airtable Personal Access Token (PAT)
  - Sent via Authorization header: `Authorization: Bearer YOUR_PAT`
- Error handling for:
  - Invalid credentials
  - Rate limiting
  - Network issues
- Response Processing:
  - Transforms API response into simplified JSON structure
  - Organizes schema by tables and fields
  - Highlights relationships between tables

## UI/UX Design

### Theme
- Pixel art aesthetic
- Minimal color palette:
  - Primary: #000000 (Black)
  - Secondary: #FFFFFF (White)
  - Accent: #FF0000 (Red for errors)
  - Background: #F0F0F0 (Light gray)
- Custom pixel art icons for:
  - Expand/collapse buttons
  - Loading states
  - Success/error indicators

### Pixel Art Implementation
- CSS Properties:
  ```css
  .pixel-perfect {
    image-rendering: pixelated;
    image-rendering: crisp-edges; /* Firefox support */
    transform: scale(2); /* Integer scaling */
  }
  ```
- Techniques:
  - Integer scaling for all pixel art elements
  - Grid alignment for pixel-perfect positioning
  - Custom pixel font using Google Fonts "Press Start 2P"
  - Box-shadow for pixel-style borders
  - Disable anti-aliasing on interactive elements
- Components:
  - Pixel art buttons with hover states
  - Retro-style input fields with pixel borders
  - 8-bit style loading animations
  - Pixelated icons (16x16 base size)

### Layout
1. Header
   - App logo (pixel art style)
   - Simple navigation

2. Main Content
   - Input Form Section
     - PAT input field
     - Base ID input field
     - Submit button
   - JSON Visualization Section
     - Collapsible tree structure
     - Monospace font for JSON
     - Copy to clipboard button

3. Footer
   - Basic attribution
   - Links to documentation

## User Flow
1. User lands on homepage
2. Enters Airtable PAT and Base ID
3. Submits form
4. Loading animation appears
5. Schema is fetched and processed
6. JSON visualization is displayed
7. User can interact with the JSON structure

## Error Handling
- Clear error messages for:
  - Invalid PAT
  - Invalid Base ID
  - API rate limiting
  - Network errors
- Pixel art styled error states
- Helpful error recovery suggestions

## Future Enhancements (v2)
- Dark mode support
- Schema export functionality
- Visual diagram view
- Schema change tracking
- Multiple base comparison
- Customizable JSON formatting

## Performance Considerations
- Client-side caching of schema data
- Optimized JSON rendering for large schemas
- Lazy loading of JSON tree components
- Efficient error boundary implementation

## Security Considerations
- No storage of PAT
- Secure API endpoint handling
- Rate limiting
- Input sanitization
- CORS configuration

## Development Guidelines
- Maintain pixel art aesthetic consistency
- Keep UI elements minimal and functional
- Ensure responsive design
- Write comprehensive tests
- Document all components
- Follow TypeScript best practices


## Test credentials
- PAT: patOceRkg5K6Pu5jl.081dccb676fdbc59a52f6231cfafa40062252018589bdde974b0a5c10faa2455
- Base ID: appcpm5cH3mnosUQE