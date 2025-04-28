import strawberry
from sqlalchemy import select
from fastapi import HTTPException
from app.models import User
from app.schemas import RegisterInput, LoginInput, AuthPayload
from app.database import get_session
from app.utils.auth import hash_password, verify_password, create_access_token


@strawberry.type
class UserMutation:
    @strawberry.mutation
    async def register(self, info, input: RegisterInput) -> bool:
        async with get_session() as session:
            user = User(
                username=input.username,
                hashed_password=hash_password(input.password),
            )
            session.add(user)
            await session.commit()
            return True

    @strawberry.mutation
    async def login(self, info, input: LoginInput) -> AuthPayload:
        async with get_session() as session:
            result = await session.execute(
                select(User).where(User.username == input.username)
            )
            user = result.scalar_one_or_none()

            if not user or not verify_password(input.password, user.hashed_password):
                raise HTTPException(status_code=401, detail="Invalid credentials")

            token = create_access_token({"sub": str(user.id)})
            return AuthPayload(access_token=token)
