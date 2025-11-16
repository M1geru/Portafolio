document.addEventListener('DOMContentLoaded', function() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.container.card[data-modal]');
    const modalOverlay = document.querySelector('.overlay');
    
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
    
    // Add click event to each project card
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                // Show the modal and overlay
                modal.classList.add('active');
                modalOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
    
    // Handle close button clicks using event delegation
    document.addEventListener('click', function(e) {
        // Check if click is on close button
        if (e.target.closest('.close-modal')) {
            e.preventDefault();
            const modal = e.target.closest('.project-modal');
            closeModal(modal);
            return;
        }
        
        // Check if click is outside modal content
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal) {
            const modalContent = activeModal.querySelector('.modal-content');
            const modalTitle = activeModal.querySelector('.modal-window-title');
            const clickedInsideModal = modalContent.contains(e.target) || modalTitle.contains(e.target);
            
            if (!clickedInsideModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.project-modal.active');
            closeModal(activeModal);
        }
    });
});
