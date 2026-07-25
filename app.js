const STORAGE_KEY = "phoHandmadeAIOS4";
const today = new Date();
const iso = d => d.toISOString().slice(0,10);
const addDays = (d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmt = n => new Intl.NumberFormat("vi-VN").format(Number(n||0));
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);

const defaultData = {
  settings:{brand:"Phố Handmade",owner:"Mạnh Điệp",monthlyGoal:60},
  contents:[
    {id:uid(),title:"Câu chuyện người làm nghề",date:iso(today),time:"08:00",channel:"Mạnh Điệp",type:"Bài viết",note:"Ảnh đời thường, không bán hàng",done:false},
    {id:uid(),title:"Reel sản phẩm thủ công nổi bật",date:iso(today),time:"10:00",channel:"Fanpage",type:"Reel",note:"Video 20–35 giây",done:false},
    {id:uid(),title:"Thảo luận: tác phẩm bạn tự hào nhất",date:iso(today),time:"20:00",channel:"Group",type:"Bài viết",note:"Kêu gọi đăng ảnh dưới bình luận",done:false},
    {id:uid(),title:"Mini game vui về người bán và người mua",date:iso(addDays(today,1)),time:"20:00",channel:"Group",type:"Mini game",note:"5 câu hỏi ngắn",done:false},
    {id:uid(),title:"Hậu trường xưởng handmade",date:iso(addDays(today,2)),time:"08:00",channel:"Mạnh Điệp",type:"Story",note:"3–5 cảnh chân thực",done:false},
    {id:uid(),title:"Video kiến thức: Handmade là gì?",date:iso(addDays(today,3)),time:"19:30",channel:"TikTok",type:"Reel",note:"Mở đầu bằng câu hỏi",done:false}
  ],
  kpis:[
    {id:uid(),date:iso(addDays(today,-14)),channel:"Group",followers:7900,reach:6200,engagement:480,posts:12},
    {id:uid(),date:iso(today),channel:"Group",followers:8082,reach:7100,engagement:560,posts:14},
    {id:uid(),date:iso(addDays(today,-14)),channel:"Fanpage",followers:6950,reach:8300,engagement:690,posts:16},
    {id:uid(),date:iso(today),channel:"Fanpage",followers:7100,reach:9200,engagement:760,posts:18},
    {id:uid(),date:iso(addDays(today,-14)),channel:"Mạnh Điệp",followers:4580,reach:5400,engagement:610,posts:13},
    {id:uid(),date:iso(today),channel:"Mạnh Điệp",followers:4700,reach:5900,engagement:665,posts:15}
  ],
  library:[
    {id:uid(),title:"Khung bài kể chuyện người thợ",type:"Prompt",content:"Mở bằng một khoảnh khắc đời thường → nêu khó khăn → chi tiết về đôi tay người thợ → giá trị nhân văn → câu hỏi mời chia sẻ."},
    {id:uid(),title:"CTA kéo về Group",type:"Bài viết",content:"Bạn đang làm sản phẩm thủ công nào? Hãy tham gia Phố Handmade và đăng tác phẩm để cộng đồng cùng góp ý."}
  ]
};
let data = load();

