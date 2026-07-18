//Utilities
try{
	if(_ == null){
	function _(ghf){
		return document.getElementById(ghf);
	}

	}
}catch(e){
		
function _(ghf){
		return document.getElementById(ghf);
	}	
		
}

const el = document.querySelector(".df_titlebar_main_con");

// IntersectionObserver for visibility
const titleObserver = new IntersectionObserver(
  ([e]) => e.target.classList.toggle("pinned", e.intersectionRatio < 1),
  { threshold: [1] }
);
titleObserver.observe(el);

// Scroll threshold (example: 50px)
const scrollThreshold = 50;

window.addEventListener("scroll", () => {
  if (window.scrollY > scrollThreshold) {
    el.classList.add("pinned");
  } else if (el.getBoundingClientRect().top >= 0) {
    // only remove if it's fully in view and above threshold
    el.classList.remove("pinned");
  }
});