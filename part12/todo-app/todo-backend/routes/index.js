const express = require("express");
const router = express.Router();
const redis = require("../redis");
const configs = require("../util/config");

let visits = 0;

/* GET index data. */
router.get("/", async (req, res) => {
  visits++;

  res.send({
    // ...configs,
    visits,
  });
});

router.post("/", async (req, res) => {
  const currentCount = await redis.get("added_todos"); //キーと値の作成
  const count = currentCount ? Number(currentCount) : 0;

  await redis.set("added_todos", count + 1);
  res.status(201).json({ message: "Todo added" });
});

router.get("/statistics", async (req, res) => {
  const currentCount = await redis.get("added_todos");
  const count = currentCount ? Number(currentCount) : 0;

  res.json({
    added_todos: count,
  });
});

module.exports = router;
