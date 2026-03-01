// ================= DATA & KLASIFIKASI ================= //
const komentar = [
    "@immortalsindo3120: “Mungkin agak jarang yg bahas Salvation of A Saint tpi aku paling suka buku itu. Kombinasi “why” sama “how” nya mantap banget.”",
    "@arlisaputridewanti9089: “Wihh tbr lagi nihh”",
    "@petanis: “Baru mulai baca bukunya mulai dari Toko Kelontong Namiya terus lanjut di Black Showman. Belum baca yang lainnya.”",
    "@codebreak1079: “Mau baca bukunya yang seri detektif galileo cuman trauma baca novel yang sebelumnya sudah nonton adaptasi ke series atau movie nya.”",
    "@prisheilamargareth2062: “Baru selesai baca Toko kelontong Namiya. Ceritanya keren bgt, bikin kaget plotnya. Semua masalah yg dibahas tuh saling berkaitan gt, jdi bikin penasaran bgt”",
    "@adinugraha1073: “Malice sma Newcomer. klo Mr. X nonton filmnya”",
    "@overthinker_midnightt: “overhyped much? 👀 beberapa karya terasa mid bahkan jelek di pacing. ekspektasi tinggi malah jadi buruk. sorry tapi aku tidak suka.”",
    "@ditafsafitri: “Baru yg mister X, dan bagus jadi sukaaa banget kaaak, jadi pingin baca karya2 beliau yg laiiin 🌟”",
    "@smartypants_detectivee: “his pattern is too predictable 😭 lama-lama jadi jelek karena formula terus. aku mulai tidak suka karena monoton.”",
    "@fauzansyahbudin9260: “gak terlalu suka cerita yg rumit sih... bagi gw the new comer masih yg terbaik... tinggal black showman aja yang masih di wishlist...”",
    "@noonareads247: “twistnya oke tapi storytelling-nya ribet banget. muter-muter sampe pengalaman bacanya terasa buruk. sorry but aku tidak suka cara nyeritainnya.”",
    "@adindahaifa_: “Aku penasaran sm buku-buku Keigo Higashino karena review-nya Kak Aya 😍 Yang paling fav adalah The Devotion of Suspect X sama Salvation Of A Saint 😭💙 suka bangettt!”",
    "@cryingoverfiction: “menurut aku ni ya, kan dia penulis novel bergenre misteri. trus pas liat covernya tuh kayak ga menarik aja kayak membosankan, terlalu minimalis/generik, jadi keliatan nya kaya novel thriller biasa. trus ada bbrp juga yg cover nya cuma siluet bahasa jepang + warna gelap, menurut aku jelek dan jd kek kurang memorable gtu”",
    "@hendriksastrajuang3938: “Aku udah baca dua buku Kak, Malice dan Keajaiban Toko Kelontong Namiya. Tapi aku lebih suka Toko Kelontong Namiya. Twist endingnya keren.”",
    "@matchalatte_gurliee: “konsepnya sweet tapi eksekusinya agak buruk menurutku. terlalu banyak kebetulan yang dipaksa nyambung. endingnya bikin aku tidak suka 😅”",
    "@logiclify: “he's literally genius at building mystery🔥 keren banget selalu bikin penasaran”" ,
    "@destyareta: “aku baru mau mulaaii baca genre selain romanceee, terus sekarang lg baca karya dia yg the newcomer”",
    "@adictadit: “Malice tu ceritanya mindblowing! Cara mainin perspektifnya keren”",
    "@warmhugreader: “Toko kelontong namiya wholesome banget🥹 hangat dan meaningful, keren deh”",
    "@plothunter: “The Devotion of Suspect X plot twist nya gila sihh🤯 pinter banget dan bikin mikir, sukaaa”"
];

const komentarAsli = [...komentar];

let currentFilter = "semua";
let currentKeyword = "";

// ================= KATA KUNCI ================= //
const positif = {
  bagus: 1,
  keren: 2,
  mantap: 2,
  "luar biasa": 3,
  terbaik: 3,
  suka: 1
};

const negatif = {
  jelek: 1,
  buruk: 2,
  trauma: 2,
  membosankan: 2,
  rumit: 1,
  benci: 3
};

const kontras = ["tapi","namun","walau","meski"];
const negasi = ["tidak","ga","gak","kurang","belum"];
const intensifier = ["sangat","banget","bangett","bgt","super","sekali"];
const emojiPositif = ["😍","😆","🔥","👍","✨"];
const emojiNegatif = ["😡","😤","💀","😒"];
// ================= KLASIFIKASI ================= //
function klasifikasi(teks){

  const hasil = analisisDetail(teks);
  return hasil.hasilAkhir;

}

