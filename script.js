// ===== BUSINESS CARD GENERATOR =====
// Live Preview, Template Switching, and Export Functionality

// State Management
let currentTemplate = 'modern';

// DOM Elements
const templateCards = document.querySelectorAll('.template-card');
const businessCard = document.getElementById('businessCard');
const cardContent = businessCard.querySelector('.card-content');

// Form Inputs
const inputName = document.getElementById('inputName');
const inputTitle = document.getElementById('inputTitle');
const inputPhone = document.getElementById('inputPhone');
const inputEmail = document.getElementById('inputEmail');
const inputWebsite = document.getElementById('inputWebsite');
const inputLinkedIn = document.getElementById('inputLinkedIn');
const inputX = document.getElementById('inputX');
const inputGithub = document.getElementById('inputGithub');

// Display Elements
const displayName = document.getElementById('displayName');
const displayTitle = document.getElementById('displayTitle');
const displayPhone = document.getElementById('displayPhone');
const displayEmail = document.getElementById('displayEmail');
const displayWebsite = document.getElementById('displayWebsite');
const linkedinLink = document.getElementById('linkedinLink');
const xLink = document.getElementById('xLink');
const githubLink = document.getElementById('githubLink');
const displaySocial = document.getElementById('displaySocial');

// Export Buttons
const exportPNG = document.getElementById('exportPNG');
const exportJPG = document.getElementById('exportJPG');

// ===== TEMPLATE SWITCHING =====
templateCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        templateCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        this.classList.add('active');
        
        // Get template type
        const template = this.getAttribute('data-template');
        currentTemplate = template;
        
        // Update business card classes instantly
        businessCard.className = `business-card template-${template}`;
        cardContent.className = `card-content template-${template}-content`;
        
        // Save template selection
        saveFormData();
        
        // On mobile, auto-switch to preview tab after selecting template
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const previewTabButton = document.querySelector('.mobile-tab[data-tab="preview"]');
                if (previewTabButton) {
                    previewTabButton.click();
                }
            }, 400);
        }
        
        // Add haptic feedback if available (wrapped in try-catch to avoid errors)
        try {
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        } catch (e) {
            // Vibration not supported or blocked, silently ignore
        }
    });
});

// ===== LIVE PREVIEW UPDATES =====
function updatePreview() {
    // Update name
    displayName.textContent = inputName.value || 'Your Name';
    
    // Update title
    displayTitle.textContent = inputTitle.value || 'Your Title';
    
    // Update phone
    displayPhone.textContent = inputPhone.value || '+1 234 567 8900';
    
    // Update email
    displayEmail.textContent = inputEmail.value || 'email@example.com';
    
    // Update website
    displayWebsite.textContent = inputWebsite.value || 'www.example.com';
    
    // Update social links visibility and URLs
    updateSocialLinks();
}

function updateSocialLinks() {
    const linkedinUrl = inputLinkedIn.value;
    const xUrl = inputX.value;
    const githubUrl = inputGithub.value;
    
    // LinkedIn
    if (linkedinUrl) {
        linkedinLink.href = linkedinUrl;
        linkedinLink.style.display = 'flex';
    } else {
        linkedinLink.style.display = 'none';
    }
    
    // X (Twitter)
    if (xUrl) {
        xLink.href = xUrl;
        xLink.style.display = 'flex';
    } else {
        xLink.style.display = 'none';
    }
    
    // GitHub
    if (githubUrl) {
        githubLink.href = githubUrl;
        githubLink.style.display = 'flex';
    } else {
        githubLink.style.display = 'none';
    }
    
    // Hide social section if no links
    if (!linkedinUrl && !xUrl && !githubUrl) {
        displaySocial.style.display = 'none';
    } else {
        displaySocial.style.display = 'flex';
    }
}

