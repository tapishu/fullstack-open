const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  const currentCount = await redis.get("added_todos");
  const count = currentCount ? Number(currentCount) : 0;
  await redis.set("added_todos", count + 1);

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.deleteOne();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  if (req.body.text !== undefined) {
    req.todo.text = req.body.text;
  }
  if (req.body.done !== undefined) {
    req.todo.done = req.body.done;
  }
  const updatedTodo = await req.todo.save();

  res.send(updatedTodo); // Implement this
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
