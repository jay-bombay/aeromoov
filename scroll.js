// Get references to the HTML document element and the canvas
const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

// Total number of frames in the animation
const frameCount = 548;

// Array to store preloaded images
const images = [];

// Counter to track the number of loaded images
let loadedImages = 0;

// Function to construct the URL for each image frame
const currentFrame = index => (
    `Images/Aerosleep_mattress_premium_animation_${index.toString().padStart(3, '0')}.jpg`
);

// Function to preload images
const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      images[i] = img;
      loadedImages++;
      // Draw the first image once the first image is loaded
      if (loadedImages === 1) {
        setCanvasSize();
        drawImageScaled(img, context);
      }
    };
  }
};

// Placeholder image to initialize canvas settings
const img = new Image();
img.src = currentFrame(1);

// Function to set the canvas size according to the device pixel ratio
const setCanvasSize = () => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.scale(dpr, dpr);
};

// Function to draw the image scaled to fit the canvas while maintaining aspect ratio
const drawImageScaled = (img, ctx) => {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio);
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
};

// Event handler for image load to draw the first image
img.onload = function() {
  setCanvasSize();
  drawImageScaled(img, context);
};

// Function to update the image based on the current frame index
const updateImage = index => {
  if (images[index]) {
    drawImageScaled(images[index], context);
  } else {
    const img = new Image();
    img.src = currentFrame(index);
    img.onload = () => {
      images[index] = img;
      drawImageScaled(img, context);
    };
  }
};

// Throttling mechanism for scroll event handling
let ticking = false;

// Function to handle scroll events and update the displayed image
const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = html.scrollTop;
      const maxScrollTop = html.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount)
      );
      updateImage(frameIndex + 1);
      ticking = false;
    });
    ticking = true;
  }
};

// Event listener for window resize to adjust canvas size and redraw the image
window.addEventListener('resize', () => {
  setCanvasSize();
  drawImageScaled(images[Math.min(frameCount - 1, Math.ceil((html.scrollTop / (html.scrollHeight - window.innerHeight)) * frameCount)) + 1], context);
});

// Event listener for window scroll to update the image based on scroll position
window.addEventListener('scroll', onScroll);

// Preload all images at the start
preloadImages();

