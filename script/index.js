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
     <button id="lesson-btn-${lesson.level_no}" onclick="levelWords(${lesson.level_no})" class="btn  btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `;
    levelContainer.append(lessonDiv);
  }
};

const levelWords = (level) => {
  spinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${level}`;
  fetch(url)
    .then((r) => r.json())
    .then((obj) => {
      const clickedBtn = document.getElementById(`lesson-btn-${level}`);
      removeActive();
      clickedBtn.classList.add("active");
      loadWordCard(obj.data);
    });
};

const removeActive = () => {
  const inactiveBtn = document.querySelectorAll(".lesson-btn");
  inactiveBtn.forEach((btn) => btn.classList.remove("active"));
};

const loadWordCard = (words) => {
  const wordContainer = document.getElementById(`word-container`);
  wordContainer.innerHTML = ``;

  if (words.length == 0) {
    wordContainer.innerHTML = `        <div class="text-center space-y-2 w-full md:col-span-2 lg:col-span-3">
            <img class="w-30 mx-auto" src="assets/alert-error.png" alt="Error">
            <p class="hind text-lg">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-3xl font-semibold hind">নেক্সট Lesson এ যান</h2>
        </div>`;
    spinner(false);
    return;
  }

  for (let word of words) {
    const wordCard = document.createElement(`div`);

    if (words.length == 1) {
      wordCard.classList.add(
        "col-span-1",
        "md:col-span-2",
        "lg:col-span-3",
        "mx-auto",
      );
    }

    wordCard.innerHTML = `
            <div class="bg-white p-10 text-center space-y-4 rounded-xl h-full">
            <h1 class="text-3xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি!"}</h1>
            <p class="text-xl">Meaning/Pronounciation</p>
            <p class="hind text-3xl">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি!"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি!"}"</p>
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
  spinner(false);
};

const loadModal = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((r) => r.json())
    .then((word) => wordModal(word.data));
  modal.showModal();
};

const wordModal = (word) => {
  const modal = document.getElementById(`modal`);
  modal.innerHTML = ``;
  const synonyms = word.synonyms;
  let synonymsHtml = ``;
  if (synonyms.length == 0) {
    synonymsHtml = `<p class="bg-[#D7E4EF]/60 py-1 px-2 rounded-lg border-2 border-[#D7E4EF]/80">সমার্থক শব্দ পাওয়া যায়নি!</p>`;
  } else
    for (const synonym of synonyms) {
      synonymsHtml += `<p class="bg-[#D7E4EF]/60 py-1 px-2 rounded-lg border-2 border-[#D7E4EF]/80">${synonym ? synonym : "সমার্থক শব্দ পাওয়া যায়নি!"}</p>`;
    }
  modal.innerHTML = `
          <div class="modal-box">
            <div class="border-3 border-primary/20 p-5 rounded-lg">
                <h3 class="text-4xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি!"} <span class="hind">(<i
                            class="fa-solid fa-microphone-lines"></i>:${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি!"})</span></h3>
                <br>
                <h3 class="text-2xl font-semibold">Meaning</h3>
                <p class="hind text-2xl">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি!"}</p>
                <br>
                <h3 class="text-2xl font-semibold">Example</h3>
                <p class="text-xl">${word.sentence ? word.sentence : "উদাহরণ পাওয়া যায়নি!"}</p>
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

const spinner = (status) => {
  if (status) {
    document.getElementById(`spinner`).classList.remove(`hidden`);
    document.getElementById(`word-container`).classList.add(`hidden`);
  } else {
    document.getElementById(`spinner`).classList.add(`hidden`);
    document.getElementById(`word-container`).classList.remove(`hidden`);
  }
};

loadLessons();

document.getElementById(`search-btn`).addEventListener(`click`, () => {
  removeActive();
  const input = document.getElementById(`search-input`);
  const searchValue = input.value.trim().toLowerCase();

  fetch(`https://openapi.programming-hero.com/api/words/all`)
    .then((r) => r.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().startsWith(searchValue),
      );
      if (filterWords.length == 0) {
        document.getElementById(`word-container`).innerHTML =
          `<div class="hind text-center w-full md:col-span-2 lg:col-span-3">
        <p class="text-3xl">কোনো শব্দ পাওয়া যায়নি!</p>
    </div>`;
        return;
      }
      loadWordCard(filterWords);
    });
});