function load(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultData)}
  catch{return structuredClone(defaultData)}
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));renderAll()}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function switchView(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(v=>v.classList.toggle("active",v.dataset.view===view));
  document.getElementById("view-"+view).classList.add("active");
  const names={dashboard:"Trung tâm điều hành",calendar:"Lịch nội dung",content:"AI Content Studio",kpi:"KPI Center",library:"Thư viện",reports:"Báo cáo",settings:"Cài đặt"};
  document.getElementById("pageTitle").textContent=names[view];
  document.getElementById("sidebar").classList.remove("open");
  setTimeout(renderCharts,80);
}
document.getElementById("todayText").textContent=today.toLocaleDateString("vi-VN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>switchView(b.dataset.go));
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");

function latestByChannel(){
  const map={};
  [...data.kpis].sort((a,b)=>a.date.localeCompare(b.date)).forEach(k=>map[k.channel]=k);
  return map;
}
function stats(){
  const latest=latestByChannel();
  const followers=Object.values(latest).reduce((s,k)=>s+Number(k.followers),0);
  const nowMonth=iso(today).slice(0,7);
  const monthItems=data.contents.filter(x=>x.date.startsWith(nowMonth));
  const done=monthItems.filter(x=>x.done).length;
  const todayItems=data.contents.filter(x=>x.date===iso(today));
  return {followers,done,total:monthItems.length,todayTotal:todayItems.length,todayDone:todayItems.filter(x=>x.done).length};
}
function renderStats(){
  const s=stats(), completion=s.total?Math.round(s.done/s.total*100):0;
  document.getElementById("weeklyProgressHero").textContent=completion+"%";
  const cards=[
    ["Tổng cộng đồng",fmt(s.followers),"Follower/thành viên mới nhất"],
    ["Nội dung tháng",`${s.done}/${s.total}`,"Đã hoàn thành"],
    ["Hôm nay",`${s.todayDone}/${s.todayTotal}`,"Nhiệm vụ hoàn thành"],
    ["Mục tiêu tháng",`${s.done}/${data.settings.monthlyGoal}`,"Bài đã thực hiện"]
  ];
  document.getElementById("statsGrid").innerHTML=cards.map(c=>`<div class="stat-card"><span class="label">${c[0]}</span><strong>${c[1]}</strong><small>${c[2]}</small></div>`).join("");
  document.getElementById("kpiSummary").innerHTML=[
    ["Kênh đang theo dõi",Object.keys(latestByChannel()).length,"Kênh"],
    ["Tổng tiếp cận",fmt(Object.values(latestByChannel()).reduce((s,k)=>s+Number(k.reach),0)),"Kỳ nhập gần nhất"],
    ["Tổng tương tác",fmt(Object.values(latestByChannel()).reduce((s,k)=>s+Number(k.engagement),0)),"Kỳ nhập gần nhất"],
    ["Tổng bài đăng",fmt(Object.values(latestByChannel()).reduce((s,k)=>s+Number(k.posts),0)),"Kỳ nhập gần nhất"]
  ].map(c=>`<div class="stat-card"><span class="label">${c[0]}</span><strong>${c[1]}</strong><small>${c[2]}</small></div>`).join("");
}
function renderTodayTasks(){
  const items=data.contents.filter(x=>x.date===iso(today)).sort((a,b)=>a.time.localeCompare(b.time));
  document.getElementById("todayTasks").innerHTML=items.length?items.map(x=>`<label class="task ${x.done?"done":""}"><input type="checkbox" ${x.done?"checked":""} onchange="toggleContent('${x.id}')"><div><b>${x.title}</b><div><span class="tag">${x.channel}</span> <span class="tag">${x.type}</span></div></div><span class="task-meta">${x.time}</span></label>`).join(""):`<div class="empty">Chưa có nội dung nào hôm nay.</div>`;
}
window.toggleContent=id=>{const x=data.contents.find(x=>x.id===id);if(x){x.done=!x.done;save()}};
window.deleteContent=id=>{if(confirm("Xóa lịch nội dung này?")){data.contents=data.contents.filter(x=>x.id!==id);save()}};
window.deleteKpi=id=>{if(confirm("Xóa dữ liệu KPI này?")){data.kpis=data.kpis.filter(x=>x.id!==id);save()}};
window.deleteLibrary=id=>{if(confirm("Xóa tài nguyên này?")){data.library=data.library.filter(x=>x.id!==id);save()}};

function mondayOf(date){const d=new Date(date),day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);d.setHours(0,0,0,0);return d}
function renderCalendar(){
  const filter=document.getElementById("calendarChannelFilter").value;
  const start=mondayOf(today);
  const days=[...Array(7)].map((_,i)=>addDays(start,i));
  document.getElementById("calendarGrid").innerHTML=days.map(d=>{
    const di=iso(d);
    const items=data.contents.filter(x=>x.date===di&&(filter==="all"||x.channel===filter)).sort((a,b)=>a.time.localeCompare(b.time));
    return `<div class="day-column"><div class="day-head"><b>${d.toLocaleDateString("vi-VN",{weekday:"short"})}</b><span>${d.toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit"})}</span></div><div class="day-items">${items.length?items.map(x=>`<div class="calendar-item ${x.done?"done":""}"><div class="row"><b>${x.time} · ${x.title}</b><button onclick="deleteContent('${x.id}')">×</button></div><div><span class="tag">${x.channel}</span> <span class="tag">${x.type}</span></div><label style="display:flex;grid-template-columns:auto 1fr;align-items:center;margin-top:7px"><input style="width:auto" type="checkbox" ${x.done?"checked":""} onchange="toggleContent('${x.id}')"> Hoàn thành</label></div>`).join(""):`<div class="empty">Trống</div>`}</div></div>`
  }).join("");
}
document.getElementById("calendarChannelFilter").onchange=renderCalendar;

