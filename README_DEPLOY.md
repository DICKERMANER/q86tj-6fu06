# 部署到 GitHub Pages（盡量避免索引）

放在倉庫根目錄：`index.html`、`robots.txt`、`404.html`、`.nojekyll`。

## 防索引建議
- `index.html` 的 `<head>` 內加入：
  `<meta name="robots" content="noindex,nofollow,noarchive,noimageindex,nosnippet">`
- 於根目錄放 `robots.txt`：
  `User-agent: *` / `Disallow: /`
- 注意這些是「善意協議」，不是強制。若需私密，請使用私有 repo + 受保護的主機。

## GitHub Pages 設定
- Settings → Pages → Source：選 `main` / `/ (root)`
- 務必啟用 **Enforce HTTPS**
