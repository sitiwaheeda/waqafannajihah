// ====== PENGATURAN: ganti dengan data asli yayasan ======
var WA_NUMBER = "628000000000"; // nomor WhatsApp admin (format 62...)
var BANKS = {
  bsi:    {name:"Bank Syariah Indonesia (BSI)", short:"BSI",     logo:"rss/bsi_logo.svg",     no:"7297758963", an:"Waqaf An-Najihah"},
  // mandiri:{name:"Bank Mandiri",                  short:"Mandiri", logo:"rss/mandiri_logo.svg", no:"0000000000", an:"Waqaf An-Najihah"},
  b9:     {name:"Bank Pembangunan Daerah Jambi",                  short:"Bank 9",  logo:"rss/bank9_logo.svg",   no:"7001677351", an:"Waqaf An-Najihah"}
};
var PROGRAMS = [
  {id:"masjid", ico:"🕌", title:"Waqaf Masjid An-Najihah", desc:"Bangun dan makmurkan Masjid An-Najihah sebagai pusat ibadah dan pembinaan Al-Qur’an."},
  {id:"hall",   ico:"🏛️", title:"Waqaf Hall An-Najihah",   desc:"Dukung pembangunan hall serbaguna untuk kegiatan belajar, tahfizh, dan dakwah."}
];
// =========================================================

var $ = function(id){return document.getElementById(id)};
var rp = function(n){return "Rp. "+n.toLocaleString("id-ID")};
var st = {}, timer = null;

$("ov").onclick = function(e){ if(e.target===$("ov")) closeM(); };

function closeM(){ $("ov").classList.remove("on"); clearInterval(timer); }

function openForm(title){
  var p = {title: title || "Waqaf An-Najihah"};
  st = {prog:p, amt:50000, bank:"bsi"};

  $("modal").innerHTML =
    '<button class="x" onclick="closeM()" aria-label="Tutup">×</button>'+
    '<h3>'+p.title+'</h3>'+
    '<p class="sub">Isi data berikut untuk melanjutkan waqaf.</p>'+
    '<label for="nm">Nama</label>'+
    '<input type="text" id="nm" placeholder="Nama atau Hamba Allah">'+
    '<label for="hp">No. HP / WhatsApp</label>'+
    '<input type="tel" id="hp" placeholder="08xxxxxxxxxx">'+
    '<label>Nominal</label>'+
    '<div class="amts">'+
      '<button class="amt on" data-a="50000">Rp 50.000</button>'+
      '<button class="amt" data-a="100000">Rp 100.000</button>'+
      '<button class="amt" data-a="200000">Rp 200.000</button>'+
      '<button class="amt" data-a="500000">Rp 500.000</button>'+
      '<button class="amt" data-a="1000000">Rp 1.000.000</button>'+
      '<button class="amt" data-a="0">Lainnya</button>'+
    '</div>'+
    '<div id="oth" style="display:none;margin-top:8px">'+
      '<input type="number" id="ot" min="10000" placeholder="Nominal lain (min. 10.000)">'+
    '</div>'+
    '<label>Metode Pembayaran</label>'+
    '<div class="banks">'+
      Object.keys(BANKS).map(function(k,i){
        return '<div class="bank'+(i?'':' on')+'" data-b="'+k+'">'+
        '<img class="bank-logo" src="'+BANKS[k].logo+'" alt="'+BANKS[k].short+'" onerror="this.style.display=\'none\'">'+
        '<span>'+BANKS[k].name+'</span></div>';
        }).join("")+
    '</div>'+
    '<p class="err" id="er"></p>'+
    '<button class="btn" id="pay">Bayar Sekarang</button>';

  $("ov").classList.add("on");

  // event dipasang SETELAH form dibuat (di dalam openForm)
  $("modal").querySelector(".amts").onclick = function(e){
    var b = e.target.closest(".amt"); if(!b) return;
    this.querySelectorAll(".amt").forEach(function(x){x.classList.remove("on")});
    b.classList.add("on");
    st.amt = +b.getAttribute("data-a");
    $("oth").style.display = st.amt ? "none" : "block";
  };
  $("modal").querySelector(".banks").onclick = function(e){
    var b = e.target.closest(".bank"); if(!b) return;
    this.querySelectorAll(".bank").forEach(function(x){x.classList.remove("on")});
    b.classList.add("on"); st.bank = b.getAttribute("data-b");
  };
  $("pay").onclick = submit;
}

