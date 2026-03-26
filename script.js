const proposalGate = document.getElementById("proposalGate");
const mainContent = document.getElementById("mainContent");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const proposalText = document.getElementById("proposalText");
const proposalPlea = document.getElementById("proposalPlea");
const lineButton = document.getElementById("lineButton");
const confettiButton = document.getElementById("confettiButton");
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
  "Firdos, you have this quiet kind of beauty that keeps staying on my mind.",
  "If I had to describe you simply: lovely face, lovely energy, lovely heart.",
  "From your batak: you are unfairly adorable and I hope you know that.",
  "Some people take good photos. You somehow make every frame feel softer.",
  "This page is my proof that you inspire effort without even trying.",
  "You look like the kind of memory people never really move on from.",
  "If admiration had a homepage, it would probably look something like this."
];

const compliments = [
  "You make elegance look effortless.",
  "You are exactly the kind of girl a batak would fall hopelessly for.",
  "Your smile has main-character energy.",
  "You somehow look soft and stunning at the same time.",
  "Being this lovely should probably require permission.",
  "You have the kind of face people remember for a long time.",
  "Everything about you feels easy to admire."
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function floatPieces(total) {
  for (let i = 0; i < total; i += 1) {
    const piece = document.createElement("span");
    piece.className = "floating";
    piece.textContent = i % 3 === 0 ? "♥" : i % 3 === 1 ? "✦" : "❀";
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

confettiButton.addEventListener("click", () => {
  floatPieces(14);
});

if (complimentButton && complimentBox) {
  complimentButton.addEventListener("click", () => {
    complimentBox.textContent = randomItem(compliments);
    floatPieces(5);
  });
}

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
