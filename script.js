// Profile image selection
const profilePic = document.getElementById('profile-pic');
const imageUpload = document.getElementById('image-upload');

// Default image path
const defaultImage = 'images/pass3.jpg';

// Load saved image from localStorage or use default image
window.addEventListener('DOMContentLoaded', () => {
    const savedImage = localStorage.getItem('profile-image');
    profilePic.src = savedImage || defaultImage; // Use saved image or fallback to default
});

// When user uploads a new image
imageUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        profilePic.src = base64Image;
        localStorage.setItem('profile-image', base64Image);
    };
    reader.readAsDataURL(file);
});

// dynamic typing effect for the inputs
const fields = [
    {
        element: document.getElementById('user-name'),
        message: "Try entering your name here...",
        delayAfter: 0
    },
    {
        element: document.getElementById('user-location'),
        message: "Where are you from?",
        delayAfter: 1000 
    },
    {
        element: document.getElementById('user-bio'),
        message: "Write something about yourself...",
        delayAfter: 1500
    }
];

fields.forEach(({ element, message, delayAfter }) => {
    let charIndex = 0;

    function typeChar() {
        if (charIndex < message.length) {
            element.setAttribute("placeholder", message.substring(0, charIndex + 1));
            charIndex++;
            setTimeout(typeChar, 80); // Typing speed
        }
    }

    setTimeout(typeChar, delayAfter); // Start each with its delay
});

// Save data on input
document.getElementById('user-name').addEventListener('input', function() {
    localStorage.setItem('user-name', this.value);
});

document.getElementById('user-location').addEventListener('input', function() {
    localStorage.setItem('user-location', this.value);
});

document.getElementById('user-bio').addEventListener('input', function() {
    localStorage.setItem('user-bio', this.value);
});

// Load data on page load
window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('user-name');
    const location = localStorage.getItem('user-location');
    const bio = localStorage.getItem('user-bio');

    if (name) document.getElementById('user-name').value = name;
    if (location) document.getElementById('user-location').value = location;
    if (bio) document.getElementById('user-bio').value = bio;
});

// ✅ Function to save the selected skill rating into localStorage
function saveSkillRating(skill, rating) {
    // Get existing saved ratings or start with an empty object
    const skills = JSON.parse(localStorage.getItem('skills')) || {};
    
    // Save the new rating for the specific skill
    skills[skill] = rating;

    // Store the updated skills object back to localStorage
    localStorage.setItem('skills', JSON.stringify(skills));
}

// ✅ Function to load and apply saved skill ratings on page load
function loadSkillRatings() {
    // Get saved skills from localStorage or use empty object if none
    const skills = JSON.parse(localStorage.getItem('skills')) || {};

    // Loop through each saved skill and update its stars
    Object.keys(skills).forEach(skill => {
        const stars = document.querySelectorAll(`.stars[data-skill="${skill}"] .star`);
        updateStars(stars, skills[skill]); // Update the display
    });
}

// ✅ Function to visually update stars based on the rating
function updateStars(stars, rating) {
    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value')); // Get the star's number (1–5)
        
        // Highlight the star if its value is less than or equal to the rating
        star.style.color = value <= rating ? 'hsl(75, 94%, 57%)' : '#ccc';
    });
}

// ✅ Loop through each skill's star group to add interactions
document.querySelectorAll('.stars').forEach(starGroup => {
    const stars = starGroup.querySelectorAll('.star'); // Get the stars inside this group
    const skill = starGroup.getAttribute('data-skill'); // Get the skill name (e.g. 'html')

    // For each star in this group:
    stars.forEach(star => {
        // 🔸 When mouse hovers over a star, preview that rating
        star.addEventListener('mouseenter', () => {
            const hoverValue = parseInt(star.getAttribute('data-value'));
            updateStars(stars, hoverValue); // Show the highlight up to this star
        });

        // 🔹 When mouse leaves, restore the saved rating
        star.addEventListener('mouseleave', () => {
            const skills = JSON.parse(localStorage.getItem('skills')) || {};
            const savedRating = skills[skill] || 0;
            updateStars(stars, savedRating); // Reset to what was saved
        });

        // ✅ When a star is clicked, save the rating
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-value'));
            saveSkillRating(skill, rating); // Save to localStorage
            updateStars(stars, rating); // Update star display
        });
    });
});

// Run this when the page first loads to restore any saved ratings
window.addEventListener('DOMContentLoaded', loadSkillRatings);

document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    // Optional: Change button text based on the theme
    const isLightMode = document.body.classList.contains("light-mode");
    this.textContent = isLightMode ? "Switch to Dark Theme" : "Switch to Light Theme";
});