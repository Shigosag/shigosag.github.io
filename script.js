/* PARTICLE BACKGROUND */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

/* Initialize particles based on screen size */
function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

/* Particle animation loop */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 242, 255, 0.3)';
    particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(animate);
}

/* SCROLL SPY */
const sections = document.querySelectorAll('section, header');
const navLi = document.querySelectorAll('.nav-links a');

window.onscroll = () => {
    let current = "";
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 60) {
        current = "links"; /* Snap to end if user is at the bottom */
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
    }

    /* Update the URL Hash */
    if (current) history.replaceState(null, null, `#${current}`);
  
    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
};

/* Smooth scrolling & flash animation */
navLi.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            navLi.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const card = targetSection.querySelector('.terminal-card');
            if (card) {
                card.classList.remove('target-flash');
                void card.offsetWidth; /* Trigger reflow to restart animation */
                card.classList.add('target-flash');
            }
        }
    });
});

/* Event listeners for resizing */
window.addEventListener('resize', initParticles);
initParticles();
animate();

/* THEME TOGGLE FUNCTION */
function toggleMode() {
    const html = document.documentElement;
    const isLight = html.classList.toggle('light-mode');

    html.style.filter = isLight ? 'invert(1)' : 'invert(0)';
  
    const btn = document.querySelector('nav button');
    btn.innerText = isLight ? '☀️' : '🌙';
}

/* FETCH GITHUB STATS */
const username = 'Shigosag';
fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
    .then(d => {
        document.getElementById("repos").innerText = "📦 Public Repos: " + (d.public_repos || 0);
        document.getElementById("followers").innerText = "👥 Followers: " + (d.followers || 0);
        document.getElementById("gists").innerText = "📝 Public Gists: " + (d.public_gists || 0);
    })
    .catch(() => {
        document.getElementById("github-stats-box").innerText = "Stats temporarily unavailable.";
    });
