console.log(animals);
const navFilter = document.getElementById('nav-filter');
const navList = document.getElementById('nav-list');
const homePage = document.getElementById('home-page-view');
const animalContainer = document.querySelector('.animal-container');
const searchInput = document.querySelector('.input-field');
const filterField = document.querySelector('.filter-container');
const sortSelect = document.getElementById('sort');
const cleanBtn = document.querySelector('.clear-btn');
const checkBoxes = document.querySelectorAll('.filter-row input[type="checkbox"]');
const popup = document.getElementById('animal-popup');
const popupClose = document.querySelector('.popup-close');
const popupPrev = document.querySelector('.prev-popup');
const popupNext = document.querySelector('.next-popup');

const navLinks = document.querySelectorAll('header nav a.nav-link');

let currentPage = 1;
const itemsPerPage = 8;
let currentDataList = [...animals];
let activePopupIndex = -1;

function renderAnimals(dataList, page) {
    if (!animalContainer) return;
    animalContainer.innerHTML = "";
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = dataList.slice(startIndex, endIndex);
    
    if (paginatedItems.length === 0) {
        animalContainer.innerHTML = `<p class="no-results" style="width:100%; text-align:center;">Không tìm thấy con vật nào phù hợp.</p>`;
        return;
    }
    
    paginatedItems.forEach((animal, index) => {
        let habitats = "";
        if (animal.habitat) {
            const habitatSrc = animal.habitat;
            habitats = habitatSrc.split(',').map(h => `<button class="habitat-btn">${h.trim()}</button>`).join('');
        } else if (animal.habitats && Array.isArray(animal.habitats)) {
            habitats = animal.habitats.map(h => `<button class="habitat-btn">${h}</button>`).join('');
        }

        const descriptionText = animal.description || "Không có mô tả.";
        const globalIndex = startIndex + index;
        
        animalContainer.innerHTML += `
            <div class="animal-card" data-index="${globalIndex}">
                <img src="${animal.image}" alt="${animal.name}" class="image-cart">
                <h3>${animal.name}</h3>
                <p class="description">
                    ${descriptionText}
                </p>
                <div class="habitat-container">
                    ${habitats}
                </div>
            </table>
        `;
    });

    addCardClickEvents();
}

function updateActiveNav(link) {
    navLinks.forEach(nav => nav.classList.remove('active'));
    if (link) link.classList.add('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', () => updateActiveNav(link));
});

function showPopup(index) {
    if (index < 0 || index >= currentDataList.length || !popup) return;
    activePopupIndex = index;
    const animal = currentDataList[index];

    const prevIndex = index === 0 ? currentDataList.length - 1 : index - 1;
    const nextIndex = index === currentDataList.length - 1 ? 0 : index + 1;

    const prevAnimal = currentDataList[prevIndex];
    const nextAnimal = currentDataList[nextIndex];

    popup.querySelector('.prev-blur-img').src = prevAnimal.image || "";
    popup.querySelector('.popup-image-main').src = animal.image || "";
    popup.querySelector('.next-blur-img').src = nextAnimal.image || ""; 

    popup.querySelector('.popup-title').innerText = animal.name || "";
    popup.querySelector('.popup-description').innerText = animal.description || "Không có mô tả.";
    
    if (popup.querySelector('.detail-habitat')) {
        popup.querySelector('.detail-habitat').innerText = animal.habitat || "N/A";
    }
    if (popup.querySelector('.detail-diet')) {
        popup.querySelector('.detail-diet').innerText = animal.diet || "N/A";
    }
    if (popup.querySelector('.detail-size')) {
        popup.querySelector('.detail-size').innerText = animal.size || "N/A";
    }
    if (popup.querySelector('.detail-lifespan')) {
        popup.querySelector('.detail-lifespan').innerText = animal.lifespan || "N/A";
    }
    if (popup.querySelector('.detail-status')) {
        popup.querySelector('.detail-status').innerText = animal.conservationStatus || "N/A";
    }

    popup.classList.add('open');
}

function closePopup() {
    if (popup) popup.classList.remove('open');
}

function addCardClickEvents() {
    const cards = document.querySelectorAll('.animal-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.getAttribute('data-index'));
            showPopup(index);
        });
    });
}

if (popupClose) popupClose.addEventListener('click', closePopup);
if (popup) {
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
}

if (popupNext) {
    popupNext.addEventListener('click', () => {
        let nextIndex = activePopupIndex + 1;
        if (nextIndex >= currentDataList.length) nextIndex = 0;
        showPopup(nextIndex);
    });
}

