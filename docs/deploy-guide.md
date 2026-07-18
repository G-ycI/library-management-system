# 图书管理系统 - 部署指南

## 方案：全部使用 Vercel 部署

本方案将前端和后端 API 全部部署在 Vercel 上，使用内存数据存储，无需额外数据库。

### 部署步骤

#### 1. 在 Vercel 导入 GitHub 仓库

1. 登录 [Vercel](https://vercel.com/) 官网
2. 点击 "Add New..." -> "Project"
3. 点击 "Continue with GitHub" 授权
4. 选择你的 `library-management-system` 仓库，点击 "Import"

#### 2. 配置项目

- **Project Name**：保持默认或自定义
- **Framework Preset**：选择 `Next.js`
- **Root Directory**：点击 "Edit"，选择 `frontend` 目录
- **Environment Variables**：无需配置（使用内置示例数据）

#### 3. 点击 Deploy

点击底部的 "Deploy" 按钮开始部署。等待 1-3 分钟即可完成。

部署完成后，你将获得一个访问 URL（如 `https://your-project.vercel.app`）。

### API 接口

部署后，所有 API 接口将直接通过 Vercel 域名访问：

- `GET /api/books` - 获取图书列表
- `GET /api/books/[id]` - 获取图书详情
- `POST /api/books` - 新增图书
- `PUT /api/books/[id]` - 更新图书（需密码验证）
- `DELETE /api/books/[id]` - 删除图书（需密码验证）
- `GET /api/books/categories` - 获取分类列表
- `GET /api/books/stats` - 获取统计数据

### 注意事项

1. **数据存储**：使用内存数据存储，服务重启后数据会重置为初始的34本示例图书。
2. **密码验证**：编辑和删除操作需要密码验证，密码为 `20040611`。
3. **本地开发**：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   访问 `http://localhost:3000` 即可查看应用。