// Add event listeners for live preview
inputName.addEventListener('input', updatePreview);
inputTitle.addEventListener('input', updatePreview);
inputPhone.addEventListener('input', updatePreview);
inputEmail.addEventListener('input', updatePreview);
inputWebsite.addEventListener('input', updatePreview);
inputLinkedIn.addEventListener('input', updatePreview);
inputX.addEventListener('input', updatePreview);
inputGithub.addEventListener('input', updatePreview);

// ===== EXPORT FUNCTIONALITY =====

// Export as PNG
exportPNG.addEventListener('click', function() {
    exportCard('png');
});

// Export as JPG
exportJPG.addEventListener('click', function() {
    exportCard('jpg');
});

function exportCard(format) {
    // Show loading state
    const button = format === 'png' ? exportPNG : exportJPG;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
    button.disabled = true;
    
    // Get the business card element
    const card = document.getElementById('businessCard');
    const cardWrapper = card.parentElement;
    
    // Clone the card for export to avoid affecting the live preview
    const cardClone = card.cloneNode(true);
    cardClone.style.position = 'absolute';
    cardClone.style.left = '-9999px';
    cardClone.style.top = '0';
    cardClone.style.width = '500px';
    cardClone.style.height = '300px';
    cardClone.style.transform = 'none';
    cardClone.style.margin = '0';
    cardClone.style.boxShadow = 'none';
    document.body.appendChild(cardClone);
    
    // Remove problematic gradients from clone and replace with solid colors
    const elementsWithGradients = cardClone.querySelectorAll('*');
    const gradientFixes = [];
    
    elementsWithGradients.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const bgImage = computedStyle.backgroundImage;
        const bgColor = computedStyle.backgroundColor;
        
        // Replace gradients with solid background colors to avoid html2canvas gradient bugs
        if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
            // Store the background color as fallback
            el.style.backgroundImage = 'none';
            // If element has a background color, use it; otherwise use a default
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                el.style.backgroundColor = bgColor;
            }
        }
    });
    
    // Small delay to let the DOM update
    setTimeout(() => {
        // Configure html2canvas options for clean export
        const options = {
            backgroundColor: '#ffffff',
            scale: 2, // Good quality without being too large
            logging: false,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            width: 500,
            height: 300,
            windowWidth: 500,
            windowHeight: 300,
            imageTimeout: 0,
            removeContainer: true,
            foreignObjectRendering: false
        };
        
        // Capture the cloned card
        html2canvas(cardClone, options).then(canvas => {
            // Remove the clone
            document.body.removeChild(cardClone);
            
            // Create download link
            const link = document.createElement('a');
            const fileName = `business-card-${inputName.value.replace(/\s+/g, '-').toLowerCase() || 'card'}-${Date.now()}`;
            
            if (format === 'png') {
                link.download = `${fileName}.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
            } else {
                link.download = `${fileName}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 0.95);
            }
            
            // Trigger download
            link.click();
            
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Show success message
            showNotification(`Card exported successfully as ${format.toUpperCase()}!`);
        }).catch(error => {
            // Remove the clone on error
            if (document.body.contains(cardClone)) {
                document.body.removeChild(cardClone);
            }
            
            console.error('Export failed:', error);
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Export failed. Please try again.', 'error');
        });
    }, 150);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Responsive styles
    const isMobile = window.innerWidth <= 768;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'bottom: 100px; left: 16px; right: 16px; top: auto;' : 'top: 20px; right: 20px;'}
        background: ${type === 'success' ? '#000000' : '#dc2626'};
        color: #ffffff;
        padding: ${isMobile ? '14px 18px' : '16px 24px'};
        border-radius: ${isMobile ? '12px' : '8px'};
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        font-size: ${isMobile ? '0.9rem' : '0.875rem'};
        font-weight: 500;
        animation: notificationSlideIn 0.3s ease;
        ${isMobile ? 'justify-content: center; text-align: center;' : ''}
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationSlideIn {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes notificationSlideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(20px);
            opacity: 0;
        }
    }
    
    @media (min-width: 769px) {
        @keyframes notificationSlideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes notificationSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    }
    
    .business-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);

