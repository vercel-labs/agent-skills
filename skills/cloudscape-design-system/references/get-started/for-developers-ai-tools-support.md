---
scraped_at: '2026-04-20T08:51:06+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/for-developers/ai-tools-support/index.html.md
title: AI Tools Support
---

# AI Tools Support

Learn how to use Cloudscape Design System documentation with your AI tools and agents.

## Introduction

Cloudscape ensures AI tools agents have direct access to all our documentation, components specifications, and demos, making it easier for builders to create Cloudscape interfaces. Cloudscape provides each documentation page formatted in Markdown for Large Language Models (LLMs). AI agents discover these pages by using our [LLMs.txt](https://cloudscape.design/llms.txt) file.

## LLMs Support

### What is LLMs.txt?

`/llms.txt` is a proposed [standard](https://llmstxt.org/) for websites designed to help LLMs better understand and process their content. Cloudscape [LLMs.txt](https://cloudscape.design/llms.txt) file provides direct access to all our documentation main sections, it lists all patterns and components, and links to APIs definitions, in a format LLMs can understand. This enables AI agents to help builders generate compliant Cloudscape design and code.

### How to Use LLMs Documentation

Using our LLMs documentation in your AI workflows allows AI agents to generate up to date, correct, and complete designs and code. You can do it in the following ways:

1. **Reference /llms.txt**   : Point your AI agent to `https://<cloudscape_url>/llms.txt`  

  so that it gets aware of the documentation pages available at Cloudscape and how to retrieve them while building. From this point in time, your agent will be aware of all components, patterns, and main sections pages.
2. **Browse Documentation: **   For specific guidance, depending on the intelligence and available tools from your agent, you might need to browse Cloudscape website and provide your AI agent with the Markdown URL of the article that you need assistance with. E.g. `https://<cloudscape_url>/foundation/core-principles/key-concepts/index.html.md`
3. **Use API Definitions for Coding**   : For implementation, you might need to point your AI agent to all the components API definitions using  

`https://<cloudscape_url>/components/index.html.json`   or the specific component API definition URL ( `https://<cloudscape_url>/components/[component]/index.html.json`   ).
4. **Use Components Guidelines for Testing: **  

  For unit and integration tests, point your AI agent to the components Markdown URL. Example: `https://<cloudscape_url>/component/[component]/index.html.md`

### Examples of Prompts

Include the [LLMs.txt](https://cloudscape.design/llms.txt) URL in your AI agent prompts to get better Cloudscape suggestions:

```
"Use the Cloudscape Design System documentation at https://<cloudscape_url>/llms.txt to help me implement a table with filtering capabilities."
```

```
"I'm building a web interface. Using the Cloudscape Design System (https://<cloudscape_url>/llms.txt), help me create an alert component for error messages use https://<cloudscape_url>/components/alert/index.html.json and https://<cloudscape_url>/components/alert/index.html.md for ensuring the code is valid and implement production code, maintainable, and well tested"
```

### Supported LLM Documentation

Each documentation page is available in markdown and the components API definition is available in JSON. These files are intended for LLMs consumption and their structure might change in the future, so you shouldn't use scripts that depend on their structure.

#### 1. Component API Definitions and Guidelines

- **Guidelines Files **   ( `/index.html.md`   ): Implementation guides, combining unit and integration tests specifications with practical examples, design principles, and accessibility standards to ensure proper component usage.
- **API Definition Files **   ( `/index.html.json`   ): Component specifications including types, properties, events, and functions.

#### 2. Get Started, Patterns, Demos, and More

All our documentation pages are available in markdown by appending /index.html.md . This includes get started, patterns, demos, foundations, and contributions guidelines. This provides the AI agent the context you will need for your design or code development.
