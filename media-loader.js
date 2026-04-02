/**
 * Mwiwa Borehole Drilling — Gallery & Videos Reader
 * Drop this script into gallery.html and videos.html (or index.html)
 * Images are read from GitHub repo — no auth needed for public repos
 */

const MWIWA_REPO = {
  owner: 'lennexpo',
  repo: 'mwiwa-borehole-drilling',
  branch: 'main',
  galleryPath: 'gallery/images',
  videosPath: 'data/videos.json'
};

/* ─────────────────────────────────────────────
   GALLERY LOADER
   Call this in your gallery section:
   <div id="galleryGrid"></div>
   loadGalleryImages('galleryGrid');
───────────────────────────────────────────── */
async function loadGalleryImages(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">Loading gallery…</div>`;

  try {
    const url = `https://api.github.com/repos/${MWIWA_REPO.owner}/${MWIWA_REPO.repo}/contents/${MWIWA_REPO.galleryPath}`;
    const res = await fetch(url);

    if (!res.ok) {
      container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">No images yet.</div>`;
      return;
    }

    const files = await res.json();
    const images = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f.name));

    if (images.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">No images yet.</div>`;
      return;
    }

    container.innerHTML = '';

    images.forEach((file, index) => {
      const rawUrl = `https://raw.githubusercontent.com/${MWIWA_REPO.owner}/${MWIWA_REPO.repo}/${MWIWA_REPO.branch}/${file.path}`;

      const item = document.createElement('div');
      item.className = 'gallery-item'; // use your existing gallery card class
      item.style.cssText = `
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.4s ease ${index * 0.06}s, transform 0.4s ease ${index * 0.06}s;
      `;

      item.innerHTML = `
        <img
          src="${rawUrl}"
          alt="Mwiwa Borehole Drilling project"
          loading="lazy"
          style="width:100%;height:100%;object-fit:cover;display:block;"
        />
      `;

      container.appendChild(item);

      // Trigger fade-in after a tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        });
      });
    });

  } catch (err) {
    console.error('Gallery load error:', err);
    container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">Could not load gallery.</div>`;
  }
}


/* ─────────────────────────────────────────────
   VIDEOS LOADER
   Call this in your videos section:
   <div id="videosGrid"></div>
   loadVideos('videosGrid');
───────────────────────────────────────────── */
async function loadVideos(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">Loading videos…</div>`;

  try {
    const rawUrl = `https://raw.githubusercontent.com/${MWIWA_REPO.owner}/${MWIWA_REPO.repo}/${MWIWA_REPO.branch}/${MWIWA_REPO.videosPath}`;
    const res = await fetch(rawUrl);

    if (!res.ok) {
      container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">No videos yet.</div>`;
      return;
    }

    const videos = await res.json();

    if (!videos.length) {
      container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">No videos yet.</div>`;
      return;
    }

    container.innerHTML = '';

    videos.forEach((video, index) => {
      const thumb = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;

      const item = document.createElement('div');
      item.className = 'video-item'; // use your existing video card class
      item.style.cssText = `
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s;
        cursor: pointer;
        position: relative;
      `;

      item.innerHTML = `
        <div style="position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:8px;background:#111;">
          <img
            src="${thumb}"
            alt="${video.title}"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'"
          />
          <!-- Play button overlay -->
          <div style="
            position:absolute;inset:0;
            display:flex;align-items:center;justify-content:center;
            background:rgba(0,0,0,0.3);
            transition:background 0.2s;
          " onmouseenter="this.style.background='rgba(0,0,0,0.5)'" onmouseleave="this.style.background='rgba(0,0,0,0.3)'">
            <div style="
              width:60px;height:60px;border-radius:50%;
              background:#1e90ff;display:flex;align-items:center;justify-content:center;
              box-shadow:0 4px 20px rgba(30,144,255,0.5);
            ">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
        <p style="margin-top:10px;font-size:14px;font-weight:600;color:#fff;">${video.title}</p>
      `;

      // Click opens YouTube
      item.addEventListener('click', () => {
        window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
      });

      container.appendChild(item);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        });
      });
    });

  } catch (err) {
    console.error('Videos load error:', err);
    container.innerHTML = `<div style="text-align:center;padding:60px;color:#888">Could not load videos.</div>`;
  }
}
