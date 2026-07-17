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

    return jsonify(
        {
            "books": [book.to_dict() for book in books],
            "total": pagination.total,
            "page": page,
            "per_page": per_page,
            "pages": pagination.pages,
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
