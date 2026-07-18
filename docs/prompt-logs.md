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

## Prompt 8：删除图书密码验证功能

**对应功能**：删除操作安全保护  
**涉及文件**：`backend/routes/books.py`、`frontend/pages/books/[id].js`

**Prompt 内容**：
```
能不能在删除图书后加一个密码，输入正确才可以删除，密码为20040611
```

**AI 返回结果**：
```python
# backend/routes/books.py - 删除接口添加密码验证
@books_bp.route("/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    data = request.get_json() or {}
    password = data.get("password", "")
    if password != "20040611":
        return jsonify({"error": "密码错误，无法删除"}), 403
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"})
```

```jsx
// frontend/pages/books/[id].js - 删除前弹出密码验证模态框
const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
        setDeleteError('请输入密码');
        return;
    }
    setDeleting(true);
    const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
    });
    if (res.ok) {
        router.push('/');
    } else {
        const data = await res.json();
        setDeleteError(data.error || '删除失败');
    }
    setDeleting(false);
};
```

---

## Prompt 9：图书编辑功能（带密码验证）

**对应功能**：图书编辑、编辑操作安全保护  
**涉及文件**：`backend/routes/books.py`、`frontend/pages/books/[id].js`、`frontend/styles/BookDetail.module.css`

**Prompt 内容**：
```
给我添加图书编辑功能，然后一样要有删除的密码才可以
```

**AI 返回结果**：
```python
# backend/routes/books.py - 更新接口添加密码验证
@books_bp.route("/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.get_json() or {}
    password = data.get("password", "")
    if password != "20040611":
        return jsonify({"error": "密码错误，无法编辑"}), 403
    book = Book.query.get_or_404(book_id)
    # 更新字段...
    db.session.commit()
    return jsonify({"book": book.to_dict()})
```

```jsx
// frontend/pages/books/[id].js - 编辑流程：密码验证 → 编辑表单 → 提交更新
const handleEditClick = () => {
    setShowEditPasswordModal(true);  // 先弹出密码验证
};

const handleConfirmEditPassword = async () => {
    const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: editPassword }),
    });
    if (res.status === 403) {
        setEditPasswordError('密码错误');
    } else {
        setShowEditPasswordModal(false);
        setShowEditModal(true);  // 密码正确，显示编辑表单
    }
};

const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...editForm, password: editPassword }),
    });
    if (res.ok) {
        setShowEditModal(false);
        fetchBook();  // 重新获取图书数据
    }
};
```

---

## Prompt 10：整体样式优化

**对应功能**：UI/UX 美化、响应式布局  
**涉及文件**：`frontend/styles/globals.css`、`frontend/styles/Header.module.css`、`frontend/styles/Home.module.css`、`frontend/styles/BookCard.module.css`、`frontend/styles/BookDetail.module.css`、`frontend/styles/AddBook.module.css`、`frontend/components/BookCard.js`

**Prompt 内容**：
```
帮我优化一下整体的布局，让样式更加美观
```

**AI 返回结果**：
```css
/* globals.css - 引入CSS变量系统，渐变背景，自定义滚动条 */
:root {
  --primary: #667eea;
  --primary-dark: #764ba2;
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --radius-lg: 16px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%);
}

/* BookCard.module.css - 卡片悬浮动画 + 分类封面图标 */
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
.bookCover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header.module.css - 固定导航 + 毛玻璃效果 */
.header {
  position: sticky;
  top: 0;
  backdrop-filter: blur(10px);
}
```

```jsx
// BookCard.js - 按分类显示不同emoji图标
const getBookEmoji = (category) => {
  const emojiMap = {
    '编程': '💻', '文学': '📖', '历史': '🏛️', '科学': '🔬',
    '小说': '📚', '教育': '🎓', '艺术': '🎨', '经济': '💰',
    // ... 51种分类对应不同图标
  };
  return emojiMap[category] || '📕';
};
```

---

## Prompt 11：分类扩展与表单校验增强

