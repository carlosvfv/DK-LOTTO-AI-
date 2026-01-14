// ================================================
// FADE PATTERN - Temporary Hover Effect
// Small radius (2-3 squares), returns to original after 500ms
// ================================================

(function () {
    'use strict';

    let created = false;

    function create() {
        if (created) return;
        created = true;

        console.log('🎨 Creating fade pattern with temporary hover...');

        const container = document.createElement('div');
        container.id = 'fadePattern';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2';

        const cols = Math.ceil(window.innerWidth / 12);
        const rows = Math.ceil(window.innerHeight / 12);

        // Subtle, elegant colors - restored for "light up" effect
        const hoverColors = [
            '#b83040', // Deep muted red
            '#8a2a3a', // Dark wine red
            '#4a5a7a', // Muted navy blue
            '#5a4a6a', // Deep muted purple
            '#6a5550', // Warm muted brown
        ];
        const squares = [];

        // Create all squares
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const s = document.createElement('div');

                const randomOpacity = Math.random();
                const fadeProgress = r / (rows - 1);
                const fadeMultiplier = 1 - (fadeProgress * 0.8);
                const finalOpacity = (randomOpacity * fadeMultiplier) * 0.4;

                const x = c * 12;
                const y = r * 12;

                s.style.cssText = `
                    position:absolute;
                    left:${x}px;
                    top:${y}px;
                    width:8px;
                    height:8px;
                    background:#dc283c;
                    opacity:${finalOpacity};
                    border-radius:2px;
                    transition:background 0.15s ease, opacity 0.15s ease, transform 0.1s ease;
                `;

                container.appendChild(s);
                squares.push({
                    el: s,
                    x,
                    y,
                    baseOpacity: finalOpacity,
                    resetTimer: null
                });
            }
        }

        document.body.insertBefore(container, document.body.firstChild);

        // Global mouse tracking
        let mouseX = -100;
        let mouseY = -100;
        let animating = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!animating) {
                animating = true;
                requestAnimationFrame(updateSquares);
            }
        });

        function updateSquares() {
            squares.forEach((square) => {
                const { el, x, y, baseOpacity } = square;
                const dx = mouseX - x - 4;
                const dy = mouseY - y - 4;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Small radius randomly lit up
                // Radius 20px, 50% chance to light up -> Fine sparkle trail
                if (distance < 20 && Math.random() > 0.5) {
                    const newColor = hoverColors[Math.floor(Math.random() * hoverColors.length)];
                    el.style.background = newColor;
                    el.style.opacity = Math.min(0.9, baseOpacity + 0.6); // Light up bright
                    el.style.transform = 'scale(1.3)'; // Pop out

                    // Clear previous timer
                    if (square.resetTimer) {
                        clearTimeout(square.resetTimer);
                    }

                    // Reset after 250ms (quarter second)
                    square.resetTimer = setTimeout(() => {
                        el.style.background = '#dc283c';
                        el.style.opacity = baseOpacity;
                        el.style.transform = 'scale(1)';
                        square.resetTimer = null;
                    }, 250);
                }
            });

            animating = false;
        }

        console.log(`✅ Created ${squares.length} squares!`);
        console.log('👉 Move mouse - squares light up temporarily!');
    }

    if (document.body) {
        setTimeout(create, 50);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(create, 50));
    }
})();
