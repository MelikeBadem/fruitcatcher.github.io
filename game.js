const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fruitWidth = 45; // meyve genisligi
const fruitHeight = 45; // meyve yuksekligi
const sepetWidth = 150; // sepet genisligi
const sepetHeight = 85; // sepet yuksekligi
const sepetSpeed = 30; // sepet hareket hizi

let gameStarted = false;
let fruits = []; // meyveleri tutacak dizi
let score = 0; // oyuncunun skoru

// canvas poziston
canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%, -50%)";
let sepetX = canvas.width / 2 - sepetWidth / 2; // spetin baslangic x koordinati
let sepetY = canvas.height - 90; // sepetin baslangic y koordinati
const sepetMaxY = canvas.height - 200; // sepetin üst siniri

const topDividerY = 100; // oyun alaninin üstündeki bölme için y koordinati
const topDividerHeight = 10; // oyun alaninin ustundeki bolme yuksekligi
const topDividerLeft = 0; // oyun alaninin ustundeki bolme sol kenari
const topDividerRight = canvas.width; // oyun alaninin ustundeki bolme sag kenari

//gorseller
const topImage = new Image();
topImage.src = "manav1.png"; // yukariya eklenen manav gorseli

const sepetImg = new Image();
sepetImg.src = "sepet1.png"; // sepet resmi

const grassImage = new Image();
grassImage.src = "cimen1.png"; // oyun arka plani cimen resmi

const fruitImages = {
  apple: "elma.png",
  strawberry: "cilek.png",
  banana: "muz.png",
};

//oyun zorluk seviyeleri
let meyveUretmeHizi = 1200; // baslangictaki meyve uretme hizi
let meyveDusmeHizi = 5; // baslangicta meyve düsme hizi (px cinsinden)
const hizArtisSuresi = 1000; // Meyve üretme hızının artırılacağı zaman aralığı (ms cinsinden)
const hizArtisOrani = 0.75; // Meyve üretme hızının artış oranı

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    // tiklandiginda mesaj kalksin
    canvas.removeEventListener("click", startGame);
    spawnFruit();
  }
}
//oyun ilk acilis sayfasi
function drawStartMessage() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Tap to start!", canvas.width / 2 - 60, canvas.height / 2 - 15); //baslatmak icin mousela tikla
  ctx.fillText(
    "Restart:R  Controls:Arrow keys", //tekrar baslatma ve oyun kontol tuslarinin aciklamasi
    canvas.width / 2 - 150,
    canvas.height / 2 + 30
  );
}
//
function spawnFruit() {
  const x = Math.random() * (canvas.width - fruitWidth);
  const type = Object.keys(fruitImages)[Math.floor(Math.random() * 3)];
  fruits.push({ x: x, y: -fruitHeight, type: type });
}
//oyunu guncelle
function updateGame() {
  if (!gameStarted) {
    drawStartMessage();
    return;
  }
  for (let i = fruits.length - 1; i >= 0; i--) {
    fruits[i].y += meyveDusmeHizi;
    //meyve sepete dustuyse score artsin
    if (
      fruits[i].x + fruitWidth >= sepetX &&
      fruits[i].x <= sepetX + sepetWidth &&
      fruits[i].y + fruitHeight >= sepetY &&
      fruits[i].y <= sepetY + sepetHeight
    ) {
      fruits.splice(i, 1);
      score += 10;
    }
    //meyve zemine dustuyse oyun bitsin
    for (let i = 0; i < fruits.length; i++) {
      if (fruits[i].y > canvas.height - fruitHeight) {
        gameOver();
        return;
      }
    }
  }

  drawGame();
}
canvas.addEventListener("click", startGame);
//oyun ekraninin cizilmesi ayarlanmasi
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    grassImage,
    0,
    topDividerY + topDividerHeight,
    canvas.width,
    canvas.height - (topDividerY + topDividerHeight)
  );
  ctx.drawImage(topImage, 0, 0, canvas.width, topDividerY);

  fruits.forEach((fruit) => {
    const fruitImg = new Image();
    fruitImg.src = fruitImages[fruit.type];
    ctx.drawImage(fruitImg, fruit.x, fruit.y, fruitWidth, fruitHeight);
  });

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(topDividerLeft, topDividerY);
  ctx.lineTo(topDividerRight, topDividerY);
  ctx.stroke();

  ctx.drawImage(sepetImg, sepetX, sepetY, sepetWidth, sepetHeight);

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, sepetMaxY);
  ctx.lineTo(canvas.width, sepetMaxY);
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
  let lastScore = 0; //spn score

  // Son skoru güncelle
  lastScore = score;

  // Oyun alanını temizle
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // "Game Over" metnini yazdır
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2 - 20);

  // Skorunu yazdır
  ctx.font = "30px Arial";
  ctx.fillStyle = "green";
  ctx.fillText(
    "Your score: " + lastScore,
    canvas.width / 2 - 100,
    canvas.height / 2 + 20
  );
  //tekrar baslamak icin
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Restart:R", canvas.width / 2 - 100, canvas.height / 2 + 60);

  // Oyunu durdur (istediğiniz diğer işlemleri de burada yapabilirsiniz)
  clearInterval(spawnInterval);
  clearInterval(updateInterval);
  document.location.reload();
}
//klavye kontrolleri
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" && sepetX > 0) {
    sepetX -= sepetSpeed;
  } else if (event.key === "ArrowRight" && sepetX < canvas.width - sepetWidth) {
    sepetX += sepetSpeed;
  } else if (event.key === "ArrowUp" && sepetY > sepetMaxY) {
    sepetY -= sepetSpeed;
  } else if (
    event.key === "ArrowDown" &&
    sepetY < canvas.height - sepetHeight
  ) {
    sepetY += sepetSpeed;
  } else if (event.key === "R" || event.key === "r") {
    document.location.reload();
  }
});
//meyve olusturme ve oyunu guncelleme
setInterval(spawnFruit, meyveUretmeHizi);
setInterval(updateGame, 50);
//meyve uretme hiz kontrol
setInterval(function () {
  meyveUretmeHizi *= 1 + hizArtisOrani;
}, hizArtisSuresi);
