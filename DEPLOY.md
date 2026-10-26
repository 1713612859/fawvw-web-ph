# 部署指南

本站是纯静态网站：`npm run generate` 生成 `.output/public` 文件夹，里面全是 HTML/CSS/JS/图片，
**不需要自己的服务器**，放到任何静态托管平台即可。下面以免费的 Cloudflare Pages 为主，Netlify / Vercel 为备选；
已有云服务器和宝塔面板的，见第 4 节。

---

## 0. 上线前检查（正式公开前必须完成）

| 项目 | 说明 | 位置 |
|---|---|---|
| 品牌授权 | 一汽-大众的名称、图片、车型资料需厂家书面授权 | — |
| 公司与联系方式 | 公司全称、地址、热线、邮箱、Messenger、Viber、社媒 | `app/data/site.ts` |
| 经销商 | 真实门店名称、地址、电话、营业时间 | `app/data/dealers.ts` |
| 车型数据 | 菲律宾版配置、价格、参数 | `app/data/models.ts`、`app/data/modelDetails.ts` |
| 促销、新闻 | 真实活动和文章 | `app/data/home.ts`、`app/data/content.ts` |
| 表单 | 目前只显示"提交成功"，**数据不会发送**，需接入邮箱/CRM（见第 6 节） | `app/pages/get-a-quote.vue` 等 |
| 演示标记 | 正式上线时去掉顶部 "Prototype preview" 横幅，并删除 `noindex` | `app/layouts/default.vue` 第 3 行；`nuxt.config.ts` 中 `robots` 一行 |

> 演示阶段可以保留横幅和 `noindex`（不被搜索引擎收录），并加访问限制（Cloudflare 见第 2.3 节，宝塔见第 4.8 节）。

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

## 4. 部署到自己的服务器（宝塔面板）

网站是纯静态文件，服务器只需要 **Nginx**，不需要安装 Node.js，也不需要 PM2。

### 4.1 服务器选择

- 面向菲律宾用户，建议用**新加坡、香港或菲律宾**机房的服务器：访问更快，而且**不需要 ICP 备案**。
- 如果服务器在中国大陆，域名必须先完成 ICP 备案才能用 80/443 端口对外提供网站。

### 4.2 本地打包

在项目目录执行：

```bash
npm ci
npm run test:all
npm run generate
tar -czf fawvw-ph-site.tar.gz -C .output/public .
```

- `tar` 命令在 Windows 10/11 的命令行和 PowerShell 里都能直接用，生成的 `.tar.gz` 宝塔可以直接解压。
- 也可以用 zip：注意要压缩 `.output/public` **里面的全部内容**，不要把 `public` 文件夹本身包进去。
  解压后网站根目录下应该直接是 `index.html`、`_nuxt`、`images`、`models` 等。

### 4.3 创建站点

1. 宝塔 → **软件商店** → 安装 **Nginx**（已装可跳过）。
2. **网站** → **添加站点**（新版宝塔：网站 → PHP项目 → 添加站点）：
   - 域名：填你的域名（如 `www.example.ph`）；暂时没有域名可先填服务器 IP
   - 根目录：默认 `/www/wwwroot/<域名>`
   - PHP 版本：**纯静态**
   - 数据库、FTP：不创建
3. 提交。

### 4.4 上传并解压

1. 宝塔 → **文件** → 进入站点根目录。
2. 删除宝塔生成的默认 `index.html`、`404.html`。根目录里的 `.user.ini` 是宝塔锁定的文件，保留即可。
3. **上传**打包文件 → 右键 → **解压** → 解压到当前目录。
4. 确认根目录下直接能看到 `index.html`、`_nuxt`、`images`、`models` 等，然后删除压缩包。

### 4.5 Nginx 设置

**① 伪静态**：网站 → 站点 **设置** → **伪静态**，粘贴并保存：

```nginx
location / {
    try_files $uri $uri/index.html $uri/ =404;
}
```

