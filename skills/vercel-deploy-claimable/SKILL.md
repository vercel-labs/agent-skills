---
name: vercel-deploy
description: Build and deploy web UI projects (React, Vue, Svelte, Next.js, etc.) to Vercel cloud or locally. Generate dashboards, widgets, apps, and data visualizations from natural language prompts. Supports framework auto-detection, cloud deployment with shareable URLs, local development serving, and portable uv packages.
metadata:
  author: vercel
  version: "3.0.0"
  features:
    - prompt-to-ui
    - dashboards
    - data-visualization
    - widgets
---

# Deploy

Deploy any project to Vercel or run locally. Supports Vercel cloud deployment (no auth required), local development serving, and **prompt-based UI generation** for dashboards, widgets, and data visualizations.

## How It Works

1. **Ask the user** what they want to do:
   - **Generate** - Create dashboard/widget/app from a prompt
   - **Deploy existing project** - Deploy an existing codebase

2. For **Generate**: Create UI from prompt using component catalog, then deploy
3. For **Deploy**: Choose deployment target (Vercel/Local/uv package)
4. Return deployment URL or local server information

---

## Generate from Prompt (Dashboards, Widgets, Data Viz)

Generate complete UIs from natural language prompts. The AI outputs constrained JSON that renders as React components.

### Usage Flow

```
User: "Create a sales dashboard with revenue metrics, a chart showing monthly trends, and a transactions table"

Claude:
1. Generate JSON using the component catalog
2. Create Next.js project with the generated UI
3. Ask user where to deploy (Vercel/Local/uv)
4. Deploy and return URL
```

### Component Catalog

All generated UIs use this component catalog. Components are type-safe with validated props.

#### Layout Components

| Component | Props | Description |
|-----------|-------|-------------|
| **Dashboard** | `title`, `subtitle`, `children` | Root container for dashboard layouts |
| **Card** | `title`, `subtitle`, `children` | Container with header and content area |
| **Grid** | `columns` (1-4), `gap`, `children` | Responsive grid layout |
| **Stack** | `direction` (row/column), `gap`, `children` | Flex container |
| **Tabs** | `tabs[]`, `defaultTab`, `children` | Tabbed content sections |

#### Data Display Components

| Component | Props | Description |
|-----------|-------|-------------|
| **Metric** | `label`, `valuePath`, `format`, `trend`, `trendDirection` | KPI display with optional trend indicator |
| **Table** | `columns[]`, `dataPath`, `sortable`, `paginated` | Data table with column definitions |
| **List** | `dataPath`, `itemTemplate`, `emptyMessage` | Rendered list from data array |
| **Text** | `content`, `variant` (h1-h6, body, caption) | Typography component |
| **Badge** | `label`, `variant` (success/warning/error/info) | Status indicator |

#### Chart Components

| Component | Props | Description |
|-----------|-------|-------------|
| **LineChart** | `dataPath`, `xKey`, `yKey`, `color`, `title` | Time series / trend lines |
| **BarChart** | `dataPath`, `xKey`, `yKey`, `color`, `horizontal`, `title` | Bar/column charts |
| **PieChart** | `dataPath`, `nameKey`, `valueKey`, `title` | Pie/donut charts |
| **AreaChart** | `dataPath`, `xKey`, `yKey`, `color`, `gradient`, `title` | Filled area charts |
| **Sparkline** | `dataPath`, `color`, `height` | Inline mini chart |

#### Interactive Components

| Component | Props | Description |
|-----------|-------|-------------|
| **Button** | `label`, `action`, `variant`, `disabled` | Clickable button with action |
| **TextField** | `label`, `valuePath`, `placeholder`, `checks[]` | Text input with validation |
| **Select** | `label`, `valuePath`, `options[]`, `placeholder` | Dropdown selector |
| **DatePicker** | `label`, `valuePath`, `range` | Date/date range picker |
| **Toggle** | `label`, `valuePath` | Boolean switch |
| **Search** | `placeholder`, `valuePath`, `debounce` | Search input with debounce |

