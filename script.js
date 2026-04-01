document.addEventListener("DOMContentLoaded", () => {
    // === キャラクター画像のファイル名設定 ===
    // 用意した画像のファイル名に書き換えてください（例："smile.png"、"hint.jpg"など）
    const IMG_EXPLANATION = "happy.png";    // 普通の解説の顔
    const IMG_HINT = "question.png";       // 30秒経過ヒントの顔
    const IMG_MISTAKE = "sad.png";    // Yesを押してしまった顔

    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");
    const buttonContainer = document.getElementById("button-container");
    const messageContainer = document.getElementById("message-container");
    const question = document.getElementById("question");
    const titleNo = document.getElementById("title-no");
    const explanationContainer = document.getElementById("explanation-container");
    const explanationText = document.getElementById("explanation-text");
    const btnRestart = document.getElementById("btn-restart");

    // 画像タグの取得
    const characterImg = document.getElementById("character-img");
    const characterImgMistake = document.getElementById("character-img-mistake");

    // 初期画像の適用
    if (characterImg) characterImg.src = IMG_EXPLANATION;
    if (characterImgMistake) characterImgMistake.src = IMG_MISTAKE;

    let noCount = 0;
    let isEscaping = false;

    const questions = [
        "第1問：キリンの首の骨の数は、スズメよりも多い？",
        "第2問：ラクダのコブの中に入っているのは「水」である？",
        "第3問：オリンピックの金メダルは「純金」で作られている？",
        "第4問：闘牛の牛は、「赤い色」を見ると興奮して突進してくる？",
        "第5問：ウサギは「寂しい」と本当に死んでしまう？",
        "第6問：人間は脳の「10％」しか使っていない？",
        "第7問：タコには心臓が「5つ」ある？",
        "第8問：エッフェル塔は、夏になると熱で縮んで低くなる？",
        "第9問：日本の最南端の島は「南鳥島」である？",
        "最終問題：これまでの出題で、少しでも『Yes』と思ったものはある？"
    ];

    const explanations = [
        "", // 最初は解説なし
        "解説：キリンの首の骨も、スズメも、人間もみんな同じ7個なんだよ。",
        "解説：ラクダのコブの中身は脂肪。水分の少ない砂漠でのエネルギー源なんだ。",
        "解説：実は純金じゃなく、銀メダルに金メッキをしたものなんだよ。",
        "解説：牛は色を識別できないんだ。ヒラヒラ動く布そのものに反応してるだけだよ。",
        "解説：ウサギは寂しさで死ぬことはないよ。ただストレスには弱いかも。",
        "解説：人間は常に脳のほぼ100％の領域を使用していることが現代科学でわかっているよ。",
        "解説：タコの心臓は3つ（メイン1つ＋エラ心臓2つ）もあるんだ！",
        "解説：エッフェル塔は金属製だから、夏場は熱で膨張して約15cmほど高くなるよ。",
        "解説：最南端は「沖ノ鳥島」！南鳥島は「最東端」だよ。"
    ];

    // Title No Secret Click Logic
    titleNo.addEventListener("click", () => {
        if (noCount >= 9) {
            window.location.href = "bonus.html";
        }
    });

    // Base Yes button size variables
    let currentFontSize = 1.2; // rem
    let currentPaddingY = 15; // px
    let currentPaddingX = 45; // px

    // Generate random coordinates within the window
    const getRandomPosition = (element) => {
        const x = Math.random() * (window.innerWidth - element.offsetWidth);
        const y = Math.random() * (window.innerHeight - element.offsetHeight);
        return { x, y };
    };

    // Make the No button run away
    const moveEvadingButton = () => {
        if (!isEscaping) return;
        const { x, y } = getRandomPosition(btnNo);
        // Set smooth transition for evading movement
        btnNo.style.transition = "all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)";
        btnNo.style.left = `${x}px`;
        btnNo.style.top = `${y}px`;
    };

    const handleNoClick = () => {
        if (isEscaping) {
            // 動き回るNoはクリアに繋がらず何も起きない（または煽るだけ）
            return;
        }

        noCount++;

        if (noCount < questions.length) {
            question.textContent = questions[noCount];
            explanationContainer.classList.remove("hidden");
            explanationText.textContent = explanations[noCount];
            if (characterImg) characterImg.src = IMG_EXPLANATION;
        }

        // "No" selected 9 times
        if (noCount >= 9) {
            isEscaping = true;
            titleNo.classList.add("active"); // Activate secret No

            // 30 Seconds hint trigger
            setTimeout(() => {
                if (isEscaping) { // The user hasn't cleared it yet
                    if (characterImg) characterImg.src = IMG_HINT;
                    explanationText.innerHTML = "あのー、この動き回るNoって<br><b>本当にクリックできるのかなぁ？</b><br>上の方にも「No」ってある気がする……（チラッ）";
                }
            }, 30000);

            // Get current absolute position to avoid jumping directly to top-left
            const rect = btnNo.getBoundingClientRect();
            btnNo.style.position = "absolute";
            btnNo.style.left = `${rect.left}px`;
            btnNo.style.top = `${rect.top}px`;
            btnNo.style.zIndex = "100";

            // Move out of container so it can fly anywhere on screen
            document.body.appendChild(btnNo);

            // スマホ対応：マウスホバーではなく自動で高速移動し続ける
            setInterval(moveEvadingButton, 350); // 0.35秒ごとにワープ

            // Trigger first run away action slightly after appending to DOM
            setTimeout(moveEvadingButton, 50);
            return;
        }

        // Less than 9 times -> Increase "Yes" button size
        currentFontSize += 0.5;
        currentPaddingY += 4;
        currentPaddingX += 12;

        btnYes.style.fontSize = `${currentFontSize}rem`;
        btnYes.style.padding = `${currentPaddingY}px ${currentPaddingX}px`;
    };

    const handleYesClick = () => {
        // Yes Pressed -> Show message & hide buttons
        buttonContainer.classList.add("hidden");
        question.classList.add("hidden");
        explanationContainer.classList.add("hidden");
        messageContainer.classList.remove("hidden");

        // Remove runaway button if it exists
        if (isEscaping && btnNo.parentNode === document.body) {
            btnNo.remove();
        }
    };

    btnNo.addEventListener("click", handleNoClick);
    btnYes.addEventListener("click", handleYesClick);

    // Restart feature
    if (btnRestart) {
        btnRestart.addEventListener("click", () => {
            window.location.reload();
        });
    }
});
