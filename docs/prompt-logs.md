# AI 工具运用 Prompt 日志

本文件记录项目开发过程中使用 AI 辅助编程的 Prompt 及 AI 返回结果，每条记录包含对应的功能模块和文件。

---

## Prompt 1：项目整体架构设计

**对应功能**：项目初始化、技术选型、目录结构设计  
**涉及文件**：项目整体结构规划

**Prompt 内容**：
```
我需要开发一个图书管理系统的全栈项目，前端用Next.js，后端用Flask。
请帮我设计项目目录结构，需要满足以下要求：
1. 前端至少3个独立路由页面
2. 后端至少3个API接口
3. 代码结构清晰，符合Next.js和Flask的规范
4. 使用SQLite数据库
```

**AI 返回结果**：
```
图书管理系统项目结构建议：

library-management-system/
├── backend/                 # Flask 后端
│   ├── app.py              # 应用入口，应用工厂模式
│   ├── config.py           # 配置文件
│   ├── models.py           # SQLAlchemy 数据模型
│   ├── seed.py             # 种子数据脚本
│   ├── requirements.txt    # Python 依赖
│   └── routes/             # 路由蓝图
│       └── books.py        # 图书相关 API
├── frontend/               # Next.js 前端
│   ├── pages/
│   │   ├── _app.js         # 全局配置
│   │   ├── index.js        # 图书列表页（首页）
│   │   └── books/
│   │       ├── [id].js     # 图书详情页（动态路由）
│   │       └── add.js      # 新增图书页
│   ├── components/         # 可复用组件
│   │   ├── Header.js
│   │   └── BookCard.js
│   ├── styles/             # CSS Modules 样式
│   ├── package.json
│   └── next.config.js
├── docs/                   # 项目文档
└── README.md

说明：
- 后端采用 Flask 蓝图模式，便于后续扩展用户、借阅等模块
- 前端使用 Next.js 路由约定，pages 目录即路由
- 使用 CSS Modules 做样式隔离
```

---

## Prompt 2：后端数据模型设计

**对应功能**：图书数据模型设计  
**涉及文件**：`backend/models.py`

**Prompt 内容**：
```
帮我设计一个图书管理系统的Book数据模型，使用Flask-SQLAlchemy。
需要包含以下字段：
- 书名
- 作者
- ISBN
- 分类
- 内容简介
- 馆藏数量
- 可借数量
- 创建时间
- 更新时间

同时需要一个to_dict()方法用于序列化为JSON。
```

**AI 返回结果**：
```python
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), unique=True)
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    total_copies = db.Column(db.Integer, default=1)
    available_copies = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "isbn": self.isbn,
            "category": self.category,
            "description": self.description,
            "total_copies": self.total_copies,
            "available_copies": self.available_copies,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
```

---

## Prompt 3：图书 CRUD API 接口

**对应功能**：图书增删改查 API  
**涉及文件**：`backend/routes/books.py`

**Prompt 内容**：
```
帮我写一个Flask蓝图，实现图书的CRUD接口。
需要实现：
1. GET /api/books - 获取图书列表，支持分页、搜索、分类筛选
2. GET /api/books/<id> - 获取单本图书详情
3. POST /api/books - 新增图书，需要校验必填项和ISBN重复
4. PUT /api/books/<id> - 更新图书信息
5. DELETE /api/books/<id> - 删除图书
6. GET /api/books/categories - 获取所有分类列表

使用SQLAlchemy查询，返回统一的JSON格式。
```

**AI 返回结果**：
```python
from flask import Blueprint, request, jsonify
from models import db, Book

books_bp = Blueprint("books", __name__, url_prefix="/api/books")


@books_bp.route("", methods=["GET"])
def get_books():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    search = request.args.get("search", "", type=str)
    category = request.args.get("category", "", type=str)

    query = Book.query
    if search:
        query = query.filter(
            (Book.title.like(f"%{search}%")) | (Book.author.like(f"%{search}%"))
        )
    if category:
        query = query.filter(Book.category == category)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    books = pagination.items

    return jsonify({
        "books": [book.to_dict() for book in books],
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "pages": pagination.pages,
    })


# ... 其他接口实现
```

---

## Prompt 4：前端图书列表页开发

**对应功能**：图书列表页面、搜索筛选、分页  
**涉及文件**：`frontend/pages/index.js`、`frontend/components/BookCard.js`

**Prompt 内容**：
```
帮我写一个Next.js的图书列表页面，需要包含：
1. 顶部搜索框，可以按书名或作者搜索
2. 分类下拉筛选
3. 图书卡片网格布局展示
4. 分页功能，每页6本
5. 加载状态和空状态提示
6. 使用CSS Modules样式

数据从 /api/books 接口获取。
```

