# 图书管理系统

一个基于 Next.js + Flask 的全栈图书管理系统，提供图书的增删改查、搜索筛选、分页浏览、密码保护等功能。

## 项目介绍

本项目是一个现代化的图书管理系统，采用前后端分离架构。前端使用 Next.js 构建响应式用户界面，后端使用 Flask 提供 RESTful API 服务，数据存储采用 SQLite 数据库。系统支持图书信息的完整生命周期管理，包括新增、查询、修改、删除，以及按关键词搜索和分类筛选。删除和编辑操作需密码验证，确保数据安全。系统提供 51 种预设分类（每种分类配有独立图标），同时支持自定义分类输入。

## 技术栈

### 前端
- **Next.js 14** - React 框架，服务端渲染
- **React 18** - 用户界面库
- **CSS Modules** - 组件样式隔离
- **Axios** - HTTP 请求库

### 后端
- **Flask 3.0** - Python Web 框架
- **Flask-SQLAlchemy** - ORM 数据库操作
- **Flask-CORS** - 跨域请求处理
- **SQLite** - 轻量级关系型数据库

## 项目结构

```
library-management-system/
├── backend/                 # Flask 后端
│   ├── app.py              # 应用入口
│   ├── config.py           # 配置文件
│   ├── models.py           # 数据模型
│   ├── seed.py             # 初始化示例数据
│   ├── requirements.txt    # Python 依赖
│   └── routes/             # 路由目录
│       └── books.py        # 图书相关 API
├── frontend/               # Next.js 前端
│   ├── pages/              # 页面路由
│   │   ├── _app.js         # 全局配置
│   │   ├── index.js        # 图书列表页（首页）
│   │   └── books/
│   │       ├── [id].js     # 图书详情页
│   │       └── add.js      # 新增图书页
│   ├── components/         # 公共组件
│   │   ├── Header.js       # 顶部导航栏
│   │   └── BookCard.js     # 图书卡片组件
│   ├── styles/             # 样式文件
│   ├── package.json        # Node 依赖
│   └── next.config.js      # Next.js 配置
└── docs/                   # 项目文档
```

## 安装与运行

### 环境要求
- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 后端启动

1. 进入后端目录
```bash
cd backend
```

2. 创建虚拟环境（推荐）
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 初始化示例数据（可选）
```bash
python seed.py
```

5. 启动后端服务
```bash
python app.py
```

后端服务将运行在 `http://localhost:5000`

### 前端启动

1. 进入前端目录
```bash
cd frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

前端服务将运行在 `http://localhost:3000`

## 功能说明

### 前端页面（3个独立路由）

1. **图书列表页** (`/`)
   - 展示所有图书的卡片列表
   - 支持按书名/作者关键词搜索
   - 支持按分类筛选
   - 分页浏览，每页6本
   - 显示馆藏数量和可借状态

2. **图书详情页** (`/books/[id]`)
   - 展示图书的完整信息
   - 包含书名、作者、ISBN、分类、馆藏数量、可借数量、内容简介
   - 支持编辑图书操作（需密码验证）
   - 支持删除图书操作（需密码验证）

3. **新增图书页** (`/books/add`)
   - 表单形式录入图书信息
   - 前端表单验证（必填项、数量校验）
   - 分类支持下拉选择（51种预设分类）或自定义输入
   - 可借数量不能大于馆藏数量，超限时弹出红色提示
   - 提交后跳转到图书详情页

### 后端 API 接口（7个接口）

#### 1. 获取图书列表
- **接口**：`GET /api/books`
- **描述**：分页获取图书列表，支持搜索和分类筛选
- **查询参数**：
  - `page` - 页码，默认 1
  - `per_page` - 每页数量，默认 10
  - `search` - 搜索关键词（匹配书名和作者）
  - `category` - 分类筛选
- **返回示例**：
```json
{
  "books": [
    {
      "id": 1,
      "title": "Python编程：从入门到实践",
      "author": "Eric Matthes",
      "isbn": "9787115428028",
      "category": "编程",
      "description": "...",
      "total_copies": 5,
      "available_copies": 3,
      "created_at": "2026-07-10T10:30:00",
      "updated_at": "2026-07-10T10:30:00"
    }
  ],
  "total": 5,
  "page": 1,
  "per_page": 6,
  "pages": 1
}
```

