# Judge0 CE (RapidAPI) for code execution

Used by FastAPI `POST /execute` instead of self-hosted Piston.

## Why RapidAPI

- Public Piston (`emkc.org`) is whitelist-only
- Always Free Oracle Ampere (ARM) cannot run the official Piston amd64 image reliably
- Club volume is low (~10 runs/week); RapidAPI Basic pay-per-use is effectively free at that scale

## Setup

1. Create a RapidAPI account: https://rapidapi.com/
2. Subscribe to **Judge0 CE** Basic: https://rapidapi.com/judge0-official/api/judge0-ce
3. Copy the `X-RapidAPI-Key` from the playground / app keys page
4. Our API enforces **20 executes per member per UTC day** (`EXECUTE_DAILY_LIMIT`).  
   RapidAPI plan "Hard Limit" is configured by Judge0 (provider), not by subscribers.

### Local `backend/.env`

```
JUDGE0_RAPIDAPI_KEY=...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

### Heroku Config Vars

Same keys as above (`JUDGE0_RAPIDAPI_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).

## Language mapping

| Frontend | Judge0 language_id |
|----------|--------------------|
| python | 100 (Python 3.12.5) |
| java | 91 (JDK 17) |
| cpp | 105 (GCC 14.1.0) |
| javascript | 93 (Node.js 18.15.0) |

## Smoke test

With backend running and a member JWT:

```bash
curl -s -X POST http://127.0.0.1:8000/execute \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(1+1)"}'
```

Expect `"stdout":"2\n"` and `"exit_code":0`.

## Ops notes

- Rotate the RapidAPI key in the password manager if an exec leaves
- Do not commit keys to git
- Oracle Piston experiments are optional/legacy; see `piston-oracle-setup.md` only if revisiting self-host later
