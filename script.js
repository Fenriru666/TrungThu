/* ========================================================
   MÙA TRĂNG YÊU THƯƠNG - JAVASCRIPT MASTER SCRIPT
   - Hiệu ứng con trỏ chuột lồng đèn (Lantern Cursor)
   - Vệt sao băng & hạt đom đóm (Golden Sparkle Trail)
   - Bầu trời sao & Thả đèn trời tương tác (Sky Lantern Canvas)
   - Mở thư tình lãng mạn & Bẻ bánh trung thu may mắn
   - Tùy chỉnh thông tin tên cô ấy & lời chúc (LocalStorage)
   ======================================================== */

// --- 1. CONFIG & STATE MANAGEMENT ---
const DEFAULT_HER_NAME = "Nguyễn Huỳnh Phương Hồng";
const DEFAULT_SENDER_NAME = "Lê Khánh Luân";
const DEFAULT_LETTER = `Trung Thu là mùa của trăng tròn vẹn nguyên, của đèn hoa rực rỡ và những điều ngọt ngào nhất. Người ta hay ngước lên trời ngắm ánh trăng sáng, còn với anh, chỉ cần nhìn thấy nụ cười của em là cả bầu trời đã bừng sáng rồi.\n\nChúc em một mùa Trung Thu thật ấm áp, luôn giữ nét trong trẻo, an yên và hồn nhiên như những đóa hoa cúc mùa thu. Mong rằng mỗi bước em đi đều có bình an đồng hành, và dẫu ngày mai có bận rộn thế nào, vẫn luôn có một người sẵn sàng làm lồng đèn thắp sáng đường cho em.`;

const FORTUNES = [
  "Chúc em mãi luôn rạng rỡ như trăng rằm, ăn mãi không béo và luôn yêu anh nhiều hơn mỗi ngày!",
  "Phần thưởng đặc biệt: Một buổi hẹn hò dưới phố lồng đèn và một cái ôm thật ấm áp từ anh!",
  "Điều ước đêm trăng: Mong nụ cười của em luôn nở trên môi, mọi lo toan nhường chỗ cho bình yên.",
  "Tấm vé may mắn: Được quyền nhõng nhẽo và bắt anh chiều chuộng vô điều kiện suốt mùa trăng này!",
  "Trăng rằm có hạn, nhưng tình cảm anh dành cho em thì vẹn nguyên mãi mãi."
];

// Cấu hình nhận thông báo tâm thư khi deploy lên Vercel / Online (Tùy chọn)
// Bạn có thể điền thông tin vào đây nếu muốn nhận thông báo thẳng về máy:
const NOTIFY_CONFIG = {
  emailTo: "",           // Điền email của bạn (ví dụ: "example@gmail.com") để nhận tâm thư qua Email
  telegramBotToken: "",  // Token bot Telegram (nếu dùng)
  telegramChatId: "",    // Chat ID Telegram (nếu dùng)
  discordWebhookUrl: ""  // URL Discord Webhook (nếu dùng)
};

// --- 2. LOCAL STORAGE / DỮ LIỆU TÙY CHỈNH ---
function loadSavedCustomization() {
  const herName = localStorage.getItem("trungthu_herName") || DEFAULT_HER_NAME;
  const senderName = localStorage.getItem("trungthu_senderName") || DEFAULT_SENDER_NAME;
  const letterText = localStorage.getItem("trungthu_letter") || DEFAULT_LETTER;

  const herNameEl = document.getElementById("herNameDisplay");
  const senderNameEl = document.getElementById("senderNameDisplay");
  const letterBodyEl = document.getElementById("letterBody");

  if (herNameEl) herNameEl.textContent = herName;
  if (senderNameEl) senderNameEl.textContent = senderName;

  if (letterBodyEl) {
    const paragraphs = letterText.split("\n\n").filter(p => p.trim() !== "");
    let html = "";
    paragraphs.forEach(p => {
      html += `<p>${p.replace(/\n/g, "<br>")}</p>`;
    });
    // Giữ lại bài thơ kết thư
    html += `
     
    `;
    letterBodyEl.innerHTML = html;
  }
}

