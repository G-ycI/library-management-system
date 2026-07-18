from flask import Blueprint, request, jsonify
from models import db, Book
from pypinyin import lazy_pinyin, Style

books_bp = Blueprint("books", __name__, url_prefix="/api/books")


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


@books_bp.route("", methods=["GET"])
def get_books():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 8, type=int)
    search = request.args.get("search", "", type=str)
    category = request.args.get("category", "", type=str)

    query = Book.query

    if category:
        query = query.filter(Book.category == category)

    if search:
        # 拼音搜索需在 Python 层面过滤（SQL 无法处理拼音转换）
        all_books = query.all()
        filtered = [b for b in all_books if _match_search(b, search)]
        total = len(filtered)
        pages = max(1, (total + per_page - 1) // per_page)
        start = (page - 1) * per_page
        books = filtered[start : start + per_page]
    else:
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        books = pagination.items
        total = pagination.total
        pages = pagination.pages

    return jsonify(
        {
            "books": [book.to_dict() for book in books],
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": pages,
        }
    )


@books_bp.route("/<int:book_id>", methods=["GET"])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify({"book": book.to_dict()})


@books_bp.route("", methods=["POST"])
def create_book():
    data = request.get_json()

    if not data or not data.get("title") or not data.get("author"):
        return jsonify({"error": "Title and author are required"}), 400

    if data.get("isbn") and Book.query.filter_by(isbn=data["isbn"]).first():
        return jsonify({"error": "ISBN already exists"}), 400

    book = Book(
        title=data["title"],
        author=data["author"],
        isbn=data.get("isbn"),
        category=data.get("category"),
        description=data.get("description"),
        total_copies=data.get("total_copies", 1),
        available_copies=data.get("available_copies", data.get("total_copies", 1)),
    )

    db.session.add(book)
    db.session.commit()

    return jsonify({"book": book.to_dict()}), 201


@books_bp.route("/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.get_json() or {}
    password = data.get("password", "")

    if password != "20040611":
        return jsonify({"error": "密码错误，无法编辑"}), 403

    book = Book.query.get_or_404(book_id)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    if data.get("title") is not None:
        book.title = data["title"]
    if data.get("author") is not None:
        book.author = data["author"]
    if data.get("isbn") is not None:
        existing = Book.query.filter_by(isbn=data["isbn"]).first()
        if existing and existing.id != book_id:
            return jsonify({"error": "ISBN already exists"}), 400
        book.isbn = data["isbn"]
    if data.get("category") is not None:
        book.category = data["category"]
    if data.get("description") is not None:
        book.description = data["description"]
    if data.get("total_copies") is not None:
        book.total_copies = data["total_copies"]
    if data.get("available_copies") is not None:
        book.available_copies = data["available_copies"]

    db.session.commit()
    return jsonify({"book": book.to_dict()})


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


@books_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = db.session.query(Book.category).distinct().all()
    category_list = [c[0] for c in categories if c[0]]
    return jsonify({"categories": category_list})


@books_bp.route("/stats", methods=["GET"])
def get_stats():
    """获取图书统计数据"""
    from sqlalchemy import func

    # 总图书数
    total_books = Book.query.count()

    # 总分类数
    total_categories = db.session.query(func.count(func.distinct(Book.category))).scalar()

    # 总馆藏数量
    total_copies = db.session.query(func.sum(Book.total_copies)).scalar() or 0

    # 总可借数量
    available_copies = db.session.query(func.sum(Book.available_copies)).scalar() or 0

    # 已借出数量
    borrowed_copies = total_copies - available_copies

    # 可借比例
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
