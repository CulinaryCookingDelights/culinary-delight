// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Feature cards animation on scroll
const featureCards = document.querySelectorAll('.feature-card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

featureCards.forEach(card => {
    observer.observe(card);
});

// Get Started button click handler
document.querySelector('.get-started-btn').addEventListener('click', () => {
    const featuresSection = document.querySelector('.features');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
});

// Recipe Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Servings adjustment
    const servingsSelector = document.querySelector('.servings-selector');
    if (servingsSelector) {
        const servingsDisplay = servingsSelector.querySelector('span');
        const ingredients = document.querySelectorAll('.ingredients-list li');
        const baseServings = 4;
        const baseAmounts = Array.from(ingredients).map(item => {
            const amountEl = item.querySelector('.amount');
            return {
                value: parseFloat(amountEl.textContent),
                unit: amountEl.textContent.replace(/[\d.]/g, '').trim()
            };
        });

        servingsSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('adjust-servings')) {
                const currentServings = parseInt(servingsDisplay.textContent);
                const action = e.target.dataset.action;
                let newServings = currentServings;

                if (action === 'increase' && currentServings < 12) {
                    newServings = currentServings + 1;
                } else if (action === 'decrease' && currentServings > 1) {
                    newServings = currentServings - 1;
                }

                if (newServings !== currentServings) {
                    updateServings(newServings);
                    updateIngredientAmounts(newServings);
                }
            }
        });

        function updateServings(newServings) {
            servingsDisplay.textContent = `${newServings} servings`;
        }

        function updateIngredientAmounts(newServings) {
            ingredients.forEach((item, index) => {
                const amountEl = item.querySelector('.amount');
                const ratio = newServings / baseServings;
                const newAmount = (baseAmounts[index].value * ratio).toFixed(1);
                amountEl.textContent = `${newAmount}${baseAmounts[index].unit}`;
            });
        }
    }

    // Shopping list functionality
    const addToShoppingListBtn = document.querySelector('.ingredients-card .primary-btn');
    if (addToShoppingListBtn) {
        addToShoppingListBtn.addEventListener('click', () => {
            const ingredients = Array.from(document.querySelectorAll('.ingredients-list li'))
                .map(item => {
                    const amount = item.querySelector('.amount').textContent;
                    const ingredient = item.querySelector('.ingredient').textContent;
                    return `${amount} ${ingredient}`;
                });
            
            // Store ingredients in localStorage
            const shoppingList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
            ingredients.forEach(item => {
                if (!shoppingList.includes(item)) {
                    shoppingList.push(item);
                }
            });
            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
            
            // Show success message
            showNotification('Added ingredients to shopping list!');
        });
    }

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Recipes Page Functionality
    const recipeSearch = document.getElementById('recipe-search');
    const filterOptions = document.querySelectorAll('.filter-option input');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const loadMoreBtn = document.querySelector('.load-more .secondary-btn');

    if (recipeSearch) {
        let activeFilters = new Set();
        let currentPage = 1;
        const recipesPerPage = 8;

        // Search functionality
        recipeSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterRecipes();
        });

        // Filter functionality
        filterOptions.forEach(option => {
            option.addEventListener('change', () => {
                if (option.checked) {
                    activeFilters.add(option.value);
                } else {
                    activeFilters.delete(option.value);
                }
                currentPage = 1;
                filterRecipes();
            });
        });

        // Load more functionality
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentPage++;
                filterRecipes();
            });
        }

        function filterRecipes() {
            const searchTerm = recipeSearch.value.toLowerCase();
            let visibleCount = 0;

            recipeCards.forEach((card, index) => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const categories = card.dataset.categories.split(',');
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesFilters = activeFilters.size === 0 || 
                    [...activeFilters].every(filter => categories.includes(filter));
                
                if (matchesSearch && matchesFilters) {
                    visibleCount++;
                    if (visibleCount <= currentPage * recipesPerPage) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide load more button
            if (loadMoreBtn) {
                loadMoreBtn.style.display = visibleCount > currentPage * recipesPerPage ? 'inline-block' : 'none';
            }

            // Show no results message
            const noResultsMsg = document.querySelector('.no-results');
            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    const message = document.createElement('div');
                    message.className = 'no-results';
                    message.innerHTML = `
                        <div class="no-results-content">
                            <i class="fas fa-search"></i>
                            <h3>No recipes found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    `;
                    document.querySelector('.recipes-grid').appendChild(message);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        // Initialize filtering
        filterRecipes();
    }

    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
        }
    }

    // Dark mode toggle event listener
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save theme preference
        const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
        localStorage.setItem('theme', currentTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        body.classList.toggle('dark-mode', e.matches);
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box i');

    if (searchInput && searchIcon) {
        searchInput.addEventListener('focus', () => {
            searchIcon.classList.add('active');
        });

        searchInput.addEventListener('blur', () => {
            searchIcon.classList.remove('active');
        });

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', searchTerm);
        });
    }

    // Responsive Navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth Scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Import footer component
import './components/footer.js';
