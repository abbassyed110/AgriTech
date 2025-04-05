/**
 * AgriTech Platform - Knowledge Base JavaScript
 * Handles functionality for the knowledge base page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize category filters
  initializeCategoryFilters();
  
  // Setup search functionality
  setupSearch();
  
  // Initialize article expandable content
  initializeArticleExpansion();
});

/**
 * Initialize category filter pills
 */
function initializeCategoryFilters() {
  const categoryPills = document.querySelectorAll('.category-pill');
  const currentCategory = new URLSearchParams(window.location.search).get('category') || 'all';
  
  categoryPills.forEach(pill => {
    // Set active class on current category
    if (pill.getAttribute('data-category') === currentCategory) {
      pill.classList.add('active');
    }
    
    // Add click event to navigate to filtered view
    pill.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      window.location.href = `/knowledge_base?category=${category}`;
    });
  });
}

/**
 * Setup search functionality for articles
 */
function setupSearch() {
  const searchInput = document.getElementById('article-search');
  const articleCards = document.querySelectorAll('.article-card');
  
  if (!searchInput || !articleCards.length) return;
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    let resultsFound = false;
    
    articleCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const content = card.querySelector('.card-text').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        card.style.display = 'block';
        resultsFound = true;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Show or hide no results message
    const noResultsMsg = document.getElementById('no-results-message');
    if (noResultsMsg) {
      noResultsMsg.style.display = resultsFound ? 'none' : 'block';
    }
  });
}

/**
 * Initialize article content expansion/collapse
 */
function initializeArticleExpansion() {
  const articleCards = document.querySelectorAll('.article-card');
  
  articleCards.forEach(card => {
    const cardText = card.querySelector('.card-text');
    const readMoreBtn = card.querySelector('.read-more-btn');
    
    if (!cardText || !readMoreBtn) return;
    
    // Check if the article content is long enough to need the read more button
    const fullContent = cardText.getAttribute('data-full-content');
    const shortContent = cardText.textContent;
    
    if (fullContent && fullContent.length > shortContent.length) {
      readMoreBtn.style.display = 'inline-block';
      
      // Toggle between full and short content
      readMoreBtn.addEventListener('click', function() {
        if (this.textContent.includes('Read More')) {
          cardText.textContent = fullContent;
          this.textContent = 'Read Less';
          card.classList.add('expanded');
        } else {
          cardText.textContent = shortContent;
          this.textContent = 'Read More';
          card.classList.remove('expanded');
        }
      });
    } else {
      readMoreBtn.style.display = 'none';
    }
  });
}

/**
 * Handle offline saving of articles for later reading
 */
function saveArticleForOffline(articleId) {
  if (typeof localStorage !== 'undefined') {
    // Get current article data
    const article = document.querySelector(`.article-card[data-article-id="${articleId}"]`);
    if (!article) return;
    
    const title = article.querySelector('.card-title').textContent;
    const content = article.querySelector('.card-text').getAttribute('data-full-content') || 
                   article.querySelector('.card-text').textContent;
    const category = article.getAttribute('data-category');
    const author = article.querySelector('.article-author').textContent;
    const date = article.querySelector('.article-date').textContent;
    
    // Create article object
    const articleData = {
      id: articleId,
      title: title,
      content: content,
      category: category,
      author: author,
      date: date,
      savedAt: new Date().toISOString()
    };
    
    // Get existing saved articles
    let savedArticles = [];
    try {
      const saved = localStorage.getItem('savedArticles');
      if (saved) {
        savedArticles = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error parsing saved articles:', error);
    }
    
    // Check if article is already saved
    const existingIndex = savedArticles.findIndex(a => a.id === articleId);
    if (existingIndex >= 0) {
      // Update existing article
      savedArticles[existingIndex] = articleData;
    } else {
      // Add new article
      savedArticles.push(articleData);
    }
    
    // Save back to localStorage
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    
    // Update UI
    const saveBtn = article.querySelector('.save-offline-btn');
    if (saveBtn) {
      saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved Offline';
      saveBtn.classList.remove('btn-outline-primary');
      saveBtn.classList.add('btn-success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save Offline';
        saveBtn.classList.remove('btn-success');
        saveBtn.classList.add('btn-outline-primary');
      }, 3000);
    }
    
    showNotification('Article saved for offline reading', 'success');
  } else {
    showNotification('Your browser does not support offline saving', 'warning');
  }
}

/**
 * Load offline saved articles when online content is unavailable
 */
function loadOfflineArticles() {
  const articlesContainer = document.getElementById('articles-container');
  if (!articlesContainer) return;
  
  // Try to get saved articles
  let savedArticles = [];
  try {
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      savedArticles = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error parsing saved articles:', error);
  }
  
  if (savedArticles.length === 0) {
    articlesContainer.innerHTML = `
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        No saved articles available offline.
      </div>
    `;
    return;
  }
  
  // Display saved articles
  let articlesHTML = `
    <div class="alert alert-info mb-4">
      <i class="fas fa-info-circle me-2"></i>
      You are viewing saved articles from offline storage.
    </div>
  `;
  
  savedArticles.forEach(article => {
    articlesHTML += `
      <div class="card article-card mb-4" data-article-id="${article.id}" data-category="${article.category}">
        <div class="card-body">
          <h3 class="card-title">${article.title}</h3>
          <div class="article-meta">
            <span class="article-author">${article.author}</span> | 
            <span class="article-date">${article.date}</span> | 
            <span class="article-category badge bg-secondary">${article.category}</span>
          </div>
          <p class="card-text">${article.content}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Saved on ${new Date(article.savedAt).toLocaleString()}</small>
        </div>
      </div>
    `;
  });
  
  articlesContainer.innerHTML = articlesHTML;
}

// Add event listeners to save offline buttons
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're offline and load saved articles if needed
  if (!navigator.onLine) {
    loadOfflineArticles();
  }
  
  // Setup save offline buttons
  const saveButtons = document.querySelectorAll('.save-offline-btn');
  
  saveButtons.forEach(button => {
    button.addEventListener('click', function() {
      const articleId = this.closest('.article-card').getAttribute('data-article-id');
      saveArticleForOffline(articleId);
    });
  });
});
