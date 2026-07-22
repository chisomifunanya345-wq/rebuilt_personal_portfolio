/**
 * Projects Page JavaScript
 * Handles video preview interactions, modal functionality, and accessibility
 */

(function() {
    'use strict';

    // DOM Elements
    const modal = document.getElementById('videoModal');
    const modalBackdrop = modal.querySelector('.video-modal-backdrop');
    const modalVideo = document.getElementById('modalVideo');
    const modalVideoSource = modalVideo.querySelector('source');
    const modalCloseBtn = document.getElementById('videoClose');
    const watchDemoButtons = document.querySelectorAll('.watch-demo');
    const previewVideos = document.querySelectorAll('.project-preview');

    let activePreview = null;
    let focusableElements = [];
    let lastFocusedElement = null;

    /**
     * Open the video modal
     * @param {string} videoSrc - Path to the video file
     * @param {string} posterSrc - Path to the poster image
     */
    function openModal(videoSrc, posterSrc) {
        // Store the currently focused element for restoration
        lastFocusedElement = document.activeElement;

        // Pause all preview videos
        previewVideos.forEach(video => {
            video.pause();
        });

        // Set modal video source and poster
        modalVideoSource.src = videoSrc;
        modalVideo.poster = posterSrc;
        modalVideo.load();

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Focus the close button for accessibility
        setTimeout(() => {
            modalCloseBtn.focus();
            modalVideo.play().catch(() => {
                // Autoplay may be blocked, user can manually play
            });
        }, 400);

        // Trap focus within modal
        trapFocus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the video modal
     */
    function closeModal() {
        // Hide modal
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Pause and reset modal video
        modalVideo.pause();
        modalVideo.currentTime = 0;

        // Resume preview videos
        previewVideos.forEach(video => {
            video.play().catch(() => {
                // Autoplay may be blocked
            });
        });

        // Restore focus
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Trap focus within the modal for accessibility
     */
    function trapFocus() {
        focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
        );
    }

    /**
     * Handle Tab key navigation within modal
     * @param {KeyboardEvent} event
     */
    function handleTabKey(event) {
        if (!modal.classList.contains('active')) return;
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Event Listeners

    // Watch Demo buttons
    watchDemoButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const videoSrc = this.getAttribute('data-video-src');
            const posterSrc = this.getAttribute('data-poster');
            openModal(videoSrc, posterSrc);
        });
    });

    // Close button
    modalCloseBtn.addEventListener('click', closeModal);

    // Click outside to close
    modalBackdrop.addEventListener('click', closeModal);

    // Keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        if (event.key === 'Tab' && modal.classList.contains('active')) {
            handleTabKey(event);
        }
    });

    // Pause preview on hover, resume on leave
    previewVideos.forEach(video => {
        const projectVideo = video.closest('.project-video');

        projectVideo.addEventListener('mouseenter', function() {
            video.pause();
        });

        projectVideo.addEventListener('mouseleave', function() {
            // Only resume if modal is not open
            if (!modal.classList.contains('active')) {
                video.play().catch(() => {
                    // Autoplay may be blocked
                });
            }
        });
    });

    // Handle modal video ended event
    modalVideo.addEventListener('ended', function() {
        // Video ended, keep modal open for user to replay or close
    });

})();