import { CodeBlock } from '../components/CodeBlock';

const dockerfile = `# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`;

const nginxConf = `worker_processes auto;

events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  # Gzip compression
  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    application/xml
    image/svg+xml;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Cache static assets aggressively (content-hashed filenames)
    location /assets/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # SPA fallback - all routes serve index.html
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
      access_log off;
      return 200 "OK\\n";
      add_header Content-Type text/plain;
    }
  }
}`;

const dockerignore = `node_modules
dist
.git
.github
*.md
.env*
coverage
.vscode
.idea`;

export function Deploy() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Deployment</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Docker multi-stage build with nginx for production serving. Optimized for minimal image size and maximum cache efficiency.
        </p>
      </div>

      {/* Deployment Flow */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          DEPLOYMENT FLOW
        </div>
        <div className="flex items-center justify-between">
          {[
            { step: 'git push', desc: 'Push to main' },
            { step: 'CI', desc: 'Lint + Test + Build' },
            { step: 'Docker', desc: 'Multi-stage build' },
            { step: 'Registry', desc: 'Push image' },
            { step: 'Deploy', desc: 'Rolling update' },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border"
                  style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)', background: 'var(--bg-primary)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'var(--text-primary)' }}>{item.step}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
              </div>
              {i < 4 && (
                <div className="w-8 h-0.5 mx-1" style={{ background: 'var(--border-default)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Points */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          KEY DEPLOYMENT STRATEGIES
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Multi-stage Build', desc: 'Builder stage compiles, production stage only copies artifacts. Final image ~25MB vs ~900MB.' },
            { title: 'Layer Caching', desc: 'Dependencies copied before source code. Docker reuses cached layers when only source changes.' },
            { title: 'Content-hashed Assets', desc: 'Vite generates filenames with content hashes. Enables aggressive 1-year cache headers.' },
            { title: 'SPA Fallback', desc: 'nginx try_files directive serves index.html for all non-asset routes. Enables client-side routing.' },
          ].map((item) => (
            <div key={item.title} className="p-3 rounded border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--accent-green)' }}>{item.title}</div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Config Files */}
      <div className="space-y-4">
        <CodeBlock code={dockerfile} language="dockerfile" filename="Dockerfile" />
        <CodeBlock code={nginxConf} language="nginx" filename="nginx.conf" />
        <CodeBlock code={dockerignore} language="text" filename=".dockerignore" />
      </div>
    </div>
  );
}
