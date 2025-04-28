
## FastAPI-GraphQL-React Project


This project is a **hands-on guide** designed to help you learn **how to implement GraphQL using FastAPI** and **consume the GraphQL API using ReactJS (Vite)**.  
It's structured simply to help you understand how the backend and frontend connect and interact via GraphQL.

---

### Project Structure

```
fastapi-graphql-react/
├── app/
│   ├── graphql/
│   │   ├── __init__.py
│   │   ├── books_resolvers.py
│   │   ├── resolvers.py
│   │   ├── review_resolvers.py
│   │   └── users_resolvers.py
│   ├── utils/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── database.py
│   ├── Dockerfile
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
├── react-graphql-app/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── graphql/
│   │       ├── apollo-client.js
│   │       ├── mutations.js
│   │       └── queries.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── .env
├── alembic.ini
├── docker-compose.yml
└── README.md
```

---

### Running the Project (Docker)

create a .env file in the project root directory and copy the contents of the .env-sample to the .env file.

Make sure you have Docker installed.

1. **Build and start the services:**

```bash
docker compose up --build
```

2. **Stop the services:**

```bash
docker compose down
```

---

### Access Points

- **GraphQL API Playground**: [http://localhost:8080/graphql](http://localhost:8080/graphql)
- **React Frontend App**: [http://localhost:3000/](http://localhost:3000/)

---

### GraphQL Mutations and Queries

Use these examples to test the full cycle graphql API for **Categories**, **Books**, **Users**, and **Reviews**.

---

### 1. Register and Login a User

#### Register Mutation

```graphql
mutation {
  register(input: { username: "alice", password: "strongpassword" })
}
```

####  Login Mutation

```graphql
mutation {
  login(input: { username: "alice", password: "strongpassword" }) {
    access_token
  }
}
```

> **Note**: Save the returned `access_token` and include it in the **Authorization header** for authenticated requests:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

---

### 2. Category

#### Create Category

```graphql
mutation {
  createCategory(category: { name: "Science Fiction" }) {
    id
    name
  }
}
```

#### Query All Books in a Category

```graphql
query {
  getBooksByCategory(categoryId: 1) {
    id
    title
    author
    published_year
  }
}
```

---

### 3. Book

####  Create Book

```graphql
mutation {
  createBook(book: {
    title: "Dune"
    author: "Frank Herbert"
    published_year: 1965
    category_id: 1
  }) {
    id
    title
    author
    published_year
    category {
      id
      name
    }
  }
}
```

---

### Get All Books

#### 1. Pagination Only
```graphql
query {
  getBooks(pagination: { skip: 0, limit: 5 }) {
    total
    books {
      id
      title
      author
      publishedYear
    }
  }
}
```

#### 2. Sorting Only (Title Ascending)
```graphql
query {
  getBooks(sort: { field: title, order: asc }) {
    total
    books {
      id
      title
      author
      publishedYear
    }
  }
}
```

#### 3. Sorting by Published Year (Descending)
```graphql
query {
  getBooks(sort: { field: published_year, order: desc }) {
    total
    books {
      id
      title
      author
      publishedYear
    }
  }
}
```

#### 4. Filtering by Author
```graphql
query {
  getBooks(filters: { author: "George Orwell" }) {
    total
    books {
      id
      title
      author
      publishedYear
    }
  }
}
```

#### 5. Filtering by Title and Category
```graphql
query {
  getBooks(filters: { title: "1984", categoryId: 1 }) {
    total
    books {
      id
      title
      author
      publishedYear
    }
  }
}
```

#### 6. Combined Pagination, Filtering, and Sorting
```graphql
query {
  getBooks(
    pagination: { skip: 0, limit: 10 },
    filters: { author: "Tolkien" },
    sort: { field: published_year, order: asc }
  ) {
    total
    books {
      id
      title
      author
      publishedYear
    }
  }
}
```

---

### Get Book by ID

```graphql
query {
  getBook(id: 1) {
    id
    title
    author
    published_year
    category {
      name
    }
  }
}
```

---

### 4. Review

> Requires an authenticated user and a valid `book_id`.

#### Write Review

```graphql
mutation {
  writeReview(review: {
    content: "An epic sci-fi masterpiece."
    rating: 5
    book_id: 1
  }) {
    id
    content
    rating
    book_id
    user_id
  }
}
```

#### Get Reviews for a Book

```graphql
query {
  getReviews(bookId: 1) {
    id
    content
    rating
    user_id
    book_id
  }
}
```

---

### REST vs GraphQL Feature Comparison
The following tabular comparison might help you understand how GraphQL performs well in some cases compared to RESTFUL API.

| Feature                     | REST                                  | GraphQL                                                      |
|------------------------------|--------------------------------------|--------------------------------------------------------------|
| Request specific fields      | ❌ Usually returns full object       | ✅ Ask for exactly what you need                             |
| Combine multiple resources   | ❌ Multiple endpoints                | ✅ Single query with nested types                            |
| Schema introspection         | ❌ Not built-in                      | ✅ Strongly typed and introspectable                         |
| Evolving API                 | ❌ Requires versioning               | ✅ Clients query new/old fields without breaking changes     |
| Over/Under fetching          | ❌ Common issue                      | ✅ Clients fetch precisely what is needed                    |


---

### When REST Might Be a Better Choice

While GraphQL is powerful as we saw in the above tabular comparisons, **REST APIs** are still a better fit in certain cases:

- **Simple CRUD Applications**:  
  If your application mainly performs basic Create, Read, Update, and Delete operations, a traditional REST API can be faster to build and easier to maintain.

- **Caching at HTTP Layer**:  
  REST APIs work naturally with HTTP caching (e.g., using status codes like 304 Not Modified and proxies), making them great for performance in simple web apps.

- **File Uploads and Large Binary Transfers**:  
  Handling file uploads (images, videos) is often easier and more standardized with REST than with GraphQL.

- **Limited Client Flexibility Required**:  
  If you control both the frontend and backend and don’t need flexible, dynamic queries, REST’s rigid structure might actually simplify your codebase.

- **Existing Tools and Ecosystem**:  
  REST has broader tooling support for monitoring, API gateways, analytics, and security in many enterprise systems.