// --- 3. PARTICLE TRAIL & CLICK EXPLOSION ---
const trailCanvas = document.getElementById("trailCanvas");
const trailCtx = trailCanvas.getContext("2d");
const skyCanvas = document.getElementById("skyCanvas");
const skyCtx = skyCanvas.getContext("2d");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let particles = [];

function resizeCanvases() {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
  skyCanvas.width = window.innerWidth;
  skyCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvases);

// Theo dõi vị trí chuột và tạo vệt hạt sáng lấp lánh nhẹ
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (Math.random() < 0.4) {
    particles.push(new TrailParticle(mouseX, mouseY));
  }
});

// Class hiệu ứng hạt vệt sáng vàng ấm
class TrailParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 8;
    this.y = y + (Math.random() - 0.5) * 8;
    this.size = Math.random() * 3.5 + 1.5;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = Math.random() * 1.2 + 0.5;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    // Màu vàng ánh kim hoặc cam ấm áp
    this.color = Math.random() > 0.4 ? "#f6b93b" : "#ff7675";
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
    if (this.size > 0.2) this.size -= 0.03;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Vòng lặp cập nhật vệt sáng
function updateCursorAndTrail() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(trailCtx);
    if (particles[i].alpha <= 0 || particles[i].size <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(updateCursorAndTrail);
}

// Hiệu ứng pháo hoa tia sáng khi nhấp chuột
window.addEventListener("click", (e) => {
  // Không nổ khi bấm vào modal input
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  createClickExplosion(e.clientX, e.clientY);
  playChimeSound(600, "sine");
});

function createClickExplosion(x, y) {
  const burstCount = 20;
  for (let i = 0; i < burstCount; i++) {
    const p = new TrailParticle(x, y);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    p.speedX = Math.cos(angle) * speed;
    p.speedY = Math.sin(angle) * speed;
    p.size = Math.random() * 4 + 2;
    p.decay = 0.025;
    p.color = ["#ffd32a", "#ff6b81", "#70a1ff", "#ffa502"][Math.floor(Math.random() * 4)];
    particles.push(p);
  }
}

// --- 4. BẦU TRỜI SAO BĂNG & ĐÈN TRỜI KHỔNG MINH (SKY CANVAS) ---
const stars = [];
const skyLanterns = [];
let shootingStars = [];

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * (window.innerHeight * 0.75);
    this.size = Math.random() * 1.6 + 0.4;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
  }
  update() {
    this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.015;
    this.alpha = Math.min(1, Math.max(0.2, this.alpha));
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#ffffff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * (window.innerHeight * 0.4);
    this.length = Math.random() * 80 + 50;
    this.speed = Math.random() * 8 + 6;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
    this.alpha = 1;
    this.active = true;
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.02;
    if (this.alpha <= 0) this.active = false;
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    const tailX = this.x - Math.cos(this.angle) * this.length;
    const tailY = this.y - Math.sin(this.angle) * this.length;
    const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.95)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.restore();
  }
}

// Class Đèn Trời Khổng Minh bay lên không trung
class SkyLantern {
  constructor(x, customText = "", isGrand = false, sender = "") {
    this.x = x || Math.random() * window.innerWidth;
    this.y = window.innerHeight + Math.random() * 80;
    this.scale = isGrand ? 1.45 : (Math.random() * 0.4 + 0.6);
    this.speedY = isGrand ? 0.95 : (Math.random() * 0.8 + 0.6);
    this.swingAngle = Math.random() * Math.PI * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.customText = customText;
    this.sender = sender;
    this.isGrand = isGrand;
    this.alpha = 0.98;
    this.sparkTimer = 0;
  }