**对应功能**：分类选择优化、可借数量校验  
**涉及文件**：`frontend/pages/books/add.js`、`frontend/pages/books/[id].js`、`frontend/components/BookCard.js`、`frontend/styles/AddBook.module.css`、`frontend/styles/BookDetail.module.css`

**Prompt 内容**：
```
每一个分类图标要不一样，分类种类多一些，新增时分类可以选择也可以自己写，
新增图书时可借数不能大于馆藏数量，要多于时弹出提示不可大于
```

**AI 返回结果**：
```jsx
// 51种预设分类常量
const CATEGORIES = [
  '编程', '文学', '历史', '科学', '小说', '教育', '艺术', '经济',
  '哲学', '传记', '计算机', '数学', '物理', '化学', '生物', '医学',
  '法律', '心理', '社会', '政治', '军事', '地理', '天文', '音乐',
  '电影', '摄影', '美食', '旅行', '运动', '游戏', '漫画', '童话',
  '诗歌', '散文', '戏剧', '语言', '宗教', '建筑', '设计', '管理',
  '营销', '金融', '投资', '会计', '农业', '工业', '交通', '环境',
  '宠物', '育儿', '养生',
];

// 分类下拉选择 + 自定义输入切换
const handleCategoryChange = (e) => {
  const value = e.target.value;
  if (value === '__custom__') {
    setCustomCategory(true);  // 切换为自定义输入模式
  } else {
    setCustomCategory(false);
    setFormData(prev => ({ ...prev, category: value }));
  }
};

// 可借数量超限弹出提示
const handleChange = (e) => {
  const { name, value } = e.target;
  const newFormData = { ...formData,
    [name]: parseInt(value) || 0
  };
  if (name === 'available_copies' && newFormData.available_copies > newFormData.total_copies) {
    setShowCopiesAlert(true);  // 显示红色提示
    setTimeout(() => setShowCopiesAlert(false), 2000);
  }
  // 馆藏数量变小时自动调整可借数量
  if (name === 'total_copies' && newFormData.available_copies > newFormData.total_copies) {
    newFormData.available_copies = newFormData.total_copies;
  }
};
```

```css
/* 弹出提示样式 */
.copiesAlert {
  position: absolute;
  top: -44px;
  background: #fef2f2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  animation: slideDown 0.3s ease;
}
```

---

## Prompt 12：数据统计面板

**对应功能**：首页数据统计展示  
**涉及文件**：`backend/routes/books.py`、`frontend/pages/index.js`、`frontend/styles/Home.module.css`

**Prompt 内容**：
```
新增一个数据统计面板
```

**AI 返回结果**：
```python
# backend/routes/books.py - 新增统计接口
@books_bp.route("/stats", methods=["GET"])
def get_stats():
    """获取图书统计数据"""
    from sqlalchemy import func

    total_books = Book.query.count()
    total_categories = db.session.query(func.count(func.distinct(Book.category))).scalar()
    total_copies = db.session.query(func.sum(Book.total_copies)).scalar() or 0
    available_copies = db.session.query(func.sum(Book.available_copies)).scalar() or 0
    borrowed_copies = total_copies - available_copies
    available_ratio = round(available_copies / total_copies * 100, 1) if total_copies > 0 else 0

    # 各分类图书数量（取前6个）
    category_stats = (
        db.session.query(Book.category, func.count(Book.id))
        .group_by(Book.category)
        .order_by(func.count(Book.id).desc())
        .limit(6)
        .all()
    )
    category_distribution = [{"category": c[0], "count": c[1]} for c in category_stats if c[0]]

    return jsonify({
        "total_books": total_books,
        "total_categories": total_categories,
        "total_copies": total_copies,
        "available_copies": available_copies,
        "borrowed_copies": borrowed_copies,
        "available_ratio": available_ratio,
        "category_distribution": category_distribution,
    })
```

