// SAKURA CINEMA - Enhanced JavaScript with Video Background Controls

// ===== GLOBAL VARIABLES =====
let reviewsData = [];
let suggestionsData = [];
let currentRating = 0;

// ===== VIDEO & AUDIO BACKGROUND CONTROLS =====
class VideoBackgroundController {
    constructor() {
        this.video = document.getElementById('demonSlayerVideo');
        this.audio = document.getElementById('backgroundAudio');
        this.videoToggle = document.getElementById('videoToggle');
        this.audioToggle = document.getElementById('audioToggle');
        this.soundToggle = document.getElementById('soundToggle');
        this.isVideoPlaying = true;
        this.isAudioPlaying = false;
        this.isAllMuted = true;
        
        this.init();
    }
    
    init() {
        // Initialize video
        if (this.video) {
            this.video.muted = true;
            this.video.play().catch(e => console.log('Video autoplay prevented:', e));
            
            this.video.addEventListener('error', (e) => {
                console.warn('Video error:', e);
                this.handleVideoError();
            });
            
            this.video.addEventListener('loadeddata', () => {
                console.log('Video loaded successfully');
            });
        }
        
        // Initialize audio
        if (this.audio) {
            this.audio.volume = 0.6; // Set comfortable volume
            
            this.audio.addEventListener('error', (e) => {
                console.warn('Audio error:', e);
                this.handleAudioError();
            });
            
            this.audio.addEventListener('loadeddata', () => {
                console.log('Audio loaded successfully');
            });
        }
        
        // Add event listeners
        this.setupEventListeners();
        
        // Update button states
        this.updateButtonStates();
    }
    
    setupEventListeners() {
        // Video toggle button
        if (this.videoToggle) {
            this.videoToggle.addEventListener('click', () => {
                this.toggleVideo();
            });
        }
        
        // Audio toggle button
        if (this.audioToggle) {
            this.audioToggle.addEventListener('click', () => {
                this.toggleAudio();
            });
        }
        
        // Sound toggle button (mutes all)
        if (this.soundToggle) {
            this.soundToggle.addEventListener('click', () => {
                this.toggleAllSound();
            });
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input' || 
                e.target.tagName.toLowerCase() === 'textarea') {
                return; // Don't interfere with form inputs
            }
            
            switch(e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    this.toggleVideo();
                    break;
                case 'p':
                    e.preventDefault();
                    this.toggleAudio();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleAllSound();
                    break;
            }
        });
        
        // Video ended event
        if (this.video) {
            this.video.addEventListener('ended', () => {
                this.video.currentTime = 0;
                this.video.play();
            });
        }
    }
    
    toggleVideo() {
        if (!this.video) return;
        
        if (this.isVideoPlaying) {
            this.video.pause();
            this.isVideoPlaying = false;
        } else {
            this.video.play().catch(e => console.log('Video play prevented:', e));
            this.isVideoPlaying = true;
        }
        
        this.updateButtonStates();
        this.showNotification(this.isVideoPlaying ? 'Video resumed' : 'Video paused');
    }
    
    toggleAudio() {
        if (!this.audio) return;
        
        if (this.isAudioPlaying) {
            this.audio.pause();
            this.isAudioPlaying = false;
        } else {
            // First interaction, allow audio to play
            this.audio.play().then(() => {
                this.isAudioPlaying = true;
                this.updateButtonStates();
                this.showNotification('Background music started');
            }).catch(e => {
                console.log('Audio play prevented:', e);
                this.showNotification('Click to enable background music', 'info');
            });
            return;
        }
        
        this.updateButtonStates();
        this.showNotification(this.isAudioPlaying ? 'Music resumed' : 'Music paused');
    }
    
    toggleAllSound() {
        this.isAllMuted = !this.isAllMuted;
        
        if (this.video) {
            this.video.muted = this.isAllMuted;
        }
        
        if (this.audio) {
            this.audio.muted = this.isAllMuted;
        }
        
        this.updateButtonStates();
        this.showNotification(this.isAllMuted ? 'All sound muted' : 'All sound enabled');
    }
    
    updateButtonStates() {
        // Video toggle button
        if (this.videoToggle) {
            const icon = this.videoToggle.querySelector('i');
            if (icon) {
                icon.className = this.isVideoPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
            this.videoToggle.classList.toggle('paused', !this.isVideoPlaying);
            this.videoToggle.title = this.isVideoPlaying ? 'Pause Video' : 'Play Video';
        }
        
        // Audio toggle button
        if (this.audioToggle) {
            const icon = this.audioToggle.querySelector('i');
            if (icon) {
                icon.className = this.isAudioPlaying ? 'fas fa-pause-circle' : 'fas fa-music';
            }
            this.audioToggle.classList.toggle('playing', this.isAudioPlaying);
            this.audioToggle.title = this.isAudioPlaying ? 'Pause Music' : 'Play Background Music';
        }
        
        // All sound toggle button
        if (this.soundToggle) {
            const icon = this.soundToggle.querySelector('i');
            if (icon) {
                icon.className = this.isAllMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
            this.soundToggle.title = this.isAllMuted ? 'Enable All Sound' : 'Disable All Sound';
        }
    }
    
    handleVideoError() {
        const videoBackground = document.querySelector('.video-background');
        if (videoBackground) {
            videoBackground.style.display = 'none';
        }
        
        this.showNotification('Video background unavailable, using animated background', 'error');
        
        // Hide video controls
        if (this.videoToggle) this.videoToggle.style.display = 'none';
    }
    
    handleAudioError() {
        this.showNotification('Background music unavailable', 'error');
        
        // Hide audio control
        if (this.audioToggle) this.audioToggle.style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(45, 45, 45, 0.95);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border-left: 4px solid ${type === 'error' ? '#FF4444' : '#25D366'};
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1100;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ===== NAVIGATION =====
class NavigationController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }
    
    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (this.navbar) {
                if (currentScrollY > 100) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
                
                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    this.navbar.style.transform = 'translateY(-100%)';
                } else {
                    this.navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    setupMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.hamburger.classList.toggle('active');
            });
        }
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                if (this.navMenu) {
                    this.navMenu.classList.remove('active');
                }
                if (this.hamburger) {
                    this.hamburger.classList.remove('active');
                }
            });
        });
    }
}

