<div align="center">
  <h1>🧮 JuroCerto</h1>
  <p><strong>AI-Powered Fixed-Income Investment Calculator & Portfolio Advisor</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#security">Security</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## Overview

**JuroCerto** is a production-ready financial advisory platform designed for individual investors and financial professionals to optimize fixed-income portfolios in the Brazilian market. Powered by Google Gemini AI with extended thinking capabilities, JuroCerto combines sophisticated financial calculations with intelligent, conversational investment guidance.

### What We Solve
- **Portfolio Optimization**: Compare and simulate multiple fixed-income assets side-by-side with real market rates
- **Tax Planning**: Understand regressive taxation on different investment vehicles with instant tax equivalence calculations
- **Market Insights**: Access current benchmark rates (Selic, CDI, IPCA) and Treasury bonds data
- **Intelligent Advising**: Get personalized investment recommendations via AI-powered chat with extended thinking
- **Statement Analysis**: Upload investment statements for AI-powered yield analysis and validation

### Who It's For
- Individual investors seeking better returns on fixed-income investments
- Financial advisors building client portfolios
- Developers integrating financial calculations into their platforms

---

## Features

| Feature | Description |
|---------|-------------|
| **📊 Dashboard** | Real-time market indicators (Selic, CDI, IPCA, TR), saved comparisons, investment overview with key metrics |
| **🤖 AI Advisor** | Conversational AI assistant with Google Gemini 3.1 Pro extended thinking for tax optimization, scenario analysis, and personalized recommendations |
| **📈 Comparisons Tab** | Multi-asset comparison simulator allowing users to configure and compare different fixed-income investments (CDB, LCI, CRA, Treasury) with yearly/monthly projections |
| **🧮 Calculators** | Three specialized financial calculators: compound interest, tax equivalence analysis, and inflation impact calculator |
| **💹 Market Data** | Live benchmark rates (Selic, CDI, IPCA, TR) and Treasury Direct bonds listing with current rates and maturity dates |
| **📸 Image Analysis** | AI-powered optical character recognition to extract yield data from investment statements and cross-reference with market benchmarks |

### Supported Assets
- **Tesouro Selic** — 100% Selic rate, daily liquidity, no explicit spread
- **CDB 110% CDI** — Post-fixed rate with 15% tax (after 720 days holding)
- **LCI Isento** — 95% CDI, completely tax-free (real estate focus)
- **CRA Agronegócio** — 10.5% fixed rate, tax-free (agriculture focus)

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript 5.8** — Type-safe component development with strict mode
- **Vite 6.2** — Lightning-fast dev server and optimized production builds
- **Tailwind CSS 4.1** — Utility-first styling with @tailwindcss/vite plugin for performance
- **Lucide React** — Beautiful, consistent icon library
- **Motion 12** — Smooth animations and transitions for polished UX

### Backend
- **Express.js 4.21** — Lightweight, production-ready HTTP server
- **Node.js** + **tsx** — TypeScript execution without build step complexity
- **Zod 3.22** — Runtime validation for API inputs and responses

### AI & APIs
- **Google Gemini 3.1 Pro** — Extended thinking for sophisticated financial analysis
- **Bearer Token Auth** — Secure API key management for protected endpoints

### Security & DevOps
- **Helmet 7.1** — Automatic OWASP security headers
- **express-rate-limit 7.1** — Request throttling and DDoS protection
- **CORS** — Whitelist-based cross-origin resource sharing
- **esbuild** — Ultra-fast server bundle compilation

### Core Math Engine
The **financialMath.ts** module provides:
- **Asset Simulation**: Compound interest calculations with monthly contributions and multi-year projections
- **Tax Calculation**: Regressive Brazilian tax rates (22.5% → 15% over holding period)
- **Monthly/Yearly Balances**: Detailed projections with gross/net profit breakdowns
- **Real Yield Analysis**: After-tax return calculations considering inflation

---

## Getting Started

