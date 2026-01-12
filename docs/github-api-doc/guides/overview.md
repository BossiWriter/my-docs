---
sidebar_position: 1
sidebar_label: "Overview"
title: "Overview"
---

:::note
This documentation was built using official GitHub documentation and validated through manual authenticated API requests.
:::

This is a technical documentation project focused on the GitHub REST API and based on real-world use and valid application. This API returns JSON responses and supports multiple request tools. Here, the requests will be made through cURL and PowerShell, which are accessible and popular tools.

---

## GitHub REST API Overview

| Resource | Details |
| :--- | :--- |
| **Base URL** | `https://api.github.com` |
| **Media Type** | `application/vnd.github+json` |
| **Auth** | Personal Access Token (PAT) |
| **Format** | JSON |

---

## Learning Experiences

* Creating tokens and authentication
* Using paginated REST responses efficiently
* Interpreting GitHub API errors and status codes
* Validating requests against real API usage
* Filtering useful JSON metadata from responses
* Implementing the `GET` List Issues request into your workflow

---

## In Scope

As of now, the project contains only a single endpoint thoroughly detailed and explained.

It also contains several global guides that directly tie into the endpoint for additional context to help guide users through processes and solve issues.

The GitHub REST API was chosen for being popular but not overly documented. The official documentation offers multiple examples, edge cases, best practices, and more with enough depth that I can build my own.

`GET` List Issues was chosen as the first endpoint for being complete, providing multiple explanation threads and examples to populate the documentation.

---

## Out of Scope

The scope currently avoids explanation that is unrelated to the endpoint. For instance, while it still has room to expand on GraphQL API, write operations, or webhooks, they will be implemented as necessary.

---

## How to Navigate 

If you already have a token and know how to use the GitHub REST API, skip directly to **`GET` List Issues** for a detailed documentation about the endpoint.

If you don't understand the GitHub REST API or need an authentication token, go to **Quick Start**.

For further direction, follow:

Quick Start → Authentication → Pagination → `GET` List Issues → Errors & Validation

* **New users:** Start with the [Quick Start](./quick-start.md) to make your first authenticated request.

* **Authentication:** Learn how to secure your requests in the [Authentication](../guides/authentication.md) guide.

* **Pagination:** Understand how to handle large datasets in [Pagination](../guides/pagination.md).

* **The Endpoint:** Visit [`GET` List Issues](../reference/endpoints/list-issues.md) for detailed parameter information.

* **Troubleshooting:** Check [Validation and Sources](../guides/validation-and-sources.md) or [Errors and Status Codes](../guides/errors-and-status-codes.md) if you encounter issues.

---

## Target Audience

This documentation is intended for new and experienced developers, as well as technical writers and API consumers looking for validated references and detailed guides for the GitHub REST API.

---

## Documentation Philosophy

This documentation was created with a few core principles in mind:

- **Depth over breadth:** One endpoint, but deeply explained.

- **Validation over assumption:** Every example was tested using the live API.

- **Future-proofing:** The documentation is structured to make it easier to add new guides or endpoints.

- **Readability:** The project is coded and written focused on UI/UX and DX for a smooth experience from top to bottom.

:::note
The current technical documentation is an ongoing project, and was built from the ground as modular to accommodate future expansion through its structure and organization. It's made with Docusaurus in mind using Markdown and Docs-as-code to improve UX/DX.

It will be periodically updated to improve current content and add new ones.
:::