// ================= NORMALIZE WORD (MINI NLP) ================= //
function normalizeWord(word){

  // lowercase
  word = word.toLowerCase();

  // hapus tanda baca
  word = word.replace(/[^\w]/g,"");

  // hapus huruf berulang lebih dari 2
  word = word.replace(/(.)\1{2,}/g, "$1$1");

  return word;
}

// ================= ANALISIS DETAIL PER KATA (NEGASI PINTAR) ================= //
function analisisDetail(teks){

  const words = teks.toLowerCase().split(/\s+/);

  let hasilKata = [];
  let pos = 0;
  let neg = 0;
  let net = 0;

  let kataCount = {};

  for(let i=0; i<words.length; i++){

    let rawWord = words[i];
    let kata = normalizeWord(rawWord);

    let kategori = "netral";

    // === CEK NEGASI ===
    if(negasi.includes(kata) && words[i+1]){

  let nextWord = normalizeWord(words[i+1]);

  if(Object.keys(positif).some(p => nextWord.includes(p))){
    hasilKata.push({kata, kategori:"negasi"});
    hasilKata.push({kata: nextWord, kategori:"negatif"});
    neg++;
    kataCount[nextWord] = (kataCount[nextWord] || 0) + 1;
    i++;
    continue;
  }

  if(Object.keys(negatif).some(n => nextWord.includes(n))){
    hasilKata.push({kata, kategori:"negasi"});
    hasilKata.push({kata: nextWord, kategori:"positif"});
    pos++;
    kataCount[nextWord] = (kataCount[nextWord] || 0) + 1;
    i++;
    continue;
  }
}

   let multiplier = 1;

if(i > 0){
  let prevWord = normalizeWord(words[i-1]);
  if(intensifier.includes(prevWord)){
    multiplier = 1.5;
  }
}
    
    // === SUBSTRING CHECK ===
    let found = false;

for(let p in positif){
  if(kata.includes(p)){
    kategori = "positif";
    pos += positif[p] * multiplier;
    found = true;
  }
}

for(let n in negatif){
  if(kata.includes(n)){
    kategori = "negatif";
    neg += negatif[n] * multiplier;
    found = true;
  }
}

if(!found){
  net++;
}

    hasilKata.push({kata, kategori});
  }

  const total = pos + neg + net;

  const confidence = total 
    ? Math.abs(pos - neg) / total * 100
    : 0;

  // Cari kata dominan
  let dominan = "-";
  let max = 0;
  for(let k in kataCount){
    if(kataCount[k] > max){
      max = kataCount[k];
      dominan = k;
    }
  }

  return {
    detail: hasilKata,
    persentase: {
      positif: total ? ((pos/total)*100).toFixed(1) : 0,
      negatif: total ? ((neg/total)*100).toFixed(1) : 0,
      netral: total ? ((net/total)*100).toFixed(1) : 0
    },
    hasilAkhir:
      pos > neg ? "positif" :
      neg > pos ? "negatif" : "netral",
    confidence: confidence.toFixed(1),
    dominan
  };
}

// ================= HIGHLIGHT ================= //
function highlightText(teks){

  let hasil = teks;

  // highlight sentimen
  for(let k in positif){
  hasil = hasil.replace(
    new RegExp(`(${k})`, 'gi'),
    '<span class="highlight-positif">$1</span>'
  );
}

for(let k in negatif){
  hasil = hasil.replace(
    new RegExp(`(${k})`, 'gi'),
    '<span class="highlight-negatif">$1</span>'
  );
}

  // highlight keyword search
  if(currentKeyword){
    hasil = hasil.replace(
      new RegExp(`(${currentKeyword})`, 'gi'),
      '<span class="highlight-search">$1</span>'
    );
  }

  return hasil;
}

// ================= ANIMASI ANGKA ================= //
function animateCounter(element, target){
  let start = 0;
  const duration = 500;
  const stepTime = 15;
  const increment = target / (duration / stepTime);

  const timer = setInterval(()=>{
    start += increment;
    if(start >= target){
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, stepTime);
}

let sentimentChart;

function renderChart(p,n,net){

  const ctx = document.getElementById("sentimentChart");

  if(sentimentChart){
    sentimentChart.destroy();
  }

  sentimentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Positif','Negatif','Netral'],
      datasets: [{
        data: [p,n,net],
        backgroundColor: ['#22c55e','#ef4444','#64748b']
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{
          position:'bottom'
        }
      }
    }
  });
}

