const proposalGate = document.getElementById("proposalGate");
const mainContent = document.getElementById("mainContent");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const proposalText = document.getElementById("proposalText");
const proposalPlea = document.getElementById("proposalPlea");
const lineButton = document.getElementById("lineButton");
const musicButton = document.getElementById("musicButton");
const lineBox = document.getElementById("lineBox");
const complimentButton = document.getElementById("complimentButton");
const complimentBox = document.getElementById("complimentBox");
const memoryLane = document.getElementById("memoryLane");
const memoryLaneFill = document.getElementById("memoryLaneFill");
const secretNote = document.getElementById("secretNote");
const isCompactScreen = window.matchMedia("(max-width: 680px)");

const proposalReplies = [
  "No is a very serious button, are you sure you want to use it on your own batak?",
  "I respect your click, but your batak is still going to ask very sweetly for a yes.",
  "Maybe the button missed. Batak recommends trying yes this time.",
  "Counter-offer: you click yes, and I show you the surprise page your batak made for you.",
  "That no looks shy. Let your batak help it turn into a yes."
];

const proposalPleas = [
  "Please? Your batak made this with a full heart.",
  "Just one tiny yes and the surprise from batak opens.",
  "Your batak is asking very politely here.",
  "A yes would look really cute on you.",
  "Come on, pretty please for your batak."
];

const lines = [
  "From your batak: you are unfairly adorable and I hope you know that.",
  "Some people take good photos. You somehow make every frame feel softer.",
  "If admiration had a homepage, it would probably look something like this.",
  "You have this quiet kind of beauty that keeps staying on my mind.",
  "You look like the kind of memory people never really move on from.",
  "If I had to describe you simply: lovely face, lovely energy, lovely heart."
];

const compliments = [
  "You make elegance look effortless.",
  "You are exactly the kind of girl a batak would fall hopelessly for.",
  "Your smile has main-character energy.",
  "You somehow look soft and stunning at the same time.",
  "Everything about you feels easy to admire.",
  "You have the kind of face people remember for a long time."
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function floatPieces(total) {
  for (let i = 0; i < total; i += 1) {
    const piece = document.createElement("span");
    piece.className = "floating";
    piece.textContent = i % 3 === 0 ? "\u2665" : i % 3 === 1 ? "\u273f" : "\u2726";
    piece.style.left = `${10 + Math.random() * 80}%`;
    piece.style.top = `${70 + Math.random() * 12}%`;
    piece.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2800);
  }
}

let noClickCount = 0;

yesButton.addEventListener("click", () => {
  proposalGate.style.display = "none";
  mainContent.classList.remove("shell-hidden");
  memoryLane.classList.add("is-visible");
  floatPieces(18);
  updateMemoryLane();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

noButton.addEventListener("click", () => {
  proposalText.textContent = proposalReplies[noClickCount % proposalReplies.length];
  proposalPlea.textContent = proposalPleas[noClickCount % proposalPleas.length];
  proposalPlea.classList.add("is-visible");
  noClickCount += 1;

  const yesScale = Math.min(1 + noClickCount * 0.08, 1.45);
  yesButton.style.transform = `scale(${yesScale})`;
  yesButton.style.boxShadow = "0 20px 36px rgba(185, 85, 104, 0.32)";

  const moveRangeX = isCompactScreen.matches ? 18 : 60;
  const moveRangeY = isCompactScreen.matches ? 8 : 12;
  const moveX = Math.random() * (moveRangeX * 2) - moveRangeX;
  const moveY = Math.random() * (moveRangeY * 2) - moveRangeY;
  noButton.style.transform = `translate(${moveX}px, ${moveY}px)`;
  noButton.textContent = noClickCount > 1 ? "No, really?" : "No, wait";

  floatPieces(6);
});

lineButton.addEventListener("click", () => {
  lineBox.textContent = randomItem(lines);
  floatPieces(8);
});

if (complimentButton && complimentBox) {
  complimentButton.addEventListener("click", () => {
    complimentBox.textContent = randomItem(compliments);
    floatPieces(5);
  });
}

let audioContext;
let audioPlaying = false;
let currentTimeouts = [];
let activeOscillators = [];

function stopMelody() {
  currentTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  currentTimeouts = [];
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch (error) {
      // Ignore already-stopped oscillators.
    }
  });
  activeOscillators = [];
}

function playTone(frequency, startAt, duration, gainValue) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
  activeOscillators.push(oscillator);
}

function scheduleMelody() {
  const notes = [
    [392, 0, 0.42],
    [440, 0.44, 0.42],
    [523.25, 0.88, 0.52],
    [440, 1.45, 0.38],
    [392, 1.86, 0.5],
    [349.23, 2.4, 0.48],
    [392, 2.92, 0.7]
  ];

  const loopLength = 4.2;
  let cycle = 0;

  while (cycle < 8 && audioPlaying) {
    notes.forEach(([frequency, offset, duration]) => {
      playTone(frequency, audioContext.currentTime + cycle * loopLength + offset, duration, 0.028);
    });
    cycle += 1;
  }

  const timeoutId = setTimeout(() => {
    if (audioPlaying) {
      scheduleMelody();
    }
  }, loopLength * 1000 * 4);
  currentTimeouts.push(timeoutId);
}

musicButton.addEventListener("click", async () => {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!audioPlaying) {
    audioPlaying = true;
    musicButton.textContent = "Pause our vibe";
    scheduleMelody();
    floatPieces(6);
  } else {
    audioPlaying = false;
    musicButton.textContent = "Play our vibe";
    stopMelody();
  }
});

function updateMemoryLane() {
  if (mainContent.classList.contains("shell-hidden")) {
    return;
  }

  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

  memoryLaneFill.style.width = `${progress * 100}%`;

  if (progress > 0.84) {
    secretNote.classList.add("is-revealed");
  }
}

window.addEventListener("scroll", updateMemoryLane, { passive: true });
window.addEventListener("resize", updateMemoryLane);