#### Conditional Components

| Component | Props | Description |
|-----------|-------|-------------|
| **Alert** | `message`, `variant`, `visible` | Conditional alert message |
| **Skeleton** | `width`, `height`, `variant` | Loading placeholder |
| **Empty** | `message`, `icon`, `action` | Empty state display |

### JSON Schema

Generated UIs follow this structure:

```json
{
  "type": "ComponentName",
  "props": { /* component-specific properties */ },
  "visible": { /* optional: conditional visibility */ },
  "children": [ /* optional: nested components */ ]
}
```

### Data Binding

Components access data via `valuePath` using JSONPath expressions:

```json
{
  "type": "Metric",
  "props": {
    "label": "Total Revenue",
    "valuePath": "/analytics/revenue",
    "format": "currency"
  }
}
```

### Conditional Visibility

Show/hide components based on data state:

```json
{
  "type": "Alert",
  "props": { "message": "Error occurred", "variant": "error" },
  "visible": {
    "and": [
      { "path": "/form/hasError" },
      { "not": { "path": "/form/errorDismissed" } }
    ]
  }
}
```

### Actions

Button actions with confirmation and callbacks:

```json
{
  "type": "Button",
  "props": {
    "label": "Export Report",
    "variant": "primary",
    "action": {
      "name": "export_report",
      "params": { "format": "pdf" },
      "confirm": {
        "title": "Export Report?",
        "message": "This will generate a PDF report."
      },
      "onSuccess": { "set": { "/ui/exportComplete": true } }
    }
  }
}
```

### Example: Sales Dashboard

**Prompt**: "Create a sales dashboard with KPIs, a revenue chart, and recent orders table"

**Generated JSON**:
```json
{
  "type": "Dashboard",
  "props": { "title": "Sales Dashboard" },
  "children": [
    {
      "type": "Grid",
      "props": { "columns": 4, "gap": "md" },
      "children": [
        {
          "type": "Card",
          "children": [{
            "type": "Metric",
            "props": {
              "label": "Total Revenue",
              "valuePath": "/analytics/revenue",
              "format": "currency",
              "trend": "+12.5%",
              "trendDirection": "up"
            }
          }]
        },
        {
          "type": "Card",
          "children": [{
            "type": "Metric",
            "props": {
              "label": "Orders",
              "valuePath": "/analytics/orders",
              "format": "number"
            }
          }]
        },
        {
          "type": "Card",
          "children": [{
            "type": "Metric",
            "props": {
              "label": "Customers",
              "valuePath": "/analytics/customers",
              "format": "number"
            }
          }]
        },
        {
          "type": "Card",
          "children": [{
            "type": "Metric",
            "props": {
              "label": "Conversion Rate",
              "valuePath": "/analytics/conversionRate",
              "format": "percent"
            }
          }]
        }
      ]
    },
    {
      "type": "Card",
      "props": { "title": "Revenue Trend" },
      "children": [{
        "type": "LineChart",
        "props": {
          "dataPath": "/analytics/revenueByMonth",
          "xKey": "month",
          "yKey": "revenue",
          "color": "#3b82f6"
        }
      }]
    },
    {
      "type": "Card",
      "props": { "title": "Recent Orders" },
      "children": [{
        "type": "Table",
        "props": {
          "dataPath": "/orders",
          "columns": [
            { "key": "id", "label": "Order ID" },
            { "key": "customer", "label": "Customer" },
            { "key": "amount", "label": "Amount", "format": "currency" },
            { "key": "status", "label": "Status", "component": "Badge" }
          ],
          "sortable": true,
          "paginated": true
        }
      }]
    }
  ]
}
```

### Validation Rules for TextField

```json
{
  "type": "TextField",
  "props": {
    "label": "Email",
    "valuePath": "/form/email",
    "checks": [
      { "fn": "required", "message": "Email is required" },
      { "fn": "email", "message": "Invalid email format" }
    ],
    "validateOn": "blur"
  }
}
```

