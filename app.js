const KEY="homecare_tasks_v1";
const defaults=[
{id:1,name:"Sweep & mop living room",category:"today",repeat:"daily",person:"",done:false},
{id:2,name:"Clean bathroom",category:"weekly",repeat:"weekly",person:"",done:false},
{id:3,name:"Change bed sheets",category:"weekly",repeat:"weekly",person:"",done:false},
{id:4,name:"Deep clean kitchen",category:"monthly",repeat:"monthly",person:"",done:false},
{id:5,name:"Water garden plants",category:"garden",repeat:"daily",person:"",done:false},
{id:6,name:"Check taps & leaks",category:"maintenance",repeat:"monthly",person:"",done:false}
];
let tasks=JSON.parse(localStorage.getItem(KEY)||"null")||defaults;
let filter="all";
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(tasks))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const list=$("taskList");
 const visible=tasks.filter(t=>filter==="all"||filter==="today"&&t.category==="today"||filter===t.category);
 list.innerHTML=visible.length?visible.map(t=>`<article class="task ${t.done?"done":""}">
 <button class="check" aria-label="Complete task" onclick="toggleTask(${t.id})"></button>
 <div class="task-main"><div class="name">${esc(t.name)}</div>
 <div class="meta">${t.repeat==="daily"?"Every day":t.repeat==="weekly"?"Every week":t.repeat==="monthly"?"Every month":"One time"}${t.person?" · "+esc(t.person):""}</div></div>
 <span class="tag">${t.category}</span><button class="delete" onclick="removeTask(${t.id})">×</button></article>`).join("")
 :" <div class='task'><div class='task-main'><div class='name'>No tasks here</div><div class='meta'>Add a task to start your home routine.</div></div></div>";
 const done=tasks.filter(t=>t.done).length,total=tasks.length,pct=total?Math.round(done/total*100):0;
 $("progressText").textContent=pct+"%";$("progressBar").style.width=pct+"%";
}
window.toggleTask=id=>{const t=tasks.find(x=>x.id===id);if(t){t.done=!t.done;save();render()}}
window.removeTask=id=>{tasks=tasks.filter(t=>t.id!==id);save();render()}
document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{
 document.querySelector(".filters .active").classList.remove("active");b.classList.add("active");filter=b.dataset.filter;render()
});
$("addBtn").onclick=()=>$("taskDialog").showModal();
$("cancelBtn").onclick=()=>$("taskDialog").close();
$("taskForm").onsubmit=e=>{
 e.preventDefault();
 tasks.push({id:Date.now(),name:$("taskName").value.trim(),category:$("taskCategory").value,repeat:$("taskRepeat").value,person:$("taskPerson").value.trim(),done:false});
 save();e.target.reset();$("taskDialog").close();render()
};
const now=new Date();
$("dateText").textContent=now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
$("greeting").textContent=(now.getHours()<12?"Good morning":now.getHours()<18?"Good afternoon":"Good evening")+" 👋";
const tips=["Clean from top to bottom so dust falls onto surfaces you have not cleaned yet.","Keep a small basket for items that belong in other rooms.","Water garden plants early in the morning or later in the evening when practical.","A 10-minute daily reset can reduce the need for a long weekend cleanup."];
$("tip").textContent=tips[now.getDate()%tips.length];
render();