
const scrollingImage = document.getElementById('scrollingImage');

// Function to stop the animation
const stopScroll = () => {
  scrollingImage.style.animationPlayState = 'paused';
};

// Function to start the animation
const startScroll = () => {
  scrollingImage.style.animationPlayState = 'running';
};

// Event listener for mouse hover
scrollingImage.addEventListener('mouseover', stopScroll); // Stop animation when cursor is on image
scrollingImage.addEventListener('mouseout', startScroll); // Start animation when cursor leaves the image