  update() {
    this.y -= this.speedY;
    this.swingAngle += this.swingSpeed;
    this.x += Math.sin(this.swingAngle) * (this.isGrand ? 0.4 : 0.6);

    // Nếu là đèn ước nguyện đặc biệt, phát ra các hạt sáng vàng rơi rụng
    if (this.isGrand) {
      this.sparkTimer++;
      if (this.sparkTimer % 3 === 0 && this.alpha > 0.3) {
        particles.push(new TrailParticle(this.x, this.y + 30 * this.scale));
      }
    }

    // Giảm dần độ mờ và kích thước khi bay lên quá cao
    if (this.y < window.innerHeight * 0.25) {
      this.alpha -= (this.isGrand ? 0.0018 : 0.003);
      this.scale = Math.max(0.3, this.scale - 0.0006);
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // Hào quang đèn lồng (rực rỡ hơn nếu là đèn ước nguyện)
    const haloRadius = this.isGrand ? 60 : 45;
    const glowGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, haloRadius);
    glowGrad.addColorStop(0, this.isGrand ? "rgba(255, 241, 168, 0.8)" : "rgba(255, 234, 167, 0.6)");
    glowGrad.addColorStop(0.5, this.isGrand ? "rgba(243, 156, 18, 0.4)" : "rgba(230, 126, 34, 0.25)");
    glowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // Thân đèn lồng Khổng Minh hình thang bo cong
    ctx.fillStyle = this.isGrand ? "#d35400" : "#e67e22";
    ctx.beginPath();
    ctx.moveTo(-16, 20);
    ctx.quadraticCurveTo(-24, -10, -18, -30);
    ctx.quadraticCurveTo(0, -35, 18, -30);
    ctx.quadraticCurveTo(24, -10, 16, 20);
    ctx.closePath();
    ctx.fill();

    // Khung nẹp thân đèn
    if (this.isGrand) {
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Lõi ngọn lửa bập bùng bên dưới
    const flameGrad = ctx.createRadialGradient(0, 14, 1, 0, 14, 10);
    flameGrad.addColorStop(0, "#ffffff");
    flameGrad.addColorStop(0.4, "#f1c40f");
    flameGrad.addColorStop(1, "rgba(231, 76, 60, 0)");
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.arc(0, 14, 9, 0, Math.PI * 2);
    ctx.fill();

    // Dải lụa / Cuộn thư ước nguyện treo dưới đèn lồng
    if (this.customText) {
      const bannerWidth = Math.min(180, Math.max(90, this.customText.length * 7.5));
      const bannerHeight = this.sender ? 36 : 24;

      // Nẹp gỗ đỏ trên
      ctx.fillStyle = "#a71d2a";
      ctx.fillRect(-bannerWidth / 2, 28, bannerWidth, 3);

      // Thân giấy da cuộn thư
      ctx.fillStyle = "rgba(253, 250, 243, 0.95)";
      ctx.strokeStyle = "#e0c89c";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-bannerWidth / 2, 31, bannerWidth, bannerHeight, [0, 0, 6, 6]);
      } else {
        ctx.rect(-bannerWidth / 2, 31, bannerWidth, bannerHeight);
      }
      ctx.fill();
      ctx.stroke();

      // Chữ điều ước
      ctx.font = "italic 11px 'Be Vietnam Pro', sans-serif";
      ctx.fillStyle = "#8b3a12";
      ctx.textAlign = "center";
      ctx.fillText(this.customText.slice(0, 26), 0, 47);

      if (this.sender) {
        ctx.font = "bold 9px 'Be Vietnam Pro', sans-serif";
        ctx.fillStyle = "#c0392b";
        ctx.fillText(`✦ ${this.sender}`, 0, 60);
      }

      // Dây tua rua đỏ treo phía dưới
      ctx.strokeStyle = "#c0392b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 31 + bannerHeight);
      ctx.lineTo(0, 31 + bannerHeight + 10);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// Khởi tạo bầu trời
function initSky() {
  stars.length = 0;
  for (let i = 0; i < 90; i++) {
    stars.push(new Star());
  }

  // Khởi tạo một vài đèn trời bay sẵn
  skyLanterns.length = 0;
  for (let i = 0; i < 7; i++) {
    const l = new SkyLantern();
    l.y = Math.random() * window.innerHeight;
    skyLanterns.push(l);
  }
}

// Vòng lặp vẽ bầu trời đêm
function animateSky() {
  skyCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);

  // 1. Vẽ sao
  stars.forEach(s => {
    s.update();
    s.draw(skyCtx);
  });

  // 2. Sao băng ngẫu nhiên
  if (Math.random() < 0.015 && shootingStars.length < 3) {
    shootingStars.push(new ShootingStar());
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    shootingStars[i].update();
    shootingStars[i].draw(skyCtx);
    if (!shootingStars[i].active) {
      shootingStars.splice(i, 1);
    }
  }

  // 3. Đèn trời Khổng Minh
  if (Math.random() < 0.012 && skyLanterns.length < 18) {
    skyLanterns.push(new SkyLantern());
  }
  for (let i = skyLanterns.length - 1; i >= 0; i--) {
    skyLanterns[i].update();
    skyLanterns[i].draw(skyCtx);
    if (skyLanterns[i].alpha <= 0 || skyLanterns[i].y < -60) {
      skyLanterns.splice(i, 1);
    }
  }

  requestAnimationFrame(animateSky);
}

// Thả đèn trời mới có đính kèm điều ước
function releaseNewLantern(text = "", sender = "") {
  const spawnX = window.innerWidth * (0.3 + Math.random() * 0.4);
  const lantern = new SkyLantern(spawnX, text, false, sender);
  lantern.scale = 1.1; // To và rõ ràng
  lantern.speedY = 1.2;
  skyLanterns.push(lantern);
  showToast("🏮 Chiếc đèn lồng mang ước nguyện đã cất cánh!");
  playChimeSound(520, "triangle");
}

// Thả đèn trời ĐẶC BIỆT chở theo BỨC THƯ & điều ước của cô ấy
function releaseGrandWishLantern(text, sender) {
  const spawnX = window.innerWidth * 0.5 + (Math.random() - 0.5) * 80;
  const lantern = new SkyLantern(spawnX, text, true, sender);
  lantern.y = window.innerHeight + 10;
  skyLanterns.push(lantern);

  // Mưa sao băng chúc mừng
  for (let i = 0; i < 2; i++) {
    setTimeout(() => {
      shootingStars.push(new ShootingStar());
    }, i * 350);
  }

  // Bung pháo hoa chúc mừng tại đáy màn hình nơi đèn bay lên
  createClickExplosion(spawnX, window.innerHeight - 80);
  playChimeSound(720, "triangle");

  // Đưa điều ước vào bảng ước nguyện trên trang web
  addWishToBoard(text, sender);
}

function addWishToBoard(text, sender) {
  const wishBoard = document.querySelector(".wish-board");
  if (!wishBoard) return;

  const card = document.createElement("div");
  card.className = "wish-item lantern-card";
  card.style.border = "1.5px solid var(--bright-gold)";
  card.style.boxShadow = "0 0 30px rgba(246, 185, 59, 0.45)";
  card.innerHTML = `
    <div class="card-lantern-icon">🏮✨</div>
    <p class="wish-text">"${escapeHtml(text)}"</p>
    <span class="wish-sender">✦ Từ ${escapeHtml(sender)} (Vừa Thả Lên Trời Cao)</span>
  `;
  wishBoard.insertBefore(card, wishBoard.firstChild);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// --- 5. AUDIO & WEB AUDIO SYNTHESIZER ---
const bgMusic = document.getElementById("bgMusic");
const musicWidget = document.getElementById("musicWidget");
const vinylDisc = document.getElementById("vinylDisc");
const musicTitleWrap = document.getElementById("musicTitleWrap");
const volSlider = document.getElementById("volSlider");
const volVal = document.getElementById("volVal");
const volMuteBtn = document.getElementById("volMuteBtn");
const volIcon = document.getElementById("volIcon");

let isPlaying = false;
let lastVolume = 0.7;

let audioCtx = null;
function playChimeSound(freq = 440, type = "sine") {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    // Trình duyệt không hỗ trợ Web Audio
  }
}

// Cập nhật giao diện thanh âm lượng lớn hơn
function updateVolumeUI(volumePercent) {
  if (volSlider) volSlider.value = volumePercent;
  if (volVal) volVal.textContent = `${volumePercent}%`;
  if (volSlider) {
    volSlider.style.background = `linear-gradient(to right, var(--primary-gold) 0%, var(--primary-gold) ${volumePercent}%, rgba(255, 255, 255, 0.22) ${volumePercent}%, rgba(255, 255, 255, 0.22) 100%)`;
  }
  if (volIcon) {
    if (volumePercent === 0) {
      volIcon.className = "fa-solid fa-volume-xmark";
    } else if (volumePercent < 50) {
      volIcon.className = "fa-solid fa-volume-low";
    } else {
      volIcon.className = "fa-solid fa-volume-high";
    }
  }
}

// Bắt đầu phát nhạc nền
function startMusic() {
  if (isPlaying) return;
  bgMusic.volume = lastVolume;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      if (vinylDisc) vinylDisc.classList.add("spinning");
      if (musicWidget) musicWidget.classList.add("playing");
      cleanupAutoplayTriggers();
    }).catch(() => {
      // Chờ tương tác người dùng
    });
  }
}

