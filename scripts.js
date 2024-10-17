let currentSlideIndex = 0;

const bigImage = document.getElementById('big-image');
const imageUrls = [
    'chennai.jpg',
    'kerala.jpg',
    'goa.jpg',
    'bengaluru.jpg',
    'odisha.jpg'
];

document.getElementById('big-next-btn').addEventListener('click', function () {
    currentSlideIndex = (currentSlideIndex + 1) % imageUrls.length;
    updateImage();
});

document.getElementById('big-prev-btn').addEventListener('click', function () {
    currentSlideIndex = (currentSlideIndex - 1 + imageUrls.length) % imageUrls.length;
    updateImage();
});

function updateImage() {
    bigImage.style.backgroundImage = `url(${imageUrls[currentSlideIndex]})`;
}

// Initial setup
updateImage();