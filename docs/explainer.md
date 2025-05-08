# BaseMap: Airtable Schema Analyzer

## Overview

BaseMap is a specialized web application designed to help Airtable users understand, analyze, and optimize their base schemas. It serves as a bridge between Airtable's database structure and Google's Gemini AI, allowing users to extract their Airtable schema and generate AI-powered insights and recommendations.

## Core Functionality

BaseMap provides two main functions:

1. **Schema Extraction**: The application fetches and extracts the complete schema of an Airtable base, including tables, fields, relationships, and metadata.

2. **AI Analysis**: It leverages Google's Gemini AI to analyze the schema and provide insights, recommendations, and optimizations based on the structure of the base.

## Technical Architecture

### Client-Side Only Architecture

BaseMap follows a client-side only architecture, meaning all operations occur within the user's browser without server involvement:

- Built with Next.js 15 using the App Router for efficient client-side rendering
- React 19 for component-based UI development
- TailwindCSS for responsive and customizable styling
- Integration with external APIs (Airtable and Google Gemini) directly from the client

### Security Model

Security is a core design principle of BaseMap:

- **Zero Server Storage**: No user data, credentials, or schema information is ever sent to or stored on BaseMap servers
- **Local Storage**: API credentials and preferences are stored exclusively in the browser's local storage
- **Direct API Communication**: The client browser communicates directly with Airtable and Gemini APIs
- **Minimum Permission Scope**: Recommends users create Airtable PATs with the minimum required scope (`schema.bases:read`)

### Component Structure

The application is structured with a clean separation of concerns:

- **UI Components**: Built using shadcn/ui component library for a modern, accessible interface
- **Custom Hooks**: Specialized hooks handle API interactions, state management, and local storage
- **Type Safety**: Comprehensive TypeScript interfaces for schema structure and API responses

## Workflow

1. **Authentication**: Users provide their Airtable Personal Access Token (PAT) and Base ID
2. **Schema Extraction**: The application makes a direct call to the Airtable API to fetch the schema
3. **Visualization**: The extracted schema is displayed in a structured JSON format for review
4. **AI Configuration**: Users provide a Google Gemini API key and can customize the analysis prompt
5. **Analysis**: The schema is sent directly to Google Gemini for AI-powered analysis
6. **Results**: The analysis is rendered with markdown formatting and code highlighting

## Technical Components

### Schema Extraction

The schema extraction process involves:

- Authenticating with the Airtable API using the user's PAT
- Fetching table structure, field types, and relationships 
- Processing the response to identify linked records and table relationships
- Transforming the API response into a normalized schema structure

### Data Types

The application handles several key data structures:

- **Tables**: Collection of fields with metadata and primary key information
- **Fields**: Various field types (text, number, date, links, etc.) with their configuration
- **Relationships**: Connections between tables via linked record fields
- **Schema**: The overall base structure containing tables and their relationships

### AI Integration

Integration with Google Gemini involves:

- Authenticating with the Gemini API using the user's API key
- Crafting a prompt that includes both instructions and the schema JSON
- Using the Gemini 2.0 Flash model for fast, accurate analysis
- Processing the response into formatted markdown output

## Security Implementation

### Client-Side Credential Management

- API keys are stored in browser local storage only
- Keys are accessible only to the application running in the user's browser
- Users can purge stored credentials at any time

### API Request Flow

- **Airtable Flow**: Browser → Airtable API → Browser
- **Gemini Flow**: Browser → Gemini API → Browser

No intermediate servers are involved in the request chain, ensuring maximum data security.

## Design Philosophy

BaseMap is built with several core principles:

1. **Security First**: Client-side architecture that never exposes user data
2. **User Autonomy**: Users maintain full control over their data and credentials
3. **Visual Clarity**: Clean interface focusing on essential information
4. **Actionable Insights**: AI analysis that provides practical recommendations

## Use Cases

BaseMap is particularly valuable for:

- **Database Architects**: Understanding and optimizing complex Airtable structures
- **Airtable Consultants**: Quickly analyzing client bases and providing improvement recommendations
- **Teams**: Documenting database designs and identifying opportunities for optimization
- **Developers**: Understanding data structures when building integrations with Airtable

## Limitations and Considerations

- Requires users to have appropriate Airtable permissions to access schema data
- Limited to the analytical capabilities provided by the Gemini API
- Analysis is dependent on the prompt quality and the LLM's understanding of database concepts
- Currently focuses on schema analysis rather than data analysis

## Technical Requirements

- Modern web browser with local storage support
- Airtable Personal Access Token with `schema.bases:read` scope
- Google Gemini API key for analysis features
- Internet connection to access Airtable and Gemini APIs

## Future Development Opportunities

Potential areas for enhancement include:

- Schema comparison capabilities to track changes over time
- Visual schema representation with diagram generation
- Extended analysis of field usage patterns and optimization opportunities
- Integration with additional AI services for specialized analysis
- Change recommendation implementation through Airtable API

## Conclusion

BaseMap represents a specialized tool in the Airtable ecosystem, focusing on schema understanding and optimization through AI assistance. Its client-side architecture ensures data security while providing valuable insights into database structure and design patterns.
