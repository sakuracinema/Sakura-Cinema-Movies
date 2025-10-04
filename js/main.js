// SAKURA CINEMA - Main JavaScript File
// Demon Slayer Themed Interactive Website

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    setupNavigation();
    setupStarRating();
    setupForms();
    setupFilters();
    setupAnimations();
    loadReviews();
    loadSuggestions();
    updateStats();
    setupMobileMenu();
}

// ===== NAVIGATION =====
function setupNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Active navigation state
    window.addEventListener('scroll', updateActiveNavigation);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = section.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== STAR RATING SYSTEM =====
function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    let currentRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            ratingInput.value = currentRating;
            updateStarDisplay(currentRating);
        });

        star.addEventListener('mouseenter', function() {
            updateStarDisplay(index + 1);
        });
    });

    const starContainer = document.querySelector('.star-rating');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', function() {
            updateStarDisplay(currentRating);
        });
    }

    function updateStarDisplay(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
}

// ===== FORM HANDLING =====
function setupForms() {
    setupReviewForm();
    setupSuggestionForm();
}

function setupReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmission);
    }
}

function setupSuggestionForm() {
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestionSubmission);
    }
}

async function handleReviewSubmission(e) {
    e.preventDefault();
    
    const formData = {
        reviewer_name: document.getElementById('reviewerName').value,
        rating: parseInt(document.getElementById('rating').value),
        experience: document.getElementById('experience').value,
        review_text: document.getElementById('reviewText').value,
        created_at: new Date().toISOString(),
        status: 'approved' // Auto-approve for demo
    };

    // Validate form data
    if (!validateReviewData(formData)) {
        return;
    }

    try {
        showLoadingState('reviewForm');
        
        const response = await fetch('tables/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            showMessage('Review submitted successfully! Thank you for your feedback.', 'success');
            document.getElementById('reviewForm').reset();
            resetStarRating();
            loadReviews(); // Refresh reviews display
            updateStats(); // Update statistics
        } else {
            throw new Error('Failed to submit review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showMessage('Failed to submit review. Please try again.', 'error');
    } finally {
        hideLoadingState('reviewForm');
    }
}

async function handleSuggestionSubmission(e) {
    e.preventDefault();
    
    const formData = {
        suggester_name: document.getElementById('suggesterName').value,
        suggestion_type: document.getElementById('suggestionType').value,
        priority: document.getElementById('priority').value,
        suggestion_title: document.getElementById('suggestionTitle').value,
        suggestion_text: document.getElementById('suggestionText').value,
        created_at: new Date().toISOString(),
        status: 'new',
        votes: 0
    };

    // Validate form data
    if (!validateSuggestionData(formData)) {
        return;
    }

    try {
        showLoadingState('suggestionForm');
        
        const response = await fetch('tables/suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            showMessage('Suggestion submitted successfully! We appreciate your ideas.', 'success');
            document.getElementById('suggestionForm').reset();
            loadSuggestions(); // Refresh suggestions display
            updateStats(); // Update statistics
        } else {
            throw new Error('Failed to submit suggestion');
        }
    } catch (error) {
        console.error('Error submitting suggestion:', error);
        showMessage('Failed to submit suggestion. Please try again.', 'error');
    } finally {
        hideLoadingState('suggestionForm');
    }
}

// ===== VALIDATION =====
function validateReviewData(data) {
    if (!data.reviewer_name.trim()) {
        showMessage('Please enter your name.', 'error');
        return false;
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
        showMessage('Please select a rating.', 'error');
        return false;
    }
    
    if (!data.experience) {
        showMessage('Please select your experience level.', 'error');
        return false;
    }
    
    if (!data.review_text.trim()) {
        showMessage('Please write a review.', 'error');
        return false;
    }
    
    return true;
}

function validateSuggestionData(data) {
    if (!data.suggester_name.trim()) {
        showMessage('Please enter your name.', 'error');
        return false;
    }
    
    if (!data.suggestion_type) {
        showMessage('Please select a suggestion type.', 'error');
        return false;
    }
    
    if (!data.priority) {
        showMessage('Please select a priority level.', 'error');
        return false;
    }
    
    if (!data.suggestion_title.trim()) {
        showMessage('Please enter a title for your suggestion.', 'error');
        return false;
    }
    
    if (!data.suggestion_text.trim()) {
        showMessage('Please provide a detailed description.', 'error');
        return false;
    }
    
    return true;
}

// ===== DATA LOADING =====
async function loadReviews() {
    try {
        const response = await fetch('tables/reviews?limit=10&sort=-created_at');
        if (response.ok) {
            const data = await response.json();
            displayReviews(data.data || []);
        } else {
            console.error('Failed to load reviews');
            displayReviews([]);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        displayReviews([]);
    }
}

async function loadSuggestions() {
    try {
        const response = await fetch('tables/suggestions?limit=15&sort=-created_at');
        if (response.ok) {
            const data = await response.json();
            displaySuggestions(data.data || []);
        } else {
            console.error('Failed to load suggestions');
            displaySuggestions([]);
        }
    } catch (error) {
        console.error('Error loading suggestions:', error);
        displaySuggestions([]);
    }
}

// ===== DATA DISPLAY =====
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-comment-slash"></i>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card" data-aos="fade-up">
            <div class="review-header">
                <div class="reviewer-name">${escapeHtml(review.reviewer_name)}</div>
                <div class="review-rating">${generateStars(review.rating)}</div>
            </div>
            <div class="review-experience experience-${review.experience}">
                ${getExperienceLabel(review.experience)}
            </div>
            <div class="review-text">${escapeHtml(review.review_text)}</div>
            <div class="review-date">${formatDate(review.created_at)}</div>
        </div>
    `).join('');

    // Add animation to new reviews
    animateElements('.review-card');
}

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');
    if (!suggestionsList) return;

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-lightbulb"></i>
                <p>No suggestions yet. Share your ideas to help us improve!</p>
            </div>
        `;
        return;
    }

    suggestionsList.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-card" data-type="${suggestion.suggestion_type}" data-aos="fade-up">
            <div class="suggestion-header">
                <div class="suggestion-title">${escapeHtml(suggestion.suggestion_title)}</div>
                <div class="suggestion-priority priority-${suggestion.priority}">
                    ${getPriorityIcon(suggestion.priority)} ${suggestion.priority.toUpperCase()}
                </div>
            </div>
            <div class="suggestion-meta">
                <div class="suggestion-type">
                    <i class="${getTypeIcon(suggestion.suggestion_type)}"></i>
                    ${formatType(suggestion.suggestion_type)}
                </div>
                <div class="suggestion-author">
                    <i class="fas fa-user"></i>
                    ${escapeHtml(suggestion.suggester_name)}
                </div>
            </div>
            <div class="suggestion-text">${escapeHtml(suggestion.suggestion_text)}</div>
            <div class="suggestion-footer">
                <div class="suggestion-date">${formatDate(suggestion.created_at)}</div>
                <div class="suggestion-votes">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${suggestion.votes || 0}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add animation to new suggestions
    animateElements('.suggestion-card');
}

// ===== FILTERS =====
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter suggestions
            filterSuggestions(filter);
        });
    });
}