// ===== FORM VALIDATION =====
const form = document.getElementById('cardForm');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission
    
    // Validate required fields
    if (!inputName.value.trim()) {
        showNotification('Please enter your name', 'error');
        inputName.focus();
        return;
    }
    
    if (!inputTitle.value.trim()) {
        showNotification('Please enter your job title', 'error');
        inputTitle.focus();
        return;
    }
    
    if (!inputPhone.value.trim()) {
        showNotification('Please enter your phone number', 'error');
        inputPhone.focus();
        return;
    }
    
    if (!inputEmail.value.trim()) {
        showNotification('Please enter your email', 'error');
        inputEmail.focus();
        return;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputEmail.value)) {
        showNotification('Please enter a valid email address', 'error');
        inputEmail.focus();
        return;
    }
    
    showNotification('All fields are valid! Your card is ready to export.');
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to export PNG
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportCard('png');
    }
    
    // Ctrl/Cmd + E to export JPG
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportCard('jpg');
    }
});

// ===== LOCAL STORAGE (Save Form Data) =====
function saveFormData() {
    const formData = {
        name: inputName.value,
        title: inputTitle.value,
        phone: inputPhone.value,
        email: inputEmail.value,
        website: inputWebsite.value,
        linkedin: inputLinkedIn.value,
        x: inputX.value,
        github: inputGithub.value,
        template: currentTemplate
    };
    
    localStorage.setItem('businessCardData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('businessCardData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        inputName.value = data.name || 'John Doe';
        inputTitle.value = data.title || 'Senior Product Manager';
        inputPhone.value = data.phone || '+1 234 567 8900';
        inputEmail.value = data.email || 'john.doe@company.com';
        inputWebsite.value = data.website || 'www.johndoe.com';
        inputLinkedIn.value = data.linkedin || '';
        inputX.value = data.x || '';
        inputGithub.value = data.github || '';
        
        // Load saved template
        if (data.template) {
            const templateCard = document.querySelector(`[data-template="${data.template}"]`);
            if (templateCard) {
                templateCard.click();
            }
        }
        
        updatePreview();
    }
}

// Save data on input change
const allInputs = [inputName, inputTitle, inputPhone, inputEmail, inputWebsite, inputLinkedIn, inputX, inputGithub];
allInputs.forEach(input => {
    input.addEventListener('input', saveFormData);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadFormData();
    
    // Initial preview update
    updatePreview();
    
    // Initialize mobile tabs
    initializeMobileTabs();
    
    // Handle initial mobile layout
    if (window.innerWidth <= 768) {
        const contentGrid = document.querySelector('.content-grid');
        const templatesTab = document.getElementById('templatesTab');
        if (contentGrid) contentGrid.style.display = 'none';
        if (templatesTab) templatesTab.classList.add('active');
    }
    
    // Add smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Handle resize for layout changes
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const contentGrid = document.querySelector('.content-grid');
            if (window.innerWidth > 768) {
                // Desktop: show content-grid
                if (contentGrid) contentGrid.style.display = '';
            }
        }, 100);
    });
    
    console.log('✅ Business Card Generator initialized successfully!');
    console.log('💡 Keyboard shortcuts: Ctrl/Cmd + S (PNG), Ctrl/Cmd + E (JPG)');
});

