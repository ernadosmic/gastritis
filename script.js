// Gastritis Diet Guide - Interactive Features with Tailwind

document.addEventListener('DOMContentLoaded', function () {
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
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
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
    searchContainer.className = 'bg-white shadow-sm sticky top-16 z-40 py-8';
    searchContainer.innerHTML = `
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <input type="text" id="food-search" placeholder="Search for foods..." 
                   class="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 
                          focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 
                          focus:ring-primary-100 transition-all duration-200">
            <button type="button" id="clear-search" aria-label="Clear search"
                    class="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 
                           hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">×</button>
            <div id="search-results" 
                 class="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-xl 
                        shadow-lg max-h-96 overflow-y-auto hidden z-50 mt-2"></div>
        </div>
    `;

    // Insert search bar after the hero section
    const heroSection = document.querySelector('section.bg-gradient-to-r');
    heroSection.insertAdjacentElement('afterend', searchContainer);

    const searchInput = document.getElementById('food-search');
    const clearButton = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');

    // Get all food items for searching
    const foodItems = Array.from(document.querySelectorAll('.bg-gray-50.rounded-lg.p-4.border.border-gray-200')).map(item => ({
        element: item,
        name: item.querySelector('.font-medium').textContent.toLowerCase(),
        reason: item.querySelector('.text-sm.text-gray-600').textContent.toLowerCase(),
        category: item.closest('.bg-white.rounded-xl').querySelector('h3').textContent,
        type: item.closest('#avoid') ? 'avoid' : 'eat'
    }));

    let searchTimeout;

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.trim());
        }, 300);
    });

    clearButton.addEventListener('click', function () {
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
            searchResults.innerHTML = '<div class="p-8 text-center text-gray-500">No foods found matching your search.</div>';
        } else {
            const resultsHTML = results.map(result => `
                <div class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${result.type}" data-food="${result.name}">
                    <div class="flex flex-col space-y-2">
                        <div class="font-semibold text-gray-900">${highlightText(result.element.querySelector('.font-medium').textContent, query)}</div>
                        <div class="text-sm text-gray-600">${highlightText(result.element.querySelector('.text-sm.text-gray-600').textContent, query)}</div>
                        <div class="text-xs text-gray-400 uppercase font-medium">${result.category}</div>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.type === 'avoid' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} self-start">
                            ${result.type === 'avoid' ? 'Avoid' : 'Safe to Eat'}
                        </span>
                    </div>
                </div>
            `).join('');

            searchResults.innerHTML = resultsHTML;

            // Add click handlers to scroll to food items
            searchResults.querySelectorAll('[data-food]').forEach(resultItem => {
                resultItem.addEventListener('click', function () {
                    const foodName = this.dataset.food;
                    const targetElement = Array.from(document.querySelectorAll('.bg-gray-50.rounded-lg.p-4.border.border-gray-200')).find(item =>
                        item.querySelector('.font-medium').textContent.toLowerCase() === foodName
                    );

                    if (targetElement) {
                        const headerHeight = 80;
                        const targetPosition = targetElement.offsetTop - headerHeight - 100;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Briefly highlight the target
                        targetElement.classList.add('search-highlight');
                        setTimeout(() => {
                            targetElement.classList.remove('search-highlight');
                        }, 2000);
                    }

                    // Close search results
                    searchResults.classList.add('hidden');
                });
            });
        }

        searchResults.classList.remove('hidden');
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
        document.querySelectorAll('.search-highlight').forEach(item => {
            item.classList.remove('search-highlight');
        });
    }

    // Close search results when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.add('hidden');
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
        '.bg-white.rounded-xl, .bg-gray-50.rounded-lg'
    );

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');

            // Update button icon
            const svg = mobileMenuButton.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            } else {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                const svg = mobileMenuButton.querySelector('svg');
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const svg = mobileMenuButton.querySelector('svg');
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            }
        });
    }
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
    const interactiveCards = document.querySelectorAll('.bg-white.rounded-xl');
    interactiveCards.forEach(card => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Improve screen reader experience for food items
    document.querySelectorAll('.bg-gray-50.rounded-lg.p-4.border.border-gray-200').forEach(item => {
        const name = item.querySelector('.font-medium').textContent;
        const reason = item.querySelector('.text-sm.text-gray-600').textContent;
        const type = item.closest('#avoid') ? 'food to avoid' : 'safe food';

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
    document.querySelectorAll('.bg-gray-50.rounded-lg.p-4.border.border-gray-200').forEach(item => {
        const name = item.querySelector('.font-medium').textContent;
        const reason = item.querySelector('.text-sm.text-gray-600').textContent;
        const category = item.closest('.bg-white.rounded-xl').querySelector('h3').textContent;
        const foodType = item.closest('#avoid') ? 'avoid' : 'eat';

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

// Add minimal CSS for search functionality since we're now using Tailwind
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-highlight {
        background-color: #fef3c7 !important;
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
    }
    
    mark {
        background-color: #fbbf24;
        color: #92400e;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-weight: 600;
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
    
    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(searchStyles);