function submit(){
  var nm = $("nm").value.trim(), hp = $("hp").value.replace(/\D/g,""),
      amt = st.amt || parseInt($("ot").value,10) || 0, er = $("er");
  if(!nm) return er.textContent = "Nama wajib diisi.";
  if(hp.length<9 || hp.length>15) return er.textContent = "Nomor HP tidak valid.";
  if(amt<10000) return er.textContent = "Nominal minimal Rp 10.000.";
  st.inv = {nm:nm, hp:hp, amt:amt, total:amt, bank:BANKS[st.bank],
          id:"WQF"+Date.now().toString().slice(-8), exp:Date.now()+12*3600*1000};
  showInvoice();
}

function showInvoice(){
  var v = st.inv, b = v.bank;
  var dl = new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Jakarta",hour12:false}).format(new Date(v.exp)).replace(/\./g,":");
  $("modal").innerHTML =
  '<button class="x" onclick="closeM()" aria-label="Tutup">×</button>'+
  '<div class="center"><div class="ok">✓</div><h3>'+v.nm.replace(/</g,"&lt;")+', checkout berhasil</h3><span class="small">Invoice '+v.id+' · '+st.prog.title+'</span></div>'+
  '<div class="cd"><span>Batas akhir<br>pembayaran</span><span class="t" id="tm">--:--:--</span></div>'+
  '<div class="small" style="text-align:right">Jatuh tempo '+dl+' WIB</div>'+
  '<div class="warn"><b>Yuk, segera selesaikan pembayaranmu.</b><br>Kami verifikasi waqaf Anda setelah pembayaran diterima, paling lambat 1×24 jam.</div>'+
  '<b>Tolong transfer ke</b>'+
  '<div class="row"><div><small>'+b.name+'</small><b>a.n '+b.an+'</b></div></div>'+
  '<div class="row"><div><small>No. rekening</small><strong>'+b.no+'</strong></div><button class="cp" data-c="'+b.no+'">Salin</button></div>'+
  '<div class="row"><div><small>Total Pembayaran</small><strong>'+rp(v.total)+'</strong></div><button class="cp" data-c="'+v.total+'">Salin</button></div>'+
  '<div class="note"><b>Penting!</b> Setelah transfer, mohon kirim bukti pembayaran melalui tombol konfirmasi WhatsApp di bawah agar waqaf Anda dapat kami verifikasi.</div>'+
  '<p class="small center">Konfirmasi pembayaran melalui halaman ini:</p>'+
  '<a id="wa" target="_blank" rel="noopener"><button class="btn wa">KONFIRMASI VIA WA</button></a>'+
  '<button class="btn ghost" onclick="closeM()">Selesai</button>';

  var msg = "Assalamu’alaikum, saya "+v.nm+" ingin konfirmasi waqaf.\nInvoice: "+v.id+"\nProgram: "+st.prog.title+"\nTotal transfer: "+rp(v.total)+"\nBank: "+b.short+"\nJazakumullahu khairan.";
  $("wa").href = "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg);
  $("modal").onclick = function(e){
    var c = e.target.getAttribute("data-c"); if(!c) return;
    var done = function(){ e.target.textContent = "Tersalin ✓"; setTimeout(function(){e.target.textContent="Salin"},1500) };
    try{ navigator.clipboard.writeText(c).then(done,done) }catch(x){ done() }
  };
  clearInterval(timer);
  var tick = function(){
    var s = Math.max(0, Math.floor((v.exp-Date.now())/1000));
    var p = function(n){return String(n).padStart(2,"0")};
    var el = $("tm"); if(el) el.textContent = p(Math.floor(s/3600))+":"+p(Math.floor(s%3600/60))+":"+p(s%60);
  };
  tick(); timer = setInterval(tick,1000);
}