Available validation functions: `required`, `email`, `minLength`, `maxLength`, `pattern`, `min`, `max`

### Example: Analytics Widget

**Prompt**: "Create a compact widget showing user growth with a sparkline"

**Generated JSON**:
```json
{
  "type": "Card",
  "props": { "title": "User Growth" },
  "children": [
    {
      "type": "Stack",
      "props": { "direction": "row", "gap": "md" },
      "children": [
        {
          "type": "Metric",
          "props": {
            "label": "Active Users",
            "valuePath": "/users/active",
            "format": "number",
            "trend": "+8.2%",
            "trendDirection": "up"
          }
        },
        {
          "type": "Sparkline",
          "props": {
            "dataPath": "/users/dailyActive",
            "color": "#10b981",
            "height": 40
          }
        }
      ]
    }
  ]
}
```

### Example: Data Visualization App

**Prompt**: "Create an app to visualize regional sales with a pie chart breakdown and filter by date range"

**Generated JSON**:
```json
{
  "type": "Dashboard",
  "props": { "title": "Regional Sales Analysis" },
  "children": [
    {
      "type": "Stack",
      "props": { "direction": "row", "gap": "md" },
      "children": [
        {
          "type": "DatePicker",
          "props": {
            "label": "Date Range",
            "valuePath": "/filters/dateRange",
            "range": true
          }
        },
        {
          "type": "Select",
          "props": {
            "label": "Region",
            "valuePath": "/filters/region",
            "options": [
              { "value": "all", "label": "All Regions" },
              { "value": "north", "label": "North" },
              { "value": "south", "label": "South" },
              { "value": "east", "label": "East" },
              { "value": "west", "label": "West" }
            ]
          }
        }
      ]
    },
    {
      "type": "Grid",
      "props": { "columns": 2, "gap": "lg" },
      "children": [
        {
          "type": "Card",
          "props": { "title": "Sales by Region" },
          "children": [{
            "type": "PieChart",
            "props": {
              "dataPath": "/sales/byRegion",
              "nameKey": "region",
              "valueKey": "amount"
            }
          }]
        },
        {
          "type": "Card",
          "props": { "title": "Monthly Comparison" },
          "children": [{
            "type": "BarChart",
            "props": {
              "dataPath": "/sales/monthlyByRegion",
              "xKey": "month",
              "yKey": "amount",
              "color": "#6366f1"
            }
          }]
        }
      ]
    },
    {
      "type": "Card",
      "props": { "title": "Sales Details" },
      "children": [{
        "type": "Table",
        "props": {
          "dataPath": "/sales/transactions",
          "columns": [
            { "key": "date", "label": "Date", "format": "date" },
            { "key": "region", "label": "Region" },
            { "key": "product", "label": "Product" },
            { "key": "amount", "label": "Amount", "format": "currency" }
          ],
          "sortable": true,
          "paginated": true
        }
      }]
    }
  ]
}
```

### Generation Workflow

When generating UIs from prompts:

1. **Parse the prompt** to identify:
   - Type of UI (dashboard, widget, form, app)
   - Required data points and metrics
   - Chart types needed
   - Interactive elements
   - Layout preferences

2. **Generate JSON** using only components from the catalog above

3. **Create Next.js project** with:
   - `app/page.tsx` - Main page with Renderer component
   - `components/ui/` - Component implementations
   - `lib/data.ts` - Sample data structure
   - `lib/actions.ts` - Action handlers

4. **Apply styling** (keep existing fonts/colors):
   - Use Tailwind CSS with the project's existing theme
   - Maintain consistent spacing and typography
   - Use the color palette already defined in the project

5. **Deploy** using user's preferred method

### Sample Data Structure

Generated projects include sample data matching the UI:

```typescript
// lib/data.ts
export const INITIAL_DATA = {
  analytics: {
    revenue: 125000,
    orders: 1420,
    customers: 890,
    conversionRate: 0.032,
    revenueByMonth: [
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 15000 },
      // ...
    ]
  },
  orders: [
    { id: "ORD-001", customer: "Acme Inc", amount: 1250, status: "completed" },
    // ...
  ],
  filters: {
    dateRange: { start: null, end: null },
    region: "all"
  },
  ui: {
    exportComplete: false
  }
};
```

---

## Deployment Options

### Option 1: Vercel (Cloud Deployment)

Packages project and deploys to Vercel. No authentication required.

```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**Returns:** Preview URL (live site) and Claim URL (transfer to your Vercel account)

### Option 2: Local Deployment

Builds the npm project and serves the static output via FastAPI.

```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy-local.sh [path] [port]
```

**Arguments:**
- `path` - Directory to deploy (defaults to current directory)
- `port` - Port to serve on (defaults to 8000)

**Returns:** Local URL (e.g., http://localhost:8000)

### Option 3: Package for uv

Creates a portable package with a run script that uses `uv` to serve the built project.

```bash
bash /mnt/skills/user/vercel-deploy/scripts/package-uv.sh [path] [output-dir]
```

**Arguments:**
- `path` - Directory to package (defaults to current directory)
- `output-dir` - Where to create the package (defaults to `./deploy-package`)

**Returns:** Path to the generated package with instructions

## Usage Flow

When a user asks to deploy, **always ask which option they prefer**:

```
How would you like to deploy this project?

1. **Vercel** - Deploy to cloud (get shareable URL)
2. **Local** - Run locally on your machine
3. **Package for uv** - Create portable package to run anywhere
```

## Output Examples

### Vercel Deployment
```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...
```

### Local Deployment
```
Building project...
npm install completed
npm run build completed
Starting local server...

Local server running at: http://localhost:8000
Press Ctrl+C to stop the server
```

### Package for uv
```
Building project...
Creating uv package...
Package created at: ./deploy-package

To run the package:
  cd ./deploy-package
  ./run.sh

Or with uv directly:
  cd ./deploy-package
  uv run server.py
```

## Framework Detection

Auto-detects frameworks from `package.json`. Supported frameworks include:

- **React**: Next.js, Gatsby, Create React App, Remix, React Router
- **Vue**: Nuxt, Vitepress, Vuepress, Gridsome
- **Svelte**: SvelteKit, Svelte, Sapper
- **Other Frontend**: Astro, Solid Start, Angular, Ember, Preact, Docusaurus
- **Build Tools**: Vite, Parcel
- **And more**: Blitz, Hydrogen, RedwoodJS, Storybook, Sanity, etc.

For static HTML projects (no `package.json`), framework is set to `null`.

## Present Results to User

### For Vercel:
```
Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

View your site at the Preview URL.
To transfer this deployment to your Vercel account, visit the Claim URL.
```

### For Local:
```
Local server is running!

URL: http://localhost:8000

The server will keep running until you stop it with Ctrl+C.
```

### For uv Package:
```
Package created successfully!

Location: ./deploy-package

To run anywhere with uv installed:
  cd ./deploy-package
  ./run.sh

Requirements: uv (https://github.com/astral-sh/uv), Python 3.11+
```

## Troubleshooting

### Vercel Network Egress Error

If deployment fails due to network restrictions (common on claude.ai):

```
Deployment failed due to network restrictions. To fix this:

1. Go to https://claude.ai/settings/capabilities
2. Add *.vercel.com to the allowed domains
3. Try deploying again
```

### Local Deployment - npm not found

```
npm is required for building the project. Please install Node.js:
https://nodejs.org/
```

### Local Deployment - Build failed

Check the build output for errors. Common issues:
- Missing dependencies: Run `npm install` first
- Build script missing: Ensure `package.json` has a `build` script

### Package for uv - uv not found

The generated package requires `uv` to run. Install it:
```
curl -LsSf https://astral.sh/uv/install.sh | sh
```
