// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        displayProducts(data.products);
        
        // Setup filter buttons
        setupFilters(data.products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products
function displayProducts(products, category = 'all') {
    const grid = document.getElementById('products-grid');
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-episode">Episode #${product.episode}</p>
                <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer" class="shop-btn">
                    Shop Now
                </a>
            </div>
        </div>
    `).join('');
}

// Setup category filters
function setupFilters(products) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter products
            const category = btn.dataset.category;
            displayProducts(products, category);
        });
    });
}

// Load YouTube videos
async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        const data = await response.json();
        displayVideos(data.videos);
    } catch (error) {
        console.error('Error loading videos:', error);
        // If no videos.json exists, hide the section
        document.querySelector('.videos-section').style.display = 'none';
    }
}

// Display YouTube videos
function displayVideos(videos) {
    const grid = document.getElementById('videos-grid');
    
    // Only show the latest 3 videos
    const latestVideos = videos.slice(0, 3);
    
    grid.innerHTML = latestVideos.map(video => {
        // Extract video ID from URL
        const videoId = extractVideoId(video.url);
        
        return `
            <div class="video-card">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    title="${video.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p class="video-date">${video.date}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Extract YouTube video ID from various URL formats
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return url; // Return as-is if no pattern matches
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadVideos();
});