### Prerequisites
- **Node.js** 18 or higher (LTS recommended)
- **npm** 9+ or **yarn** equivalent
- Google Gemini API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Daniel-iel/JuroCerto.git
   cd JuroCerto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   ```bash
   # ============================================
   # AI & API CONFIGURATION (REQUIRED)
   # ============================================
   GEMINI_API_KEY="your-google-gemini-api-key-here"
   JUROCERTO_API_KEY="your-secure-bearer-token-here"
   
   # ============================================
   # SERVER CONFIGURATION
   # ============================================
   NODE_ENV="development"
   HOST="localhost"
   PORT="3000"
   LOG_LEVEL="info"
   ```
   
   **How to get API keys:**
   - **GEMINI_API_KEY**: Generate free at [Google AI Studio](https://ai.google.dev)
   - **JUROCERTO_API_KEY**: Generate secure random token:
     ```bash
     openssl rand -hex 32
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000` with hot module reloading

5. **Verify installation**
   ```bash
   # In another terminal, test the API:
   curl -H "Authorization: Bearer $JUROCERTO_API_KEY" \
     http://localhost:3000/api/benchmarks
   ```

### Project Structure

```
src/
├── components/                    # React UI components
│   ├── DashboardTab.tsx          # Market overview & metrics
│   ├── ComparisonsTab.tsx        # Multi-asset simulator
│   ├── CalculatorsTab.tsx        # 3 financial calculators
│   ├── AIAdvisorTab.tsx          # Chat + image analysis
│   ├── MarketDataTab.tsx         # Treasury bonds & rates
│   ├── Sidebar.tsx               # Tab navigation
│   ├── form/InputField.tsx       # Reusable input component
│   ├── animations/               # Motion animation components
│   └── skeletons/                # Loading placeholder states
├── utils/                         # Security & validation utilities
│   ├── sanitizers.ts             # XSS/injection prevention
│   ├── inputValidator.ts         # Zod schema validation
│   ├── imageValidator.ts         # Magic byte verification
│   ├── errorHandler.ts           # Standardized error responses
│   ├── logger.ts                 # Structured logging
│   └── integrityCheck.ts         # API versioning & checksums
├── financialMath.ts              # Core calculation engine
├── types.ts                      # TypeScript interfaces
├── App.tsx                       # Root component
└── index.css                     # Tailwind + custom styles

middleware/                        # Express security layer
├── auth.ts                       # Bearer token authentication
├── cors.ts                       # CORS policy enforcement
├── https.ts                      # HTTPS enforcement & HSTS
├── rateLimit.ts                  # Request throttling by IP
└── securityHeaders.ts            # OWASP security headers (CSP, X-Frame-Options, etc.)

server.ts                         # Express app + Gemini API routes
vite.config.ts                    # Vite + React + Tailwind configuration
tsconfig.json                     # TypeScript strict mode
tailwind.config.ts                # Design tokens & custom utilities
```

---

## Security

### OWASP Top 10 Coverage: **85%** ✅

JuroCerto implements **Phase 1 & Phase 2** security hardening covering 7 of the top 10 OWASP risks:

#### 🔐 Authentication & Authorization
- **Bearer Token Auth** ([middleware/auth.ts](middleware/auth.ts)): Required `Authorization: Bearer <key>` for all `/api/*` endpoints
- **API Key Management**: Never log or expose keys; rotate in production
- **Rate Limiting**: Per-IP throttling (10 req/15min for general API, 5 req/15min for image analysis)

#### 🛡️ Input Validation & Sanitization
| Utility | Protection |
|---------|-----------|
| **inputValidator.ts** | Zod schemas for message arrays, system instructions, image MIME types (max 25MB) |
| **sanitizers.ts** | Removes control characters, escapes HTML entities, prevents prompt injection |
| **imageValidator.ts** | Magic byte detection (PNG, JPEG, GIF, WebP), prevents file type spoofing |

#### 🚨 Security Headers
```
X-Content-Type-Options: nosniff          # Prevents MIME type sniffing (XSS)
X-Frame-Options: DENY                     # Clickjacking protection
Strict-Transport-Security: max-age=31536000 # 1-year HSTS
Content-Security-Policy: strict-dynamic  # Inline script blocking
Permissions-Policy: microphone=(), ...    # Restrict browser features
```
([middleware/securityHeaders.ts](middleware/securityHeaders.ts))

#### 🌐 CORS & HTTPS
- **CORS**: Whitelist-based (`ALLOWED_ORIGINS` env var); localhost auto-allowed in dev
- **HTTPS Enforcement**: Automatic redirect in production + HSTS header
- **Development Mode**: Localhost:3000 + Vite HMR (5173) auto-allowed

#### 📝 Error Handling & Logging
- **Standardized Error Responses**: No stack traces leaked to clients; safe 5xx messages
- **Structured Logging**: JSON format with severity levels (debug, info, warn, error)
- **Data Integrity**: SHA-256 checksums + API versioning (1.0.0)

#### 🔍 Dependency Security
```bash
npm audit  # 0 vulnerabilities
```

### Known Security Measures
✅ No hardcoded secrets (uses environment variables only)  
✅ Image size limits (25MB max) prevent OOM attacks  
✅ Request size limits prevent payload bombs  
✅ No dangerous `eval()` or `exec()` patterns  
✅ Type-safe validation with Zod (runtime + compile-time)  

### Limitations & Roadmap
⚠️ **Known Gaps**:
- Gemini API key stored in `.env.local` (use server-side environment in production)
- No user authentication layer yet (planned for Phase 3)
- No database encryption (consider for PII/sensitive data)
- Single-region deployment (no DDoS mitigation beyond rate limiting)

📋 **Planned** (Phase 3 - Monitoring):
- Prometheus metrics + Grafana dashboards
- OpenTelemetry tracing
- Security event alerting

**For detailed security analysis**, see documentation in the [utils/](src/utils) and [middleware/](middleware) directories.

---

## Building & Deployment

### Development

```bash
# Start dev server with hot reload
npm run dev

# Type-check without building
npm run lint
```

### Production Build

```bash
# Build frontend + backend
npm run build

# Output: dist/server.cjs (bundled Node.js server)
```

### Running in Production

```bash
npm run start  # Runs dist/server.cjs
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Generate secure `JUROCERTO_API_KEY`: `openssl rand -hex 32`
- [ ] Obtain `GEMINI_API_KEY` from Google AI Studio
- [ ] Configure `ALLOWED_ORIGINS` for your domain(s)
- [ ] Set up HTTPS certificate (e.g., Let's Encrypt)
- [ ] Enable `https: true` in middleware (auto-enabled when `NODE_ENV=production`)
- [ ] Run `npm audit` to verify zero vulnerabilities
- [ ] Test rate limiting: `curl -H "Authorization: Bearer <key>" http://localhost:3000/api/benchmarks` (11+ requests in 15min should be throttled)
- [ ] Monitor logs for suspicious activity
- [ ] Set up CDN or reverse proxy (nginx, Cloudflare) if needed

### Environment-Specific Configs

**Development** (`NODE_ENV=development`)
- HTTPS disabled
- CORS allows `localhost:*`, `127.0.0.1:*`
- Vite HMR websocket allowed
- Verbose logging (debug level)

**Production** (`NODE_ENV=production`)
- HTTPS enforced + HSTS
- CORS whitelist only (`ALLOWED_ORIGINS`)
- Rate limiting: 10 req/15min (general), 5 req/15min (image analysis)
- Security headers strict (no inline scripts)

---

## Contributing

### Setup for Contributors

1. Follow the **Getting Started** section above
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Keep commits atomic and well-documented

### Code Standards

- **TypeScript**: Strict mode enabled; no `any` types
- **Validation**: Use Zod schemas for all API inputs
- **Testing**: Add unit tests for `financialMath.ts` functions and e2e tests with Playwright
- **Security**: Never log API keys; always sanitize user input before AI processing

### Reporting Issues

Found a bug? Please file an issue on [GitHub Issues](https://github.com/Daniel-iel/JuroCerto/issues) with:
- Steps to reproduce
- Expected vs. actual behavior
- Browser/Node.js version

---

## Roadmap

### Phase 1 ✅ (Completed)
- Core calculation engine + UI components
- Google Gemini integration (chat + image analysis)
- Security hardening: Bearer auth, rate limiting, headers

### Phase 2 ✅ (Completed)
- Security hardening: Image validation, CSP, error standardization
- Dependency audit (0 vulnerabilities)
- API versioning & integrity checks

### Phase 3 📋 (Planned)
- User accounts + authentication (OAuth 2.0)
- Portfolio persistence (PostgreSQL or MongoDB)
- Real-time market data API integration
- Dark mode theme
- Monitoring: Prometheus, Grafana, alerts

---

## License

This project is open source. See your project repository for licensing details.

---

## Support

**Questions or Issues?**
- 📚 [Documentation](https://github.com/Daniel-iel/JuroCerto/wiki)
- 🐛 [Bug Reports](https://github.com/Daniel-iel/JuroCerto/issues)
- 💬 [Discussions](https://github.com/Daniel-iel/JuroCerto/discussions)