// Tạm dừng nhạc
function pauseMusic() {
  bgMusic.pause();
  isPlaying = false;
  if (vinylDisc) vinylDisc.classList.remove("spinning");
  if (musicWidget) musicWidget.classList.remove("playing");
}

// Bật/tắt khi nhấp vào đĩa than hoặc tiêu đề bài hát
function toggleMusic() {
  if (!isPlaying) {
    startMusic();
  } else {
    pauseMusic();
  }
}

if (vinylDisc) {
  vinylDisc.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

if (musicTitleWrap) {
  musicTitleWrap.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

// Tự động phát mỗi khi vào trang web:
// Thử phát ngay, đồng thời lắng nghe mọi cử chỉ đầu tiên (di chuột, chạm, cuộn, gõ phím)
const autoplayEvents = ["mousemove", "pointermove", "touchstart", "pointerdown", "mousedown", "click", "scroll", "keydown", "wheel"];
function triggerAutoplayOnGesture() {
  if (!isPlaying) {
    startMusic();
  }
}

function setupAutoplayTriggers() {
  updateVolumeUI(70);
  startMusic();
  autoplayEvents.forEach(ev => {
    window.addEventListener(ev, triggerAutoplayOnGesture, { passive: true });
  });
}

function cleanupAutoplayTriggers() {
  autoplayEvents.forEach(ev => {
    window.removeEventListener(ev, triggerAutoplayOnGesture);
  });
}

// Lắng nghe thanh trượt âm lượng
if (volSlider) {
  volSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value, 10);
    bgMusic.volume = val / 100;
    if (val > 0) lastVolume = val / 100;
    updateVolumeUI(val);
  });
}