**AI 返回结果**：
```jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, category, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/books/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: 6 });
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // ... 渲染逻辑
}
```

---

## Prompt 5：新增图书表单验证

**对应功能**：新增图书页面、表单验证  
**涉及文件**：`frontend/pages/books/add.js`

**Prompt 内容**：
```
帮我写一个新增图书的表单页面，需要：
1. 表单字段：书名、作者、ISBN、分类、馆藏数量、可借数量、内容简介
2. 前端验证：
   - 书名和作者必填
   - 馆藏数量不能小于1
   - 可借数量不能小于0且不能超过馆藏数量
3. 提交按钮loading状态
4. 提交成功后跳转到详情页
5. 错误提示显示
6. 使用CSS Modules样式
```

**AI 返回结果**：
```jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from '../../styles/AddBook.module.css';

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '',
    description: '', total_copies: 1, available_copies: 1,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '请输入书名';
    if (!formData.author.trim()) newErrors.author = '请输入作者';
    if (formData.total_copies < 1) newErrors.total_copies = '馆藏数量不能小于1';
    if (formData.available_copies < 0) newErrors.available_copies = '可借数量不能小于0';
    if (formData.available_copies > formData.total_copies)
      newErrors.available_copies = '可借数量不能超过馆藏数量';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // 提交逻辑...
  };

  // ... 渲染表单
}
```

---

## Prompt 6：代码结构优化建议

**对应功能**：代码审查、结构优化  
**涉及文件**：项目整体代码质量

**Prompt 内容**：
```
请对我这个图书管理系统的代码做一次Code Review，检查：
1. 代码结构是否合理
2. 有没有潜在的bug
3. 安全性问题
4. 性能优化建议
5. 最佳实践建议

分别从后端Flask和前端Next.js两个维度分析。
```

**AI 返回结果**：
```
## 后端 Code Review 结果

### 优点
- 使用了应用工厂模式，结构清晰
- 蓝图分离，便于扩展
- 统一的JSON响应格式
- SQL注入防护（使用ORM参数化查询）

### 改进建议
1. **输入验证**：建议使用 marshmallow 或 pydantic 做更严格的输入验证
2. **错误处理**：建议添加全局错误处理器，统一错误响应格式
3. **日志系统**：建议添加日志记录，便于排查问题
4. **API限流**：生产环境建议添加接口限流，防止恶意请求
5. **数据库迁移**：建议使用 Flask-Migrate 管理数据库版本

## 前端 Code Review 结果

### 优点
- 组件拆分合理，复用性好
- CSS Modules 样式隔离
- 表单验证完善
- 加载状态和空状态处理

### 改进建议
1. **状态管理**：如果功能扩展，建议引入 SWR 或 React Query 做数据获取
2. **TypeScript**：建议迁移到 TypeScript 提升类型安全
3. **错误边界**：建议添加 React 错误边界组件
4. **环境变量**：API地址建议使用环境变量配置
5. **SEO优化**：图书详情页可添加更多meta标签
```

---

## Prompt 7：README 文档编写

**对应功能**：项目文档  
**涉及文件**：`README.md`

**Prompt 内容**：
```
帮我写一个完整的README.md文档，用于图书管理系统项目。
需要包含：
1. 项目介绍
2. 技术栈说明
3. 项目结构
4. 安装运行指南（前后端分别说明）
5. 功能说明（前端页面列表、后端API接口文档）
6. 部署说明
7. 开发说明

API接口文档要详细，包含请求方式、参数、返回示例。
```

**AI 返回结果**：
```markdown
# 图书管理系统

## 项目介绍
...

## 技术栈
### 前端
- Next.js 14
- React 18
- CSS Modules
- Axios

### 后端
- Flask 3.0
- Flask-SQLAlchemy
- Flask-CORS
- SQLite

## 项目结构
...

## 安装与运行
### 后端启动
1. cd backend
2. pip install -r requirements.txt
3. python seed.py
4. python app.py

### 前端启动
1. cd frontend
2. npm install
3. npm run dev

## API 文档
### GET /api/books
获取图书列表，支持分页、搜索、分类筛选
...
```

---

## 使用的 AI 工具

- **Trae IDE AI 助手** - 主要的代码生成和调试工具
- **使用方式**：通过自然语言描述需求，AI 生成代码后人工审查和调整

## AI 使用心得

1. **效率提升**：AI 可以快速生成基础代码框架，节省大量重复劳动时间
2. **代码质量**：AI 生成的代码通常遵循较好的实践，但仍需人工审查
3. **调试辅助**：遇到报错时，AI 可以快速定位问题并给出修复建议
4. **学习工具**：通过与 AI 交流，可以学习到新的编程模式和最佳实践
5. **局限性**：AI 对复杂业务逻辑的理解仍有局限，需要人工把控整体架构
