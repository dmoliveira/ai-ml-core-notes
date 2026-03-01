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
    "summaryDigest": "xyz987"
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

    const entry = {
      displayName: String(payload.displayName).slice(0, 40),
      scorePercent: Number(payload.summary.scorePercent) || 0,
      pointsPercent: Number(payload.summary.pointsPercent) || 0,
      totalTimeSeconds: Number(payload.summary.totalTimeSeconds) || 0,
      attemptId: payload.integrity.attemptId,
      submittedAt: payload.submittedAt,
    };

    const existing = JSON.parse((await env.LEADERBOARD.get("scores")) || "[]");
    existing.push(entry);
    existing.sort((a, b) => b.scorePercent - a.scorePercent || a.totalTimeSeconds - b.totalTimeSeconds);
    await env.LEADERBOARD.put("scores", JSON.stringify(existing.slice(0, 100)));

    return Response.json({ ok: true, stored: true });
  },
};
```

Use any provider you prefer (Cloudflare Workers, Vercel Functions, Netlify Functions, AWS Lambda).
