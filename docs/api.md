# 图书管理系统 API 接口文档

**基础URL**：`http://localhost:5000`（本地）或 `https://my-library-system-one.vercel.app`（线上）

**接口总数**：8 个

**认证方式**：删除和编辑接口需在请求体中传入 `password` 字段进行密码验证

---

## 接口列表

| 序号 | 方法 | 路径 | 描述 | 是否需要认证 |
|------|------|------|------|-------------|
| 1 | GET | /api/books | 获取图书列表 | 否 |
| 2 | GET | /api/books/{id} | 获取图书详情 | 否 |
| 3 | POST | /api/books | 新增图书 | 否 |
| 4 | PUT | /api/books/{id} | 更新图书 | 是 |
| 5 | DELETE | /api/books/{id} | 删除图书 | 是 |
| 6 | GET | /api/books/categories | 获取分类列表 | 否 |
| 7 | GET | /api/books/stats | 获取统计数据 | 否 |
| 8 | GET | /api/health | 健康检查 | 否 |

---

## 接口详情

### 1. 获取图书列表

- **接口**：`GET /api/books`
- **描述**：分页获取图书列表，支持搜索（含拼音首字母）和分类筛选
- **查询参数**：

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| page | int | 否 | 1 | 页码 |
| per_page | int | 否 | 8 | 每页数量 |
| search | string | 否 | - | 搜索关键词（匹配书名、作者的中文字符及拼音首字母） |
| category | string | 否 | - | 分类筛选 |

- **请求示例**：
```
GET /api/books?page=1&per_page=8&search=st&category=小说
```

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
      "description": "一本面向编程初学者的Python入门书籍",
      "total_copies": 5,
      "available_copies": 3,
      "created_at": "2026-07-10T10:30:00",
      "updated_at": "2026-07-10T10:30:00"
    }
  ],
  "total": 33,
  "page": 1,
  "per_page": 8,
  "pages": 5
}
```

- **返回字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| books | array | 当前页的图书列表 |
| total | int | 符合条件的图书总数 |
| page | int | 当前页码 |
| per_page | int | 每页数量 |
| pages | int | 总页数 |

- **拼音搜索说明**：搜索词 `st` 可匹配书名拼音首字母为 `st` 的图书（如"三体"），搜索词 `py` 可匹配"Python编程"等。

---

### 2. 获取图书详情

- **接口**：`GET /api/books/{id}`
- **描述**：根据 ID 获取单本图书的详细信息
- **路径参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | int | 是 | 图书ID |

- **请求示例**：
```
GET /api/books/1
```

- **返回示例**：
```json
{
  "book": {
    "id": 1,
    "title": "Python编程：从入门到实践",
    "author": "Eric Matthes",
    "isbn": "9787115428028",
    "category": "编程",
    "description": "一本面向编程初学者的Python入门书籍",
    "total_copies": 5,
    "available_copies": 3,
    "created_at": "2026-07-10T10:30:00",
    "updated_at": "2026-07-10T10:30:00"
  }
}
```

- **错误码**：

| 状态码 | 描述 |
|--------|------|
| 404 | 图书不存在 |

- **图书字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| id | int | 图书唯一标识 |
| title | string | 书名 |
| author | string | 作者 |
| isbn | string | ISBN编号 |
| category | string | 分类 |
| description | string | 内容简介 |
| total_copies | int | 馆藏总量 |
| available_copies | int | 可借数量 |
| created_at | string | 创建时间（ISO 8601格式） |
| updated_at | string | 更新时间（ISO 8601格式） |

---

### 3. 新增图书

- **接口**：`POST /api/books`
- **描述**：创建一本新的图书记录
- **请求体**：

```json
{
  "title": "新书名",
  "author": "作者名",
  "isbn": "9781234567890",
  "category": "编程",
  "description": "内容简介",
  "total_copies": 5,
  "available_copies": 5
}
```

- **请求字段说明**：

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 是 | 书名 |
| author | string | 是 | 作者 |
| isbn | string | 否 | ISBN编号（唯一） |
| category | string | 否 | 分类 |
| description | string | 否 | 内容简介 |
| total_copies | int | 否 | 馆藏总量，默认1 |
| available_copies | int | 否 | 可借数量，默认1（不可大于total_copies） |

- **请求示例**：
```
POST /api/books
Content-Type: application/json

{
  "title": "深入理解计算机系统",
  "author": "Randal E. Bryant",
  "isbn": "9787111544937",
  "category": "计算机",
  "description": "从程序员的视角详细阐述计算机系统的本质概念",
  "total_copies": 3,
  "available_copies": 3
}
```

- **返回示例**：
```json
{
  "book": {
    "id": 34,
    "title": "深入理解计算机系统",
    "author": "Randal E. Bryant",
    "isbn": "9787111544937",
    "category": "计算机",
    "description": "从程序员的视角详细阐述计算机系统的本质概念",
    "total_copies": 3,
    "available_copies": 3,
    "created_at": "2026-07-19T14:30:00",
    "updated_at": "2026-07-19T14:30:00"
  }
}
```

- **错误码**：

| 状态码 | 描述 |
|--------|------|
| 400 | 缺少必填字段（title 或 author） |
| 400 | ISBN 已存在 |
| 400 | 可借数量大于馆藏总量 |

---

### 4. 更新图书

- **接口**：`PUT /api/books/{id}`
- **描述**：更新指定图书的信息，需密码验证
- **路径参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | int | 是 | 图书ID |

- **请求体**：

```json
{
  "title": "更新后的书名",
  "author": "更新后的作者",
  "isbn": "9781234567890",
  "category": "小说",
  "description": "更新后的简介",
  "total_copies": 10,
  "available_copies": 8,
  "password": "管理员密码"
}
```

- **请求字段说明**：

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| password | string | 是 | 管理员密码（用于身份验证） |
| title | string | 否 | 书名 |
| author | string | 否 | 作者 |
| isbn | string | 否 | ISBN编号 |
| category | string | 否 | 分类 |
| description | string | 否 | 内容简介 |
| total_copies | int | 否 | 馆藏总量 |
| available_copies | int | 否 | 可借数量（不可大于total_copies） |

- **请求示例**：
```
PUT /api/books/1
Content-Type: application/json

