import strawberry
from typing import List
from enum import Enum


@strawberry.type
class CategoryType:
    id: int
    name: str


@strawberry.input
class CategoryInput:
    name: str


@strawberry.type
class ReviewType:
    id: int
    content: str
    rating: int
    user_id: int
    book_id: int
    username: str


@strawberry.input
class ReviewInput:
    content: str
    rating: int
    book_id: int


@strawberry.type
class BookType:
    id: int
    title: str
    author: str
    published_year: int
    category: CategoryType
    reviews: list[ReviewType]


@strawberry.input
class BookInput:
    title: str
    author: str
    published_year: int
    category_id: int


@strawberry.input
class RegisterInput:
    username: str
    password: str


@strawberry.input
class LoginInput:
    username: str
    password: str


@strawberry.type
class AuthPayload:
    access_token: str


@strawberry.input
class BookPaginationInput:
    skip: int = 0
    limit: int = 10


@strawberry.type
class PaginatedBooksType:
    total: int
    books: List[BookType]


@strawberry.enum
class BookSortField(Enum):
    title = "title"
    published_year = "published_year"
    author = "author"


@strawberry.enum
class SortOrder(Enum):
    asc = "asc"
    desc = "desc"


@strawberry.input
class BookSortInput:
    field: BookSortField
    order: SortOrder = SortOrder.asc


@strawberry.input
class BookFilterInput:
    title: str | None = None
    author: str | None = None
    category_id: int | None = None
    published_year: int | None = None
