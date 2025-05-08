# ShopifyLens: Product Catalog Intelligence Platform

## Project Vision

ShopifyLens is a specialized web application designed to provide Shopify merchants with deep AI-powered insights into their product catalog. The platform extracts comprehensive product data through Shopify's GraphQL Admin API and leverages Google's Gemini AI to analyze product information, identify patterns, suggest optimizations, and provide strategic recommendations for catalog management.

## Core Principles

1. **Client-Side Security**: Following the BaseMap approach, all operations occur directly in the user's browser with no server intermediary for API credentials or product data
2. **Merchant Empowerment**: Enable merchants to make data-driven decisions about their product catalog through AI insights
3. **Actionable Intelligence**: Focus on providing practical, implementable recommendations rather than abstract analytics
4. **Holistic Analysis**: Consider products both individually and as a collective catalog to identify cross-product opportunities

## Technical Architecture

### Client-Side Only Implementation

- Next.js 15+ application using App Router
- React 19+ for component architecture
- TailwindCSS for responsive styling
- shadcn/ui component library for consistent UI elements
- TypeScript for type safety and developer experience
- Direct browser-to-API communication with no server intermediary

### Data Flow Architecture

1. Browser collects Shopify GraphQL Admin API credentials
2. Direct API calls from browser to Shopify GraphQL endpoint
3. Product data processing and normalization in the browser
4. Direct API calls from browser to Google Gemini with processed data
5. Analysis display and export capabilities

## Authentication Model

- **Shopify Admin API Authentication**: Personal Access Token (PAT) with scoped permissions
- **Required Scopes**: `read_products`, `read_product_listings`
- **API Key Storage**: Browser local storage only, never transmitted to application servers
- **Token Validation**: Local validation before making API requests

## Data Extraction

### GraphQL Query Structure

The application will utilize the Shopify Admin GraphQL API to extract detailed product information for up to 250 products:

```graphql
query GetProductDetails {
  products(first: 250) {
    edges {
      node {
        id
        title
        description
        handle
        productType
        vendor
        status
        createdAt
        updatedAt
        tags
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
              type
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              inventoryQuantity
              price
              compareAtPrice
              selectedOptions {
                name
                value
              }
              metafields(first: 10) {
                edges {
                  node {
                    namespace
                    key
                    value
                    type
                  }
                }
              }
            }
          }
        }
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    }
  }
}
```

## Data Processing & Normalization

The application will transform the GraphQL response into a normalized structure optimized for analysis:

```typescript
interface NormalizedProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  priceRange: {
    min: number;
    max: number;
    currencyCode: string;
  };
  featuredImage?: {
    url: string;
    altText?: string;
  };
  metafields: {
    [namespace: string]: {
      [key: string]: {
        value: string;
        type: string;
      };
    };
  };
  variants: Array<{
    id: string;
    title: string;
    sku: string;
    inventoryQuantity: number;
    price: number;
    compareAtPrice?: number;
    options: {
      [name: string]: string;
    };
    metafields: {
      [namespace: string]: {
        [key: string]: {
          value: string;
          type: string;
        };
      };
    };
  }>;
  collections: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
}
```

## User Interface

### Core Interface Elements

1. **Authentication Panel**
   - Store URL input
   - PAT input with secure field
   - Clear instructions on PAT creation with required scopes
   - Connect button with validation
   
2. **Data Visualization**
   - JSON tree view with collapsible nodes
   - Simple filter controls by product type, vendor, etc.
   
3. **Analysis Configuration**
   - Gemini API key input
   - Customizable analysis prompts with templates
   
4. **Analysis Results**
   - Markdown rendering with proper formatting
   - Code block styling for technical recommendations
   - Exportable analysis

### Workflow Screens

1. **Welcome/Onboarding**
   - Purpose explanation
   - Security assurances
   - Quick start guide
   
2. **Configuration**
   - Credential management
   - Analysis preferences
   
3. **Data Browser**
   - Basic product data explorer
   
4. **Analysis Dashboard**
   - AI-generated insights

## AI Integration

### Google Gemini Implementation

- Integration with Google Generative AI JavaScript SDK
- Use of Gemini 2.0 Flash model
- Basic error handling for API limitations

### Analysis Prompt Engineering

Default prompt template:
```
You are an expert e-commerce product catalog analyst with deep knowledge of Shopify. 
I'm providing you with the product catalog data from my Shopify store in JSON format.

Please analyze this catalog and provide the following insights:

1. Overall catalog assessment: product count, types, price ranges
2. Catalog structure: how products are organized by type, vendor, and collections
3. SEO improvement opportunities: identify products with suboptimal titles, descriptions, or missing metadata
4. Pricing strategy analysis: identify pricing inconsistencies, opportunities for bundling, or repricing
5. Product description quality: evaluate descriptions for completeness, persuasiveness, and SEO value
6. Inventory optimization suggestions
7. Metafield usage patterns and improvement opportunities
8. Product variant organization efficiency
9. Recommendations for product grouping and collection organization
10. Specific actionable improvements for the 3-5 products most needing attention

For each insight, provide concrete, actionable recommendations.

Product Catalog JSON:
```

### Analysis Customization (ESSENTIAL)

Users will be able to customize the analysis prompt with:
- Focus area selection
- Industry-specific templates
- Technical depth adjustment
- Custom question integration
- Saved prompt templates

## Security Implementation

### Data Protection Measures

1. **No Server Storage**
   - All data processes run client-side
   - No product data or credentials stored on servers
   
2. **Local Storage Security**
   - Storage of API credentials in browser local storage
   - Option to purge stored credentials
   
3. **API Communication**
   - Direct browser-to-API communication
   - TLS encryption for all network requests

## Technical Implementation Details

### Framework & Library Stack

- **Frontend**: Next.js 15+, React 19+
- **Styling**: TailwindCSS 4+, shadcn/ui components
- **State Management**: React Context API with hooks
- **Data Fetching**: Custom GraphQL implementation
- **Authentication**: Basic token management
- **Data Processing**: Basic normalization utilities
- **AI Integration**: Google Generative AI SDK
- **Presentation**: React Markdown with syntax highlighting

### Key Custom Hooks

```typescript
// Shopify Authentication
useShopifyAuth(shopDomain: string)

// Product Data Fetching
useProductFetcher(shopDomain: string, accessToken: string)

// Data Processing
useProductNormalizer(rawProducts: any[])

// Local Storage Management
useSecureLocalStorage()

// Gemini Integration
useGeminiAnalysis(apiKey: string)
```

## User Workflows

### Primary User Journey

1. User enters shop domain and creates/enters Shopify PAT
2. Application retrieves product data (up to 250 products)
3. User reviews extracted data in the data browser
4. User enters Gemini API key and customizes analysis prompt
5. Application sends processed data to Gemini for analysis
6. User reviews AI-generated insights and recommendations
7. User exports analysis and/or raw data as needed

## Development Plan

### MVP Features

- Authentication with Shopify Admin API
- Basic product data extraction (up to 250 products)
- Data normalization and basic display
- Customizable analysis prompts (ESSENTIAL)
- Integration with Google Gemini
- Markdown rendering of analysis results
- Export functionality for analysis
- Simple product filtering

## Technical Requirements

- Modern web browser with local storage support
- Shopify Admin API access (appropriate permissions)
- Google Gemini API key
- Stable internet connection

## Conclusion

ShopifyLens MVP provides merchants with a secure, client-side tool to extract product data from their Shopify store and receive AI-powered analysis and recommendations. The focus on customizable prompts ensures merchants can tailor the analysis to their specific needs while maintaining the security benefits of client-side processing.
