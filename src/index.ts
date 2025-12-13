import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get("/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/todos", async (_req, res) => {
  const todos = await prisma.todo.findMany({ orderBy: { id: "desc" } });
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  const todo = await prisma.todo.create({ data: { title } });
  res.status(201).json(todo);
});

app.patch("/todos/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);
  const cur = await prisma.todo.findUnique({ where: { id } });
  if (!cur) return res.status(404).json({ error: "not found" });

  const updated = await prisma.todo.update({
    where: { id },
    data: { done: !cur.done }
  });
  res.json(updated);
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
