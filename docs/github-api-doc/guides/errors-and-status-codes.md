---
sidebar_position: 5
sidebar_label: "Errors and Status Codes"
title: "Errors and Status Codes"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This section aims to list and explain common errors and status codes within this project's scope of issues.

:::warning
The GitHub API intentionally uses ambiguous status codes (`403` and `404`) to avoid leaking information about private resources.
:::

## Global Status Codes

<Tabs>
  <TabItem value="all" label="All Status Codes">

### All Status Codes

This is a global list of all common status codes relevant for this project. While there may be more, they are rare or irrelevant for the scope.

**This list is sorted by numerical order**

| Status Code | Name | Context / When It Happens | Observed Behavior | Client Action |
| :--- | :--- | :--- | :--- | :--- |
| `200` | OK | Successful request | Returns array of issues. If page is out of range, returns empty array `[]`. | Process response normally. Stop pagination if empty. |
| `304` | Not Modified | Conditional request using `If-None-Match` or `If-Modified-Since`. | No response body. **Does not consume rate limit credits**. | Use cached data. Do not retry immediately. |
| `400` | Bad Request | Invalid query parameters or malformed request. | Error message returned in JSON body. | Fix request parameters. Retry only after correction. |
| `401` | Unauthorized | Missing or invalid authentication token. | Returns error message indicating authentication failure. | Provide valid PAT. Retry only after fixing auth. |
| `403` | Forbidden | Primary rate limit exceeded **or** insufficient permissions. | Can indicate rate limit or access restriction. Check headers. | Inspect `x-ratelimit-remaining`. Wait or adjust permissions. |
| `404` | Not Found | Repository does not exist **or** user lacks access. | Same response for both cases. No permission distinction. | Verify repo existence and permissions. Do not retry blindly. |
| `422` | Unprocessable Entity | Valid request but semantically invalid parameters. | Returns detailed validation errors in response body. | Fix input values. Retry after correction. |
| `429` | Too Many Requests | Secondary rate limit triggered (burst traffic). | Temporary block. May include `Retry-After` header. | Back off. Retry after delay. Avoid concurrent bursts. |
| `500` | Internal Server Error | GitHub server error. | Rare. No client fault. | Retry with exponential backoff. |
| `502` | Bad Gateway | Upstream GitHub issue. | Temporary infrastructure failure. | Retry after short delay. |
| `503` | Service Unavailable | GitHub service temporarily unavailable. | Often short-lived outages. | Retry later. Respect backoff. |

  </TabItem>

  <TabItem value="by-category" label="By Error Type">

### Sorted Status Codes

This list groups status codes by behavior to help identify issues based on how the API responds.

#### **Endpoints**

| Status Code | Name | Context / When It Happens | Observed Behavior | Client Action |
| :--- | :--- | :--- | :--- | :--- |
| `404` | Not Found | Incorrect owner or repository name in URL. | Returns "Not Found" message. | Verify the spelling of `{owner}` and `{repo}`. |
| `422` | Unprocessable Entity | Invalid filter values (e.g., wrong date in `since`). | Returns JSON with specific field errors. | Correct the parameter format (ISO 8601). |

#### **Authentication and Access Errors**

| Status Code | Name | Context / When It Happens | Observed Behavior | Client Action |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Unauthorized | Missing or invalid authentication token. | Returns error message indicating authentication failure. | Provide valid PAT. Retry only after fixing auth. |
| `403` | Forbidden | Insufficient permissions for the resource. | Can indicate access restriction. Check token scopes. | Verify token permissions. Contact repo owner if needed. |
| `404` | Not Found | Repository does not exist or user lacks access. | Same response for both cases to hide private resources. | Verify repo existence and permissions. Do not retry blindly. |

#### **Rate Limits and Performance**

| Status Code | Name | Context / When It Happens | Observed Behavior | Client Action |
| :--- | :--- | :--- | :--- | :--- |
| `304` | Not Modified | Conditional request using ETags. | No response body. **Does not consume credits**. | Use cached data. Do not retry immediately. |
| `403` | Forbidden | Primary rate limit exceeded (5,000 req/h). | Check headers for reset time. | Inspect `x-ratelimit-remaining`. Wait for reset. |
| `429` | Too Many Requests | Secondary rate limit triggered (burst traffic). | Temporary block. May include `Retry-After` header. | Back off. Retry after delay. Avoid concurrent bursts. |

#### **Server Errors**

