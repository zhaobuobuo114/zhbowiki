# ZHBOWiki

Minecraft 服务端插件文档站。当前包含首页、插件仓库与插件详情页。

**在线站点：<https://zhaobuobuo114.github.io/>**（根域名，推荐）
旧项目站点仍可用：<https://zhaobuobuo114.github.io/zhbowiki/>

## 启动

```bash
npm install
npm run dev      # http://127.0.0.1:5199
npm run build    # 输出 dist/（本地预览用，根路径）
npm run preview  # 预览生产构建
```

## 发布

### 根域名站点（推荐）

```powershell
$env:GH_TOKEN = "你的 token"   # 只放在环境变量里，不要写进仓库
npm run build:site              # 输出 dist-site/，base = /
npm run deploy:site             # 推送到 zhaobuobuo114.github.io 仓库
```

### 旧项目站点（/zhbowiki/）

```bash
npm run build:pages   # base=/zhbowiki/，输出到 docs/
git add docs src && git commit -m "update" && git push
```

`build:pages` 与 `build:site` 都会自动：

- 为 `src/siteMap.js` 中登记的每个路由生成独立 `index.html`
- 生成 `404.html` 与 `.nojekyll`

因此 `/plugins`、`/plugins/<slug>` 直接访问都返回 200，不再依赖 404 回退。

新增顶级页面时：在 `src/App.jsx` 加路由，并在 `src/siteMap.js` 的 `STATIC_ROUTES` 登记；新增插件只需在 `src/data/plugins.js` 添加数据，详情页入口会自动生成。

## 页面

- `/` 首页：大标题、副标题、毛玻璃胶囊、中/英切换；背景为像素方块波浪 + 鼠标光斑
- `/plugins` 插件仓库：左栏搜索/筛选/插件名索引，右栏插件卡片
- `/plugins/<slug>` 插件详情：特性、安装步骤、指令、配置示例
- 其他地址显示站内 404 页

## 结构

```text
src/
├─ App.jsx                路由与开场动画控制
├─ siteMap.js             需要生成静态入口的路由清单
├─ pages/
│  ├─ Landing.jsx         首页
│  ├─ Plugins.jsx         插件仓库
│  ├─ PluginDetail.jsx    插件详情
│  └─ NotFound.jsx        站内 404
├─ components/
│  ├─ SiteHeader.jsx      全站统一顶栏（含发布按钮）
│  ├─ RepoCard.jsx        液态玻璃插件卡片
│  ├─ LangSwap.jsx        中英切换模糊淡入淡出
│  ├─ Splash.jsx          开场动画
│  ├─ BackgroundFX.jsx    网格方块波浪、鼠标光斑、隐藏元素
│  ├─ Controls.jsx        语言切换、联系我们
│  └─ Logo.jsx            字标
├─ hooks/
│  ├─ useLiquidLight.js   卡片/搜索/筛选按钮共用的鼠标光源
│  └─ useGlassHover.js    玻璃胶囊吸附与边缘高光
├─ data/plugins.js        插件数据（中英双语）
├─ i18n/index.js          中英文案
├─ index.css              主题变量与样式
└─ store.jsx              主题、语言、静态模式
```

`scripts/` 下为发布脚本：`gen-pages.mjs` 生成路由入口，`deploy-site.mjs` 推送根域名站点。

`_archive/` 存放早期下线页面，仅作参考。

## 调试参数

- `?static=1`：跳过开场动画与动效（截图用）
- `?splashstatic=1`：开场定格在结束态
- `?lang=zh|en`：强制语言，便于对比