// ===== MOBILE TAB NAVIGATION =====
function initializeMobileTabs() {
    const mobileTabs = document.querySelectorAll('.mobile-tab');
    const templatesTab = document.getElementById('templatesTab');
    const editTab = document.getElementById('editTab');
    const previewTab = document.getElementById('previewTab');
    const contentGrid = document.querySelector('.content-grid');
    
    // Set initial active state
    if (window.innerWidth <= 768 && templatesTab) {
        templatesTab.classList.add('active');
        // Hide content-grid initially since templates tab is active
        if (contentGrid) contentGrid.style.display = 'none';
    }
    
    mobileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            mobileTabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Get tab type
            const tabType = this.getAttribute('data-tab');
            
            // Hide all sections
            if (templatesTab) templatesTab.classList.remove('active');
            if (editTab) editTab.classList.remove('active');
            if (previewTab) previewTab.classList.remove('active');
            
            // Show selected section and manage content-grid visibility
            if (tabType === 'templates' && templatesTab) {
                templatesTab.classList.add('active');
                if (contentGrid) contentGrid.style.display = 'none';
            } else if (tabType === 'edit' && editTab) {
                editTab.classList.add('active');
                if (contentGrid) contentGrid.style.display = 'block';
                // Recalculate card scale
                setTimeout(scaleCard, 50);
            } else if (tabType === 'preview' && previewTab) {
                previewTab.classList.add('active');
                if (contentGrid) contentGrid.style.display = 'block';
                // Recalculate card scale when preview tab becomes visible
                setTimeout(scaleCard, 50);
            }
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
    
    // Watch for tab visibility changes and recalculate scale
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (previewTab && previewTab.classList.contains('active')) {
                    setTimeout(scaleCard, 50);
                }
            }
        });
    });
    
    if (previewTab) {
        observer.observe(previewTab, { attributes: true });
    }
}

// ===== RESPONSIVE CARD SCALING =====
function scaleCard() {
    const wrapper = document.querySelector('.card-preview-wrapper');
    const card = document.getElementById('businessCard');
    
    if (!wrapper || !card) return;
    
    const cardWidth = 500;
    const cardHeight = 300;
    
    // Get viewport width for mobile detection
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth <= 768) {
        // Mobile: calculate scale based on screen width
        const horizontalPadding = 40; // 20px on each side for safety
        const availableWidth = viewportWidth - horizontalPadding;
        
        // Calculate scale to fit width
        let scale = availableWidth / cardWidth;
        
        // Cap the scale at reasonable bounds
        scale = Math.min(0.85, scale); // Don't go too large
        scale = Math.max(0.55, scale); // Don't go too small
        
        // Apply scale
        card.style.transform = `scale(${scale})`;
        card.style.transformOrigin = 'center center';
        
        // The card still takes up 300px in the layout even when scaled
        // But we need the wrapper to show the scaled visual size
        // Use negative margins to shrink the layout space
        const scaledHeight = cardHeight * scale;
        const heightDiff = cardHeight - scaledHeight;
        
        // Apply negative margins to compensate for unscaled layout
        card.style.marginTop = `-${heightDiff / 2}px`;
        card.style.marginBottom = `-${heightDiff / 2}px`;
        
        // Also handle width
        const scaledWidth = cardWidth * scale;
        const widthDiff = cardWidth - scaledWidth;
        card.style.marginLeft = `-${widthDiff / 2}px`;
        card.style.marginRight = `-${widthDiff / 2}px`;
        
        // Set wrapper height to fit the visual card size
        wrapper.style.minHeight = (scaledHeight + 60) + 'px';
    } else {
        // Desktop: no scaling needed
        card.style.transform = 'scale(1)';
        card.style.transformOrigin = 'center center';
        card.style.marginTop = '';
        card.style.marginBottom = '';
        card.style.marginLeft = '';
        card.style.marginRight = '';
        wrapper.style.minHeight = '';
    }
}

// Debounce function to prevent excessive recalculations
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

const debouncedScaleCard = debounce(scaleCard, 100);

window.addEventListener('resize', debouncedScaleCard);
window.addEventListener('load', () => {
    // Initial scale after a short delay to ensure DOM is ready
    setTimeout(scaleCard, 100);
});
window.addEventListener('orientationchange', () => {
    setTimeout(scaleCard, 200);
});
