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
    "normal_life": "normal_life.png", "power": "power.png", "Protect": "protect.png", "resources": "resources.png", "Destruction": "destruction.png", "recovery": "recovery.png",
    "token": "token.png"
};

function applyRightCircleIcon(value) {
    const iconImg = document.getElementById('rightCircleIcon');
    const circleText = document.getElementById('rightCircleText');

    if (!iconImg || !circleText) return;

    if (iconImages[value]) {
        iconImg.src = iconImages[value];
        iconImg.classList.remove('hidden');
        circleText.classList.add('hidden');
    } else {
        iconImg.classList.add('hidden');
        circleText.innerText = value || "-";
        circleText.classList.remove('hidden');
    }
}

function formatEffectText(text) {
    if (!text) return "";

    const paragraphs = text.split('\n');

    const formattedParagraphs = paragraphs.map(p => {
        let formatted = p;
        if (!formatted.trim()) return "";

        // หมวดที่ 1: ประเภทความสามารถหลัก
        formatted = formatted.replace(/\[ACT\]/gi, '<span class="keyword-badge badge-act">[ACT]</span>');
        formatted = formatted.replace(/\[Auto\]/gi, '<span class="keyword-badge badge-auto">[Auto]</span>');
        formatted = formatted.replace(/\[Counter\]/gi, '<span class="keyword-badge badge-counter">[Counter]</span>');
        formatted = formatted.replace(/\[Ongoing\]/gi, '<span class="keyword-badge badge-ongoing">[Ongoing]</span>');

        // หมวดที่ 2: ไฮไลท์ / ระบบเปลี่ยนร่าง & เควส
        const mechanicsKeywords = ["Final Regret", "Build Up", "Henshin", "Ride On", "Dragon origin", "Quest Trigger"];
        mechanicsKeywords.forEach(kw => {
            const regex = new RegExp(`\\[${kw.replace(/ /g, '\\s?')}\\]`, 'gi');
            formatted = formatted.replace(regex, `<span class="keyword-badge badge-mech">[${kw}]</span>`);
        });
        formatted = formatted.replace(/\[Evo\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-mech">Evo [$1]</span>');
        formatted = formatted.replace(/\[Evolution\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-mech">Evolution [$1]</span>');

        // หมวดที่ 3: สถานะ / เอฟเฟกต์ติดตัว & คำสาป
        const statusKeywords = ["Wandering", "Last Wish", "Paralyze", "Resist"];
        statusKeywords.forEach(kw => {
            const regex = new RegExp(`\\[${kw.replace(/ /g, '\\s?')}\\]`, 'gi');
            formatted = formatted.replace(regex, `<span class="keyword-badge badge-status">[${kw}]</span>`);
        });
        formatted = formatted.replace(/\[Poison\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-status">Poison [$1]</span>');
        formatted = formatted.replace(/\[Death Mark\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-status">Death Mark [$1]</span>');

        // หมวดที่ 4: การต่อสู้ / ปะทะ & ป้องกัน (เพิ่ม Ambush, Safeguard, Critical Strike)
        const combatKeywords = [
            "Penetrate", "Soulguard", "Taunt", "Counter attack", 
            "Double Attack", "Follow Attack", "Phantom Strike", "Ambush"
        ];
        combatKeywords.forEach(kw => {
            const regex = new RegExp(`\\[${kw.replace(/ /g, '\\s?')}\\]`, 'gi');
            formatted = formatted.replace(regex, `<span class="keyword-badge badge-combat">[${kw}]</span>`);
        });
        formatted = formatted.replace(/\[Safeguard(?:\s*([^\]]*))?\]/gi, (match, p1) => {
            return `<span class="keyword-badge badge-combat">[Safeguard${p1 ? ' ' + p1 : ''}]</span>`;
        });
        formatted = formatted.replace(/\[Critical\s*Strike(?:\s*([^\]]*))?\]/gi, (match, p1) => {
            return `<span class="keyword-badge badge-combat">[Critical Strike${p1 ? ' ' + p1 : ''}]</span>`;
        });

        // หมวดที่ 5: ทริกเกอร์พิเศษ & กักขัง (Life Trigger, Devour, Overdrive, Bind, Soul Charge)
        formatted = formatted.replace(/\[Life Trigger\]/gi, '<span class="keyword-badge badge-trigger">[Life Trigger]</span>');
        formatted = formatted.replace(/\[Devour\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-trigger">[Devour $1]</span>');
        formatted = formatted.replace(/\[Overdrive\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-trigger">[Overdrive $1]</span>');
        formatted = formatted.replace(/\[Soul\s*Charge\s*([^\]]+)\]/gi, '<span class="keyword-badge badge-trigger">[Soul Charge $1]</span>');
        formatted = formatted.replace(/\[Bind(?:\s*([^\]]*))?\]/gi, (match, p1) => {
            return `<span class="keyword-badge badge-trigger">[Bind${p1 ? ' ' + p1 : ''}]</span>`;
        });

        // หมวดที่ 6: สถานะการ์ด (Stand / Rest)
        formatted = formatted.replace(/\[Stand\]/gi, '<span class="keyword-badge badge-state">[Stand]</span>');
        formatted = formatted.replace(/\[Rest\]/gi, '<span class="keyword-badge badge-state">[Rest]</span>');

        // หมวดที่ 7: ข้อจำกัดรอบการใช้งาน
        formatted = formatted.replace(/\[(\d+(?:An)?\/Turn)\]/gi, '<span class="keyword-badge badge-limit">[$1]</span>');
        formatted = formatted.replace(/\[1\/Game\]/gi, '<span class="keyword-badge badge-limit">[1/Game]</span>');

        // หมวดที่ 8: สัญลักษณ์การ์ดและทรัพยากร
        const iconKeys = ["LB", "U", "S", "T", "C", "E", "SE"];
        iconKeys.forEach(key => {
            const regex = new RegExp(`\\[${key}\\]`, 'g');
            formatted = formatted.replace(regex, `<span class="badge-icon">${key}</span>`);
        });

        return `<div class="effect-paragraph">${formatted}</div>`;
    });

    return formattedParagraphs.join('');
}

function autoFitEffectText() {
    const content = document.getElementById('cardEffectText');
    if (!content) return;

    let fontSize = 10.5;
    content.style.fontSize = fontSize + 'px';

    while (content.scrollHeight > 135 && fontSize > 7.5) {
        fontSize -= 0.2;
        content.style.fontSize = fontSize + 'px';
    }
}

function switchCardType() {
    const typeSelect = document.getElementById('cardTypeSelect');
    if (!typeSelect) return;
    const type = typeSelect.value;
    const fields = document.getElementById('dynamicFields');
    const leftCircle = document.getElementById('leftCircle');
    
    let htmlForm = '';

    if (type === 'likit') {
        if (leftCircle) leftCircle.style.visibility = 'hidden';
        htmlForm = `
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-xs font-medium text-gray-300">Element (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" onchange="updateCard()">
                        <option value="Fire">Fire</option><option value="Wind">Wind</option><option value="Water">Water</option><option value="Earth">Earth</option><option value="Light">Light</option><option value="Dark">Dark</option>
                    </select>
                </div>
                <div><label class="text-xs font-medium text-gray-300">Archetype / Subtype</label><input type="text" id="fieldSubtype" value="Adventure" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div><label class="text-xs font-medium text-gray-300">Normal Life (Na)</label><input type="number" id="fieldLifeNa" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
                <div><label class="text-xs font-medium text-gray-300">Special Life (SL)</label><input type="number" id="fieldSL" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-20 rounded text-white" oninput="updateCard()">[Ongoing] ในเทิร์นของคุณ: ยูนิตทั้งหมดใน Unit Zone ของคุณได้รับ +1/+0 ต่อจำนวน Life ที่หงายอยู่ของคุณทุกๆ 2 ใบ
[ACT] [1/Turn] สร้างความเสียหายแก่ Life ของคุณ 1 หน่วย: ในเทิร์นนี้คุณจะไม่แพ้เกม และเมื่อจบเทิร์น ฟื้นฟู Normal Life ของคุณ 1 ใบ (เปลี่ยน Normal Life ที่หงายอยู่ 1 ใบเป็นคว่ำ)</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Gears spinning with wind..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded text-white" oninput="updateCard()"></div>
        `;
    }
    else if (type === 'unit') {
        if (leftCircle) leftCircle.style.visibility = 'visible';
        htmlForm = `
            <div class="grid grid-cols-3 gap-2">
                <div><label class="text-xs font-medium text-gray-300">Cost</label><input type="text" id="fieldCost" value="6" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
                <div><label class="text-xs font-medium text-gray-300">Race / Class</label><input type="text" id="fieldType" value="Knight" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
                <div>
                    <label class="text-xs font-medium text-gray-300">Element (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" onchange="updateCard()">
                        <option value="Fire">Fire</option><option value="Water">Water</option><option value="Earth">Earth</option><option value="Wind">Wind</option><option value="Light">Light</option><option value="Dark">Dark</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div><label class="text-xs font-medium text-gray-300">ATK</label><input type="number" id="fieldAtk" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
                <div><label class="text-xs font-medium text-gray-300">DEF</label><input type="number" id="fieldDef" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded text-white" oninput="updateCard()">[Penetrate] [Critical Strike 2]
(When Attack) Gains ATK +1 for each other unit you control.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Ash is a knight of the Gray Lion..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded text-white" oninput="updateCard()"></div>
        `;
    } 
    else if (type === 'spell') {
        if (leftCircle) leftCircle.style.visibility = 'visible';
        htmlForm = `
            <div class="grid grid-cols-3 gap-2">
                <div><label class="text-xs font-medium text-gray-300">Cost</label><input type="text" id="fieldCost" value="4" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
                <div>
                    <label class="text-xs font-medium text-gray-300">Spell Type (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" onchange="updateCard()">
                        <option value="counter">counter</option><option value="normal">normal</option><option value="equip">equip</option><option value="field">field</option>
                    </select>
                </div>
                <div><label class="text-xs font-medium text-gray-300">Element</label><input type="text" id="fieldElement" value="Wind" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded text-white" oninput="updateCard()">[Counter] [Safeguard 3]
When opponent unit attacks: Destroy that unit if its DEF is 3 or less.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="High-pressure steam bullet..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded text-white" oninput="updateCard()"></div>
        `;
    }
    else if (type === 'life') {
        if (leftCircle) leftCircle.style.visibility = 'hidden';
        htmlForm = `
            <div>
                <label class="text-xs font-medium text-gray-300">Life Category (Top-Right)</label>
                <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-2 text-sm rounded text-white" onchange="updateCard()">
                    <option value="power">power</option>
                    <option value="normal_life">normal</option>
                    <option value="Protect">Protect</option>
                    <option value="resources">resources</option>
                    <option value="Destruction">Destruction</option>
                    <option value="recovery">recovery</option>
                </select>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded text-white" oninput="updateCard()">[Life Trigger] Draw 1 card on your next Start Phase.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Emergency food in times of need..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded text-white" oninput="updateCard()"></div>
        `;
    }
    else if (type === 'token') {
        if (leftCircle) leftCircle.style.visibility = 'hidden';
        htmlForm = `
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-xs font-medium text-gray-300">Token Type (Top-Right)</label>
                    <select id="rightCircleValue" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" onchange="updateCard()">
                        <option value="token">token</option>
                    </select>
                </div>
                <div><label class="text-xs font-medium text-gray-300">Subtype</label><input type="text" id="fieldSubtype" value="Resource Token" class="w-full bg-slate-600 border border-slate-500 p-1 text-sm rounded text-white" oninput="updateCard()"></div>
            </div>
            <div><label class="text-xs font-medium text-gray-300">Effect Text</label><textarea id="fieldEffect" class="w-full bg-slate-600 border border-slate-500 p-1 text-xs h-16 rounded text-white" oninput="updateCard()">Used as cost for Steam or Build Up skills.</textarea></div>
            <div><label class="text-xs font-medium text-gray-300">Flavor Text</label><input type="text" id="fieldFlavor" value="Essential gear material..." class="w-full bg-slate-600 border border-slate-500 p-1 text-xs rounded text-white" oninput="updateCard()"></div>
        `;
    }

    if (fields) fields.innerHTML = htmlForm;
    updateCard();
}

function updateCard() {
    const typeSelect = document.getElementById('cardTypeSelect');
    if (!typeSelect) return;
    const type = typeSelect.value;

    const cardID = document.getElementById('inputCardID')?.value || "ATH-000";
    const name = document.getElementById('inputName')?.value || "Card Name";
    const creator = document.getElementById('inputCreator')?.value || "Unknown";

    const nameEl = document.getElementById('cardNameDisplay');
    const idEl = document.getElementById('displayCardID');
    const creatorEl = document.getElementById('displayCreator');

    if (nameEl) nameEl.innerText = name;
    if (idEl) idEl.innerText = cardID;
    if (creatorEl) creatorEl.innerText = `Illust: ${creator}`;
    
    const leftCircle = document.getElementById('leftCircle');
    const cardTypeText = document.getElementById('cardTypeText');
    const cardEffectText = document.getElementById('cardEffectText');
    const cardFlavorText = document.getElementById('cardFlavorText');
    const bottomStatusArea = document.getElementById('bottomStatusArea');
    
    const rightCircleVal = document.getElementById('rightCircleValue');
    const rightValue = rightCircleVal ? rightCircleVal.value : "Fire";
    applyRightCircleIcon(rightValue);

    const effectInput = document.getElementById('fieldEffect')?.value || "";
    const flavorInput = document.getElementById('fieldFlavor')?.value || "";
    
    if (cardEffectText) cardEffectText.innerHTML = formatEffectText(effectInput);
    if (cardFlavorText) cardFlavorText.innerText = flavorInput ? `"${flavorInput}"` : "";

    if (type === 'unit') {
        const cost = document.getElementById('fieldCost')?.value || "0";
        const cType = document.getElementById('fieldType')?.value || "Unit";
        const atk = document.getElementById('fieldAtk')?.value || 0;
        const def = document.getElementById('fieldDef')?.value || 0;

        if (leftCircle) {
            leftCircle.style.visibility = 'visible';
            leftCircle.innerText = cost;
        }
        if (cardTypeText) cardTypeText.innerText = `Unit / ${cType} / ${rightValue}`;

        if (bottomStatusArea) {
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
    }
    else if (type === 'spell') {
        const cost = document.getElementById('fieldCost')?.value || "0";
        const spElem = document.getElementById('fieldElement')?.value || "Wind";

        if (leftCircle) {
            leftCircle.style.visibility = 'visible';
            leftCircle.innerText = cost;
        }
        if (cardTypeText) cardTypeText.innerText = `Spell / ${rightValue} / ${spElem}`;
        if (bottomStatusArea) bottomStatusArea.innerHTML = '';
    }
    else if (type === 'likit') {
        if (leftCircle) leftCircle.style.visibility = 'hidden';

        const sub = document.getElementById('fieldSubtype')?.value || "Adventure";
        const na = parseInt(document.getElementById('fieldLifeNa')?.value) || 0;
        const sl = parseInt(document.getElementById('fieldSL')?.value) || 0;
        const totalLife = na + sl;

        if (cardTypeText) cardTypeText.innerText = `Likit Bearer / ${sub} / ${rightValue}`;

        if (bottomStatusArea) {
            bottomStatusArea.innerHTML = `
                <div class="w-full flex h-5 text-[10px] font-bold text-slate-900 overflow-hidden border border-zinc-400 rounded">
                    <div class="w-1/3 bg-lime-400 flex items-center justify-center">Life: ${totalLife}</div>
                    <div class="w-1/3 bg-gray-100 flex items-center justify-center border-x border-zinc-400">Na: ${na}</div>
                    <div class="w-1/3 bg-amber-600 text-white flex items-center justify-center">SL: ${sl}</div>
                </div>
            `;
        }
    }
    else if (type === 'life') {
        if (leftCircle) leftCircle.style.visibility = 'hidden';
        const displayLifeName = rightValue === 'normal_life' ? 'normal Life' : `${rightValue} Life`;
        if (cardTypeText) cardTypeText.innerText = `(${displayLifeName})`;
        if (bottomStatusArea) bottomStatusArea.innerHTML = '';
    }
    else if (type === 'token') {
        if (leftCircle) leftCircle.style.visibility = 'hidden';
        const sub = document.getElementById('fieldSubtype')?.value || "Token";
        if (cardTypeText) cardTypeText.innerText = `Token / (${rightValue}) / ${sub}`;
        if (bottomStatusArea) bottomStatusArea.innerHTML = '';
    }

    autoFitEffectText();
}

async function downloadCard() {
    const area = document.getElementById('cardCaptureArea');
    const cardName = document.getElementById('inputName')?.value || 'card-output';

    if (document.fonts) {
        await document.fonts.ready;
    }

    setTimeout(() => {
        html2canvas(area, { 
            scale: 2, 
            useCORS: true,
            logging: false,
            scrollY: 0,
            scrollX: 0
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${cardName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }, 100);
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
    
    if (!container || !cardCountSpan) return;

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

            <div class="card-art-container my-1 bg-sky-50 rounded border border-gray-300 overflow-hidden relative flex items-center justify-center shrink-0">
                <img src="${imageSrc}" class="w-full h-full object-cover" onerror="this.style.display='none'">
            </div>

            <div class="card-effect-box bg-amber-50 px-3 py-2 rounded border border-amber-200 flex flex-col justify-between shadow-inner relative shrink-0">
                <div class="w-full">
                    <div class="font-bold text-[11px] text-amber-900 border-b border-amber-300 pb-0.5 mb-1 truncate">${typeText}</div>
                    <div class="card-effect-content text-slate-800 font-medium">${effectText}</div>
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

document.addEventListener('DOMContentLoaded', () => {
    switchCardType();
});