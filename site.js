const menu = document.querySelector('.menu');
const navigation = document.querySelector('.nav');
menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', navigation.classList.toggle('open'));
});
document.addEventListener('click', event => {
  document.querySelectorAll('.nav details[open]').forEach(item => {
    if (!item.contains(event.target)) item.open = false;
  });
});
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const slides = [...hero.querySelectorAll('.slide')];
const slideButtons = [...hero.querySelectorAll('[data-slide]')];
const pauseButton = hero.querySelector('.pause');
let slideIndex = 0;
let timer;
let paused = false;
function showSlide(index) {
  slides[slideIndex].classList.remove('on');
  slideButtons[slideIndex].setAttribute('aria-pressed', 'false');
  slideIndex = index;
  slides[slideIndex].classList.add('on');
  slideButtons[slideIndex].setAttribute('aria-pressed', 'true');
}
function manageMotion() {
  clearInterval(timer);
  pauseButton.hidden = motion.matches;
  hero.toggleAttribute('data-paused', paused || document.hidden || motion.matches);
  pauseButton.setAttribute('aria-pressed', paused);
  pauseButton.setAttribute('aria-label', paused ? 'Relancer le diaporama' : 'Mettre le diaporama en pause');
  if (!paused && !motion.matches && !document.hidden) {
    timer = setInterval(() => showSlide((slideIndex + 1) % slides.length), 8000);
  }
}
for (const button of slideButtons) {
  button.addEventListener('click', () => {
    showSlide(Number(button.dataset.slide));
    manageMotion();
  });
}
pauseButton.addEventListener('click', () => {
  paused = !paused;
  manageMotion();
});
motion.addEventListener('change', manageMotion);
document.addEventListener('visibilitychange', manageMotion);
manageMotion();
if ('IntersectionObserver' in window && !motion.matches) {
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('seen');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px 24px 0px', threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
const photoDialog = document.querySelector('dialog');
if (photoDialog) {
  const image = photoDialog.querySelector('img');
  for (const button of document.querySelectorAll('[data-photo]')) {
    button.addEventListener('click', () => {
      image.src = button.dataset.photo;
      image.alt = button.querySelector('img').alt;
      photoDialog.showModal();
    });
  }
  photoDialog.addEventListener('click', event => {
    if (event.target === photoDialog) photoDialog.close();
  });
}