// ================= UPDATE STATISTIK ================= //
function updateStats(p, n, net){
  animateCounter(document.getElementById("jumlahPositif"), p);
  animateCounter(document.getElementById("jumlahNegatif"), n);
  animateCounter(document.getElementById("jumlahNetral"), net);

  const total = p + n + net;
  document.getElementById("barPositif").style.width = total ? (p/total*100)+"%" : "0";
  document.getElementById("barNegatif").style.width = total ? (n/total*100)+"%" : "0";
  document.getElementById("barNetral").style.width = total ? (net/total*100)+"%" : "0";
  renderChart(p,n,net);
}

// ================= HITUNG TOTAL ================= //
function hitungTotalStatistik(){
  let p=0,n=0,net=0;
  komentar.forEach(k=>{
    const kategori = klasifikasi(k);
    if(kategori==="positif") p++;
    else if(kategori==="negatif") n++;
    else net++;
  });
  updateStats(p,n,net);
}

// ================= TAMPILKAN KOMENTAR ================= //
async function tampilkan(filter, dataKomentar = komentar){

  const output = document.getElementById("output");
  output.innerHTML = `
  <div class="skeleton"></div>
  <div class="skeleton"></div>
`;

await new Promise(r=>setTimeout(r,0));

output.innerHTML = "";

  const filtered = dataKomentar.filter(k=>{
  const kat = klasifikasi(k);
  return filter === "semua" || kat === filter;
});

// CEK KOSONG SETELAH FILTER
if(filtered.length === 0){
  output.innerHTML = `
    <div class="empty-state">
      😶 Tidak ada komentar ditemukan
    </div>
  `;
  return;
}

  for(let teks of filtered){

    const kategori = klasifikasi(teks);

    const li = document.createElement("li");
    li.classList.add(kategori);

    // ===== BADGE =====
    const badge = document.createElement("span");
    badge.classList.add("badge", kategori);
    badge.textContent = kategori.toUpperCase();
    li.appendChild(badge);

    // ===== TEXT =====
    const textSpan = document.createElement("span");
    textSpan.innerHTML = " " + highlightText(teks);
    li.appendChild(textSpan);

    // ===== CLICK EVENT =====
    li.addEventListener("click", (event) => {

      // Ripple
const ripple = document.createElement("span");
ripple.className = "ripple";
ripple.style.left = event.offsetX + "px";
ripple.style.top = event.offsetY + "px";
li.appendChild(ripple);

setTimeout(() => ripple.remove(), 500);
      
      document.querySelectorAll(".detail-analisis").forEach(d=>{
  if(d.parentElement !== li){
    d.remove();
  }
});
      
      const existing = li.querySelector(".detail-analisis");

      // ===== TUTUP =====
      if(existing){
        existing.style.maxHeight = existing.scrollHeight + "px";

        requestAnimationFrame(()=>{
          existing.style.maxHeight = "0px";
          existing.style.opacity = "0";
        });

        setTimeout(()=>{
          existing.remove();
        },400);

        return;
      }

      // ===== BUKA =====
      const analisis = analisisDetail(teks);

      const detailDiv = document.createElement("div");
      detailDiv.className = "detail-analisis";

      // === PER KATA ===
      let kataHTML = "";
      analisis.detail.forEach(d=>{
        kataHTML += `<span class="kata-${d.kategori}">${d.kata}</span> `;
      });

      detailDiv.innerHTML = `
        <div>${kataHTML}</div>

        <div class="mini-bars">

          <div class="mini-row">
            <span>Positif</span>
            <div class="mini-bar">
              <div class="mini-fill positif-fill"
                style="width:${analisis.persentase.positif}%">
              </div>
            </div>
            <span>${analisis.persentase.positif}%</span>
          </div>

          <div class="mini-row">
            <span>Negatif</span>
            <div class="mini-bar">
              <div class="mini-fill negatif-fill"
                style="width:${analisis.persentase.negatif}%">
              </div>
            </div>
            <span>${analisis.persentase.negatif}%</span>
          </div>

          <div class="mini-row">
            <span>Netral</span>
            <div class="mini-bar">
              <div class="mini-fill netral-fill"
                style="width:${analisis.persentase.netral}%">
              </div>
            </div>
            <span>${analisis.persentase.netral}%</span>
          </div>

          <div class="hasil-akhir ${analisis.hasilAkhir}">
  HASIL AKHIR: ${analisis.hasilAkhir.toUpperCase()}
  <br>
  Confidence: ${analisis.confidence}%
  <br>
  Kata dominan: ${analisis.dominan}
</div>

        </div>
      `;

      li.appendChild(detailDiv);

      setTimeout(()=>{
  detailDiv.querySelector(".positif-fill").style.width = analisis.persentase.positif + "%";
},100);

setTimeout(()=>{
  detailDiv.querySelector(".negatif-fill").style.width = analisis.persentase.negatif + "%";
},200);

setTimeout(()=>{
  detailDiv.querySelector(".netral-fill").style.width = analisis.persentase.netral + "%";
},300);
      
      // Animasi buka
      detailDiv.style.maxHeight = "0px";
      detailDiv.style.opacity = "0";

      requestAnimationFrame(()=>{
        detailDiv.style.maxHeight = detailDiv.scrollHeight + "px";
        detailDiv.style.opacity = "1";
      });

    });

    output.appendChild(li);
    li.classList.add("show");
  }

  observeComments();
}

