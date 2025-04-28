from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from strawberry.fastapi import GraphQLRouter

# from app.graphql.resolvers import Query, Mutation
from app.database import engine, Base
import strawberry
from contextlib import asynccontextmanager
from fastapi import Request
from app.utils.auth import decode_access_token

from app.graphql.books_resolvers import BookQuery, BookMutation
from app.graphql.users_resolvers import UserMutation
from app.graphql.review_resolvers import ReviewQuery, ReviewMutation


@strawberry.type
class Query(BookQuery, ReviewQuery):
    pass


@strawberry.type
class Mutation(UserMutation, BookMutation, ReviewMutation):
    pass


async def get_context(request: Request):
    auth_header = request.headers.get("Authorization")
    user = None

    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split("Bearer ")[1]
        payload = decode_access_token(token)
        if payload:
            user = {"user_id": payload.get("sub")}

    return {"request": request, "user": user}


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema, context_getter=get_context)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables in the database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graphql_app, prefix="/graphql")
