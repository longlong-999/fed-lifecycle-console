import { CodeBlock } from '../components/CodeBlock';

const dockerfile = `# 阶段 1: 构建
FROM node:22-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# 先复制依赖文件以利用缓存
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN pnpm build

# 阶段 2: 生产
FROM nginx:alpine AS production

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查
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

  # Gzip 压缩
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

  # 安全头
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # 静态资源强缓存（内容哈希文件名）
    location /assets/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # SPA 回退 - 所有路由返回 index.html
    location / {
      try_files $uri $uri/ /index.html;
    }

    # 健康检查端点
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
        <h2 className="text-2xl font-bold mb-2">部署</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Docker 多阶段构建 + nginx 生产服务。最小化镜像体积，最大化缓存效率。
        </p>
      </div>

      {/* Deployment Flow */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          部署流程
        </div>
        <div className="flex items-center justify-between">
          {[
            { step: 'git push', desc: '推送到 main' },
            { step: 'CI', desc: 'Lint + 测试 + 构建' },
            { step: 'Docker', desc: '多阶段构建' },
            { step: 'Registry', desc: '推送镜像' },
            { step: 'Deploy', desc: '滚动更新' },
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
          关键部署策略
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: '多阶段构建', desc: '构建阶段编译，生产阶段仅复制产物。最终镜像 ~25MB vs ~900MB。' },
            { title: '层缓存', desc: '依赖文件先于源码复制，仅源码变更时 Docker 复用缓存层。' },
            { title: '内容哈希资源', desc: 'Vite 生成带内容哈希的文件名，支持 1 年强缓存。' },
            { title: 'SPA 回退', desc: 'nginx try_files 指令为所有非资源路由返回 index.html，支持客户端路由。' },
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
