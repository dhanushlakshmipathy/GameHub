const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: __dirname + "/../.env" });

const User = require("../models/Users");
const Game = require("../models/Game");
const Review = require("../models/Review");

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

if(!MONGO_URI){
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

const usersData = Array.from({length:20}).map((_,i)=> ({
  username: "player" + (i+1),
  email: `player${i+1}@gamehub.dev`,
  password: "password123"
}));

const gamesData = [
  { title:"Elden Ring", genre:"Action RPG", platform:"PC/PS/Xbox", releaseDate:"2022-02-25" },
  { title:"Baldur's Gate 3", genre:"CRPG", platform:"PC/PS", releaseDate:"2023-08-03" },
  { title:"Hades", genre:"Roguelike", platform:"PC/Switch", releaseDate:"2020-09-17" },
  { title:"Stardew Valley", genre:"Simulation", platform:"PC/All", releaseDate:"2016-02-26" },
  { title:"The Witcher 3", genre:"RPG", platform:"PC/PS/Xbox", releaseDate:"2015-05-19" },
  { title:"Celeste", genre:"Platformer", platform:"PC/All", releaseDate:"2018-01-25" },
  { title:"God of War (2018)", genre:"Action", platform:"PS/PC", releaseDate:"2018-04-20" },
  { title:"Hollow Knight", genre:"Metroidvania", platform:"PC/All", releaseDate:"2017-02-24" },
  { title:"Disco Elysium", genre:"RPG", platform:"PC/PS", releaseDate:"2019-10-15" },
  { title:"Rocket League", genre:"Sports", platform:"PC/All", releaseDate:"2015-07-07" },
  { title:"Apex Legends", genre:"Battle Royale", platform:"PC/All", releaseDate:"2019-02-04" },
  { title:"Overwatch 2", genre:"Hero Shooter", platform:"PC/All", releaseDate:"2022-10-04" },
  { title:"Minecraft", genre:"Sandbox", platform:"PC/All", releaseDate:"2011-11-18" },
  { title:"Red Dead Redemption 2", genre:"Action-Adventure", platform:"PC/PS/Xbox", releaseDate:"2018-10-26" },
  { title:"Forza Horizon 5", genre:"Racing", platform:"PC/Xbox", releaseDate:"2021-11-09" },
  { title:"Legends of Runeterra", genre:"Card", platform:"PC/Mobile", releaseDate:"2020-04-29" },
  { title:"Cyberpunk 2077", genre:"RPG", platform:"PC/PS/Xbox", releaseDate:"2020-12-10" },
  { title:"Animal Crossing: New Horizons", genre:"Life Sim", platform:"Switch", releaseDate:"2020-03-20" },
  { title:"Marvel's Spider-Man", genre:"Action", platform:"PS/PC", releaseDate:"2018-09-07" },
  { title:"FTL: Faster Than Light", genre:"Roguelike", platform:"PC", releaseDate:"2012-09-14" }
];

async function run(){
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  await User.deleteMany({});
  await Game.deleteMany({});
  await Review.deleteMany({});

  // Users
  const users = [];
  for(const u of usersData){
    const hashed = await bcrypt.hash(u.password, 10);
    users.push(await User.create({ ...u, password: hashed }));
  }
  console.log(`👤 Inserted ${users.length} users`);

  // Following: player1 follows 2..6, player2 follows 1..3
  const u1 = users[0], u2 = users[1];
  const followIds1 = users.slice(1,6).map(u=>u._id);
  const followIds2 = users.slice(0,3).map(u=>u._id);
  u1.following = followIds1; followIds1.forEach(id => { const f = users.find(x=>x._id.equals(id)); if(f){ f.followers.push(u1._id) }});
  u2.following = followIds2; followIds2.forEach(id => { const f = users.find(x=>x._id.equals(id)); if(f){ f.followers.push(u2._id) }});
  await Promise.all(users.map(u => u.save()));
  console.log("🔗 Seeded some following relationships");

  // Games
  const games = await Game.insertMany(gamesData);
  console.log(`🎮 Inserted ${games.length} games`);

  // Reviews: create ~80 reviews randomly distributed
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)] }
  const comments = [
    "Incredible experience!", "Solid gameplay.", "Loved the art style.",
    "Story is top-tier.", "Great soundtrack.", "Bit buggy but fun.",
    "Good, not great.", "Masterpiece!", "Addictive loop.", "Highly recommend."
  ];

  const reviewsToInsert = [];
  for(let i=0;i<80;i++){
    const user = rand(users);
    const game = rand(games);
    const rating = 1 + Math.floor(Math.random()*5);
    const comment = Math.random() < 0.7 ? rand(comments) : "";
    reviewsToInsert.push({ user: user._id, game: game._id, rating, comment });
  }
  await Review.insertMany(reviewsToInsert);
  console.log(`✍️ Inserted ${reviewsToInsert.length} reviews`);

  console.log("✅ Seeding complete.");
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
