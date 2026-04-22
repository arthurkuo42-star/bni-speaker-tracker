# bni-speaker-tracker

BNI 高雄富鼎分會 · 分會助理前端（主站 + 運營台）。

## 用途

單檔 HTML 靜態網站，部署在 GitHub Pages。涵蓋：

- 主站 [`index.html`](index.html)：紅綠燈查詢、主題演講進度、咖啡會議、服務鏈總覽、導生計畫、後台。
- 運營台 [`operations.html`](operations.html)：組聚記錄、導生管理、小組設定。

## 技術棧

- 單檔 React（Babel standalone CDN，無 build step）
- Tailwind CSS CDN
- `docx` / `jszip` / `html2pdf` CDN（匯出用）
- 透過 `fetch` 呼叫 [bni-kpi](https://github.com/arthurkuo42-star/bni-kpi) 後端

## 線上網址

- 主站：https://arthurkuo42-star.github.io/bni-speaker-tracker/
- 運營台：https://arthurkuo42-star.github.io/bni-speaker-tracker/operations.html
- 快捷視角：`?view=kpi` / `?view=speaker` / `?view=coffee` / `?view=chains`

## 部署

推送 `main` 分支 → GitHub Pages 自動部署，約 1–2 分鐘上線。

直接在 GitHub 網頁上編輯檔案也可以，commit 後等部署。本機測試時雙擊打開 HTML 即可（但寫入功能需後端在線）。

## 後端依賴

前端會打：
```js
window.BNI_PROXY_URL = 'https://bni-kpi-production.up.railway.app';
```

如需切換後端（例如本機開發），改這一行即可。

## 認證

- 一般寫入需 `X-Write-PIN` header（第一次輸入存 localStorage）
- 管理員操作需 `X-Admin-Key` header

詳見 bni-kpi 後端的 PIN / KEY 設定。

## 相關

- 後端：[bni-kpi](https://github.com/arthurkuo42-star/bni-kpi)（Private）
- 整體架構：見本機 `富鼎網站/ARCHITECTURE.md`
