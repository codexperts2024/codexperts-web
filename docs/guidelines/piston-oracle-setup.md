# Piston on Oracle Cloud (codeXperts)

> **Status (2026-07):** Superseded for MVP by **Judge0 CE on RapidAPI**.  
> See [`judge0-rapidapi-setup.md`](./judge0-rapidapi-setup.md).  
> Keep this doc only if revisiting self-hosted Piston (requires **x86/AMD**, not Ampere ARM).

Self-hosted Piston for `/execute`. Replaces the public `emkc.org` API (whitelist-only as of 2026-02-15).

**Owner:** club Oracle tenancy (not a personal gaming account)  
**Region:** Canada Southeast (Toronto) `ca-toronto-1` preferred  
**Consumers:** Heroku FastAPI (`PISTON_API_URL`) and local `backend/.env`

---

## Architecture

```
Browser → Heroku FastAPI POST /execute → Oracle VM Piston :2000
                (auth + limits)              (sandbox only)
```

- Do **not** colocated this with a game server (e.g. Palworld). Separate Always Free instance.
- Frontend never calls Piston directly.

`PISTON_API_URL` must be the API **prefix** (no trailing slash):

| Host | `PISTON_API_URL` | Full execute URL |
|------|------------------|------------------|
| Self-hosted | `http://<PUBLIC_IP>:2000/api/v2` | `.../api/v2/execute` |
| Public (legacy) | `https://emkc.org/api/v2/piston` | `.../piston/execute` |

---

## Phase 0 — Club Oracle account

1. Create / use a **club** Oracle Cloud account (shared mailbox + 2FA with execs).
2. Do **not** reuse a personal tenancy that already runs unrelated workloads.
3. Complete identity verification if Always Free signup requires it.
4. Store: tenancy OCID, home region, admin user emails in the club password manager (not in git).

---

## Phase 1 — Always Free VM (Toronto)

**Console:** Compute → Instances → Create instance

Suggested shape (Always Free eligible; exact labels vary by console UI):

| Setting | Value |
|---------|--------|
| Name | `codexperts-piston` |
| Compartment | root (or `codexperts`) |
| Placement | `ca-toronto-1` (or nearest Free-eligible AD) |
| Image | Ubuntu 22.04 or 24.04 |
| Shape | Ampere **VM.Standard.A1.Flex** (Always Free) |
| OCPUs | 2 (enough for MVP; raise later within free quota) |
| Memory | 12 GB (or split quota with other Free VMs) |
| Networking | New VCN or existing; assign **public IP** |
| SSH | Upload club public key; keep private key in password manager |

After create:

1. Note **Public IP**.
2. Security List / NSG ingress:
   - SSH `22` from admin IPs only (preferred), or temporarily `0.0.0.0/0` then lock down
   - Piston `2000/tcp` from **Heroku egress** if known; otherwise `0.0.0.0/0` for MVP and plan IP allowlist later
3. SSH in:

```bash
ssh -i ~/.ssh/codexperts_oracle ubuntu@<PUBLIC_IP>
```

(Username may be `ubuntu` or `opc` depending on image.)

---

## Phase 2 — Docker + Piston

On the VM:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"
# log out / back in so docker group applies
```

Run Piston (official image; needs `--privileged` for Isolate):

```bash
sudo mkdir -p /opt/piston && cd /opt/piston
sudo docker run \
  --privileged \
  -v /opt/piston/data:/piston \
  -d \
  --restart unless-stopped \
  -p 2000:2000 \
  --name piston_api \
  ghcr.io/engineer-man/piston
```

Smoke check (from your laptop):

```bash
curl -s "http://<PUBLIC_IP>:2000/api/v2/runtimes" | head
```

Empty list `[]` is OK until languages are installed.

---

## Phase 3 — Install MVP languages

On a machine with Node 15+ (laptop or the VM):

```bash
git clone https://github.com/engineer-man/piston.git
cd piston/cli && npm i && cd ../..
```

Install against the remote API (`-u`):

```bash
# From the piston repo root
./cli/index.js -u "http://<PUBLIC_IP>:2000" ppman install python=3.10.0
./cli/index.js -u "http://<PUBLIC_IP>:2000" ppman install java=15.0.2
./cli/index.js -u "http://<PUBLIC_IP>:2000" ppman install gcc=10.2.0   # provides c++
./cli/index.js -u "http://<PUBLIC_IP>:2000" ppman install node=15.10.0 # javascript
```

If a exact version string fails, run `ppman list` and pick the closest matching versions, then update `backend/services/piston.py` `SUPPORTED_LANGUAGES` to match.

Verify:

```bash
curl -s -X POST "http://<PUBLIC_IP>:2000/api/v2/execute" \
  -H "Content-Type: application/json" \
  -d '{"language":"python","version":"3.10.0","files":[{"name":"a.py","content":"print(1+1)"}]}'
```

Expect `"stdout":"2\n"`.

---

## Phase 4 — Point FastAPI at Oracle

**Local** `backend/.env`:

```
PISTON_API_URL=http://<PUBLIC_IP>:2000/api/v2
```

**Heroku** Config Vars (same key). Restart/redeploy backend after set.

Then:

```bash
curl -s -X POST "http://127.0.0.1:8000/execute" \
  -H "Authorization: Bearer <member access_token>" \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(1+1)"}'
```

---

## Ops / handoff checklist

- [ ] Club Oracle login + 2FA documented
- [ ] SSH key in password manager; at least two execs can access
- [ ] Instance name `codexperts-piston`, public IP recorded
- [ ] `docker ps` shows `piston_api` with `--restart unless-stopped`
- [ ] Languages installed; `/api/v2/runtimes` lists python/java/c++/javascript
- [ ] `PISTON_API_URL` set on Heroku + local
- [ ] Security list locked down when Heroku egress IPs are known
- [ ] This doc kept up to date when IP or versions change

### Useful commands

```bash
sudo docker logs -f piston_api
sudo docker restart piston_api
curl -s "http://127.0.0.1:2000/api/v2/runtimes"
```

### Cost note

Always Free Ampere shape: **$0** within Oracle Always Free quotas. Watch OCPU/memory quota if other Free VMs exist on the same tenancy.

### Out of scope here

- Gemma / LLM hosting (use a managed API for Evaluate #60; do not put GPUs on this box for MVP)
- Sharing this VM with game servers