// ===== ENHANCED ANIMATIONS =====
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.enhanceButtonAnimations();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.step-card, .pricing-card, .stat-card, .team-member, .info-card'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero background elements
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${rate * 0.3}px)`;
            }
            
            // Parallax effect for animated background elements
            const sakuraPetals = document.querySelectorAll('.petal');
            sakuraPetals.forEach((petal, index) => {
                const speed = 0.1 + (index * 0.02);
                petal.style.transform += ` translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    enhanceButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
        
        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== REVIEWS SYSTEM =====
class ReviewsController {
    constructor() {
        this.reviewForm = document.getElementById('reviewForm');
        this.reviewsList = document.getElementById('reviewsList');
        this.stars = document.querySelectorAll('.star');
        this.ratingInput = document.getElementById('rating');
        
        this.init();
    }
    
    init() {
        this.setupStarRating();
        this.setupFormSubmission();
        this.loadReviews();
    }
    
    setupStarRating() {
        this.stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                this.updateStarDisplay();
                if (this.ratingInput) {
                    this.ratingInput.value = currentRating;
                }
            });
            
            star.addEventListener('mouseover', () => {
                this.highlightStars(index + 1);
            });
        });
        
        // Reset stars on mouse leave
        const starContainer = document.querySelector('.star-rating');
        if (starContainer) {
            starContainer.addEventListener('mouseleave', () => {
                this.updateStarDisplay();
            });
        }
    }
    
    highlightStars(rating) {
        this.stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }
    
    updateStarDisplay() {
        this.highlightStars(currentRating);
    }
    
    setupFormSubmission() {
        if (this.reviewForm) {
            this.reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
    }
    
    submitReview() {
        const formData = new FormData(this.reviewForm);
        const reviewData = {
            id: Date.now(),
            name: document.getElementById('reviewerName').value,
            rating: currentRating,
            experience: document.getElementById('experience').value,
            text: document.getElementById('reviewText').value,
            date: new Date().toLocaleDateString()
        };
        
        if (!reviewData.name || !reviewData.rating || !reviewData.text) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        // Add to reviews array
        reviewsData.unshift(reviewData);
        
        // Save to localStorage
        this.saveReviews();
        
        // Update display
        this.displayReviews();
        
        // Reset form
        this.reviewForm.reset();
        currentRating = 0;
        this.updateStarDisplay();
        
        // Update stats
        this.updateStats();
        
        this.showMessage('Review submitted successfully! Thank you for your feedback.', 'success');
    }
    
    loadReviews() {
        const saved = localStorage.getItem('sakura_reviews');
        if (saved) {
            reviewsData = JSON.parse(saved);
        }
        this.displayReviews();
    }
    
    saveReviews() {
        localStorage.setItem('sakura_reviews', JSON.stringify(reviewsData));
    }
    
    displayReviews() {
        if (!this.reviewsList) return;
        
        if (reviewsData.length === 0) {
            this.reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-star"></i>
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            `;
            return;
        }
        
        const reviewsHTML = reviewsData.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h4 class="reviewer-name">${this.escapeHtml(review.name)}</h4>
                            <div class="review-date">${review.date}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <div class="review-experience">
                    <span class="experience-badge experience-${review.experience}">
                        ${review.experience.charAt(0).toUpperCase() + review.experience.slice(1)}
                    </span>
                </div>
                <div class="review-text">
                    ${this.escapeHtml(review.text)}
                </div>
            </div>
        `).join('');
        
        this.reviewsList.innerHTML = reviewsHTML;
    }
    
    updateStats() {
        const totalReviewsEl = document.getElementById('totalReviews');
        if (totalReviewsEl) {
            totalReviewsEl.textContent = reviewsData.length;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        messageContainer.appendChild(messageEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// ===== SUGGESTIONS SYSTEM =====
class SuggestionsController {
    constructor() {
        this.suggestionForm = document.getElementById('suggestionForm');
        this.suggestionsList = document.getElementById('suggestionsList');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupFormSubmission();
        this.setupFiltering();
        this.loadSuggestions();
    }
    
    setupFormSubmission() {
        if (this.suggestionForm) {
            this.suggestionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitSuggestion();
            });
        }
    }
    
    setupFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentFilter = button.dataset.filter;
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter suggestions
                this.displaySuggestions();
            });
        });
    }
    
    submitSuggestion() {
        const suggestionData = {
            id: Date.now(),
            name: document.getElementById('suggesterName').value,
            type: document.getElementById('suggestionType').value,
            priority: document.getElementById('priority').value,
            title: document.getElementById('suggestionTitle').value,
            text: document.getElementById('suggestionText').value,
            date: new Date().toLocaleDateString(),
            votes: 0
        };
        
        if (!suggestionData.name || !suggestionData.type || !suggestionData.title || !suggestionData.text) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        // Add to suggestions array
        suggestionsData.unshift(suggestionData);
        
        // Save to localStorage
        this.saveSuggestions();
        
        // Update display
        this.displaySuggestions();
        
        // Reset form
        this.suggestionForm.reset();
        
        // Update stats
        this.updateStats();
        
        this.showMessage('Suggestion submitted successfully! Thank you for your idea.', 'success');
    }
    
    loadSuggestions() {
        const saved = localStorage.getItem('sakura_suggestions');
        if (saved) {
            suggestionsData = JSON.parse(saved);
        }
        this.displaySuggestions();
    }
    
    saveSuggestions() {
        localStorage.setItem('sakura_suggestions', JSON.stringify(suggestionsData));
    }
    
    displaySuggestions() {
        if (!this.suggestionsList) return;
        
        let filteredSuggestions = suggestionsData;
        if (this.currentFilter !== 'all') {
            filteredSuggestions = suggestionsData.filter(s => s.type === this.currentFilter);
        }
        
        if (filteredSuggestions.length === 0) {
            const message = this.currentFilter === 'all' 
                ? 'No suggestions yet. Share your ideas!' 
                : `No ${this.currentFilter} suggestions yet.`;
            
            this.suggestionsList.innerHTML = `
                <div class="no-suggestions">
                    <i class="fas fa-lightbulb"></i>
                    <p>${message}</p>
                </div>
            `;
            return;
        }
        
        const suggestionsHTML = filteredSuggestions.map(suggestion => `
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <div class="suggestion-meta">
                        <span class="suggestion-type type-${suggestion.type}">
                            ${suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                        </span>
                        <span class="suggestion-priority priority-${suggestion.priority}">
                            ${suggestion.priority === 'high' ? '🔴' : suggestion.priority === 'medium' ? '🟡' : '🟢'}
                            ${suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                        </span>
                    </div>
                    <div class="suggestion-date">${suggestion.date}</div>
                </div>
                <h4 class="suggestion-title">${this.escapeHtml(suggestion.title)}</h4>
                <div class="suggestion-text">${this.escapeHtml(suggestion.text)}</div>
                <div class="suggestion-footer">
                    <div class="suggester-name">
                        <i class="fas fa-user"></i>
                        ${this.escapeHtml(suggestion.name)}
                    </div>
                    <div class="suggestion-votes">
                        <button class="vote-btn" onclick="suggestionsController.voteForSuggestion(${suggestion.id})">
                            <i class="fas fa-thumbs-up"></i>
                            ${suggestion.votes}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.suggestionsList.innerHTML = suggestionsHTML;
    }
    
    voteForSuggestion(id) {
        const suggestion = suggestionsData.find(s => s.id === id);
        if (suggestion) {
            suggestion.votes++;
            this.saveSuggestions();
            this.displaySuggestions();
        }
    }
    
    updateStats() {
        const totalSuggestionsEl = document.getElementById('totalSuggestions');
        if (totalSuggestionsEl) {
            totalSuggestionsEl.textContent = suggestionsData.length;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        messageContainer.appendChild(messageEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function selectPlan(planType) {
    const phoneNumber = '94706822208'; // 070 682 2208 in international format
    const message = `Hi! I'm interested in the ${planType} package. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// ===== FAQ FUNCTIONALITY =====
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('open');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Prefetch critical resources
    const prefetchLinks = [
        'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap',
        'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
    ];
    
    prefetchLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌸 SAKURA CINEMA - Enhanced Website Loaded');
    
    // Initialize all controllers
    const videoController = new VideoBackgroundController();
    const navigationController = new NavigationController();
    const animationController = new AnimationController();
    const reviewsController = new ReviewsController();
    window.suggestionsController = new SuggestionsController(); // Make globally accessible for voting
    
    // Setup additional features
    setupFAQ();
    optimizePerformance();
    
    // Add custom styles for messages and components
    addDynamicStyles();
    
    // Welcome message
    setTimeout(() => {
        if (videoController) {
            videoController.showNotification('Welcome to SAKURA CINEMA! 🌸 Use spacebar to pause/play video, M to mute/unmute');
        }
    }, 2000);
});

