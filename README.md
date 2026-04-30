# 诗经山河

一个基于 React + Vite 的《诗经》地理可视化网站项目。

## 项目目标

本项目计划在中国地图上标注《诗经》中篇目的地理位置，并提供交互式阅读体验。

计划功能包括：

1. 在中国地图上以点位形式标注《诗经》篇目所在地。
2. 点位上方显示诗名。
3. 地图支持移动、缩放，后续计划扩展为 3D 地图。
4. 点击点位后弹出对话框，展示诗歌内容。
5. 页面底部提供“风 / 雅 / 颂”等分类标签，用于筛选不同类型的篇目。

## 当前版本

### V0：项目原型

已完成基础网页结构，包含：

- 项目标题
- 简单页面布局
- 底部分类标签占位
- 基础样式

### V1：二维中国地图

已完成二维中国地图的基础显示，包含：

- 集成 ECharts 地图库
- 加载本地 China GeoJSON 地图数据
- 显示中国地图轮廓
- 支持地图拖动
- 支持地图缩放
- 隐藏地图文字标签
- 关闭 hover tooltip

## 技术栈

- React
- Vite
- ECharts
- GeoJSON
- CSS

## 项目结构

```text
shijing-shanhe
├── public
│   └── maps
│       ├── china.geojson
│       └── china.json
├── src
│   ├── components
│   ├── styles.css
│   └── ...
├── package.json
├── vite.config.js
└── README.md