```jsx
// frontend/pages/index.js - 统计面板组件
{stats && (
  <div className={styles.statsPanel}>
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>📚</div>
        <div className={styles.statInfo}>
          <div className={styles.statValue}>{stats.total_books}</div>
          <div className={styles.statLabel}>图书总数</div>
        </div>
      </div>
      {/* 分类数量、馆藏总量、可借数量卡片... */}
    </div>
    <div className={styles.statsFooter}>
      <div className={styles.ratioBar}>
        <div className={styles.ratioFill}
          style={{ width: `${stats.available_ratio}%` }}
        ></div>
      </div>
      <div className={styles.ratioText}>
        可借比例 {stats.available_ratio}% | 已借出 {stats.borrowed_copies} 本
      </div>
    </div>
  </div>
)}
```

---

## Prompt 13：图书数据扩展

**对应功能**：扩充图书种子数据  
**涉及文件**：`backend/seed.py`

**Prompt 内容**：
```
帮我增加到3页的图书量，分别要不同的分类
```

**AI 返回结果**：
```python
# backend/seed.py - 从6本扩展到33本，涵盖33种不同分类
sample_books = [
    # 原有6本...
    {"title": "三体", "author": "刘慈欣", "category": "小说", ...},
    {"title": "教育学", "author": "王道俊", "category": "教育", ...},
    {"title": "艺术的故事", "author": "贡布里希", "category": "艺术", ...},
    {"title": "经济学原理", "author": "曼昆", "category": "经济", ...},
    {"title": "苏菲的世界", "author": "乔斯坦·贾德", "category": "哲学", ...},
    {"title": "史蒂夫·乔布斯传", "author": "沃尔特·艾萨克森", "category": "传记", ...},
    {"title": "数学之美", "author": "吴军", "category": "数学", ...},
    {"title": "时间简史", "author": "史蒂芬·霍金", "category": "物理", ...},
    # ... 共33本，涵盖编程、计算机、科学、文学、历史、小说、教育、艺术、
    # 经济、哲学、传记、数学、物理、化学、生物、医学、法律、心理、社会、
    # 政治、军事、地理、天文、音乐、电影、摄影、美食、旅行、运动、游戏、
    # 漫画、童话、诗歌等33种分类
]

# 添加 db.drop_all() 确保数据重置
db.drop_all()
db.create_all()
```

---

## Prompt 14：每页显示数量调整与分页修复

**对应功能**：分页优化  
**涉及文件**：`backend/routes/books.py`、`frontend/pages/index.js`

**Prompt 内容**：
```
为什么不能8个
后端也改为8本
空白的第6页要消除
```

**AI 返回结果**：
```python
# backend/routes/books.py - 默认每页数量从10改为8
per_page = request.args.get("per_page", 8, type=int)
```

```jsx
// frontend/pages/index.js - 每页数量和分页计算同步改为8
const params = new URLSearchParams({
  page,
  per_page: 8,  // 从6改为8
});
const totalPages = Math.ceil(total / 8);  // 从6改为8
```

说明：33本图书，每页8本，共5页（前4页各8本，第5页1本），消除了原先每页6本时产生的空白第6页。

---

## Prompt 15：拼音首字母搜索

**对应功能**：拼音搜索  
**涉及文件**：`backend/routes/books.py`、`backend/requirements.txt`、`frontend/pages/index.js`

**Prompt 内容**：
```
搜索只要输入一个字母下面就弹出书名中有这个字母的拼音的书等等
我只要首字母，不是完全的拼音
```

**AI 返回结果**：
```python
# backend/requirements.txt - 新增pypinyin依赖
pypinyin==0.55.0

# backend/routes/books.py - 拼音首字母搜索
from pypinyin import lazy_pinyin, Style

def _get_initials(text):
    """获取文本的拼音首字母，如"活着"->"hz" """
    if not text:
        return ""
    return "".join(lazy_pinyin(text, style=Style.FIRST_LETTER))

def _match_search(book, keyword):
    """检查图书是否匹配搜索词（支持中文、拼音首字母）"""
    keyword = keyword.lower()
    title = (book.title or "").lower()
    author = (book.author or "").lower()
    title_initials = _get_initials(book.title).lower()
    author_initials = _get_initials(book.author).lower()

    return (
        keyword in title
        or keyword in author
        or keyword in title_initials
        or keyword in author_initials
    )

# 搜索逻辑改为Python层面过滤（SQL无法处理拼音转换）
if search:
    all_books = query.all()
    filtered = [b for b in all_books if _match_search(b, search)]
    total = len(filtered)
    pages = max(1, (total + per_page - 1) // per_page)
    start = (page - 1) * per_page
    books = filtered[start : start + per_page]
```