function filterSuggestions(filter) {
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    
    suggestionCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// ===== STATISTICS =====
async function updateStats() {
    try {
        // Load reviews count
        const reviewsResponse = await fetch('tables/reviews');
        const reviewsData = await reviewsResponse.json();
        const totalReviews = reviewsData.total || 0;
        
        // Load suggestions count
        const suggestionsResponse = await fetch('tables/suggestions');
        const suggestionsData = await suggestionsResponse.json();
        const totalSuggestions = suggestionsData.total || 0;
        
        // Update display with animation
        animateCounter('totalReviews', totalReviews);
        animateCounter('totalSuggestions', totalSuggestions);
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 2000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = (targetValue - startValue) / steps;
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, stepTime);
}

// ===== UTILITY FUNCTIONS =====
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function getExperienceLabel(experience) {
    const labels = {
        excellent: '🌟 Excellent',
        good: '👍 Good',
        average: '👌 Average',
        poor: '👎 Poor'
    };
    return labels[experience] || experience;
}

function getPriorityIcon(priority) {
    const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };
    return icons[priority] || '';
}

function getTypeIcon(type) {
    const icons = {
        feature: 'fas fa-plus-circle',
        improvement: 'fas fa-arrow-up',
        ui: 'fas fa-paint-brush',
        performance: 'fas fa-tachometer-alt',
        content: 'fas fa-file-alt',
        other: 'fas fa-question-circle'
    };
    return icons[type] || 'fas fa-lightbulb';
}

function formatType(type) {
    const formatted = {
        feature: 'New Feature',
        improvement: 'Improvement',
        ui: 'UI/UX',
        performance: 'Performance',
        content: 'Content',
        other: 'Other'
    };
    return formatted[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== ANIMATIONS =====
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', handleParallax);
}

function animateElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'slideInUp 0.6s ease forwards';
        }, index * 100);
    });
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// ===== UI FEEDBACK =====
function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
    `;

    messageContainer.appendChild(messageElement);

    // Show message
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);

    // Hide and remove message
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 5000);
}

function showLoadingState(formId) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }
}

function hideLoadingState(formId) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.disabled = false;
        
        if (formId === 'reviewForm') {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
        } else if (formId === 'suggestionForm') {
            submitBtn.innerHTML = '<i class="fas fa-rocket"></i> Submit Idea';
        }
    }
}

function resetStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('active'));
    document.getElementById('rating').value = '';
}

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavigation, 10);
});

// Lazy load images when they come into view
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
setupLazyLoading();

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics service in production
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateReviewData,
        validateSuggestionData,
        formatDate,
        escapeHtml
    };
}