if (popupPrev) {
    popupPrev.addEventListener('click', () => {
        let prevIndex = activePopupIndex - 1;
        if (prevIndex < 0) prevIndex = currentDataList.length - 1;
        showPopup(prevIndex);
    });
}

function setupPagination(dataList) {
    const paginationContainer = document.querySelector(".pagination-flex");
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ""; 

    const totalPages = Math.ceil(dataList.length / itemsPerPage);
    if (totalPages <= 1) return; 

    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.innerText = "Back";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
        currentPage--;
        updateUI(dataList);
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = `pagination-btn ${currentPage === i ? "active" : ""}`;
        pageBtn.innerText = i;
        
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            updateUI(dataList);
        });
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.innerText = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        currentPage++;
        updateUI(dataList);
    });
    paginationContainer.appendChild(nextBtn);
}

function updateUI(dataList) {
    renderAnimals(dataList, currentPage);
    setupPagination(dataList);
    saveFileState();
}

function handleFilterAndSort() {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const selectedSpecies = [];
    const selectedHabitats = [];
    const selectedDiets = [];

    checkBoxes.forEach(cb => {
        if (cb.checked) {
            const labelText = cb.parentElement.innerText.trim();
            const rowTitle = cb.closest('.filter-row').querySelector('.filter-title').innerText.toLowerCase();
            
            if (rowTitle.includes('species')) selectedSpecies.push(labelText.toLowerCase());
            if (rowTitle.includes('habitat')) selectedHabitats.push(labelText.toLowerCase());
            if (rowTitle.includes('diet')) selectedDiets.push(labelText.toLowerCase());
        }
    });

    currentDataList = animals.filter(animal => {
        const animalName = (animal.name || "").toLowerCase();
        const animalDesc = (animal.description || "").toLowerCase();
        const animalHabit = (animal.habitat || "").toLowerCase();
        const animalSpec = (animal.species || "").toLowerCase();
        const animalDiet = (animal.diet || "").toLowerCase();

        const matchesSearch = animalName.includes(keyword) || animalDesc.includes(keyword) || animalHabit.includes(keyword);

        const matchesSpecies = selectedSpecies.length === 0 || selectedSpecies.some(s => animalSpec.includes(s));
        const matchesHabitat = selectedHabitats.length === 0 || selectedHabitats.some(h => animalHabit.includes(h));
        const matchesDiet = selectedDiets.length === 0 || selectedDiets.some(d => animalDiet.includes(d));

        return matchesSearch && matchesSpecies && matchesHabitat && matchesDiet;
    });

    if (sortSelect) {
        const sortValue = sortSelect.value;
        currentDataList.sort((a, b) => {
            const nameA = (a.name || "").toLowerCase();
            const nameB = (b.name || "").toLowerCase();
            if (sortValue === "az") return nameA.localeCompare(nameB);
            if (sortValue === "za") return nameB.localeCompare(nameA);
            return 0;
        });
    }

    currentPage = 1;
    saveFileState();
    updateUI(currentDataList);
}

if (searchInput) searchInput.addEventListener('input', handleFilterAndSort);
if (sortSelect) sortSelect.addEventListener('change', handleFilterAndSort);
checkBoxes.forEach(cb => cb.addEventListener('change', handleFilterAndSort));

if (cleanBtn) {
    cleanBtn.addEventListener('click', function(){
        checkBoxes.forEach(checkbox => checkbox.checked = false);
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'az';
        handleFilterAndSort();
    });
}

function initApp() {
    currentPage = 1;
    loadFilterState();
    handleFilterAndSort();
}

function saveFileState(){
    const checkedIndex = [];
    checkBoxes.forEach((cb, index) => {
        if(cb.checked){
            checkedIndex.push(index);
        }
    });
    const filterState = {
        keyword: searchInput ? searchInput.value : "",
        checkBoxes: checkedIndex,
        currentPage: currentPage
    }
    localStorage.setItem('animalState',JSON.stringify(filterState));
    console.log('Saved to localStorage:', filterState);
}
function loadFilterState(){
    const savedState = localStorage.getItem('animalState');
    console.log('Loaded from localStorage:', savedState);
    if(!savedState) return;
    const state = JSON.parse(savedState)
    if(searchInput && state.keyword){
        searchInput.value = state.keyword;
    }
    if(state.checkBoxes && Array.isArray(state.checkBoxes)){
        state.checkBoxes.forEach(index =>{
            if(checkBoxes[index]){
                checkBoxes[index].checked = true;
            }
        })
    }
    if(state.currentPage){
        currentPage = state.currentPage;
    }
}
initApp();