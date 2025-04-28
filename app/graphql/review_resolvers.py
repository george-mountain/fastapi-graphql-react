import strawberry
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models import Review, User
from app.schemas import ReviewType, ReviewInput
from app.database import get_session


@strawberry.type
class ReviewQuery:
    @strawberry.field
    async def get_reviews(self, info, book_id: int) -> list[ReviewType]:
        async with get_session() as session:
            result = await session.execute(
                select(Review)
                .options(selectinload(Review.user))
                .where(Review.book_id == book_id)
            )
            reviews = result.scalars().all()
            return [
                ReviewType(
                    id=review.id,
                    content=review.content,
                    rating=review.rating,
                    book_id=review.book_id,
                    user_id=review.user_id,
                    username=review.user.username if review.user else None,
                )
                for review in reviews
            ]


@strawberry.type
class ReviewMutation:
    @strawberry.mutation
    async def write_review(self, info, review: ReviewInput) -> ReviewType:
        user = info.context.get("user")
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        async with get_session() as session:
            new_review = Review(
                content=review.content,
                rating=review.rating,
                book_id=review.book_id,
                user_id=int(user["user_id"]),
            )
            session.add(new_review)
            await session.commit()
            await session.refresh(new_review)
            return ReviewType(
                id=new_review.id,
                content=new_review.content,
                rating=new_review.rating,
                book_id=new_review.book_id,
                user_id=new_review.user_id,
                username=user["username"] if user.get("username") else None,
            )
