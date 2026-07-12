from app import create_app
from models import db, Book

app = create_app()

with app.app_context():
    db.create_all()

    sample_books = [
        {
            "title": "Python编程：从入门到实践",
            "author": "Eric Matthes",
            "isbn": "9787115428028",
            "category": "编程",
            "description": "一本针对初学者的Python编程入门书籍，内容涵盖Python基础语法、面向对象编程、项目实践等。",
            "total_copies": 5,
            "available_copies": 3,
        },
        {
            "title": "深入理解计算机系统",
            "author": "Randal E. Bryant",
            "isbn": "9787111544937",
            "category": "计算机科学",
            "description": "从程序员的视角详细阐述计算机系统的本质概念，涵盖计算机底层原理。",
            "total_copies": 3,
            "available_copies": 2,
        },
        {
            "title": "算法导论",
            "author": "Thomas H. Cormen",
            "isbn": "9787111407010",
            "category": "算法",
            "description": "全面介绍算法的经典教材，涵盖算法设计与分析。",
            "total_copies": 4,
            "available_copies": 4,
        },
        {
            "title": "活着",
            "author": "余华",
            "isbn": "9787506365437",
            "category": "文学",
            "description": "讲述了农村人福贵悲惨的人生遭遇，是一部具有史诗品质的作品。",
            "total_copies": 6,
            "available_copies": 5,
        },
        {
            "title": "人类简史：从动物到上帝",
            "author": "尤瓦尔·赫拉利",
            "isbn": "9787508647357",
            "category": "历史",
            "description": "从认知革命、农业革命到科学革命，讲述人类如何登上食物链顶端。",
            "total_copies": 3,
            "available_copies": 1,
        },
    ]

    for book_data in sample_books:
        if not Book.query.filter_by(isbn=book_data["isbn"]).first():
            book = Book(**book_data)
            db.session.add(book)

    db.session.commit()
    print("Sample data seeded successfully!")
