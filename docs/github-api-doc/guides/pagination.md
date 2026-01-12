---
sidebar_position: 4
sidebar_label: "Pagination"
title: "Pagination"
---

The GitHub REST API uses pagination to split large request results into smaller data blocks. When results are split into pages, responses become faster to process, making navigation easier for clients while keeping endpoints from being overwhelmed.

It's a minor trade-off that significantly improves API response times and performance for everyone.

## Pagination Parameters

The GitHub REST API uses two primary query parameters to control pagination requests.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | integer | Returns a specific page number. Default: `1`. |
| `per_page` | integer | Number of items displayed per page. Maximum: `100`. |

---

## Pagination Headers

GitHub doesn't use pagination metadata for body JSON responses, like the total number of pages. Instead, it uses a `Link` HTTP header containing navigation instructions.

Whenever a response is paginated, the `Link` will have a `rel` label. The `Link` can sometimes be omitted if the response fits a single page.

### `Link` Headers

The `Link` header uses `rel` to provide direction to the URL while navigating through page results. 

| Relationship | Description |
| :--- | :--- | :--- | 
| `rel="next"` | Next page of results. |
| `rel="prev"` | Previous page of results. |
| `rel="first"` | First page of results. |
| `rel="last"` | Last page of results. |

### Practical Example

To better understand how this works, let's follow the example below.

**Scenario:**

* You need only **10 issues per page.** `per_page=10`
* You want to look at the **third page.** `page=3`
* You want to **navigate through the results** after reading the third page.

**Request URL:**
`GET https://api.github.com/repos/facebook/react/issues?per_page=10&page=3`

| Relationship | Destination | Generated URL in Header |
| :--- | :--- | :--- |
| `rel="next"` | Page 4 | `.../issues?per_page=10&page=4` |
| `rel="prev"` | Page 2 | `.../issues?per_page=10&page=2` |
| `rel="first"` | Page 1 | `.../issues?per_page=10&page=1` |
| `rel="last"` | Page 21 | `.../issues?per_page=10&page=21` |

:::note
`rel="last"` returns the last page from the repository total, not from your search total. This is why the value is 21 instead of 10.
:::

## Rate Limits

Rate limits exist to control data flow and keep the API stable. GitHub limits your rate based on your authentication.

GitHub uses a credit system for their requests. Every request costs 1 credit. This means that to efficiently work within rate limits, you have to make efficient use of requests.

| Access Type | Rate Limit | Identification Method |
| :--- | :--- | :--- |
| **Unauthenticated** | 60 requests per hour | Identified by IP address. |
| **Authenticated (PAT)** | 5,000 requests per hour | Identified by personal account. |

:::note
A 60 request per hour rate doesn't mean you get only 60 pages. You can request up to 100 pages using a single request.
:::

### Pagination and Limits

When making a request, you use 1 credit. However, navigating through pages with `rel="last"` or `rel="next"` each also use one credit.

You can save credits by making one large request, then filtering it, instead of several smaller ones.

**Efficiency Comparison (Fetching 1,000 Total Issues):**

| Strategy | Items to Fetch | `per_page` value | Total Pages (Requests) | Total Credit Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Default** | 1,000 | 30 | 34 pages | 34 credits |
| **Optimized** | 1,000 | 100 | 10 pages | 10 credits |

The total cost is **34 requests instead of 30** because every request costs **1 credit**, regardless of how many items it contains. 

Since 1,000 / 30 = 33.33, you need 33 full requests plus one final (34th) request to fetch the remaining 10 items.

### Exceeding Limit

Once your limit reaches 0, GitHub stops processing your requests until your limit is refreshed. Any attempt at a request will return a `403 Forbidden` error.

Every response contains headers tracking limit usage:

* **`x-ratelimit-limit`**: Total hourly credit.

* **`x-ratelimit-remaining`**: How many requests you have left for the current window.

* **`x-ratelimit-reset`**: The Unix timestamp countdown (in seconds) for when your hourly quota will be fully restored.

:::tip
To know how many minutes are left until the reset, you can subtract the current time from the value in `x-ratelimit-reset`.
:::

These limits exist to keep APIs safe from unpredicted server overload and DDoS attacks.

Additionally, there's a secondary rate limit that you cannot check. This exists to avoid spam and triggers when too many requests are made within a short time, even if credits are available.

## Behaviors and Observations

**1. Non Numeric Values**
The GitHub API doesn't return an error when you add a string of letters into a page value. Instead, it has a fallback that returns a default value of 30.

`per_page=abc` and `per_page=30` are functionally the same due to this fallback.

**2. Empty page**
Whenever a request asks for a page that is empty or doesn't exist, GitHub API returns `200 OK` with an empty response body `[]`

## Status Codes

| Status Code | Pagination/Rate Limit Context |
| :--- | :--- |
| `200 OK` | The request was successful. If the page is out of range, it returns an empty array `[]`. |
| `304 Not Modified` | The data hasn't changed since your last request. This **does not consume credits** from your limit. |
| `403 Forbidden` | You have reached your primary rate limit. Requests are blocked until the reset time. |
| `429 Too Many Requests` | You have triggered a secondary rate limit by sending requests too quickly. |

:::note
If the page is out of range or empty, it will still return `200 OK` but with an empty array `[]`
:::

---

## Best Practices

Here's a list of industry standards to maximize your use of your requests.

* **Maximize Data per Request**: Set `per_page=100` when retrieving large datasets to preserve hourly rate limits.

* **Avoid Manual URL Construction**: Don't calculate page numbers or increment URLs manually. Instead, navigate them through the `Link` header and follow the `rel` labels.

* **Implement Smart Stopping Logic**: Script pagination loops to terminate immediately upon receiving an empty array `[]` to prevent wasting credits on empty data.

* **Monitor Balance Before Looping**: Check the `x-ratelimit-remaining` header before starting long pagination sequences and ensure that you have enough credits to finish the task.

* **Respect Secondary Limits**: Even with credits available, avoid making many concurrent requests in parallel. Spread your requests over time to avoid triggering a `429 Too Many Requests` error.