function renderKpis(){
  const rows=[...data.kpis].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById("kpiTableBody").innerHTML=rows.map(k=>`<tr><td>${new Date(k.date+"T00:00").toLocaleDateString("vi-VN")}</td><td>${k.channel}</td><td>${fmt(k.followers)}</td><td>${fmt(k.reach)}</td><td>${fmt(k.engagement)}</td><td>${fmt(k.posts)}</td><td><button class="text-btn" onclick="deleteKpi('${k.id}')">Xóa</button></td></tr>`).join("");
}
function renderLibrary(){
  document.getElementById("libraryGrid").innerHTML=data.library.length?data.library.map(x=>`<div class="library-card"><span class="type">${x.type.toUpperCase()}</span><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.content)}</p><div class="actions"><button class="text-btn" onclick="navigator.clipboard.writeText(${JSON.stringify(x.content)});toast('Đã sao chép')">Sao chép</button><button class="text-btn" onclick="deleteLibrary('${x.id}')">Xóa</button></div></div>`).join(""):`<div class="empty">Chưa có tài nguyên.</div>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderAdvice(){
  const latest=latestByChannel(), arr=Object.values(latest);
  const advice=[];
  if(data.contents.filter(x=>x.date===iso(today)).length<3) advice.push("Hôm nay đang có ít hơn 3 nội dung. Nên bổ sung ít nhất một Story hoặc Reel ngắn.");
  const best=arr.sort((a,b)=>(b.engagement/(b.reach||1))-(a.engagement/(a.reach||1)))[0];
  if(best) advice.push(`${best.channel} đang có tỷ lệ tương tác tốt nhất. Hãy tái sử dụng chủ đề hiệu quả của kênh này, nhưng đổi cách kể cho từng nền tảng.`);
  const group=data.contents.filter(x=>x.channel==="Group").length, page=data.contents.filter(x=>x.channel==="Fanpage").length;
  if(Math.abs(group-page)>3) advice.push("Lịch Group và Fanpage đang lệch khá nhiều. Giữ Fanpage làm kênh thu hút, Group làm nơi thảo luận và giữ thành viên.");
  advice.push("Mỗi tuần nên có ít nhất: 2 Reel, 2 bài thảo luận Group, 1 bài hậu trường cá nhân và 1 nội dung vinh danh thành viên.");
  document.getElementById("expertAdvice").innerHTML=advice.map(x=>`<div class="advice-item">${x}</div>`).join("");
}
document.getElementById("refreshAdvice").onclick=()=>{renderAdvice();toast("Đã cập nhật gợi ý")};

function lineChart(canvasId, labels, series, opts={}){
  const c=document.getElementById(canvasId);if(!c)return;const rect=c.getBoundingClientRect();const ratio=devicePixelRatio||1;c.width=Math.max(300,rect.width)*ratio;c.height=(opts.height||240)*ratio;const ctx=c.getContext("2d");ctx.scale(ratio,ratio);
  const w=c.width/ratio,h=c.height/ratio,p={l:45,r:20,t:25,b:42};ctx.clearRect(0,0,w,h);
  const vals=series.flatMap(s=>s.values),max=Math.max(1,...vals)*1.12;
  ctx.strokeStyle="#e5e8e4";ctx.lineWidth=1;ctx.fillStyle="#6d746e";ctx.font="11px sans-serif";
  for(let i=0;i<=4;i++){const y=p.t+(h-p.t-p.b)*i/4;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();ctx.fillText(fmt(Math.round(max*(4-i)/4)),4,y+4)}
  const step=labels.length>1?(w-p.l-p.r)/(labels.length-1):0;
  labels.forEach((l,i)=>ctx.fillText(l,p.l+i*step-10,h-15));
  const colors=["#153f2e","#c9a45c","#5d7f9c","#955c5c","#765c95"];
  series.forEach((s,si)=>{ctx.strokeStyle=colors[si%colors.length];ctx.lineWidth=2.5;ctx.beginPath();s.values.forEach((v,i)=>{const x=p.l+i*step,y=p.t+(h-p.t-p.b)*(1-v/max);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();s.values.forEach((v,i)=>{const x=p.l+i*step,y=p.t+(h-p.t-p.b)*(1-v/max);ctx.fillStyle=colors[si%colors.length];ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fill()})});
}
function barChart(canvasId, labels, values){
  const c=document.getElementById(canvasId);if(!c)return;const rect=c.getBoundingClientRect();const ratio=devicePixelRatio||1;c.width=Math.max(300,rect.width)*ratio;c.height=260*ratio;const ctx=c.getContext("2d");ctx.scale(ratio,ratio);const w=c.width/ratio,h=260,p={l:45,r:20,t:25,b:55};ctx.clearRect(0,0,w,h);
  const max=Math.max(1,...values)*1.15;ctx.strokeStyle="#e5e8e4";ctx.fillStyle="#6d746e";ctx.font="11px sans-serif";
  for(let i=0;i<=4;i++){const y=p.t+(h-p.t-p.b)*i/4;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();ctx.fillText(fmt(Math.round(max*(4-i)/4)),4,y+4)}
  const slot=(w-p.l-p.r)/Math.max(labels.length,1),bw=Math.min(50,slot*.55);
  labels.forEach((l,i)=>{const x=p.l+i*slot+(slot-bw)/2,v=values[i],bh=(h-p.t-p.b)*v/max,y=h-p.b-bh;ctx.fillStyle="#235c42";ctx.beginPath();ctx.roundRect(x,y,bw,bh,6);ctx.fill();ctx.fillStyle="#6d746e";ctx.fillText(l,x,h-24)});
}
function renderCharts(){
  const labels=[...Array(7)].map((_,i)=>addDays(mondayOf(today),i).toLocaleDateString("vi-VN",{weekday:"short"}));
  const vals=[...Array(7)].map((_,i)=>data.contents.filter(x=>x.date===iso(addDays(mondayOf(today),i))&&x.done).length);
  lineChart("weeklyChart",labels,[{values:vals}]);
  const channels=[...new Set(data.kpis.map(k=>k.channel))];
  const dates=[...new Set(data.kpis.map(k=>k.date))].sort().slice(-6);
  const series=channels.map(ch=>({values:dates.map(d=>{const candidates=data.kpis.filter(k=>k.channel===ch&&k.date<=d).sort((a,b)=>b.date.localeCompare(a.date));return candidates[0]?.followers||0})}));
  lineChart("growthChart",dates.map(d=>new Date(d+"T00:00").toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit"})),series,{height:260});
  const latest=latestByChannel();barChart("engagementChart",Object.keys(latest),Object.values(latest).map(k=>k.engagement));
}
function renderAll(){renderStats();renderTodayTasks();renderCalendar();renderKpis();renderLibrary();renderAdvice();renderCharts();syncSettings()}
function syncSettings(){document.getElementById("settingBrand").value=data.settings.brand;document.getElementById("settingOwner").value=data.settings.owner;document.getElementById("settingMonthlyGoal").value=data.settings.monthlyGoal}

const contentDialog=document.getElementById("contentDialog");
function openContent(){document.getElementById("contentDate").value=iso(today);contentDialog.showModal()}
document.getElementById("addContentBtn").onclick=openContent;document.getElementById("quickAddBtn").onclick=openContent;
document.getElementById("saveContentBtn").onclick=e=>{e.preventDefault();const title=document.getElementById("contentTitle").value.trim();if(!title)return;data.contents.push({id:uid(),title,date:document.getElementById("contentDate").value,time:document.getElementById("contentTime").value,channel:document.getElementById("contentChannel").value,type:document.getElementById("contentType").value,note:document.getElementById("contentNote").value,done:false});document.getElementById("contentForm").reset();contentDialog.close();save();toast("Đã thêm lịch nội dung")};

const kpiDialog=document.getElementById("kpiDialog");
document.getElementById("addKpiBtn").onclick=()=>{document.getElementById("kpiDate").value=iso(today);kpiDialog.showModal()};
document.getElementById("saveKpiBtn").onclick=e=>{e.preventDefault();data.kpis.push({id:uid(),date:document.getElementById("kpiDate").value,channel:document.getElementById("kpiChannel").value,followers:+document.getElementById("kpiFollowers").value,reach:+document.getElementById("kpiReach").value,engagement:+document.getElementById("kpiEngagement").value,posts:+document.getElementById("kpiPosts").value});kpiDialog.close();save();toast("Đã lưu KPI")};

const libraryDialog=document.getElementById("libraryDialog");
document.getElementById("addLibraryBtn").onclick=()=>libraryDialog.showModal();
document.getElementById("saveLibraryBtn").onclick=e=>{e.preventDefault();data.library.push({id:uid(),title:document.getElementById("libraryTitle").value,type:document.getElementById("libraryType").value,content:document.getElementById("libraryContent").value});libraryDialog.close();save();toast("Đã lưu tài nguyên")};

function buildPrompt(){
  return `Bạn là chuyên gia nội dung cho hệ sinh thái Phố Handmade.
Chủ đề: ${document.getElementById("aiTopic").value}
Kênh: ${document.getElementById("aiChannel").value}
Mục tiêu: ${document.getElementById("aiGoal").value}
Giọng văn: ${document.getElementById("aiTone").value}
Yêu cầu thêm: ${document.getElementById("aiExtra").value}
Hãy viết bằng tiếng Việt, dễ đọc trên điện thoại, có tiêu đề mạnh, nội dung nhân văn, CTA phù hợp và 5 hashtag trong đó có #PhoHandmade.`;
}
document.getElementById("templateGenerateBtn").onclick=()=>{
  const topic=document.getElementById("aiTopic").value.trim()||"một sản phẩm thủ công";
  const channel=document.getElementById("aiChannel").value,goal=document.getElementById("aiGoal").value;
  document.getElementById("aiOutput").value=`𝐌Ỗ𝐈 𝐒Ả𝐍 𝐏𝐇Ẩ𝐌 ĐỀ𝐔 𝐂Ó 𝐌Ộ𝐓 𝐂Â𝐔 𝐂𝐇𝐔𝐘Ệ𝐍\n\n${topic} không chỉ được tạo nên từ vật liệu, mà còn từ thời gian, sự kiên nhẫn và đôi tay của người làm nghề.\n\nHôm nay, ${channel} muốn mời mọi người cùng nhìn lại giá trị phía sau từng chi tiết nhỏ: sự cẩn trọng, sáng tạo và niềm vui khi một ý tưởng trở thành sản phẩm thật.\n\n${goal}. Bạn đang yêu thích hoặc thực hiện sản phẩm handmade nào? Hãy chia sẻ dưới phần bình luận để cộng đồng cùng giao lưu.\n\n#PhoHandmade #HandmadeVietNam #ThuCongViet #SongCungSangTao #CongDongHandmade`;
  toast("Đã tạo bản miễn phí");
};
document.getElementById("aiGenerateBtn").onclick=async()=>{
  const btn=document.getElementById("aiGenerateBtn"),out=document.getElementById("aiOutput");btn.disabled=true;btn.textContent="Đang tạo...";
  try{const r=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:buildPrompt()})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Không thể kết nối AI");out.value=j.text;toast("AI đã tạo nội dung")}
  catch(e){toast(e.message+" — dùng bản miễn phí nếu chưa cấu hình API")}
  finally{btn.disabled=false;btn.textContent="✨ Tạo bằng AI"}
};
document.getElementById("copyOutputBtn").onclick=()=>navigator.clipboard.writeText(document.getElementById("aiOutput").value).then(()=>toast("Đã sao chép"));
document.getElementById("saveOutputBtn").onclick=()=>{const content=document.getElementById("aiOutput").value.trim();if(!content)return toast("Chưa có nội dung");data.library.push({id:uid(),title:document.getElementById("aiTopic").value||"Nội dung AI",type:"Bài viết",content});save();toast("Đã lưu vào thư viện")};

