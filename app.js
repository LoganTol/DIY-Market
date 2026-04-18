let allPlans = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Header & Footer
    await loadComponents();
    
    // 2. Fetch data globally
    await fetchPlans();

    // 3. Modal Initializers
    setupModalListeners();

    // 4. Setup Form interactions
    setupFormListeners();

    // 5. Setup existing filtering
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterPlans);
    if (categoryFilter) categoryFilter.addEventListener('change', filterPlans);
    if (priceFilter) {
        priceFilter.addEventListener('input', (e) => {
            const label = document.getElementById('priceLabel');
            if(label) label.textContent = `($${e.target.value})`;
            filterPlans();
        });
    }
    if (difficultyFilter) difficultyFilter.addEventListener('change', filterPlans);
});

async function loadComponents() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerRes = await fetch('components/header.html');
            if (headerRes.ok) headerPlaceholder.innerHTML = await headerRes.text();
        }
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerRes = await fetch('components/footer.html');
            if (footerRes.ok) footerPlaceholder.innerHTML = await footerRes.text();
        }
        
        // Active Links and Mobile Auto-Close Logic
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            }
            
            // Connect to close mobile nav
            link.addEventListener('click', () => {
                const navLinksContainer = document.getElementById('navLinks');
                const mobileToggleStr = document.getElementById('mobileToggle');
                if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    const icon = mobileToggleStr.querySelector('i');
                    if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
                }
            });
        });
        
        // Connect mobile toggle inside generated header
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = mobileToggle.querySelector('i');
                if (navLinks.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            });
        }
        
        // Connect Newsletter and Auth hooks securely since they are loaded dynamically
        setupGlobalInteractionListeners();

    } catch(e) {
        console.error('Components failed to load', e);
    }
}

function setupGlobalInteractionListeners() {
    // Auth Hook
    document.querySelectorAll('.auth-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Authentication system coming in Phase 6!");
        });
    });

    // Newsletter Hook
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you for subscribing!");
            newsletterForm.reset();
        });
    }
}

async function fetchPlans() {
    try {
        const response = await fetch('plans.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allPlans = await response.json();
        
        // Mock difficulty variable for filtering system
        allPlans = allPlans.map(plan => ({
            ...plan,
            difficulty: plan.difficulty || 'Intermediate' 
        }));
        
        renderPlans(allPlans);
    } catch (error) {
        console.error('Error fetching plans:', error);
    }
}

function renderPlans(plans) {
    const plansGrid = document.querySelector('.plans-grid');
    if (!plansGrid) return;
    
    // Clear and reflow
    plansGrid.innerHTML = '';
    
    if (plans.length === 0) {
        plansGrid.innerHTML = '<div class="no-results">No projects found matching your criteria.</div>';
        return;
    }

    plans.forEach(plan => {
        const formattedPrice = `$${Number(plan.price).toFixed(2)}`;

        const cardHTML = `
            <div class="plan-card" data-id="${plan.id}" style="cursor: pointer;">
                <div class="plan-image" style="background-image: url('${plan.imagePath}');">
                    <span class="plan-category">${plan.category}</span>
                </div>
                <div class="plan-details">
                    <div class="plan-title-row">
                        <h3>${plan.title}</h3>
                        <span class="plan-price">${formattedPrice}</span>
                    </div>
                    <p class="plan-author">by <strong>${plan.author}</strong></p>
                    <div class="plan-meta">
                        <span><i class="fa-solid fa-star"></i> ${plan.rating} (${plan.reviews})</span>
                        <span><i class="fa-solid fa-file-pdf"></i> ${plan.format}</span>
                    </div>
                </div>
            </div>
        `;
        plansGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    const cards = document.querySelectorAll('.plan-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const planId = card.getAttribute('data-id');
            const plan = allPlans.find(p => p.id === planId);
            if (plan) {
                openModal(plan);
            }
        });
    });
}

function filterPlans() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'All';
    const maxPrice = priceFilter ? parseFloat(priceFilter.value) : Infinity;
    const difficulty = difficultyFilter ? difficultyFilter.value : 'All';
    
    const filtered = allPlans.filter(plan => {
        const matchesSearch = plan.title.toLowerCase().includes(searchTerm) || 
                              plan.author.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'All' || plan.category === category;
        const matchesPrice = plan.price <= maxPrice;
        const matchesDifficulty = difficulty === 'All' || plan.difficulty === difficulty;
        
        return matchesSearch && matchesCategory && matchesPrice && matchesDifficulty;
    });
    
    renderPlans(filtered);
}

function setupModalListeners() {
    const modal = document.getElementById('plan-modal');
    const closeBtn = document.getElementById('modalClose');
    const backdrop = document.querySelector('.modal-backdrop');

    if (!modal) return;

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function openModal(plan) {
    const modal = document.getElementById('plan-modal');
    if (!modal) return;
    
    document.getElementById('modal-title').textContent = plan.title;
    document.getElementById('modal-dimensions').textContent = plan.dimensions;
    document.getElementById('modal-image').style.backgroundImage = `url('${plan.imagePath}')`;
    
    const materialsList = document.getElementById('modal-materials-list');
    materialsList.innerHTML = '';
    plan.materials.forEach(mat => {
        const li = document.createElement('li');
        li.textContent = mat;
        materialsList.appendChild(li);
    });

    modal.classList.remove('hidden');
}

// -------------------------------------------------------------
// Phase 3 & 4: Forms & Interactions
// -------------------------------------------------------------
window.nextStep = function(stepNumber) {
    document.querySelectorAll('.step-card').forEach(card => card.classList.add('hidden'));
    const nextCard = document.getElementById('step' + stepNumber);
    if (nextCard) nextCard.classList.remove('hidden');
};

function setupFormListeners() {
    const customForm = document.getElementById('customForm');
    if (customForm) {
        customForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('formFields').classList.add('hidden');
            document.getElementById('matchLoading').classList.remove('hidden');
            
            setTimeout(() => {
                document.getElementById('matchLoading').classList.add('hidden');
                document.getElementById('matchSuccess').classList.remove('hidden');
            }, 2500);
        });
    }

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    if (dropZone && fileInput) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files; 
                handleFiles(e.dataTransfer.files);
            }
        });
        dropZone.addEventListener('click', (e) => {
            if (e.target !== fileInput) fileInput.click();
        });
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    }
}

function handleFiles(files) {
    const list = document.getElementById('fileList');
    if (list) {
        list.innerHTML = '';
        Array.from(files).forEach(file => {
            list.innerHTML += `<div style="margin-bottom: 0.5rem;"><i class="fa-solid fa-file"></i> ${file.name}</div>`;
        });
    }
}