```jsx
// frontend/pages/index.js - 搜索防抖优化
const [debouncedSearch, setDebouncedSearch] = useState('');

// 搜索防抖：输入停止 300ms 后才发请求
useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(search), 300);
  return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
  fetchBooks();
}, [debouncedSearch, category, page]);  // 使用防抖后的搜索词
```

验证结果：
- 输入 `hz` → 匹配"活着" ✓
- 输入 `st` → 匹配"三体"等 ✓
- 输入 `huo` → 无结果（仅匹配首字母，不匹配完整拼音） ✓

---

## Prompt 16：一键启动脚本

**对应功能**：项目快速启动  
**涉及文件**：`start.bat`、`stop.bat`

**Prompt 内容**：
```
可以让其自带启动所需要的，每次打开即可启动
```

**AI 返回结果**：
```batch
@echo off
chcp 65001 >nul
title Library Management System

set "NODE_DIR=C:\Users\20475\.workbuddy\binaries\node\versions\22.22.2"
set "PROJECT_DIR=%~dp0"
set "PATH=%NODE_DIR%;%PATH%"

echo [1/3] Starting Backend (Flask)...
cd /d "%PROJECT_DIR%backend"
start "Backend" cmd /k "set PATH=%NODE_DIR%;%%PATH%% && python app.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend (Next.js)...
cd /d "%PROJECT_DIR%frontend"
start "Frontend" cmd /k "set PATH=%NODE_DIR%;%%PATH%% && npm run dev"

timeout /t 8 /nobreak >nul

echo [3/3] Opening Browser...
start http://localhost:3000
```

```batch
# stop.bat - 停止所有相关进程
@echo off
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
echo All services stopped.
pause
```

---

## Prompt 17：Vercel Serverless Functions 部署

**对应功能**：线上部署、Serverless API  
**涉及文件**：`frontend/pages/api/books/`、`vercel.json`、`README.md`

**Prompt 内容**：
```
线上部署访问 URL怎么搞
我采用方案2：全部用 Vercel
检查现在要如何线上部署访问 URL
```

**AI 返回结果**：
```
方案：全部用 Vercel（前后端一体部署，无需单独的后端服务）

实现思路：
1. 将 Flask 后端的 API 接口用 Node.js 重写，放到 Next.js 的 pages/api/ 目录下
2. 利用 Vercel Serverless Functions 自动部署 API
3. 数据存储改用内存（因为 Vercel Serverless 无法连接本地 SQLite）
4. 内置 33 本初始图书数据，确保部署后即可访问

前端部署配置（vercel.json）：
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}

API 接口（pages/api/books/index.js）：
- GET /api/books - 获取图书列表（支持分页、搜索、分类筛选）
- POST /api/books - 新增图书
- GET /api/books/stats - 获取统计数据
- GET /api/books/categories - 获取分类列表
- GET /api/books/[id] - 获取图书详情
- PUT /api/books/[id] - 更新图书（需密码验证）
- DELETE /api/books/[id] - 删除图书（需密码验证）

拼音首字母搜索（Node.js 实现）：
function getPinyinInitials(text) {
  // 自实现的拼音首字母映射，无需额外依赖
  const pinyinMap = {
    '活': 'h', '着': 'z', '三': 's', '体': 't', ...
  };
  return text.split('').map(ch => pinyinMap[ch] || ch).join('');
}

部署步骤：
1. 将代码推送到 GitHub
2. Vercel 导入仓库，Root Directory 设为 frontend
3. Framework 选择 Next.js
4. 点击 Deploy 等待构建完成

部署结果：
- 项目地址：https://my-library-system-one.vercel.app
- 所有 API 接口通过 Vercel Serverless Functions 提供服务
- 数据使用内存存储，重启后重置为初始33本图书
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
