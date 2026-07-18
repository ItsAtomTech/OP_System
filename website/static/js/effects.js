//Landing page:

const img = document.querySelector('.image_container_h_image');

document.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();

    const imgX = rect.left + rect.width / 2;
    const imgY = rect.top + rect.height / 2;

    // invert the shadow away from the cursor
    const offsetX = (imgX - e.clientX) / 50;
    const offsetY = (imgY - e.clientY) / 50;

    img.style.filter = `drop-shadow(${offsetX}px ${offsetY}px 4px rgba(70, 70, 70, 0.4))`;
});


img.addEventListener('mouseleave', () => {
    img.style.filter = "drop-shadow(0px 0px 6px rgba(56, 56, 56, 0.3))";
});
