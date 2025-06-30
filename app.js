import express from "express";
import path from "path";
import { readFile, writeFile } from "fs/promises";

export const app = express();

const __dirname = import.meta.dirname;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// /api/flashcards に GETリクエストが来たら "flashcards.json" の内容を返す
app.get("/api/flashcards", async (req, res) => {
	// 1. flashcards.json ファイルへの道筋（パス）を正しく作る
	const flashcardsJsonPath = path.join(__dirname, "data", "flashcards.json");

	// 2. その道筋を使って、ファイルの中身を読み込む
	const data = await readFile(flashcardsJsonPath, "utf-8");

	// 3. 読み込んだデータをプログラムで扱える形に変換し、相手に送り返す
	const flashcardsList = JSON.parse(data);
	res.json(flashcardsList);
});

// /api/flashcards に POSTリクエストが来たら "flashcards.json" に追加し、追加したデータを返す
app.post("/api/flashcards", async (req, res) => {
	// 1. 既存のデータを読み込む
  const flashcardsJsonPath = path.join(__dirname, "data", "flashcards.json");
  const data = await readFile(flashcardsJsonPath, "utf-8");
  const flashcardsList = JSON.parse(data);

  // 2. 新しいデータを受け取る
  const newWord = req.body;

  // 3. データを追加する
  flashcardsList.push(newWord);

  // 4. ファイルに書き込み、返事をする
  await writeFile(
    flashcardsJsonPath,
    JSON.stringify(flashcardsList, null, 2), // データを綺麗な形の文字列に戻す
    "utf-8",
  );

  // 「作成に成功した(201)」という返事と、追加したデータを返す
  res.status(201).json(newWord);
});