---
sidebar_label: "List Issues"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Retrieves a list of issues from either a public or private repository. It only returns `open` issues by default.

:::info
**Authentication**

This endpoint supports unauthenticated requests, but a **Personal Access Token (PAT)** is recommended for increased rate limits and access to private data. See [Authentication](../../guides/authentication.md) and [Pagination](../../guides/pagination.md).
:::

:::info
**Pull Requests**

This endpoint might return responses with pull requests, which are identified by `pull_request`.
:::

:::info
**Pagination**
This endpoint supports pagination. See [Pagination](../../guides/pagination.md).
:::

---

## HTTP Request

`GET https://api.github.com/repos/{owner}/{repo}/issues`

### Path Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `owner` | string | **Required.** Account owner of the repository. |
| `repo` | string | **Required.** Repository name. |

### Query Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `page` | integer | Page number of the results to fetch. Default: 1. |
| `state` | string | Current issue state. Options: `open`, `closed`, `all`. Default: `open`. |
| `per_page` | integer | Number of results per page (max 100). |

---

## Example Request

Use the following cURL command to list issues from a repository. Copy and paste the code into a valid terminal, then replace `<TOKEN>`, `{owner}`, and `{repo}` with valid information.

<Tabs>
<TabItem value="bash" label="Bash (cURL)">

```bash
curl -L \
  -X GET \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/{owner}/{repo}/issues?state=open&per_page=10"
```

</TabItem>
<TabItem value="powershell" label="Windows PowerShell">

```powershell
$headers = @{
  "Authorization"        = "Bearer <TOKEN>"
  "Accept"               = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

Invoke-RestMethod -Uri "https://api.github.com/repos/{owner}/{repo}/issues?state=open&per_page=10" -Headers $headers
```

</TabItem>
</Tabs>

---

## Response Example (JSON)
```json
[
    {
        "html_url": "https://github.com/facebook/react/issues/35481",
        "number": 35481,
        "title": "[Compiler Bug]: Hydration error with multiline className",
        "user": {
            "login": "V-iktor"
        },
        "labels": [
            {
                "name": "Type: Bug"
            },
            {
                "name": "Status: Unconfirmed",
                "description": "A potential issue that we haven't yet confirmed as a bug"
            }
        ],
        "state": "open",
        "locked": false,
        "assignees": [],
        "comments": 0,
        "created_at": "2026-01-10T15:53:02Z",
        "updated_at": "2026-01-10T15:53:02Z",
        "closed_at": null,
        "body": "### What kind of issue is this?\n\n- [x] React Compiler core (the JS output is incorrect, or your app works incorrectly after optimization)\n- [ ] babel-plugin-react-compiler ... (truncated for brevity)"
    }
]
```

---

## Response Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `html_url` | string | Direct URL to view the issue on GitHub.com. |
| `number` | integer | Unique issue identifying number within the repository. |
| `title` | string | Issue title. |
| `user.login` | string | Issue's author username. |
| `labels` | array | Label list associated with the issue. |
| `labels[].name` | string | Label name. (e.g., `bug`, `documentation`). |
| `labels[].description` | string | Brief description of each label. |
| `state` | string | Current state of the issue (either `open` or `closed`). |
| `locked` | boolean | Indicates whether or not issue conversation is restricted to collaborators. |
| `assignees` | array | List of users assigned to the issue. |
| `comments` | integer | Total number of comments on the issue. |
| `created_at` | string | Issue creation timestamp in ISO 8601 format. |
| `updated_at` | string | Issue last update timestamp in ISO 8601 format. |
| `closed_at` | string (nullable) | Issue closure timestamp in ISO 8601 format. Returns `null` when open. |
| `body` | string | Main content or description of the issue. Supports Markdown. |

---

## Status Codes

| Status Code | Description |
| :--- | :--- |
| `200` | **OK.** Successful request. Issue list returned in response body. |
| `301` | **Moved permanently.** Repository or resource has been moved to a new location. |
| `404` | **Resource not found.** Repository does not exist or no permission to view. |
| `422` | **Validation failed.** May be returned for semantically invalid requests. However, some invalid parameters may fallback to default behavior and values.|