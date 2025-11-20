document.addEventListener('DOMContentLoaded', function() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.container.card[data-modal]');
    const modalOverlay = document.querySelector('.overlay');

    function openModalById(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modalOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Function to close modal
    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove('active');
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling

        // Pause any videos when closing the modal
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
        });
    }

    // Make cards fully interactive (click, touch, keyboard)
    projectCards.forEach(card => {
        // Accessibility attributes so the whole card acts like a button
        card.setAttribute('role', 'button');
        if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

        const handleActivate = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const modalId = card.getAttribute('data-modal');
            openModalById(modalId);
        };

        // Click (desktop and mobile browsers synthesize click from touch)
        card.addEventListener('click', handleActivate);
        // Touch explicit handler for some mobile browsers that don't fire click
        card.addEventListener('touchend', handleActivate, { passive: false });
        // Keyboard: Enter or Space
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleActivate(e);
            }
        });
    });

    // Handle close button clicks and touch using event delegation
    const closeHandler = (e) => {
        // Check if event is on close button
        if (e.target.closest('.close-modal')) {
            e.preventDefault();
            const modal = e.target.closest('.project-modal');
            closeModal(modal);
            return;
        }

        // Check if interaction is outside modal content
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal) {
            const modalContent = activeModal.querySelector('.modal-content');
            const modalTitle = activeModal.querySelector('.modal-window-title');
            const inside = modalContent.contains(e.target) || modalTitle.contains(e.target);
            if (!inside) closeModal(activeModal);
        }
    };

    document.addEventListener('click', closeHandler);
    document.addEventListener('touchend', closeHandler, { passive: false });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.project-modal.active');
            closeModal(activeModal);
        }
    });
});
