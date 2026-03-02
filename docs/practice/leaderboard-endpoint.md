# Optional Leaderboard Endpoint

If you want shared rankings across learners, you can provide a custom endpoint in Advanced settings.

## Expected request payload

```json
{
  "displayName": "Learner",
  "summary": {
    "scorePercent": 82.5,
    "pointsPercent": 79.3,
    "total": 8,
    "correct": 6,
    "timing": {
      "percentileRank": 64.0,
      "p50ThresholdSeconds": 98.2,
      "p90ThresholdSeconds": 165.4
    },
    "topicBreakdown": []
  },
  "integrity": {
    "attemptId": "abc123",
    "summaryDigest": "xyz987",
    "replayProtection": {
      "nonce": "f3d7...",
      "token": "9k2...",
      "issuedAt": "2026-03-01T11:58:00.000Z"
    }
  },
  "antiReplay": {
    "nonce": "f3d7...",
    "token": "9k2...",
    "issuedAt": "2026-03-01T11:58:00.000Z"
  },
  "submittedAt": "2026-03-01T12:00:00.000Z"
}
```

## Minimal serverless handler example

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("method not allowed", { status: 405 });
    }
    const payload = await request.json();
    if (!payload.displayName || !payload.summary || !payload.integrity) {
      return new Response("invalid payload", { status: 400 });
    }

    const nonceKey = `nonce:${payload.antiReplay?.nonce || ""}`;
    const existingNonce = await env.LEADERBOARD.get(nonceKey);
    if (existingNonce) {
      return new Response("duplicate submission", { status: 409 });
    }

    const entry = {
      displayName: String(payload.displayName).slice(0, 40),
      scorePercent: Number(payload.summary.scorePercent) || 0,
      pointsPercent: Number(payload.summary.pointsPercent) || 0,
      totalTimeSeconds: Number(payload.summary.totalTimeSeconds) || 0,
      attemptId: payload.integrity.attemptId,
      summaryDigest: payload.integrity.summaryDigest,
      submittedAt: payload.submittedAt,
    };

    const existing = JSON.parse((await env.LEADERBOARD.get("scores")) || "[]");
    existing.push(entry);
    existing.sort((a, b) => b.scorePercent - a.scorePercent || a.totalTimeSeconds - b.totalTimeSeconds);
    await env.LEADERBOARD.put("scores", JSON.stringify(existing.slice(0, 100)));
    await env.LEADERBOARD.put(nonceKey, "used", { expirationTtl: 86400 });

    return Response.json({ ok: true, stored: true });
  },
};
```

Use any provider you prefer (Cloudflare Workers, Vercel Functions, Netlify Functions, AWS Lambda).

## Recommended GET response for public viewer

Expose a read-only `GET` endpoint that returns either:

```json
[
  {
    "displayName": "Learner",
    "scorePercent": 82.5,
    "totalTimeSeconds": 108.7,
    "submittedAt": "2026-03-01T12:00:00.000Z"
  }
]
```

or:

```json
{
  "scores": [
    {
      "displayName": "Learner",
      "scorePercent": 82.5,
      "totalTimeSeconds": 108.7,
      "submittedAt": "2026-03-01T12:00:00.000Z"
    }
  ]
}
```

This format is compatible with `docs/practice/leaderboard-viewer.md`.

## Anti-replay recommendation

- Reject repeated `nonce` values for a TTL window (for example 24h).
- Validate `x-idempotency-key` header and bind it to the same nonce and attempt id.
- Store `summaryDigest` and reject duplicate digest submissions from the same learner/profile.
