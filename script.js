function loadImage(event) {
    const cardArt = document.getElementById('cardArt');
    const artPlaceholder = document.getElementById('artPlaceholder');
    if (event.target.files && event.target.files[0]) {
        cardArt.src = URL.createObjectURL(event.target.files[0]);
        cardArt.classList.remove('hidden');
        artPlaceholder.classList.add('hidden');
    }
}

const iconImages = {
    "Fire": "fire.png", "Water": "water.png", "Earth": "earth.png", "Wind": "wind.png", "Light": "light.png", "Dark": "dark.png",
    "normal": "normal_spell.png", "equip": "equip.png", "counter": "counter.png", "field": "field.png",
    "normal_life": "normal_life.png", "power": "power.png", "defense": "defense.png", "resources": "resources.png", "Destruction": "destruction.png", "recovery": "recovery.png",
    "token": "token.png"
};

function applyRightCircleIcon(value) {
    const iconImg = document.getElementById('rightCircleIcon');
    const circleText = document.getElementById('rightCircleText');

    if (iconImages[value]) {
        iconImg.src = iconImages[value];
        iconImg.classList.remove('hidden');
        circleText.classList.add('hidden');
    } else {
        iconImg.classList.add('hidden');
        circleText.innerText = value;
        circleText.classList.remove('hidden');
    }
}

