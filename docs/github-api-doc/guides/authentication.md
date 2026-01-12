---
sidebar_position: 3
sidebar_label: "Authentication"
title: "Authentication"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Before interacting with the GitHub REST API, it's highly recommended to use a **Personal Access Token (PAT)**. When using proper authentication, rate limits are higher and access to private repositories is allowed.

:::danger
**Treat tokens like passwords. Never share them.**
:::

:::note
This authentication is targeted at making authenticated requests to issue endpoints. While it may work for other operations, those are not the current goal. Anything not mentioned can be left at default values.
:::

## Why Authenticate?

* **Increased Rate Limits:** Unauthenticated requests are limited to **60 per hour per IP**. With a PAT, the rate limit is raised to **5,000 per hour per user**.

* **Private Access:** Authentication is required to list issues from private repositories, among other operations.

* **Increased Security:** Proper authorization ensures only users with secure access can perform specific actions on repositories.

## How to Generate Personal Access Token (PAT)

1. **Sign in** to your GitHub account at https://github.com/login.

2. In the **upper-right corner**, select your **profile picture** > **Settings**.

3. In the left sidebar, select **Developer settings**.

4. Select **Personal access tokens** > **Fine-grained tokens**.

5. Select **Generate new token**.

6. Confirm access by **verifying the email code**.

7. Under **Token name**, enter a descriptive name for the token.

8. Under **Repository access**, select **Public repositories**.

9. Under **Repository permissions**, select on the dropdown next to **Issues** and change it to **Read-only**.

10. Select **Generate token**.

## Using the Personal Access Token

Enter the PAT together with the `Authorization` header of HTTP requests using the `Bearer` scheme.

### Examples

:::note
Examples and authentication were both tested and validated. See [Validation and Sources](./validation-and-sources.md).
:::

Replace `<TOKEN>` with your new PAT, then `{owner}`, and `{repo}` with valid information.

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

:::note
If a token is invalid or expired, the request will return a `401 Unauthorized` error with the message `Bad credentials`.
:::

## Token Scope
While the scope may change in the future with a project expansion, the current version uses a fine-grained PAT with access limited to:

- Public repositories
- Read-only permission

This decision was made to align the documentation with the principle of least privilege.