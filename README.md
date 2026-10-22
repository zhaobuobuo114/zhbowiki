# ZHBOWiki

Minecraft 服务端插件文档站。当前版本只保留首页，其余页面后续按需补充。

**在线预览：<https://zhaobuobuo114.github.io/zhbowiki/>**

## 启动

```bash
npm install
npm run dev      # http://127.0.0.1:5199
npm run build    # 输出 dist/（本地预览用，根路径）
npm run preview  # 预览生产构建
```

## 发布到 GitHub Pages

站点通过 `main` 分支的 `docs/` 目录发布（Settings → Pages → Branch: main / docs）。

```bash
npm run build:pages   # --base=/zhbowiki/ 构建并输出到 docs/
cp docs/index.html docs/404.html
git add -A && git commit -m "update" && git push
```

推送后 GitHub Pages 会自动重建（约 30~60 秒）。`docs/.nojekyll` 用于跳过 Jekyll 处理。

## 页面

- `/` 首页：大标题（与开场动画逐像素对齐）、副标题、毛玻璃胶囊按钮、中/英切换；背景为像素方块波浪 + 鼠标光斑，光斑与波浪会浮现隐藏的 Minecraft 元素（苦力怕、草方块、钻石、TNT、钻石镐、铁砧）

## 结构

```text
src/
├─ App.jsx                路由与开场动画控制
├─ pages/Landing.jsx      首页（标题、副标题、胶囊按钮、语言切换动画）
├─ components/
│  ├─ Splash.jsx          开场动画
│  ├─ BackgroundFX.jsx    网格方块波浪、鼠标光斑、隐藏元素、波浪发光
│  ├─ Controls.jsx        语言切换（玻璃胶囊 + 蓝色指示器果冻滑动）
│  └─ Logo.jsx            字标
├─ hooks/useGlassHover.js 玻璃胶囊吸附与边缘高光跟随
├─ i18n/index.js          中英文案
├─ index.css              主题变量与样式
└─ store.jsx              主题、语言、静态模式
```

`_archive/` 存放暂时下线的页面（插件库、详情、关于等），后续恢复时可直接取回。

## 调试参数

- `?static=1`：跳过开场动画与动效（截图用）
- `?splashstatic=1`：开场定格在结束态
- `?lang=zh|en`：强制语言，便于对比
