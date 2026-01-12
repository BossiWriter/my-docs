---
sidebar_position: 2
sidebar_label: "Quick Start"
title: "Quick Start"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This quick start guide describes how to get your first response from the GitHub REST API using cURL and PowerShell. For more information, see [Validation and Sources](../guides/validation-and-sources.md).

## Prerequisites

1. GitHub account.
2. Personal Access Token (PAT).
3. cURL or PowerShell.

## Quick Start Overview

1. Create a token.
2. Make your first request.
3. Read the response.
4. Handle pagination.

## Token Creation

This token will replace `<TOKEN>` from codes for authentication. For this Quick Start, use all default settings and values.

For additional information, see [Authentication](../guides/authentication.md).

1. **Sign in** to your GitHub account at https://github.com/login.

2. In the **upper-right corner**, select your **profile picture** > **Settings**.

3. In the left sidebar, select **Developer settings**.

4. Select **Personal access tokens** > **Fine-grained tokens** > **Generate new token**.

## First Request

1. Choose between **cURL** or **PowerShell**.

<Tabs>
<TabItem value="bash" label="Bash (cURL)">

```bash
curl -i -H "Authorization: Bearer <TOKEN>" "https://api.github.com/repos/facebook/react/issues?per_page=1&page=1"
  ```

  </TabItem>

  <TabItem value="powershell" label="PowerShell">

  ```powershell
  $headers = @{
    Authorization = "Bearer <TOKEN>"
    Accept        = "application/vnd.github+json"
              }
Invoke-RestMethod -Uri "https://api.github.com/repos/facebook/react/issues?per_page=1&page=1" -Headers $headers
```
  </TabItem>
</Tabs>

2. Replace `<TOKEN>` with a **valid token**.

3. Run the **request**.

If it returns `200 OK`, you confirmed that your authentication is working and that you can read responses from the GitHub REST API.

However, if it returns `401 Unauthorized`, your token is invalid. Verify that you pasted the token correctly or if it's expired. See [Errors and Status Codes](../guides/errors-and-status-codes.md) for other issues.

## Analyzing Response

A successful response will return a JSON with an array of issue objects and a status code. GitHub has many notable metadata, like `id`, `title`, `state`, `created_at`, and more.

The response includes an HTTP status code, followed by several metadata parameters and the array with the object from the request.

## Understanding Pagination

GitHub REST API responses are paginated by default, even when requesting only one item.

For additional information, see [Pagination](../guides/pagination.md).