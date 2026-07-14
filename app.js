document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Routing Mechanics
    const pageViews = document.querySelectorAll('.page-view');
    const navLinks = document.querySelectorAll('.nav-link, .breadcrumb-list a, .footer-links a, .logo-wrapper');
    const primaryNav = document.getElementById('primary-nav');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');

    // Route Switching Router (Static Index-Based SPA)
    function router() {
        let currentHash = window.location.hash || '#home';
        let targetViewId = 'view-' + currentHash.substring(1);
        
        // Ensure route exists
        let activeView = document.getElementById(targetViewId);
        if (!activeView) {
            currentHash = '#home';
            targetViewId = 'view-home';
            activeView = document.getElementById(targetViewId);
        }

        pageViews.forEach(view => {
            view.classList.remove('active-view');
        });
        activeView.classList.add('active-view');

        // Nav Active highlights update
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });

        // Accessibility announcement on content shift
        announcePageChange(currentHash.substring(1));
        
        // Collapse mobile nav
        primaryNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');

        // Scroll page smoothly to top layout container
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('hashchange', router);
    router(); // Handle page load

    // 2. Accessibility Screen-Reader Page Change Announcement
    function announcePageChange(pageName) {
        let liveRegion = document.getElementById('a11y-live-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.setAttribute('id', 'a11y-live-announcer');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = `Now viewing the ${pageName} section.`;
    }

    // 3. Mobile Navigation Menu Toggle Handler
    mobileToggle.addEventListener('click', () => {
        const isActive = primaryNav.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!primaryNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            primaryNav.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // 4. Live Content Finder / Client-Side Search (A11y/GEO Feature)
    const searchInput = document.getElementById('hero-search');
    const searchableItems = document.querySelectorAll('.card, .faq-item, .trouble-card, .guide-article');

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase().trim();
        
        // Route to home page automatically if the user performs a search on another page
        if (window.location.hash !== '#home' && window.location.hash !== '') {
            window.location.hash = '#home';
        }

        searchableItems.forEach(item => {
            const headingText = item.querySelector('h2, h3, span')?.textContent.toLowerCase() || '';
            const descText = item.querySelector('p')?.textContent.toLowerCase() || '';
            const matches = headingText.includes(value) || descText.includes(value);

            if (value === '') {
                // Clear matching highlights
                item.style.display = '';
                item.style.backgroundColor = '';
            } else if (matches) {
                item.style.display = 'block';
                item.style.backgroundColor = '#f1f5f9'; // Soft slate highlight
            } else {
                item.style.display = 'none';
            }
        });
    });

    // 5. Accessible FAQ Accordion Mechanics
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const panel = trigger.nextElementSibling;

            // Collapse other panels
            faqTriggers.forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                t.nextElementSibling.style.display = 'none';
            });

            if (!isExpanded) {
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.display = 'block';
            } else {
                trigger.setAttribute('aria-expanded', 'false');
                panel.style.display = 'none';
            }
        });
    });

    // 6. Keyboard navigation support for FAQ panel links
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Spacebar' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });
    });
});