function download(name,text,type="application/json"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function backup(){download(`pho-handmade-ai-os-backup-${iso(today)}.json`,JSON.stringify(data,null,2))}
document.getElementById("exportBtn").onclick=backup;document.getElementById("backupBtn").onclick=backup;
document.getElementById("restoreInput").onchange=async e=>{try{const obj=JSON.parse(await e.target.files[0].text());if(!obj.contents||!obj.kpis)throw new Error();data=obj;save();toast("Khôi phục thành công")}catch{toast("File sao lưu không hợp lệ")}};
document.getElementById("downloadKpiCsv").onclick=()=>{const head=["Ngày","Kênh","Follower/Thành viên","Tiếp cận","Tương tác","Bài đăng"];const rows=data.kpis.map(k=>[k.date,k.channel,k.followers,k.reach,k.engagement,k.posts]);download("pho-handmade-kpi.csv","\ufeff"+[head,...rows].map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\n"),"text/csv;charset=utf-8")};
document.getElementById("printReportBtn").onclick=()=>{switchView("dashboard");setTimeout(()=>window.print(),250)};
document.getElementById("saveSettingsBtn").onclick=()=>{data.settings={brand:document.getElementById("settingBrand").value,owner:document.getElementById("settingOwner").value,monthlyGoal:+document.getElementById("settingMonthlyGoal").value};save();toast("Đã lưu cài đặt")};
document.getElementById("resetDataBtn").onclick=()=>{if(confirm("Bạn chắc chắn muốn đặt lại toàn bộ dữ liệu?")){data=structuredClone(defaultData);save();toast("Đã đặt lại hệ thống")}};

window.addEventListener("resize",()=>setTimeout(renderCharts,100));
renderAll();