作用：访问 `/about` 时直接返回 `/about/index.html`，不跳转、不出现斜杠。

**② 配置文件**：网站 → 站点 **设置** → **配置文件**：

- 找到 `#error_page 404 /404.html;`，去掉前面的 `#`，让未知网址显示网站自带的品牌 404 页面。
- 在 `#REWRITE-END` 下面加入缓存规则，然后保存：

```nginx
# 带哈希的程序文件，可长期缓存
location ^~ /_nuxt/ {
    expires 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# 图片和字体缓存 30 天
location ~* \.(webp|png|jpg|jpeg|svg|woff2)$ {
    expires 30d;
}
```

保存时宝塔会自动检查配置，报错会提示具体行号。

### 4.6 HTTPS

1. 到域名注册商添加 **A 记录**，指向服务器公网 IP。
2. 云服务器的**安全组**和宝塔 **安全** 页面都放行 80、443 端口。
3. 站点 **设置** → **SSL** → **Let's Encrypt** → 勾选域名 → **申请**。
4. 申请成功后打开 **强制HTTPS**。

### 4.7 验证

- 打开首页、任意车型页、询价页，确认图片和样式正常。
- 访问一个不存在的网址（如 `/abc`），应显示品牌 404 页面。
- 手机上打开，确认可以正常浏览、没有横向滚动。

### 4.8 演示期加访问限制（可选）

站点 **设置** → **访问限制** → **加密访问** → 添加，设置用户名和密码。
访客打开网站时需要输入账号密码。

### 4.9 更新网站

1. 本地拉取最新代码，重新执行第 4.2 节的打包命令。
2. 宝塔 → 文件 → 站点根目录：先把旧文件全选 → **压缩**，留作备份。
3. 删除旧文件（`.user.ini` 和备份包除外）→ 上传新包 → 解压到当前目录。
4. 浏览器按 `Ctrl + F5` 强制刷新查看。需要回滚时，删除新文件、解压备份包即可。

---

## 5. 绑定自己的域名（托管平台）

1. 购买域名（`.ph` 域名可在 dotPH 等注册商购买，也可用 `.com`）。
2. 在托管平台的项目里打开 **Custom domains** → 添加域名（如 `www.example.ph`）。
3. 按页面提示到域名注册商添加 DNS 记录（通常是一条 `CNAME` 指向 `<项目名>.pages.dev`）。
   若域名 DNS 已托管在 Cloudflare，会自动配置。
4. HTTPS 证书自动签发，几分钟到几小时生效。

---

## 6. 表单接入（正式上线前）

当前询价、试驾、保养、联系四个表单只在页面上显示成功，不发送数据。可选方案：

| 方案 | 说明 |
|---|---|
| 表单服务（最快） | 如 Formspree、Netlify Forms（仅 Netlify）：把提交发到指定邮箱，无需后端 |
| 自有接口 | 接入公司现有后台 / CRM 的 API，按经销商分发线索 |
| 托管平台函数 | Cloudflare Pages Functions / Vercel Functions 写一个小接口转发到邮箱或 CRM |

接入后需同步更新隐私声明（`app/pages/privacy-notice.vue`），符合菲律宾《数据隐私法》（RA 10173）。

---

## 7. 其他注意事项

- **地图**：经销商页和联系页使用 Google Maps 内嵌，在中国大陆访问时地图区域会显示空白，菲律宾访问正常。
- **统计与广告**：如需 Google Analytics / Meta Pixel，需在用户同意 Cookie 后再加载（Cookie 横幅已有"仅必要 / 全部接受"选择）。
- **字体**：当前为 Archivo + Inter（开源可商用）；拿到大众官方字体 VW Head / VW Text 后可在 `app/assets/css/main.css` 替换。
- **原始照片**：`assets-src/` 未进入 Git（仓库公开），只保存在本机，请自行备份。
