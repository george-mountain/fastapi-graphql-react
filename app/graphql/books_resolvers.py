import strawberry
from typing import List
from sqlalchemy import select, asc, desc, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models import Book, Category, Review
from app.schemas import (
    BookType,
    BookInput,
    BookPaginationInput,
    PaginatedBooksType,
    BookFilterInput,
    BookSortInput,
    SortOrder,
    CategoryType,
    ReviewType,
)
from app.database import get_session


@strawberry.type
class BookQuery:
    @strawberry.field
    async def get_books(
        self,
        info,
        pagination: BookPaginationInput | None = None,
        filters: BookFilterInput | None = None,
        sort: BookSortInput | None = None,
    ) -> PaginatedBooksType:
        async with get_session() as session:
            stmt = select(Book).options(
                selectinload(Book.category),
                selectinload(Book.reviews).selectinload(Review.user),
            )

            # Apply filters
            if filters:
                conditions = []
                if filters.title:
                    conditions.append(Book.title.ilike(f"%{filters.title}%"))
                if filters.author:
                    conditions.append(Book.author.ilike(f"%{filters.author}%"))
                if filters.category_id:
                    conditions.append(Book.category_id == filters.category_id)
                if filters.published_year:
                    conditions.append(Book.published_year == filters.published_year)

                if conditions:
                    stmt = stmt.where(and_(*conditions))

            # Apply sorting
            if sort:
                sort_column = getattr(Book, sort.field.value)
                stmt = stmt.order_by(
                    asc(sort_column)
                    if sort.order == SortOrder.asc
                    else desc(sort_column)
                )

            # Get total count
            count_stmt = stmt.with_only_columns(Book.id).order_by(None)
            total_result = await session.execute(count_stmt)
            total = len(total_result.scalars().all())

            # Apply pagination
            if pagination:
                stmt = stmt.offset(pagination.skip).limit(pagination.limit)
            else:
                stmt = stmt.limit(10)

            result = await session.execute(stmt)
            books = result.scalars().all()

            return PaginatedBooksType(
                total=total,
                books=[
                    BookType(
                        id=book.id,
                        title=book.title,
                        author=book.author,
                        published_year=book.published_year,
                        category=(
                            CategoryType(
                                id=book.category.id,
                                name=book.category.name,
                            )
                            if book.category
                            else None
                        ),
                        reviews=[
                            ReviewType(
                                id=review.id,
                                content=review.content,
                                rating=review.rating,
                                user_id=review.user_id,
                                book_id=review.book_id,
                                username=review.user.username if review.user else None,
                            )
                            for review in book.reviews
                        ],
                    )
                    for book in books
                ],
            )

    @strawberry.field
    async def get_book(self, info, id: int) -> BookType:
        async with get_session() as session:
            result = await session.execute(
                select(Book)
                .options(
                    selectinload(Book.category),
                    selectinload(Book.reviews).selectinload(Review.user),
                )
                .where(Book.id == id)
            )

            book = result.scalar_one_or_none()
            if not book:
                raise HTTPException(status_code=404, detail="Book not found")

            return BookType(
                id=book.id,
                title=book.title,
                author=book.author,
                published_year=book.published_year,
                category=CategoryType(id=book.category.id, name=book.category.name),
                reviews=[
                    ReviewType(
                        id=review.id,
                        content=review.content,
                        rating=review.rating,
                        user_id=review.user_id,
                        book_id=review.book_id,
                        username=review.user.username if review.user else None,
                    )
                    for review in book.reviews
                ],
            )

    @strawberry.field
    async def get_books_by_category(self, info, category_id: int) -> List[BookType]:
        async with get_session() as session:
            result = await session.execute(
                select(Book).where(Book.category_id == category_id)
            )
            books = result.scalars().all()
            return [
                BookType(
                    id=book.id,
                    title=book.title,
                    author=book.author,
                    published_year=book.published_year,
                )
                for book in books
            ]

    @strawberry.field
    async def get_categories(self, info) -> List[CategoryType]:
        async with get_session() as session:
            result = await session.execute(select(Category))
            categories = result.scalars().all()
            return [
                CategoryType(id=category.id, name=category.name)
                for category in categories
            ]


@strawberry.type
class BookMutation:
    @strawberry.mutation
    async def create_book(self, info, book: BookInput) -> BookType:
        async with get_session() as session:
            new_book = Book(**book.__dict__)
            session.add(new_book)
            await session.commit()
            await session.refresh(new_book)

            # Fetch related category
            await session.refresh(new_book, attribute_names=["category"])
            category = new_book.category
            return BookType(
                id=new_book.id,
                title=new_book.title,
                author=new_book.author,
                published_year=new_book.published_year,
                category=CategoryType(id=category.id, name=category.name),
                reviews=[],
            )

    @strawberry.mutation
    async def update_book(self, info, id: int, book: BookInput) -> BookType:
        async with get_session() as session:
            result = await session.execute(select(Book).where(Book.id == id))
            existing_book = result.scalar_one_or_none()
            if not existing_book:
                raise Exception("Book not found")

            existing_book.title = book.title
            existing_book.author = book.author
            existing_book.published_year = book.published_year

            await session.commit()
            await session.refresh(existing_book)

            return BookType(
                id=existing_book.id,
                title=existing_book.title,
                author=existing_book.author,
                published_year=existing_book.published_year,
            )

    @strawberry.mutation
    async def delete_book(self, info, id: int) -> bool:
        async with get_session() as session:
            result = await session.execute(select(Book).where(Book.id == id))
            book = result.scalar_one_or_none()
            if not book:
                return False

            await session.delete(book)
            await session.commit()
            return True