// ================= SUBMIT ================= //
function submitComment(){
  const input = document.getElementById("userComment");
  const teks = input.value.trim();
  if(!teks) return;

  komentar.push(teks);

  const kategori = klasifikasi(teks);
  jatuhEmoji(kategori); 
  showToast("✔ Komentar berhasil dianalisis");

  input.value="";
  hitungTotalStatistik();
  tampilkan("semua");
}

// ================= EMOJI JATUH (ASLI VERSI KAMU) ================= //
function jatuhEmoji(kategori){
  const emojiMap = { 
    positif: "☺️", 
    negatif: "😡", 
    netral: "😇" 
  };

  const emojiChar = emojiMap[kategori];
  if(!emojiChar) return;

  for(let i=0;i<12;i++){
    const span = document.createElement("span");
    span.textContent = emojiChar;
    span.style.position="fixed";
    span.style.top="-40px";
    span.style.left=Math.random()*85+"%";
    span.style.fontSize=(Math.random()*16+28)+"px";
    span.style.pointerEvents="none";
    span.style.transition="transform 1.8s ease-out, opacity 1.8s ease-out";
    span.style.textShadow="2px 2px 6px rgba(0,0,0,0.35)";
    document.body.appendChild(span);

    setTimeout(()=>{
      span.style.transform = `translateY(${window.innerHeight+80}px) rotate(${Math.random()*90-45}deg)`;
      span.style.opacity = 0;
    }, i*150);

    setTimeout(()=>span.remove(), 2000+i*150);
  }
}

// ================= OBSERVER ================= //
function observeComments(){
  const comments = document.querySelectorAll('#output li');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('show');
    });
  }, {threshold:0.1});
  comments.forEach(c=>observer.observe(c));
}

// ================= FILTER BUTTON ================= //
const buttons = document.querySelectorAll('.button-group button');

buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    renderCombined();
  });
});

// ================= SCROLL ================= //
function scrollToAnalyzer(){
  document.getElementById("analyzer").scrollIntoView({behavior:"smooth"});
}

function applySorting(){

  const sortType = document.getElementById("sortSelect").value;

  if(sortType === "newest"){
    komentar.reverse();
  }

  else if(sortType === "oldest"){
    komentar.length = 0;
    komentar.push(...komentarAsli);
  }

  else if(sortType === "az"){
    komentar.sort((a,b)=>a.localeCompare(b));
  }

  else if(sortType === "za"){
    komentar.sort((a,b)=>b.localeCompare(a));
  }

  renderCombined();
}

// ================= SEARCH FUNCTION ================= //
function applySearch(){
  const searchInput = document.getElementById("searchInput");
  currentKeyword = searchInput.value.toLowerCase();
  renderCombined();
}

function renderCombined(){

  let data = komentar;

  // FILTER KATEGORI
  if(currentFilter !== "semua"){
    data = data.filter(k => klasifikasi(k) === currentFilter);
  }

  // FILTER SEARCH
  if(currentKeyword){
    data = data.filter(k =>
      k.toLowerCase().includes(currentKeyword)
    );
  }

  tampilkan("semua", data);
}

function renderCombined(){

  let data = komentar;

  // FILTER KATEGORI
  if(currentFilter !== "semua"){
    data = data.filter(k => klasifikasi(k) === currentFilter);
  }

  // FILTER SEARCH
  if(currentKeyword){
    data = data.filter(k =>
      k.toLowerCase().includes(currentKeyword)
    );
  }

  tampilkan("semua", data);
}

document.getElementById("themeToggle")
.addEventListener("click", function(){

  // fade sedikit
  document.documentElement.style.transition = "opacity 0.2s ease";
  document.documentElement.style.opacity = "0.85";

  setTimeout(()=>{

    document.documentElement.classList.toggle("dark");

    if(document.documentElement.classList.contains("dark")){
      this.textContent = "☀ Light Mode";
    } else {
      this.textContent = "🌙 Dark Mode";
    }

    document.documentElement.style.opacity = "1";

  },150);

});

function showToast(message){

  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },2000);
}

// ================= LOAD ================= //
// Set button pertama sebagai active
document.querySelector('.button-group button').classList.add('active');

hitungTotalStatistik();
renderCombined();