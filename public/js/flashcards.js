// get flashcards list
async function fetchFlashcards() {
	try {
		const response = await fetch("/api/flashcards");
		return response.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}

// 暗記カードを追加するデータをサーバーに送る関数を作成してください
async function createFlashcardData(wordData) {
	try {
		const url = "/api/flashcards";
		const response = await fetch(url, {
			method: "POST", // 「追加してください」というお願い
			headers: { "Content-Type": "application/json" }, // 「JSON形式のデータを送ります」という自己紹介
			body: JSON.stringify(wordData), // 送りたいデータ本体をJSON文字列に変換
		});
		return await response.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function setupFlashcards() {
	const flashcardsList = document.getElementById("flashcards-list");
	const addWordBtn = document.querySelector(".add-word");
	const wordModal = document.getElementById("word-modal");
	const wordForm = document.getElementById("word-form");
	const cancelBtn = document.querySelector(".cancel-word");

	// control modal
	function showModal() {
		wordModal.classList.remove("hidden"); // hiddenクラスを取り除いて表示
		document.getElementById("word-input").focus(); // 開いたらすぐ入力できるようにする
	}

	function hideModal() {
		wordModal.classList.add("hidden"); // hiddenクラスを付けて非表示
		wordForm.reset(); // 中の入力内容を空にする
	}

	async function save(event) {
		// まず、このおまじないで、フォーム送信時にページが再読み込みされるのを防ぐんじゃ。
		event.preventDefault();

		// フォームに入力された値を取得する
		const wordInput = document.getElementById("word-input").value;
		const meaningInput = document.getElementById("meaning-input").value;

		// サーバーに送るためのデータオブジェクトを作る
		const word = {
			id: Date.now(), // IDは仮に現在時刻で作っておく
			word: wordInput.trim(), // trim()で余分な空白を取り除く
			meaning: meaningInput.trim(),
		};

		// データをサーバーに送信し、画面を更新し、モーダルを閉じる
		await createFlashcardData(word);
		await readFlashcards();
		hideModal();
	}

	// Event listeners
	addWordBtn.addEventListener("click", showModal); // Addボタンクリックで表示
	cancelBtn.addEventListener("click", hideModal); // Cancelボタンクリックで非表示
	wordForm.addEventListener("submit", save);

	// Close modal when clicking outside
	wordModal.addEventListener("click", (event) => {
		// クリックされたのが、黒い背景部分（wordModal）だったら非表示にする
		if (event.target === wordModal) {
			hideModal();
		}
	});

	function toggleMeaning(id) {
		const meaningElement = document.querySelector(`[data-meaning="${id}"]`);

		if (meaningElement.classList.contains("hidden")) {
			meaningElement.classList.remove("hidden");
		} else {
			meaningElement.classList.add("hidden");
		}
	}

	async function readFlashcards() {
		const wordList = await fetchFlashcards();
		renderFlashcards(wordList);
	}

	async function renderFlashcards(wordList) {
		flashcardsList.innerHTML = "";
		wordList.forEach((word) => {
			const flashcard = `
      <div class="flashcard">
        <div class="flashcard-content">
          <p class="flashcard-title">${word.word}</p>
          <div class="flashcard-icons">
            <button data-toggle="${word.id}" class="flashcard-meaning">
              <span class="ri-eye-line"></span>
            </button>
          </div>
        </div>
        <div data-meaning="${word.id}" class="hidden">
          <p class="flashcard-toggle">${word.meaning}</p>
        </div>
      </div>
      `;
			flashcardsList.innerHTML += flashcard;
		});
	}

	flashcardsList.addEventListener("click", (event) => {
		const btn = event.target.closest(".flashcard-meaning");
		if (btn) {
			const id = btn.getAttribute("data-toggle");
			toggleMeaning(id);
		} else {
			return;
		}
	});

	await readFlashcards();
}
