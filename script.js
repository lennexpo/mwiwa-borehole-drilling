/* ===== MWIWA BOREHOLE DRILLING — script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. DEFINE FUNCTIONS FIRST (This prevents the "not defined" error) ---

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 20);
  }

  function addCursorEvents(elements) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        if(follower) follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        if(follower) follower.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  // --- 2. DEFINE OBSERVERS ---

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(c => animateCounter(c));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // --- 3. RUN INITIALIZATIONS ---

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.hero-stats, .stats-bar').forEach(el => counterObserver.observe(el));
  addCursorEvents(document.querySelectorAll('a, button, .gallery-item'));

  // --- 4. CMS LOADER (Now safe to run) ---

  async function loadBoreholeProjects() {
    const gallery = document.getElementById('project-gallery');
    if (!gallery) return;

    try {
      const response = await fetch(`https://api.github.com/repos/lennexpo/mwiwa-borehole-drilling/contents/data/projects`);
      if (!response.ok) return;
      
      const files = await response.json();
      for (const file of files) {
        if (file.name === '.gitkeep') continue;

        const contentRes = await fetch(file.download_url);
        const text = await contentRes.text();

        const titleMatch = text.match(/title:\s*["']?(.*?)["']?$/m);
        const imageMatch = text.match(/image:\s*["']?(.*?)["']?$/m);
        
        const title = titleMatch ? titleMatch[1].trim() : "Mwiwa Project";
        let imgPath = imageMatch ? imageMatch[1].trim() : "";

        if (imgPath) {
          if (imgPath.startsWith('/')) imgPath = imgPath.substring(1);
          const finalImgUrl = `https://raw.githubusercontent.com/lennexpo/mwiwa-borehole-drilling/main/${imgPath}`;

          const item = document.createElement('div');
          item.className = 'gallery-item reveal'; 
          item.innerHTML = `
            <img src="${finalImgUrl}" alt="${title}" onerror="this.src='img1.jpeg'">
            <div class="gallery-overlay"><h4>${title}</h4></div>
          `;

          gallery.appendChild(item);
          addCursorEvents([item]);
          revealObserver.observe(item);
          
          item.addEventListener('click', () => {
            const lbImg = document.getElementById('lightbox-img');
            const lb = document.getElementById('lightbox');
            if(lbImg && lb) {
               lbImg.src = finalImgUrl;
               lb.classList.add('active');
               document.body.style.overflow = 'hidden';
            }
          });
        }
      }
    } catch (e) { console.warn("Syncing..."); }
  }

  loadBoreholeProjects();

  // --- 5. MOBILE NAV & OTHER LOGIC ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));

});