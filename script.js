// Gastritis Diet Guide - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearchFunctionality();
    initializeScrollAnimations();
    initializeMobileMenu();
    initializeAccessibility();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation(); // Initial call
}

// Search functionality
function initializeSearchFunctionality() {
    // Create search bar
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-wrapper">
            <input type="text" id="food-search" placeholder="Search for foods..." class="search-input">
            <button type="button" class="search-clear" id="clear-search" aria-label="Clear search">×</button>
        </div>
        <div class="search-results" id="search-results"></div>
    `;
    
    // Insert search bar after the hero section
    const heroSection = document.querySelector('.hero');
    heroSection.insertAdjacentElement('afterend', searchContainer);
    
    const searchInput = document.getElementById('food-search');
    const clearButton = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');
    
    // Get all food items for searching
    const foodItems = Array.from(document.querySelectorAll('.food-item')).map(item => ({
        element: item,
        name: item.querySelector('.food-name').textContent.toLowerCase(),
        reason: item.querySelector('.food-reason').textContent.toLowerCase(),
        category: item.closest('.category-card').querySelector('h3').textContent,
        type: item.closest('.section-danger') ? 'avoid' : 'eat'
    }));
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.trim());
        }, 300);
    });
    
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        resetHighlights();
    });
    
    function performSearch(query) {
        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            resetHighlights();
            return;
        }
        
        const results = foodItems.filter(item => 
            item.name.includes(query.toLowerCase()) || 
            item.reason.includes(query.toLowerCase())
        );
        
        displaySearchResults(results, query);
        highlightMatchingItems(results);
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No foods found matching your search.</div>';
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-result-item ${result.type}" data-food="${result.name}">
                    <div class="search-result-content">
                        <span class="food-name">${highlightText(result.element.querySelector('.food-name').textContent, query)}</span>
                        <span class="food-reason">${highlightText(result.element.querySelector('.food-reason').textContent, query)}</span>
                        <span class="food-category">${result.category}</span>
                        <span class="food-type-badge ${result.type}">${result.type === 'avoid' ? '❌ Avoid' : '✅ Safe to Eat'}</span>
                    </div>
                </div>
            `).join('');
            
            searchResults.innerHTML = resultsHTML;
            
            // Add click handlers to scroll to food items
            searchResults.querySelectorAll('.search-result-item').forEach(resultItem => {
                resultItem.addEventListener('click', function() {
                    const foodName = this.dataset.food;
                    const targetElement = Array.from(document.querySelectorAll('.food-item')).find(item => 
                        item.querySelector('.food-name').textContent.toLowerCase() === foodName
                    );
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 100;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Briefly highlight the target
                        targetElement.style.backgroundColor = '#fef3c7';
                        setTimeout(() => {
                            targetElement.style.backgroundColor = '';
                        }, 2000);
                    }
                });
            });
        }
        
        searchResults.style.display = 'block';
    }
    
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function highlightMatchingItems(results) {
        resetHighlights();
        results.forEach(result => {
            result.element.classList.add('search-highlight');
        });
    }
    
    function resetHighlights() {
        document.querySelectorAll('.food-item.search-highlight').forEach(item => {
            item.classList.remove('search-highlight');
        });
    }
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.overview-card, .category-card, .tip-card, .notice-card'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const nav = document.querySelector('.nav');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    nav.appendChild(mobileToggle);
    
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-open');
        this.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('mobile-open') ? '✕' : '☰';
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
            mobileToggle.innerHTML = '☰';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            navMenu.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
            mobileToggle.innerHTML = '☰';
        }
    });
}

// Accessibility improvements
function initializeAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.id = 'main';
    }
    
    // Keyboard navigation for cards
    const interactiveCards = document.querySelectorAll('.overview-card, .tip-card');
    interactiveCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Improve screen reader experience for food items
    document.querySelectorAll('.food-item').forEach(item => {
        const name = item.querySelector('.food-name').textContent;
        const reason = item.querySelector('.food-reason').textContent;
        const type = item.closest('.section-danger') ? 'food to avoid' : 'safe food';
        
        item.setAttribute('aria-label', `${name}, ${reason}, ${type}`);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Print functionality
function printPage() {
    window.print();
}

// Export data functionality (for future use)
function exportFoodList(type = 'all') {
    const foods = [];
    document.querySelectorAll('.food-item').forEach(item => {
        const name = item.querySelector('.food-name').textContent;
        const reason = item.querySelector('.food-reason').textContent;
        const category = item.closest('.category-card').querySelector('h3').textContent;
        const foodType = item.closest('.section-danger') ? 'avoid' : 'eat';
        
        if (type === 'all' || type === foodType) {
            foods.push({ name, reason, category, type: foodType });
        }
    });
    
    return foods;
}

// Theme toggle (for future dark mode implementation)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize theme on load
loadTheme();

// Add CSS for search functionality
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-container {
        background: white;
        padding: 2rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: sticky;
        top: 80px;
        z-index: 50;
    }
    
    .search-wrapper {
        max-width: 600px;
        margin: 0 auto;
        position: relative;
        padding: 0 1rem;
    }
    
    .search-input {
        width: 100%;
        padding: 1rem 3rem 1rem 1.5rem;
        font-size: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.75rem;
        background: #f9fafb;
        transition: all 0.2s ease;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .search-clear {
        position: absolute;
        right: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #9ca3af;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.375rem;
        transition: color 0.2s ease;
    }
    
    .search-clear:hover {
        color: #6b7280;
        background: #f3f4f6;
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 1rem;
        right: 1rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        max-height: 400px;
        overflow-y: auto;
        display: none;
        z-index: 100;
    }
    
    .search-result-item {
        padding: 1rem;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .search-result-item:hover {
        background-color: #f9fafb;
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .search-result-item .food-name {
        font-weight: 600;
        color: #1f2937;
    }
    
    .search-result-item .food-reason {
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .search-result-item .food-category {
        font-size: 0.75rem;
        color: #9ca3af;
        text-transform: uppercase;
        font-weight: 500;
    }
    
    .food-type-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        font-weight: 500;
        align-self: flex-start;
        margin-top: 0.5rem;
    }
    
    .food-type-badge.avoid {
        background: #fef2f2;
        color: #dc2626;
    }
    
    .food-type-badge.eat {
        background: #f0fdf4;
        color: #16a34a;
    }
    
    .no-results {
        padding: 2rem;
        text-align: center;
        color: #6b7280;
    }
    
    .search-highlight {
        background-color: #fef3c7 !important;
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
    }
    
    mark {
        background-color: #fbbf24;
        color: #92400e;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
    }
    
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2563eb;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    }
    
    .skip-link:focus {
        top: 6px;
    }
    
    @media (max-width: 768px) {
        .search-container {
            top: 120px;
        }
        
        .mobile-menu-toggle {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #374151;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: background-color 0.2s ease;
        }
        
        .mobile-menu-toggle:hover {
            background-color: #f3f4f6;
        }
        
        .nav-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 1rem;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .nav-menu.mobile-open {
            display: flex;
        }
        
        .nav-link {
            text-align: center;
            padding: 0.75rem;
            border-radius: 0.5rem;
        }
    }
    
    @media (min-width: 769px) {
        .mobile-menu-toggle {
            display: none;
        }
    }
`;

document.head.appendChild(searchStyles);