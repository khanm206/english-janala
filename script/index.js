const loadLessons = () => {
  fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then((r) => r.json())
    .then((obj) => displayLesson(obj.data));
};

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById(`level-container`);
  levelContainer.innerHTML = ``;

  for (let lesson of lessons) {
    const lessonDiv = document.createElement(`div`);
    lessonDiv.innerHTML = `
     <button onclick="levelWords(${lesson.level_no})" class="btn  btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `;
    levelContainer.append(lessonDiv);
  }
};

const levelWords = (level) => {
  const url = `https://openapi.programming-hero.com/api/level/${level}`;
  fetch(url)
    .then((r) => r.json())
    .then((obj) => loadWordCard(obj.data));
};

const loadWordCard = (words) => {
  const wordContainer = document.getElementById(`word-container`);
  wordContainer.innerHTML = ``;
  wordContainer.classList.remove(
    "flex",
    "flex-col",
    "lg:grid",
    "lg:grid-cols-3",
    "lg:items-stretch",
    "gap-4",
  );
  wordContainer.classList.add(
    "flex",
    "flex-col",
    "lg:grid",
    "lg:grid-cols-3",
    "lg:items-stretch",
    "gap-4",
  );

  if (words.length == 0) {
    wordContainer.classList.remove(
      "flex",
      "flex-col",
      "lg:grid",
      "lg:grid-cols-3",
      "lg:items-stretch",
      "gap-4",
    );
    wordContainer.innerHTML = `        <div class="text-center space-y-2 w-full">
            <img class="w-30 mx-auto" src="assets/alert-error.png" alt="Error">
            <p class="hind text-lg">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-3xl font-semibold hind">নেক্সট Lesson এ যান</h2>
        </div>`;
  }

  for (let word of words) {
    const wordCard = document.createElement(`div`);

    wordCard.innerHTML = `
            <div class="bg-white p-10 text-center space-y-4 h-full rounded-xl">
            <h1 class="text-3xl font-bold">${word.word}</h1>
            <p class="text-xl">Meaning/Pronounciation</p>
            <p class="hind text-3xl">"${word.meaning} / ${word.pronunciation}"</p>
            <div class="flex justify-between mt-8">
                <button onclick="loadModal(${word.id})" class="btn btn-soft btn-primary p-2 rounded-lg">
                    <i class="fa-solid fa-circle-exclamation fa-lg"></i>
                </button>
                <button class="btn btn-soft btn-primary p-2 rounded-lg">
                    <i class="fa-solid fa-volume-high fa-lg"></i>
                </button>

            </div>
        </div>
    `;

    wordContainer.append(wordCard);
  }
};

const loadModal = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((r) => r.json())
    .then((word) => wordModal(word.data));
  my_modal_1.showModal();
};

const wordModal = (word) => {
  const modal = document.getElementById(`my_modal_1`);
  const synonyms = word.synonyms;
  let synonymsHtml = ``;
  for (const synonym of synonyms) {
    synonymsHtml += `<p class="bg-[#D7E4EF]/60 py-1 px-2 rounded-lg border-2 border-[#D7E4EF]/80">${synonym}</p>`;
  }
  modal.innerHTML = `
          <div class="modal-box">
            <div class="border-3 border-primary/20 p-5 rounded-lg">
                <h3 class="text-4xl font-bold">${word.word} <span class="hind">(<i
                            class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</span></h3>
                <br>
                <h3 class="text-2xl font-semibold">Meaning</h3>
                <p class="hind text-2xl">${word.meaning}</p>
                <br>
                <h3 class="text-2xl font-semibold">Example</h3>
                <p class="text-xl">${word.sentence}</p>
                <br>
                <h3 class="text-2xl font-semibold hind">সমার্থক শব্দ গুলো</h3>
                <div id="syn" class="text-xl flex flex-wrap gap-4 mt-2">
                 ${synonymsHtml}
                </div>
                <div class="modal-action justify-start">
                    <form method="dialog">
                        <button class="btn btn-primary text-base">Complete Learning</button>
                    </form>
                </div>
            </div>
        </div>
  `;
};

loadLessons();