// ===== DYNAMIC STYLES =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Message Styles */
        .message {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: rgba(45, 45, 45, 0.95);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease;
        }
        
        .message-success {
            border-left: 4px solid #25D366;
        }
        
        .message-error {
            border-left: 4px solid #FF4444;
        }
        
        .message-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background 0.2s ease;
        }
        
        .message-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        /* Review Item Styles */
        .review-item {
            background: rgba(26, 26, 26, 0.8);
            border: 1px solid rgba(255, 68, 68, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .review-item:hover {
            border-color: rgba(255, 68, 68, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 68, 68, 0.1);
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .reviewer-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .reviewer-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #FF4444, #FF8C00, #FFD700);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .reviewer-name {
            color: white;
            font-weight: 600;
            margin: 0;
        }
        
        .review-date {
            color: #C0C0C0;
            font-size: 0.9rem;
        }
        
        .review-rating {
            color: #FFD700;
            font-size: 1.2rem;
        }
        
        .review-experience {
            margin-bottom: 1rem;
        }
        
        .experience-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .experience-excellent {
            background: rgba(37, 211, 102, 0.2);
            color: #25D366;
            border: 1px solid rgba(37, 211, 102, 0.3);
        }
        
        .experience-good {
            background: rgba(30, 144, 255, 0.2);
            color: #1E90FF;
            border: 1px solid rgba(30, 144, 255, 0.3);
        }
        
        .experience-average {
            background: rgba(255, 215, 0, 0.2);
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .experience-poor {
            background: rgba(255, 68, 68, 0.2);
            color: #FF4444;
            border: 1px solid rgba(255, 68, 68, 0.3);
        }
        
        .review-text {
            color: #C0C0C0;
            line-height: 1.6;
        }
        
        /* Suggestion Item Styles */
        .suggestion-item {
            background: rgba(26, 26, 26, 0.8);
            border: 1px solid rgba(30, 144, 255, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .suggestion-item:hover {
            border-color: rgba(30, 144, 255, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(30, 144, 255, 0.1);
        }
        
        .suggestion-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .suggestion-meta {
            display: flex;
            gap: 0.5rem;
        }
        
        .suggestion-type {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .type-feature {
            background: rgba(255, 68, 68, 0.2);
            color: #FF4444;
            border: 1px solid rgba(255, 68, 68, 0.3);
        }
        
        .type-improvement {
            background: rgba(30, 144, 255, 0.2);
            color: #1E90FF;
            border: 1px solid rgba(30, 144, 255, 0.3);
        }
        
        .type-ui {
            background: rgba(255, 215, 0, 0.2);
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .suggestion-priority {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .priority-high {
            background: rgba(255, 68, 68, 0.2);
            color: #FF4444;
            border: 1px solid rgba(255, 68, 68, 0.3);
        }
        
        .priority-medium {
            background: rgba(255, 215, 0, 0.2);
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .priority-low {
            background: rgba(37, 211, 102, 0.2);
            color: #25D366;
            border: 1px solid rgba(37, 211, 102, 0.3);
        }
        
        .suggestion-date {
            color: #C0C0C0;
            font-size: 0.9rem;
        }
        
        .suggestion-title {
            color: white;
            font-weight: 600;
            margin: 0 0 1rem 0;
        }
        
        .suggestion-text {
            color: #C0C0C0;
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .suggestion-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .suggester-name {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #C0C0C0;
            font-size: 0.9rem;
        }
        
        .suggester-name i {
            color: #1E90FF;
        }
        
        .vote-btn {
            background: rgba(30, 144, 255, 0.2);
            border: 1px solid rgba(30, 144, 255, 0.3);
            color: #1E90FF;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .vote-btn:hover {
            background: rgba(30, 144, 255, 0.3);
            transform: scale(1.05);
        }
        
        /* No content states */
        .no-reviews,
        .no-suggestions {
            text-align: center;
            padding: 3rem 2rem;
            color: #C0C0C0;
        }
        
        .no-reviews i,
        .no-suggestions i {
            font-size: 3rem;
            color: rgba(255, 68, 68, 0.3);
            margin-bottom: 1rem;
            display: block;
        }
        
        /* FAQ Styles */
        .faq-item {
            margin-bottom: 1rem;
        }
        
        .faq-question {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(45, 45, 45, 0.8);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .faq-question:hover {
            background: rgba(45, 45, 45, 1);
        }
        
        .faq-question i {
            transition: transform 0.3s ease;
        }
        
        .faq-item.open .faq-question i {
            transform: rotate(90deg);
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            background: rgba(26, 26, 26, 0.8);
            border-radius: 0 0 8px 8px;
        }
        
        .faq-answer p {
            padding: 1rem;
            margin: 0;
        }
    `;
    
    document.head.appendChild(style);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});
