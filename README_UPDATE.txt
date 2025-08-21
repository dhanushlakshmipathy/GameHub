GameHub Completion & Seed — 2025-08-21

Added features:
- JWT auth middleware fixed.
- Users now support following/followers; follow & unfollow endpoints.
- Friends Feed endpoint (/api/reviews/feed) + UI page (/feed) + Follow button in reviews.
- Trending alias (/api/games/trending) plus existing aggregations.
- Frontend wired for trending, feed, and social actions.

Seed data:
- 20 users (player1..player20) with password 'password123'.
- 20 games (popular titles).
- ~80 randomized reviews across those users & games.
- Some initial following relationships so /feed shows content immediately.

How to seed:
1) cd backend
2) Copy .env.example to .env and set MONGO_URI and JWT_SECRET.
3) npm install
4) npm run seed

Run app:
- Backend: npm run dev (PORT defaults to 5000)
- Frontend: cd ../frontend && npm install && npm start

Login examples:
- Email: player1@gamehub.dev  /  Password: password123
- Email: player2@gamehub.dev  /  Password: password123
