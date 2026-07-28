document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  toggle && toggle.addEventListener('click', () => {
    const shown = nav.style.display === 'flex';
    nav.style.display = shown ? 'none' : 'flex';
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
