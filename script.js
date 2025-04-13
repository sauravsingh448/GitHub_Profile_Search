// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const profileContainer = document.querySelector('.profile-container');
const errorMessage = document.querySelector('.error-message');
const loading = document.querySelector('.loading');

// Event Listeners
searchButton.addEventListener('click', searchProfile);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchProfile();
    }
});

// Functions
async function searchProfile() {
    const username = searchInput.value.trim();
    
    if (!username) {
        showError('Please enter a GitHub username');
        return;
    }

    showLoading();
    hideError();
    hideProfile();

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
            throw new Error('User not found');
        }

        const data = await response.json();
        displayProfile(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayProfile(profile) {
    profileContainer.innerHTML = `
        <div class="profile-header">
            <img src="${profile.avatar_url}" alt="${profile.login}" class="profile-avatar">
            <div class="profile-info">
                <h2>${profile.name || profile.login}</h2>
                <p>@${profile.login}</p>
                <p>${profile.location || 'No location specified'}</p>
            </div>
        </div>
        <div class="profile-stats">
            <div class="stat-item">
                <i class="fas fa-users"></i>
                <span>${profile.followers} followers</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-user-friends"></i>
                <span>${profile.following} following</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-code-branch"></i>
                <span>${profile.public_repos} repos</span>
            </div>
        </div>
        ${profile.bio ? `<p class="profile-bio">${profile.bio}</p>` : ''}
        <div class="profile-links">
            ${profile.blog ? `<a href="${profile.blog}" target="_blank"><i class="fas fa-globe"></i> Website</a>` : ''}
            <a href="${profile.html_url}" target="_blank"><i class="fab fa-github"></i> GitHub</a>
            ${profile.twitter_username ? `<a href="https://twitter.com/${profile.twitter_username}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>` : ''}
        </div>
    `;

    profileContainer.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

function hideProfile() {
    profileContainer.style.display = 'none';
} 