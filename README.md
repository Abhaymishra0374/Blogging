# Blogify — Full-Stack Blogging Platform

A full-stack blog application:

- **Frontend:** React 19 + Vite, styled with Bootstrap 5
- **Backend:** Node.js + Express 5
- **Database:** MySQL (via `mysql2`)
- **Auth:** JWT (httpOnly cookie + Bearer token fallback), bcrypt password hashing
- **Uploads:** Multer for blog cover images

---

## What was fixed

The original project was an incomplete/broken scaffold. Notable bugs fixed:

- `server.js` referenced `app` before it was created, called `cors()` twice, and never mounted the blog routes — the server couldn't even start.
- `models/blogModel.js`, `controllers/blogController.js`, `routes/blogRoutes.js`, and `middleware/authMiddleware.js` were **empty files** — there was no blog CRUD API at all.
- `ProtectedRoute` checked `localStorage.getItem("token")`, but login only ever stored `user` in localStorage — every protected route redirected to `/login` even after a successful login.
- `pages/CreateBlog.jsx` had a stray `<textarea>` outside of the component/JSX tree — a syntax error that would crash the build.
- `pages/EditBlog.jsx`, `BlogDetails.jsx`, `Blogs.jsx`, `Profile.jsx` were placeholder stubs with no real logic.
- Image imports used the wrong filename casing (`hero.png`/`register.png` vs. the actual `Hero.png`/`Register.png`) — this works on case-insensitive filesystems (Windows/macOS) but breaks on Linux and most production builds.
- `Dashboard.jsx` crashed if a signed-out user ever reached it (`user.fullName` on `null`).
- `.env` had Windows line endings mixed into the file.

On top of the fixes, the app was completed end-to-end: full blog CRUD (create/edit/delete with image upload), search + category filtering, a real dashboard with stats, a working profile editor, and the homepage sections now pull real data from the API instead of hardcoded arrays.

---

## 1. Database setup

1. Make sure MySQL is installed and running.
2. Create the database and tables:

   ```bash
   mysql -u root -p < Backend/schema.sql
   ```

   This creates a `blogify` database with `users` and `blogs` tables.

---

## 2. Backend setup

```bash
cd Backend
npm install
```

Edit `Backend/.env` with your own MySQL credentials and JWT secret:

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blogify

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173
```

Run it:

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start
```

You should see:

```
✅ Server running on http://localhost:5000
✅ MySQL Connected Successfully
```

### API overview

| Method | Route                | Auth | Description                    |
|--------|-----------------------|------|--------------------------------|
| POST   | `/api/auth/register`  | –    | Create an account              |
| POST   | `/api/auth/login`     | –    | Log in, returns user + token   |
| POST   | `/api/auth/logout`    | –    | Clear the auth cookie          |
| GET    | `/api/auth/me`        | ✅   | Get the current user           |
| PUT    | `/api/auth/profile`   | ✅   | Update name/bio                |
| GET    | `/api/blogs`          | –    | List blogs (`?category=&search=`) |
| GET    | `/api/blogs/mine`     | ✅   | List the current user's blogs + stats |
| GET    | `/api/blogs/:id`      | –    | Get a single blog              |
| POST   | `/api/blogs`          | ✅   | Create a blog (multipart, field `image`) |
| PUT    | `/api/blogs/:id`      | ✅   | Update a blog (owner only)     |
| DELETE | `/api/blogs/:id`      | ✅   | Delete a blog (owner only)     |

---

## 3. Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The frontend is pre-configured to call the API at `http://localhost:5000/api` (see `src/api/axios.js` and `src/constants/config.js`).

> **Note:** this project's `package.json` pins very recent `vite`/`react-router-dom` versions. If `npm install` in your environment resolves platform-native optional dependencies incorrectly (a known npm bug — see https://github.com/npm/cli/issues/4828), delete `node_modules` and `package-lock.json` and reinstall.

---

## 4. Building for production

```bash
cd Frontend
npm run build       # outputs to Frontend/dist
```

Serve `Frontend/dist` with any static host, and deploy `Backend/` as a Node service (set `CLIENT_URL` to your deployed frontend origin and `NODE_ENV=production` so cookies are marked `secure`).

---

## Project structure

```
Blogging/
├── Backend/
│   ├── config/db.js            # MySQL connection pool
│   ├── controllers/            # authController, blogController
│   ├── middleware/              # authMiddleware (JWT), uploadMiddleware (multer)
│   ├── models/                  # userModel, blogModel
│   ├── routes/                  # authRoutes, blogRoutes
│   ├── uploads/                 # uploaded blog images (served at /uploads)
│   ├── schema.sql               # run once to create the database
│   ├── .env
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── api/axios.js         # axios instance (cookie + bearer token)
    │   ├── context/AuthContext.jsx
    │   ├── constants/           # categories, image URL helper
    │   ├── components/          # Navbar, BlogCard, BlogForm, ProtectedRoute, ...
    │   ├── pages/                # Home, Blogs, BlogDetails, CreateBlog, EditBlog,
    │   │                         #   Dashboard, Profile, Login, Register
    │   └── routes/AppRoutes.jsx
    └── vite.config.js
```
