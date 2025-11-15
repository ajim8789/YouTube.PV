/* ---------- THEME TOGGLE ---------- */
function toggleTheme(){
    document.body.classList.toggle("light-mode");
}

/* ---------- DRAG & DROP ---------- */
let dropZone = document.getElementById("dropZone");

dropZone.ondragover = (e)=>{ e.preventDefault(); dropZone.style.borderColor="red"; };
dropZone.ondragleave = ()=> dropZone.style.borderColor="#555";
dropZone.ondrop = (e)=>{
    e.preventDefault();
    dropZone.style.borderColor="#555";
    const text = e.dataTransfer.getData("text");
    document.getElementById("videoUrl").value = text.trim();
    loadPreview();
};

/* ---------- ENTER KEY to submit ---------- */
document.getElementById("videoUrl").addEventListener("keydown", (e)=>{
    if(e.key==="Enter") loadPreview();
});

/* ---------- EXTRACT VIDEO ID ---------- */
function extractID(url){
    const pattern = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

/* ---------- LOAD PREVIEW ---------- */
async function loadPreview(){
    let url = document.getElementById("videoUrl").value.trim();

    // Playlist → extract first video
    if(url.includes("list=")){
        let id = extractID(url);
        url = "https://www.youtube.com/watch?v=" + id;
    }

    let videoId = extractID(url);
    if(!videoId){
        alert("❌ Invalid YouTube URL");
        return;
    }

    document.getElementById("loading").style.display="block";

    try{
        let response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );
        let data = await response.json();
        console.log(data);

    }catch(err){
        console.log(err);
    }

    document.getElementById("player").src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

    document.getElementById("preview").classList.remove("hidden");
    document.getElementById("loading").style.display="none";
}

/* ---------- AUTO PASTE DETECT ---------- */
document.getElementById("videoUrl").addEventListener("paste", ()=>{
    setTimeout(()=> loadPreview(), 200);
});
