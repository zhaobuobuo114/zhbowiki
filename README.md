# ZHBOWiki

Minecraft 服务端插件文档站。当前版本只保留首页，其余页面后续按需补充。

## 启动

```bash
npm install
npm run dev      # http://127.0.0.1:5199
npm run build    # 输出 dist/
npm run preview  # 预览生产构建
```

## 页面

- `/` 首页：品牌字标、一句说明、中/英切换、明暗主题、缓慢旋转的背景水印（苦力怕 ⇄ 手绘头像，水平镜像 + 边缘渐隐）

## 结构

```text
src/
├─ App.jsx                路由与开场动画控制
├─ pages/Landing.jsx      首页
├─ components/
│  ├─ Splash.jsx          开场动画
│  ├─ BackgroundFX.jsx    背景网格与水印
│  ├─ Controls.jsx        主题 / 语言切换
│  └─ Logo.jsx            字标
├─ i18n/index.js          中英文案
├─ index.css              主题变量与样式
└─ store.jsx              主题、语言、静态模式
```

`_archive/` 存放暂时下线的页面（插件库、详情、关于等），后续恢复时可直接取回。

## 调试参数

- `?static=1`：跳过开场动画
- `?theme=light`：强制浅色主题
- `?splashstatic=1`：开场定格在结束态