// Nút tắt / bật tiếng (Mute toggle)
if (volMuteBtn) {
  volMuteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgMusic.volume > 0) {
      lastVolume = bgMusic.volume;
      bgMusic.volume = 0;
      updateVolumeUI(0);
    } else {
      const restore = lastVolume || 0.7;
      bgMusic.volume = restore;
      updateVolumeUI(Math.round(restore * 100));
    }
  });
}

// --- 6. INTERACTIVE MODALS & FEATURES ---
function showToast(msg) {
  const toast = document.getElementById("toastMessage");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Modal Thả Đèn (Bức Thư Nguyện Ước Dưới Trăng)
const wishModal = document.getElementById("wishModal");
const wishLetterCard = document.getElementById("wishLetterCard");
const openWishModalBtn = document.getElementById("openWishModalBtn");
const closeWishModal = document.getElementById("closeWishModal");
const confirmReleaseWish = document.getElementById("confirmReleaseWish");
const customWishSender = document.getElementById("customWishSender");
const customWishInput = document.getElementById("customWishInput");
const fastReleaseBtn = document.getElementById("fastReleaseBtn");

openWishModalBtn.addEventListener("click", () => {
  wishModal.classList.add("active");
  if (customWishSender) {
    customWishSender.value = localStorage.getItem("trungthu_herName") || "";
  }
  if (customWishInput) {
    customWishInput.value = "";
    setTimeout(() => customWishInput.focus(), 200);
  }
});

closeWishModal.addEventListener("click", () => {
  wishModal.classList.remove("active");
});

// Lưu trữ tâm thư và chuyển tiếp thông báo (hỗ trợ cả chạy offline, Vercel, Email, Telegram, Discord)
function saveWishToServer(wishText, senderName) {
  const payload = {
    sender: senderName,
    wish: wishText,
    time: new Date().toLocaleString("vi-VN")
  };

  // 1. Luôn lưu vào LocalStorage của trình duyệt
  try {
    const existing = JSON.parse(localStorage.getItem("trungthu_wishes_history") || "[]");
    existing.push(payload);
    localStorage.setItem("trungthu_wishes_history", JSON.stringify(existing));
    console.log("💾 Đã lưu tâm thư vào bộ nhớ trình duyệt:", payload);
  } catch (e) {}

  // 2. Gửi về Telegram (nếu có cấu hình)
  if (NOTIFY_CONFIG.telegramBotToken && NOTIFY_CONFIG.telegramChatId) {
    const msg = `🏮 TÂM THƯ TRUNG THU MỚI!\n⏰ Thời gian: ${payload.time}\n👤 Người gửi: ${payload.sender}\n💌 Lời chúc: ${payload.wish}`;
    fetch(`https://api.telegram.org/bot${NOTIFY_CONFIG.telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: NOTIFY_CONFIG.telegramChatId,
        text: msg
      })
    }).catch(err => console.warn("Lỗi gửi Telegram:", err));
  }

  // 3. Gửi về Email (qua FormSubmit miễn phí, nếu có cấu hình)
  if (NOTIFY_CONFIG.emailTo) {
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_CONFIG.emailTo)}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `🏮 Tâm thư Trung Thu từ ${payload.sender}`,
        name: payload.sender,
        message: payload.wish,
        time: payload.time
      })
    }).catch(err => console.warn("Lỗi gửi Email:", err));
  }

  // 4. Gửi về Discord Webhook (nếu có cấu hình)
  if (NOTIFY_CONFIG.discordWebhookUrl) {
    fetch(NOTIFY_CONFIG.discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🏮 **TÂM THƯ TRUNG THU MỚI!**\n**Người gửi:** ${payload.sender}\n**Thời gian:** ${payload.time}\n**Nội dung:**\n> ${payload.wish.replace(/\n/g, '\n> ')}`
      })
    }).catch(err => console.warn("Lỗi gửi Discord:", err));
  }

  // 5. Thử gửi về API nội bộ nếu có
  if (window.location.protocol.startsWith("http")) {
    fetch("/api/tam-thu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }
}

confirmReleaseWish.addEventListener("click", () => {
  const wishText = (customWishInput ? customWishInput.value.trim() : "") || "Nguyện ước luôn bình yên và tràn ngập tiếng cười";
  const senderName = (customWishSender ? customWishSender.value.trim() : "") || "Cô Gái Dịu Dàng Của Anh";

  // Lưu tâm thư trực tiếp vào file trên máy tính qua Server
  saveWishToServer(wishText, senderName);

  // Kích hoạt hiệu ứng bức thư gấp cuộn và bay vút lên
  if (wishLetterCard) {
    wishLetterCard.classList.add("letter-ascending");
  }
  playChimeSound(750, "triangle");
  createClickExplosion(window.innerWidth / 2, window.innerHeight / 2);

  setTimeout(() => {
    wishModal.classList.remove("active");
    if (wishLetterCard) {
      wishLetterCard.classList.remove("letter-ascending");
    }
    // Phóng đèn trời mang bức thư lên cao
    releaseGrandWishLantern(wishText, senderName);
    showToast("🏮 Chiếc đèn lồng đã chở bức thư và lời ước của em bay vút lên bầu trời sao!");
    if (customWishInput) customWishInput.value = "";
  }, 650);
});

fastReleaseBtn.addEventListener("click", () => {
  wishModal.classList.add("active");
  if (customWishSender) {
    customWishSender.value = localStorage.getItem("trungthu_herName") || "";
  }
  if (customWishInput) {
    customWishInput.value = "";
    setTimeout(() => customWishInput.focus(), 200);
  }
});

// Modal Bẻ Bánh May Mắn
const cakeModal = document.getElementById("cakeModal");
const openCakeBtn = document.getElementById("openCakeBtn");
const closeCakeModal = document.getElementById("closeCakeModal");
const interactiveCake = document.getElementById("interactiveCake");
const cakeMessage = document.getElementById("cakeMessage");
const fortuneText = document.getElementById("fortuneText");

openCakeBtn.addEventListener("click", () => {
  cakeModal.classList.add("active");
  cakeMessage.classList.remove("revealed");
});
closeCakeModal.addEventListener("click", () => {
  cakeModal.classList.remove("active");
});
interactiveCake.addEventListener("click", (e) => {
  createClickExplosion(e.clientX, e.clientY);
  playChimeSound(680, "sine");
  // Lấy ngẫu nhiên câu chúc
  const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  fortuneText.textContent = `"${randomFortune}"`;
  cakeMessage.classList.add("revealed");
});

// Bức Thư Tình (Wax seal)
const openLetterBtn = document.getElementById("openLetterBtn");
const waxSeal = document.getElementById("waxSeal");

function triggerOpenLetter() {
  scrollToSection("letterSection");
  waxSeal.style.transform = "scale(1.25) rotate(25deg)";
  playChimeSound(440, "sine");
  setTimeout(() => {
    waxSeal.style.transform = "scale(1) rotate(0deg)";
    showToast("💌 Bức thư đã được mở gửi đến em!");
  }, 400);
}

openLetterBtn.addEventListener("click", triggerOpenLetter);
waxSeal.addEventListener("click", triggerOpenLetter);

// Modal Tùy chỉnh (Easy Configurator)
const customizerModal = document.getElementById("customizerModal");
const customizeBtn = document.getElementById("customizeBtn");
const closeConfigModal = document.getElementById("closeConfigModal");
const cfgHerName = document.getElementById("cfgHerName");
const cfgSenderName = document.getElementById("cfgSenderName");
const cfgLetterText = document.getElementById("cfgLetterText");
const saveCustomBtn = document.getElementById("saveCustomBtn");
const resetDefaultBtn = document.getElementById("resetDefaultBtn");

customizeBtn.addEventListener("click", () => {
  cfgHerName.value = localStorage.getItem("trungthu_herName") || DEFAULT_HER_NAME;
  cfgSenderName.value = localStorage.getItem("trungthu_senderName") || DEFAULT_SENDER_NAME;
  cfgLetterText.value = localStorage.getItem("trungthu_letter") || DEFAULT_LETTER;
  customizerModal.classList.add("active");
});

closeConfigModal.addEventListener("click", () => {
  customizerModal.classList.remove("active");
});

saveCustomBtn.addEventListener("click", () => {
  localStorage.setItem("trungthu_herName", cfgHerName.value.trim() || DEFAULT_HER_NAME);
  localStorage.setItem("trungthu_senderName", cfgSenderName.value.trim() || DEFAULT_SENDER_NAME);
  localStorage.setItem("trungthu_letter", cfgLetterText.value.trim() || DEFAULT_LETTER);
  loadSavedCustomization();
  customizerModal.classList.remove("active");
  showToast("✨ Đã cập nhật tên và lời chúc thành công!");
});

resetDefaultBtn.addEventListener("click", () => {
  localStorage.removeItem("trungthu_herName");
  localStorage.removeItem("trungthu_senderName");
  localStorage.removeItem("trungthu_letter");
  loadSavedCustomization();
  customizerModal.classList.remove("active");
  showToast("↺ Đã đưa về nội dung mặc định!");
});

// Đóng modal khi click ra ngoài overlay
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
  }
});

// --- 7. KHỞI CHẠY TẤT CẢ MODULE KHI TRANG TẢI XONG ---
window.addEventListener("DOMContentLoaded", () => {
  resizeCanvases();
  loadSavedCustomization();
  initSky();
  animateSky();
  updateCursorAndTrail();
  setupAutoplayTriggers();
});