{
  "title": "Python编程：从入门到实践（第3版）",
  "total_copies": 8,
  "available_copies": 5,
  "password": "******"
}
```

- **返回示例**：同获取图书详情的返回格式

- **错误码**：

| 状态码 | 描述 |
|--------|------|
| 403 | 密码错误，无法编辑 |
| 404 | 图书不存在 |
| 400 | 可借数量大于馆藏总量 |

---

### 5. 删除图书

- **接口**：`DELETE /api/books/{id}`
- **描述**：删除指定的图书，需密码验证
- **路径参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | int | 是 | 图书ID |

- **请求体**：

```json
{
  "password": "管理员密码"
}
```

- **请求字段说明**：

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| password | string | 是 | 管理员密码（用于身份验证） |

- **请求示例**：
```
DELETE /api/books/1
Content-Type: application/json

{
  "password": "******"
}
```

- **返回示例**：
```json
{
  "message": "Book deleted successfully"
}
```

- **错误码**：

| 状态码 | 描述 |
|--------|------|
| 403 | 密码错误，无法删除 |
| 404 | 图书不存在 |

---

### 6. 获取分类列表

- **接口**：`GET /api/books/categories`
- **描述**：获取所有图书分类（去重后的分类名称列表）
- **请求参数**：无

- **请求示例**：
```
GET /api/books/categories
```

- **返回示例**：
```json
{
  "categories": ["编程", "计算机", "算法", "文学", "历史", "科学", "小说", "教育", "艺术", "经济"]
}
```

- **返回字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| categories | array[string] | 去重后的分类名称列表 |

---

### 7. 获取图书统计数据

- **接口**：`GET /api/books/stats`
- **描述**：获取图书统计数据，用于首页统计面板展示
- **请求参数**：无

- **请求示例**：
```
GET /api/books/stats
```

- **返回示例**：
```json
{
  "total_books": 33,
  "total_categories": 33,
  "total_copies": 130,
  "available_copies": 98,
  "borrowed_copies": 32,
  "available_ratio": 75.4,
  "category_distribution": [
    {"category": "编程", "count": 1},
    {"category": "小说", "count": 1},
    {"category": "历史", "count": 1},
    {"category": "科学", "count": 1},
    {"category": "教育", "count": 1},
    {"category": "艺术", "count": 1}
  ]
}
```

- **返回字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| total_books | int | 图书总数 |
| total_categories | int | 分类总数（去重） |
| total_copies | int | 馆藏总量 |
| available_copies | int | 可借总量 |
| borrowed_copies | int | 已借出总量（馆藏总量 - 可借总量） |
| available_ratio | float | 可借比例（百分比，保留1位小数） |
| category_distribution | array | 各分类图书数量（取前6个，按数量降序） |

- **category_distribution 字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| category | string | 分类名称 |
| count | int | 该分类下的图书数量 |

---

### 8. 健康检查

- **接口**：`GET /api/health`
- **描述**：检查 API 服务是否正常运行
- **请求参数**：无

- **请求示例**：
```
GET /api/health
```

- **返回示例**：
```json
{
  "status": "healthy",
  "message": "Library API is running"
}
```

- **返回字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| status | string | 服务状态（"healthy" 表示正常） |
| message | string | 状态描述信息 |

---

## 通用错误响应

所有接口在发生错误时，返回格式如下：

```json
{
  "error": "错误描述信息"
}
```

### 通用错误码

| 状态码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 403 | 权限不足（密码验证失败） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 数据模型

### Book（图书）

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | int | 主键，自增 | 图书唯一标识 |
| title | string | 非空 | 书名 |
| author | string | 非空 | 作者 |
| isbn | string | 唯一 | ISBN编号 |
| category | string | - | 分类 |
| description | string | - | 内容简介 |
| total_copies | int | 默认1 | 馆藏总量 |
| available_copies | int | 默认1 | 可借数量 |
| created_at | datetime | 自动生成 | 创建时间 |
| updated_at | datetime | 自动更新 | 更新时间 |

---

## 调用示例（cURL）

```bash
# 获取图书列表（第1页，每页8本）
curl http://localhost:5000/api/books?page=1&per_page=8

# 搜索图书（拼音首字母搜索"三体"）
curl http://localhost:5000/api/books?search=st

# 按分类筛选
curl http://localhost:5000/api/books?category=编程

# 获取图书详情
curl http://localhost:5000/api/books/1

# 新增图书
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"新书","author":"作者","category":"编程","total_copies":3,"available_copies":3}'

# 更新图书（需密码验证）
curl -X PUT http://localhost:5000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"更新书名","password":"20040611"}'

# 删除图书（需密码验证）
curl -X DELETE http://localhost:5000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"password":"20040611"}'

# 获取分类列表
curl http://localhost:5000/api/books/categories

# 获取统计数据
curl http://localhost:5000/api/books/stats

# 健康检查
curl http://localhost:5000/api/health
```
