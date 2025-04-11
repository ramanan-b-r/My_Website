/**
 * User interaction tracking system for personal website
 * Captures clicks and page views across all elements
 */

// Initialize tracking on page load
document.addEventListener('DOMContentLoaded', () => {
    // Log page view when the page loads
    logEvent('view', 'page', {
        pageName: document.title || window.location.pathname,
        url: window.location.href
    });
    
    // Set up click tracking for the entire document
    setupClickTracking();
});

/**
 * Set up event listeners to track clicks on all interactive elements
 */
function setupClickTracking() {
    // Track clicks on the entire document
    document.addEventListener('click', (event) => {
        const target = event.target;
        
        // Determine the type of element clicked
        let elementType = getElementType(target);
        
        // Get additional info about the element
        const elementInfo = getElementInfo(target, elementType);
        
        // Log the click event
        logEvent('click', elementType, elementInfo);
    });
}

/**
 * Determine the type of element that was interacted with
 * @param {HTMLElement} element - The DOM element
 * @returns {string} The type of element
 */
function getElementType(element) {
    // Check for common element types
    if (element.tagName === 'A') return 'link';
    if (element.tagName === 'BUTTON') return 'button';
    if (element.tagName === 'IMG') return 'image';
    if (element.tagName === 'INPUT') {
        return element.type || 'input';
    }
    if (element.tagName === 'SELECT') return 'dropdown';
    if (element.tagName === 'TEXTAREA') return 'textarea';
    if (element.tagName === 'LABEL') return 'label';
    if (element.tagName === 'LI') return 'list-item';
    
    // Check for PDF links
    if (element.tagName === 'A' && element.href && element.href.toLowerCase().endsWith('.pdf')) {
        return 'pdf-link';
    }

    // Check common UI components
    if (element.classList.contains('dropdown') || element.parentElement?.classList.contains('dropdown')) {
        return 'dropdown';
    }
    
    // Check for text content
    if (element.childNodes.length === 1 && element.firstChild.nodeType === 3) {
        return 'text';
    }
    
    // For other elements, try to provide meaningful information
    return element.tagName.toLowerCase() || 'unknown';
}

/**
 * Get additional information about the element
 * @param {HTMLElement} element - The DOM element
 * @param {string} elementType - The type of element
 * @returns {Object} Additional information about the element
 */
function getElementInfo(element, elementType) {
    const info = {
        id: element.id || '',
        class: element.className || '',
    };
    
    // Add type-specific information
    switch (elementType) {
        case 'link':
            info.href = element.href || '';
            info.text = element.textContent.trim() || 'Empty link';
            break;
        case 'button':
            info.text = element.textContent.trim() || 'Empty button';
            break;
        case 'image':
            info.src = element.src || '';
            info.alt = element.alt || 'No alt text';
            break;
        case 'dropdown':
            if (element.tagName === 'SELECT') {
                info.value = element.value || '';
                info.options = element.options.length;
            }
            break;
        case 'pdf-link':
            info.documentName = element.textContent.trim() || element.href.split('/').pop();
            break;
        default:
            info.text = element.textContent.trim().substring(0, 50) || 'No text';
    }
    
    // Track section information (about, education, skills, etc.)
    const section = getSectionInfo(element);
    if (section) {
        info.section = section;
    }
    
    return info;
}

/**
 * Determine which section of the website the element belongs to
 * @param {HTMLElement} element - The DOM element
 * @returns {string|null} The section name or null if not determinable
 */
function getSectionInfo(element) {
    // Check current page
    const pathname = window.location.pathname.toLowerCase();
    
    if (pathname.includes('about')) return 'about';
    if (pathname.includes('education')) return 'education';
    if (pathname.includes('portfolio')) return 'portfolio';
    if (pathname.includes('socials')) return 'socials';
    if (pathname.includes('text-analyzer')) return 'text-analyzer';
    
    // If on index page, try to determine based on parent elements
    const parentElements = getParentElements(element, 5);
    for (const parent of parentElements) {
        const id = parent.id?.toLowerCase() || '';
        const className = parent.className?.toLowerCase() || '';
        
        if (id.includes('about') || className.includes('about')) return 'about';
        if (id.includes('education') || className.includes('education')) return 'education';
        if (id.includes('skills') || className.includes('skills')) return 'skills';
        if (id.includes('portfolio') || className.includes('portfolio')) return 'portfolio';
        if (id.includes('contact') || className.includes('contact')) return 'contact';
    }
    
    return 'main';
}

/**
 * Get an array of parent elements
 * @param {HTMLElement} element - The starting element
 * @param {number} depth - How many levels up to go
 * @returns {Array<HTMLElement>} Array of parent elements
 */
function getParentElements(element, depth) {
    const parents = [];
    let currentElement = element;
    
    for (let i = 0; i < depth; i++) {
        currentElement = currentElement.parentElement;
        if (!currentElement) break;
        parents.push(currentElement);
    }
    
    return parents;
}

/**
 * Log an event to the console with timestamp
 * @param {string} eventType - Type of event (click, view)
 * @param {string} elementType - Type of element interacted with
 * @param {Object} info - Additional information about the element
 */
function logEvent(eventType, elementType, info) {
    const timestamp = new Date().toISOString();
    
    // Format as: Timestamp_of_click, type of event (click/view), event object
    const logMessage = `${timestamp}, ${eventType}, ${elementType}`;
    
    // Log to console
    console.log(logMessage, info);
}