function formatEffectText(text) {
    if (!text) return "";

    let formatted = text;

    // หมวดที่ 1: ประเภทความสามารถ
    formatted = formatted.replace(/\[ACT\]/gi, '<span class="keyword-badge badge-act">[ACT]</span>');
    formatted = formatted.replace(/\[Auto\]/gi, '<span class="keyword-badge badge-auto">[Auto]</span>');
    formatted = formatted.replace(/\[Counter\]/gi, '<span class="keyword-badge badge-counter">[Counter]</span>');
    formatted = formatted.replace(/\[Ongoing\]/gi, '<span class="keyword-badge badge-ongoing">[Ongoing]</span>');

    // หมวดที่ 2: ไฮไลท์ / ระบบเปลี่ยนร่าง
    const mechanicsKeywords = ["Final Regret", "Build Up", "Henshin", "Ride On", "Dragon origin"];
    mechanicsKeywords.forEach(kw => {
        const regex = new RegExp(`\\[${kw.replace(/ /g, '\\s?')}\\]`, 'gi');
        formatted = formatted.replace(regex, `<span class="keyword-badge badge-mech">[${kw}]</span>`);
    });
    formatted = formatted.replace(/\[Evo\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-mech">Evo [$1]</span>');
    formatted = formatted.replace(/\[Evolution\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-mech">Evolution [$1]</span>');

    // หมวดที่ 3: สถานะ / เอฟเฟกต์ติดตัว
    const statusKeywords = ["Wandering", "Last Wish"];
    statusKeywords.forEach(kw => {
        const regex = new RegExp(`\\[${kw.replace(/ /g, '\\s?')}\\]`, 'gi');
        formatted = formatted.replace(regex, `<span class="keyword-badge badge-status">[${kw}]</span>`);
    });
    formatted = formatted.replace(/\[Poison\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-status">Poison [$1]</span>');
    formatted = formatted.replace(/\[Death Mark\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-status">Death Mark [$1]</span>');

    // หมวดที่ 4: การต่อสู้ / ปะทะ
    const combatKeywords = ["Penetrate", "Soulguard", "Taunt", "Counter attack", "Double Attack", "Follow Attack", "Phantom Strike"];
    combatKeywords.forEach(kw => {
        const regex = new RegExp(`\\[${kw.replace(/ /g, '\\s?')}\\]`, 'gi');
        formatted = formatted.replace(regex, `<span class="keyword-badge badge-combat">[${kw}]</span>`);
    });

    // หมวดที่ 5: ข้อจำกัดรอบการใช้งาน
    formatted = formatted.replace(/\[(\d+(?:An)?\/Turn)\]/gi, '<span class="keyword-badge badge-limit">[$1]</span>');

    // หมวดที่ 6: สัญลักษณ์การ์ดและทรัพยากร
    const iconKeys = ["LB", "U", "S", "T", "C", "E", "SE"];
    iconKeys.forEach(key => {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        formatted = formatted.replace(regex, `<span class="badge-icon">${key}</span>`);
    });

    return formatted;
}

// ย่อขนาดฟอนต์อัตโนมัติหากข้อความล้นกล่อง
function autoFitEffectText() {
    const content = document.getElementById('cardEffectText');
    if (!content) return;
    const container = content.parentElement;
    if (!container) return;

    let fontSize = 11;
    content.style.fontSize = fontSize + 'px';

    while (content.scrollHeight > container.clientHeight && fontSize > 8) {
        fontSize -= 0.5;
        content.style.fontSize = fontSize + 'px';
    }
}

function switchCardType() {
    const type = document.getElementById('cardTypeSelect').value;
    const fields = document.getElementById('dynamicFields');
    const leftCircle = document.getElementById('leftCircle');
    
    let htmlForm = '';

    if (type === 'likit') {
        leftCircle.style.visibility = 'hidden';
        htmlForm = `
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-xs font-medium text-gray-300">Element (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" onchange="updateCard()">
                        <option value="Fire">Fire</option><option value="Wind">Wind</option><option value="Water">Water</option><option value="Earth">Earth</option><option value="Light">Light</option><option value="Dark">Dark</option>
                    </select>
                </div>
                <div><label class="text-xs font-medium text-gray-300">Archetype / Subtype</label><input type="text" id="fieldSubtype" value="Adventure" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div><label class="text-xs font-medium text-gray-300">Normal Life (Na)</label><input type="number" id="fieldLifeNa" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
                <div><label class="text-xs font-medium text-gray-300">Special Life (SL)</label><input type="number" id="fieldSL" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-20 rounded" oninput="updateCard()">[Ongoing] ในเทิร์นของคุณ: ยูนิตทั้งหมดใน Unit Zone ของคุณได้รับ +1/+0 ต่อจำนวน Life ที่หงายอยู่ของคุณทุกๆ 2 ใบ
[ACT] [1/Turn] สร้างความเสียหายแก่ Life ของคุณ 1 หน่วย: ในเทิร์นนี้คุณจะไม่แพ้เกม และเมื่อจบเทิร์น ฟื้นฟู Normal Life ของคุณ 1 ใบ (เปลี่ยน Normal Life ที่หงายอยู่ 1 ใบเป็นคว่ำ)</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Gears spinning with wind..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded" oninput="updateCard()"></div>
        `;
    }
    else if (type === 'unit') {
        leftCircle.style.visibility = 'visible';
        htmlForm = `
            <div class="grid grid-cols-3 gap-2">
                <div><label class="text-xs font-medium text-gray-300">Cost</label><input type="text" id="fieldCost" value="6" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
                <div><label class="text-xs font-medium text-gray-300">Race / Class</label><input type="text" id="fieldType" value="Knight" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
                <div>
                    <label class="text-xs font-medium text-gray-300">Element (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" onchange="updateCard()">
                        <option value="Fire">Fire</option><option value="Water">Water</option><option value="Earth">Earth</option><option value="Wind">Wind</option><option value="Light">Light</option><option value="Dark">Dark</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div><label class="text-xs font-medium text-gray-300">ATK</label><input type="number" id="fieldAtk" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
                <div><label class="text-xs font-medium text-gray-300">DEF</label><input type="number" id="fieldDef" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded" oninput="updateCard()">[Penetrate]
(When Attack) Gains ATK +1 for each other unit you control.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Ash is a knight of the Gray Lion..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded" oninput="updateCard()"></div>
        `;
    } 
    else if (type === 'spell') {
        leftCircle.style.visibility = 'visible';
        htmlForm = `
            <div class="grid grid-cols-3 gap-2">
                <div><label class="text-xs font-medium text-gray-300">Cost</label><input type="text" id="fieldCost" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
                <div>
                    <label class="text-xs font-medium text-gray-300">Spell Type (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" onchange="updateCard()">
                        <option value="counter">counter</option><option value="normal">normal</option><option value="equip">equip</option><option value="field">field</option>
                    </select>
                </div>
                <div><label class="text-xs font-medium text-gray-300">Element</label><input type="text" id="fieldElement" value="Wind" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded" oninput="updateCard()">When opponent unit attacks: Destroy that unit if its DEF is 3 or less.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="High-pressure steam bullet..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded" oninput="updateCard()"></div>
        `;
    }
    else if (type === 'life') {
        leftCircle.style.visibility = 'hidden';
        htmlForm = `
            <div>
                <label class="text-xs font-medium text-gray-300">Life Category (Top-Right)</label>
                <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-2 text-sm rounded" onchange="updateCard()">
                    <option value="power">power</option><option value="normal_life">normal</option><option value="defense">defense</option><option value="resources">resources</option><option value="Destruction">Destruction</option><option value="recovery">recovery</option>
                </select>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded" oninput="updateCard()">When revealed: Draw 1 card on your next Start Phase.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Emergency food in times of need..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded" oninput="updateCard()"></div>
        `;
    }
    else if (type === 'token') {
        leftCircle.style.visibility = 'hidden';
        htmlForm = `
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-xs font-medium text-gray-300">Token Type (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" onchange="updateCard()">
                        <option value="token">token</option>
                    </select>
                </div>
                <div><label class="text-xs font-medium text-gray-300">Subtype</label><input type="text" id="fieldSubtype" value="Resource Token" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded" oninput="updateCard()">Used as cost for Steam or Build Up skills.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Essential gear material..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded" oninput="updateCard()"></div>
        `;
    }

    fields.innerHTML = htmlForm;
    updateCard();
}

function updateCard() {
    const type = document.getElementById('cardTypeSelect').value;
    const cardID = document.getElementById('inputCardID').value || "ATH-000";
    const name = document.getElementById('inputName').value || "Card Name";
    const creator = document.getElementById('inputCreator').value || "Unknown";

    document.getElementById('cardNameDisplay').innerText = name;
    document.getElementById('displayCardID').innerText = cardID;
    document.getElementById('displayCreator').innerText = `Illust: ${creator}`;
    
    const leftCircle = document.getElementById('leftCircle');
    const cardTypeText = document.getElementById('cardTypeText');
    const cardEffectText = document.getElementById('cardEffectText');
    const cardFlavorText = document.getElementById('cardFlavorText');
    const bottomStatusArea = document.getElementById('bottomStatusArea');
    
    const rightValue = document.getElementById('rightCircleValue').value;
    applyRightCircleIcon(rightValue);

    const effectInput = document.getElementById('fieldEffect')?.value || "";
    const flavorInput = document.getElementById('fieldFlavor')?.value || "";
    
    cardEffectText.innerHTML = formatEffectText(effectInput);
    cardFlavorText.innerText = flavorInput ? `"${flavorInput}"` : "";

    if (type === 'unit') {
        const cost = document.getElementById('fieldCost').value;
        const cType = document.getElementById('fieldType').value;
        const atk = document.getElementById('fieldAtk').value || 0;
        const def = document.getElementById('fieldDef').value || 0;

        leftCircle.innerText = cost;
        cardTypeText.innerText = `Unit / ${cType} / ${rightValue}`;

        bottomStatusArea.innerHTML = `
            <div class="w-full flex h-6 font-bold text-xs text-white shadow rounded overflow-hidden">
                <div class="w-1/2 bg-red-600 flex items-center justify-center space-x-1">
                    <span>⚔️ ATK:</span><span>${atk}</span>
                </div>
                <div class="w-1/2 bg-blue-600 flex items-center justify-center space-x-1">
                    <span>🛡️ DEF:</span><span>${def}</span>
                </div>
            </div>
        `;
    }
    else if (type === 'spell') {
        const cost = document.getElementById('fieldCost').value;
        const spElem = document.getElementById('fieldElement').value;

        leftCircle.innerText = cost;
        cardTypeText.innerText = `Spell / ${rightValue} / ${spElem}`;
        bottomStatusArea.innerHTML = '';
    }
    else if (type === 'likit') {
        const sub = document.getElementById('fieldSubtype').value;
        const na = parseInt(document.getElementById('fieldLifeNa').value) || 0;
        const sl = parseInt(document.getElementById('fieldSL').value) || 0;
        const totalLife = na + sl;

        cardTypeText.innerText = `Likit Bearer / ${sub} / ${rightValue}`;

        bottomStatusArea.innerHTML = `
            <div class="w-full flex h-5 text-[10px] font-bold text-slate-900 overflow-hidden border border-zinc-400 rounded">
                <div class="w-1/3 bg-lime-400 flex items-center justify-center">Life: ${totalLife}</div>
                <div class="w-1/3 bg-gray-100 flex items-center justify-center border-x border-zinc-400">Na: ${na}</div>
                <div class="w-1/3 bg-amber-600 text-white flex items-center justify-center">SL: ${sl}</div>
            </div>
        `;
    }
    else if (type === 'life') {
        const displayLifeName = rightValue === 'normal_life' ? 'normal Life' : `${rightValue} Life`;
        cardTypeText.innerText = `(${displayLifeName})`;
        bottomStatusArea.innerHTML = '';
    }
    else if (type === 'token') {
        const sub = document.getElementById('fieldSubtype').value;

        cardTypeText.innerText = `Token / (${rightValue}) / ${sub}`;
        bottomStatusArea.innerHTML = '';
    }

    autoFitEffectText();
}

function downloadCard() {
    const area = document.getElementById('cardCaptureArea');
    const cardName = document.getElementById('inputName').value || 'card-output';
    
    html2canvas(area, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${cardName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const cardsData = XLSX.utils.sheet_to_json(worksheet);

        generateDeckFromData(cardsData);
    };

    reader.readAsArrayBuffer(file);
}

function generateDeckFromData(cardsArray) {
    const container = document.getElementById('deckGridContainer');
    const cardCountSpan = document.getElementById('cardCount');
    
    container.innerHTML = '';
    cardCountSpan.innerText = cardsArray.length;

    cardsArray.forEach((card, index) => {
        const cardID = card.Card_ID || card.Token_ID || `ATH-${index + 1}`;
        const name = card.Name || "Unknown Card";
        const typeText = card.Type_Text || "Unit / Neutral";
        const cost = card.Cost !== undefined ? card.Cost : "";
        const atk = card.ATK !== undefined ? card.ATK : 0;
        const def = card.DEF !== undefined ? card.DEF : 0;
        const effectText = formatEffectText(card.Effect_Text || "");
        const flavorText = card.Flavor_Text ? `"${card.Flavor_Text}"` : "";
        const creator = card.Art_Creator || "Studio ATH";
        const imageSrc = card.Art_Image_URL || "placeholder.png";

        const cardElement = document.createElement('div');
        cardElement.className = "card-preview border border-gray-300 shadow-2xl flex flex-col justify-between p-3.5 text-slate-900 relative bg-white rounded-lg";
        
        cardElement.innerHTML = `
            <div class="flex justify-between items-start h-10 relative z-10 shrink-0">
                <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                    ${cost}
                </div>
            </div>

            <div class="card-art-container my-1.5 bg-sky-50 rounded border border-gray-300 overflow-hidden relative flex items-center justify-center shrink-0">
                <img src="${imageSrc}" class="w-full h-full object-cover" onerror="this.style.display='none'">
            </div>

            <div class="card-effect-box bg-amber-50 p-2 rounded border border-amber-200 flex flex-col justify-between shadow-inner relative overflow-hidden shrink-0">
                <div class="flex-1 flex flex-col overflow-hidden">
                    <div class="font-bold text-[11px] text-amber-900 border-b border-amber-300 pb-0.5 mb-1 truncate">${typeText}</div>
                    <div class="card-effect-content text-slate-800 font-medium whitespace-pre-wrap overflow-hidden">${effectText}</div>
                </div>
                <div class="text-[9px] italic text-gray-500 text-right font-normal border-t border-amber-200/50 pt-0.5 mt-1 shrink-0 truncate">
                    ${flavorText}
                </div>
            </div>

            <div class="my-1 bg-zinc-300 text-center py-1 rounded font-bold text-slate-900 shadow border border-zinc-400 text-xs truncate px-2 shrink-0">
                ${name}
            </div>

            <div class="h-5 flex justify-center items-center mb-3 shrink-0">
                <div class="w-full flex h-5 font-bold text-[10px] text-white shadow rounded overflow-hidden">
                    <div class="w-1/2 bg-red-600 flex items-center justify-center space-x-1">
                        <span>⚔️ ATK:</span><span>${atk}</span>
                    </div>
                    <div class="w-1/2 bg-blue-600 flex items-center justify-center space-x-1">
                        <span>🛡️ DEF:</span><span>${def}</span>
                    </div>
                </div>
            </div>

            <div class="absolute bottom-1 left-3 right-3 flex justify-between items-center text-[8.5px] font-semibold text-gray-500 pointer-events-none">
                <span>${cardID}</span>
                <span>Illust: ${creator}</span>
            </div>
        `;

        container.appendChild(cardElement);
    });
}

window.onload = switchCardType;