| Status Code | Name | Context / When It Happens | Observed Behavior | Client Action |
| :--- | :--- | :--- | :--- | :--- |
| `500` | Internal Server Error | Unexpected server-side failure. | Generic error message. No client fault. | Retry with exponential backoff. |
| `502` | Bad Gateway | Upstream infrastructure issue. | Temporary communication failure between servers. | Wait a few seconds and retry. |
| `503` | Service Unavailable | GitHub is under heavy load or maintenance. | Service is temporarily offline. | Respect backoff. Check GitHub Status page. |

  </TabItem>
</Tabs>

### Contextual Errors

This section lists status codes split into different tabs for each particular issue to make navigation easier and to list issues for each point individually.

<Tabs>
  <TabItem value="list-issues" label="List Issues">

| Code | Scenario | Deep Dive | Corrective Action |
| :--- | :--- | :--- | :--- |
| `404` | Repository Access | Occurs if the `{owner}` or `{repo}` in the URL is misspelled, or if you are trying to access a private repo with a token that lacks the `repo` scope. | Double-check the URL slug and verify your Token scopes. |
| `422` | Invalid Filters | Triggered when parameters like `since` are not in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ) or when invalid labels are provided. | Ensure all filter values strictly follow the GitHub API data types. |
| `200` | Empty Results | Not an error, but happens when your filters (labels, state, etc.) are so restrictive that no issues match the criteria. | Try broadening your search filters to verify connectivity. |

  </TabItem>

  <TabItem value="pagination" label="Pagination">

| Code | Scenario | Deep Dive | Corrective Action |
| :--- | :--- | :--- | :--- |
| `200` | Out of Bounds | You requested a `page` number higher than the total pages available. Returns `[]`. | Implement a check to stop your loop when an empty array is returned. |
| `403` | Loop Interruption | Your primary Rate Limit credits hit 0 in the middle of a multi-page fetch. | Check `x-ratelimit-reset` and pause the script until the refresh time. |
| `429` | Rapid Navigation | You followed `rel="next"` links too quickly without any delay between requests. | Add a small delay (sleep/wait) between paginated requests. |

  </TabItem>

  <TabItem value="authentication" label="Authentication">

| Code | Scenario | Deep Dive | Corrective Action |
| :--- | :--- | :--- | :--- |
| `401` | Expired Token | Your Personal Access Token (PAT) has reached its expiration date. | Generate a new PAT in GitHub Developer Settings. |
| `401` | Format Error | You forgot the `Bearer` or `token` prefix in the `Authorization` header. | Ensure the header is: `Authorization: Bearer <TOKEN>`. |
| `403` | Scope Restriction | Your token is valid but doesn't have the `repo` permission to read issues from that specific repository. | Update your token scopes to include `repo`. |

  </TabItem>
</Tabs>

## When Does Retry Make Sense?

When making requests, you run into an error. Sometimes, it's valid to simply try the same request again. However, avoid retrying excessively.

:::note
Not all codes should be retried
:::

| Status Code | Retry? | Notes |
|-----------|-------|------|
| `400` | ❌ | Fix request before retrying |
| `401` | ❌ | Authentication issue. |
| `403` | ⚠️ | Retry only if rate-limited. |
| `429` | ✅ | Retry after delay. |
| `5xx` | ✅ | Retry with backoff. |

## Request Errors

If you make a bad request or run into issues with a particular request, the JSON may return an error.

These JSON responses usually contain a readable message and a documentation reference.

### Practical Error Example

Use these exact requests as a point of reference for the error `401 Unauthorized`.

Use an invalid or expired token, or copy this as is to reproduce this error.

<Tabs>
<TabItem value="bash" label="Bash (cURL)">

```bash
curl -i -H "Authorization: Bearer <TOKEN>" "https://api.github.com/repos/facebook/react/issues?per_page=1&page=1"
  ```

  </TabItem>

  <TabItem value="powershell" label="PowerShell">

  ```powershell
$headers = @{
  "Authorization"        = "Bearer <TOKEN>"
  "Accept"               = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
            }

Invoke-RestMethod -Uri "https://api.github.com/repos/facebook/react/issues?per_page=1&page=1" -Headers $headers
```
  </TabItem>
</Tabs>

**JSON Error Response Example:**

```JSON
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest",
  "status": "401"
}
```

:::note
This `401 Unauthorized` bad credentials error happened because the token is invalid. If you simply copy paste the code without changing the `<TOKEN>` for a valid one, the request returns an error. 

It also happens if you mistype your key or use an expired one.
:::