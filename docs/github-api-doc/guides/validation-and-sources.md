---
sidebar_position: 6
sidebar_label: "Validation and Sources"
title: "Validation and Sources"
---

This documentation was created using a combination of official GitHub references and practical validation to ensure technical accuracy.

:::info
All tests for the `GET /repos/{owner}/{repo}/issues` endpoint were manually validated through **Windows PowerShell**, **curl**, and **Postman**.
:::

:::note
During practical testing, non-numeric invalid `per_page` values returned `200 OK` and applied default pagination settings instead of triggering a client error.
:::

## Official References

- **GitHub REST API Documentation:** Primary source for endpoint specifications, data types, and status codes.

- **Endpoint Reference:** GitHub [List repository issues](https://docs.github.com/en/rest/issues/issues#list-repository-issues) documentation section.

## Practical Validation

* **Authentication:** Confirmed that a `Bearer` token is required for consistent access, increased rate limits, and permission verification.

* **Pagination:** Verified that the `per_page` parameter correctly limits the JSON array size returned by the server.

* **Query Parameters:** Confirmed that the `state` filter successfully alternates between `open` and `closed` issues.

* **Response Structure:** Validated that the API returns a JSON list (array) of objects with consistent fields such as `number`, `title`, and `state`.

* **Pull Requests:** Confirmed that Pull Requests are returned as part of the issues list, identified by a `pull_request` object within the response.

* **Status Codes:** Verified common HTTP status codes, including `200 OK` for successful requests and `404 Not Found` for invalid repositories.

## Scope
This validation focuses on the core functionality of listing issues. Complex edge cases, such as enterprise-specific repository behaviors or legacy API versions, are currently outside the scope of this project.