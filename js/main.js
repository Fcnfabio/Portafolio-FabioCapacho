// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
});
;(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();
document.querySelectorAll('a, button, .project-card, .contact-item, .skill-category').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.3)';
    cursorFollower.style.borderColor = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.borderColor = 'rgba(79,142,247,0.5)';
  });
});

// ─── SCROLL PROGRESS ───
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

// ─── NAV ───
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});
function updateActiveNav() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === current));
}

// ─── MOBILE NAV ───
const navToggle = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksList.classList.toggle('open');
});
navLinks.forEach(link => link.addEventListener('click', () => {
  navToggle.classList.remove('open');
  navLinksList.classList.remove('open');
}));

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── ROLE ROTATOR ───
const roles = ['FullStack Developer','UI/UX Designer','Algorithmic Trader','AI Enthusiast','Prompt Engineer','Python Developer'];
let roleIdx = 0;
const roleEl = document.getElementById('roleRotate');
function typeRole(text, cb) {
  let i = 0; roleEl.textContent = '';
  const t = setInterval(() => {
    roleEl.textContent += text[i++];
    if (i >= text.length) { clearInterval(t); setTimeout(cb, 1800); }
  }, 60);
}
function eraseRole(cb) {
  const t = setInterval(() => {
    const txt = roleEl.textContent;
    if (!txt.length) { clearInterval(t); cb(); return; }
    roleEl.textContent = txt.slice(0,-1);
  }, 35);
}
function cycleRoles() {
  typeRole(roles[roleIdx], () => eraseRole(() => {
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(cycleRoles, 200);
  }));
}
cycleRoles();

// ─── PARTICLES ───
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
    this.vx = (Math.random()-.5)*.3; this.vy = (Math.random()-.5)*.3;
    this.r = Math.random()*1.5+.5; this.alpha = Math.random()*.4+.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(79,142,247,${this.alpha})`; ctx.fill();
  }
}
const particles = Array.from({length:90}, () => new Particle());
function animateParticles() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let i=0;i<particles.length;i++) {
    for (let j=i+1;j<particles.length;j++) {
      const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if (dist<120) {
        ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(79,142,247,${.06*(1-dist/120)})`; ctx.lineWidth=.5; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── INTERSECTION OBSERVER ───
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible'); revealObs.unobserve(e.target);} });
}, {threshold:0.12});
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('animated'); skillObs.unobserve(e.target);} });
}, {threshold:0.3});
document.querySelectorAll('.skill-fill,.lang-bar').forEach(el => skillObs.observe(el));

const titleObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.5});
document.querySelectorAll('.section-title').forEach(el => titleObs.observe(el));

// ─── BUTTON RIPPLE ───
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// ─── CONTACT GLOW ───
document.querySelectorAll('.contact-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const r = item.getBoundingClientRect();
    item.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    item.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

// ─── AVATAR TILT ───
const avatarContainer = document.querySelector('.avatar-container');
if (avatarContainer) {
  avatarContainer.addEventListener('mousemove', e => {
    const r = avatarContainer.getBoundingClientRect();
    const dx = (e.clientX-r.left-r.width/2)/r.width*20;
    const dy = (e.clientY-r.top-r.height/2)/r.height*20;
    avatarContainer.style.transition = 'transform 0.05s linear';
    avatarContainer.style.transform = `perspective(600px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  avatarContainer.addEventListener('mouseleave', () => {
    avatarContainer.style.transition = 'transform 0.6s ease';
    avatarContainer.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
  });
}

// ─── CONTACT FORM ───
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const {name, email, message} = form;
    if (!name.value.trim()||!email.value.trim()||!message.value.trim()) {
      formNote.textContent = 'Please fill in all fields.';
      formNote.style.color = 'var(--red)'; return;
    }
    formNote.textContent = `Thanks, ${name.value.trim()}! I'll get back to you soon.`;
    formNote.style.color = 'var(--green)';
    form.reset();
    setTimeout(() => formNote.textContent = '', 5000);
  });
}

updateActiveNav();