# 部署指南

本站是纯静态网站：`npm run generate` 生成 `.output/public` 文件夹，里面全是 HTML/CSS/JS/图片，
**不需要自己的服务器**，放到任何静态托管平台即可。下面以免费的 Cloudflare Pages 为主，Netlify / Vercel 为备选。

---

## 0. 上线前检查（正式公开前必须完成）

| 项目 | 说明 | 位置 |
|---|---|---|
| 品牌授权 | 一汽-大众的名称、图片、车型资料需厂家书面授权 | — |
| 公司与联系方式 | 公司全称、地址、热线、邮箱、Messenger、Viber、社媒 | `app/data/site.ts` |
| 经销商 | 真实门店名称、地址、电话、营业时间 | `app/data/dealers.ts` |
| 车型数据 | 菲律宾版配置、价格、参数 | `app/data/models.ts`、`app/data/modelDetails.ts` |
| 促销、新闻 | 真实活动和文章 | `app/data/home.ts`、`app/data/content.ts` |
| 表单 | 目前只显示"提交成功"，**数据不会发送**，需接入邮箱/CRM（见第 5 节） | `app/pages/get-a-quote.vue` 等 |
| 演示标记 | 正式上线时去掉顶部 "Prototype preview" 横幅，并删除 `noindex` | `app/layouts/default.vue` 第 3 行；`nuxt.config.ts` 中 `robots` 一行 |

> 演示阶段可以保留横幅和 `noindex`（不被搜索引擎收录），并按第 2.3 节加访问密码。

---

## 1. 本地构建与验证

```bash
npm ci                 # 按 package-lock.json 安装依赖
npm run test:all       # 单元测试 + 生成静态站 + 端到端测试（约 6 分钟）
npm run generate       # 只生成静态站，输出到 .output/public
node tests/support/static-server.mjs .output/public 3211   # 本地预览 http://localhost:3211
```

测试全部通过后再推送到 GitHub。

---

## 2. 推荐：Cloudflare Pages（免费、亚洲节点快，含马尼拉）

### 2.1 首次部署

1. 注册并登录 Cloudflare（https://dash.cloudflare.com）。
2. 左侧菜单 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 授权 GitHub，选择仓库 `1713612859/fawvw-web-ph`，分支 `main`。
4. 构建设置：

   | 设置项 | 值 |
   |---|---|
   | Framework preset | Nuxt.js |
   | Build command | `npm run generate` |
   | Build output directory | `.output/public` |
   | 环境变量 | `NODE_VERSION` = `24` |

5. 点 **Save and Deploy**，约 2–3 分钟后得到网址：`https://<项目名>.pages.dev`。

### 2.2 之后的更新

- 推送到 `main` → 自动重新部署正式网址。
- 推送到其他分支 → 自动生成独立的预览网址，适合给领导或厂家先看。
- 出问题可在项目的 **Deployments** 列表里一键回滚到之前的版本。

### 2.3 演示期加访问限制（可选，免费）

1. Cloudflare 后台 → **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**。
2. Application domain 填 `<项目名>.pages.dev`。
3. 规则选 **Allow**，条件 **Emails**，填入允许访问的邮箱（免费版最多 50 人）。
4. 访客打开网站时输入邮箱，收到一次性验证码即可进入。

---

## 3. 备选平台

### Netlify

- **方式 A（连接 GitHub，推荐）**：Add new site → Import an existing project → 选择仓库
  - Build command：`npm run generate`
  - Publish directory：`.output/public`
  - 环境变量：`NODE_VERSION` = `24`
- **方式 B（不用 Git，最快）**：本地执行 `npm run generate`，打开 https://app.netlify.com/drop ，
  把 `.output/public` 文件夹拖进去即可得到网址。每次更新需重新拖一次。

### Vercel

Add New → Project → 导入仓库 → Framework 选 Nuxt.js，然后覆盖：

- Build Command：`npm run generate`
- Output Directory：`.output/public`
- Node.js Version（Settings → General）：24.x

> 注：Netlify、Vercel 的访问密码功能需要付费套餐；Cloudflare Access 免费。

---

## 4. 绑定自己的域名

1. 购买域名（`.ph` 域名可在 dotPH 等注册商购买，也可用 `.com`）。
2. 在托管平台的项目里打开 **Custom domains** → 添加域名（如 `www.example.ph`）。
3. 按页面提示到域名注册商添加 DNS 记录（通常是一条 `CNAME` 指向 `<项目名>.pages.dev`）。
   若域名 DNS 已托管在 Cloudflare，会自动配置。
4. HTTPS 证书自动签发，几分钟到几小时生效。

---

## 5. 表单接入（正式上线前）

当前询价、试驾、保养、联系四个表单只在页面上显示成功，不发送数据。可选方案：

| 方案 | 说明 |
|---|---|
| 表单服务（最快） | 如 Formspree、Netlify Forms（仅 Netlify）：把提交发到指定邮箱，无需后端 |
| 自有接口 | 接入公司现有后台 / CRM 的 API，按经销商分发线索 |
| 托管平台函数 | Cloudflare Pages Functions / Vercel Functions 写一个小接口转发到邮箱或 CRM |

接入后需同步更新隐私声明（`app/pages/privacy-notice.vue`），符合菲律宾《数据隐私法》（RA 10173）。

---

## 6. 其他注意事项

- **地图**：经销商页和联系页使用 Google Maps 内嵌，在中国大陆访问时地图区域会显示空白，菲律宾访问正常。
- **统计与广告**：如需 Google Analytics / Meta Pixel，需在用户同意 Cookie 后再加载（Cookie 横幅已有"仅必要 / 全部接受"选择）。
- **字体**：当前为 Archivo + Inter（开源可商用）；拿到大众官方字体 VW Head / VW Text 后可在 `app/assets/css/main.css` 替换。
- **原始照片**：`assets-src/` 未进入 Git（仓库公开），只保存在本机，请自行备份。