#### 2. 获取图书详情
- **接口**：`GET /api/books/{id}`
- **描述**：根据ID获取单本图书的详细信息
- **路径参数**：
  - `id` - 图书ID
- **返回示例**：
```json
{
  "book": {
    "id": 1,
    "title": "Python编程：从入门到实践",
    "author": "Eric Matthes",
    "isbn": "9787115428028",
    "category": "编程",
    "description": "...",
    "total_copies": 5,
    "available_copies": 3,
    "created_at": "2026-07-10T10:30:00",
    "updated_at": "2026-07-10T10:30:00"
  }
}
```

#### 3. 新增图书
- **接口**：`POST /api/books`
- **描述**：创建一本新的图书
- **请求体**：
```json
{
  "title": "书名（必填）",
  "author": "作者（必填）",
  "isbn": "ISBN（可选）",
  "category": "分类（可选）",
  "description": "内容简介（可选）",
  "total_copies": 5,
  "available_copies": 5
}
```
- **返回示例**：
```json
{
  "book": {
    "id": 6,
    "title": "新书",
    "author": "作者",
    ...
  }
}
```
- **错误码**：
  - 400 - 缺少必填字段 / ISBN已存在

#### 4. 更新图书
- **接口**：`PUT /api/books/{id}`
- **描述**：更新指定图书的信息（需密码验证）
- **路径参数**：
  - `id` - 图书ID
- **请求体**：
```json
{
  "title": "更新后的书名",
  "author": "更新后的作者",
  "isbn": "ISBN（可选）",
  "category": "分类（可选）",
  "description": "内容简介（可选）",
  "total_copies": 5,
  "available_copies": 3,
  "password": "管理员密码（必填）"
}
```
- **返回示例**：同获取图书详情
- **错误码**：
  - 403 - 密码错误
  - 404 - 图书不存在

#### 5. 删除图书
- **接口**：`DELETE /api/books/{id}`
- **描述**：删除指定的图书（需密码验证）
- **路径参数**：
  - `id` - 图书ID
- **请求体**：
```json
{
  "password": "管理员密码（必填）"
}
```
- **返回示例**：
```json
{
  "message": "Book deleted successfully"
}
```
- **错误码**：
  - 403 - 密码错误
  - 404 - 图书不存在

#### 6. 获取分类列表
- **接口**：`GET /api/books/categories`
- **描述**：获取所有图书分类（去重）
- **返回示例**：
```json
{
  "categories": ["编程", "计算机科学", "算法", "文学", "历史"]
}
```

#### 7. 健康检查
- **接口**：`GET /api/health`
- **描述**：检查API服务是否正常运行
- **返回示例**：
```json
{
  "status": "healthy",
  "message": "Library API is running"
}
```

## 异常场景处理

1. **图书不存在**：访问无效图书ID时，返回404错误和友好提示
2. **ISBN重复**：新增或更新图书时，检测到重复ISBN返回400错误
3. **参数校验**：必填字段缺失、数量不合理等情况返回明确的错误信息
4. **密码验证**：删除和编辑操作需要输入管理员密码，密码错误时返回403
5. **可借数量超限**：可借数量大于馆藏数量时，前端弹出红色提示并阻止提交
6. **网络异常**：前端API请求失败时显示错误提示，不影响页面基础展示
7. **空数据**：无图书数据时显示空状态提示

## 部署说明

### 后端部署（示例：Vercel / Railway / 自建服务器）
1. 设置环境变量 `DATABASE_URL` 为生产数据库地址
2. 设置环境变量 `SECRET_KEY` 为安全密钥
3. 使用 Gunicorn 等 WSGI 服务器部署：`gunicorn app:app`

### 前端部署（示例：Vercel / Netlify）
1. 修改 `next.config.js` 中的 API 代理地址为后端线上地址
2. 构建生产版本：`npm run build`
3. 启动生产服务：`npm start`

## 开发说明

- 后端采用 Flask 应用工厂模式，便于扩展和测试
- 前端使用 CSS Modules 实现样式隔离，避免全局样式污染
- API 设计遵循 RESTful 规范，状态码语义明确
- 数据库使用 SQLAlchemy ORM，便于迁移和切换数据库

## License

MIT
