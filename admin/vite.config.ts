import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const templatesRoot = new URL('../templates', import.meta.url).pathname

function templatesStaticGuardPlugin(): Plugin {
  return {
    name: 'landinghub-templates-static-guard',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url?.split('?')[0] ?? ''
        // Only intercept static template paths (e.g. /templates/<cat>/<slug>/index.html)
        // Do NOT intercept SPA routes like /templates, /templates/new, /templates/tpl-001
        const isTemplateAsset =
          rawUrl.startsWith('/templates/') &&
          (rawUrl.endsWith('.html') ||
            rawUrl.endsWith('.css') ||
            rawUrl.endsWith('.js') ||
            rawUrl.endsWith('.svg') ||
            rawUrl.endsWith('.png') ||
            rawUrl.endsWith('.jpg') ||
            rawUrl.endsWith('.webp') ||
            rawUrl.split('/').filter(Boolean).length >= 3)

        if (!isTemplateAsset) {
          return next()
        }

        const relPath = rawUrl.replace(/^\/templates\/?/, '')
        let filePath = path.join(templatesRoot, relPath)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html')
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase()
          const mimeMap: Record<string, string> = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.webp': 'image/webp',
          }
          res.statusCode = 200
          res.setHeader('Content-Type', mimeMap[ext] ?? 'application/octet-stream')
          res.setHeader('Cache-Control', 'no-cache')
          fs.createReadStream(filePath).pipe(res)
          return
        }

        // Prevent Vite SPA fallback from serving Admin index.html when a template file is missing!
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>404 — Template Not Found</title>
  <style>
    body { margin:0; min-height:100vh; display:grid; place-items:center; background:#0C0E16; color:#F8FAFC; font-family:system-ui,sans-serif; }
    .box { max-width:460px; padding:32px; border-radius:20px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); text-align:center; }
    code { display:block; margin:14px 0; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,0.35); color:#93C5FD; font-size:12px; word-break:break-all; }
    p { color:rgba(255,255,255,0.55); font-size:13px; line-height:1.6; }
  </style>
</head>
<body>
  <div class="box">
    <h2 style="margin:0 0 8px;font-size:18px;">Không tìm thấy file Template (404)</h2>
    <p>Đường dẫn preview chưa có file HTML trên ổ đĩa:</p>
    <code>${rawUrl}</code>
    <p>Kiểm tra lại Preview URL trong trang Quản lý Routes hoặc Chỉnh sửa Template.</p>
  </div>
</body>
</html>`)
      })
    },
    closeBundle() {
      const outTemplatesDir = path.resolve(
        new URL('./dist/templates', import.meta.url).pathname,
      )
      if (fs.existsSync(templatesRoot)) {
        fs.cpSync(templatesRoot, outTemplatesDir, { recursive: true })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [templatesStaticGuardPlugin(), react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  publicDir: 'public',
  server: {
    port: 5173,
    fs: {
      allow: ['..'],
    },
  },
})
