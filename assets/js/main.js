/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav__link');   

function linkAction(){
  /*Active link*/
  navLink.forEach(n => n.classList.remove('active'));
  this.classList.add('active');
  
  /*Remove menu mobile*/
  const navMenu = document.getElementById('nav-menu')
  navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '50px',
    duration: 750,
    reset: false
});

/*SCROLL HOME*/
sr.reveal('.home__title',{}); 
sr.reveal('.button',{delay: 100}); 
sr.reveal('.home__img',{delay: 200}); 
sr.reveal('.home__social-icon',{ interval: 100}); 

/*SCROLL ABOUT*/
sr.reveal('.about__img',{}); 
sr.reveal('.about__subtitle',{delay: 200}); 
sr.reveal('.about__text',{delay: 200}); 
sr.reveal('.button',{}); 

/*SCROLL SKILLS*/
sr.reveal('.skills', {interval: 100})

/*SCROLL PROJECTS*/
sr.reveal('.card',{interval: 100}); 

/*SCROLL CONTACT*/
sr.reveal('.contact__container',{interval: 100}); 

/*SCROLL QUALIFICATION*/
sr.reveal('.qualification__container',{interval: 250});

/*SCROLL AWARDS*/
sr.reveal('.awards__container',{interval: 250});


// Change Theme
const btn = document.querySelector(".btn-theme");
const theme = document.querySelector("#theme");

btn.addEventListener("click", function() {
  if (theme.getAttribute("href") == "assets/css/styles.css") {
    theme.href = "assets/css/styles_dark.css";

  } else {
    theme.href = "assets/css/styles.css";
  }
});

/*===== GO TO TOP =====*/
//Get the button:
mybutton = document.getElementById("goToTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function goToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/*===== QUALIFICATION TOGGLE =====*/

function showExperience() {
  var eduToggle = document.getElementById("education-toggle");
  var expToggle = document.getElementById("experience-toggle");
  var exp = document.getElementById("experience");
  var edu = document.getElementById("education");

  eduToggle.style.opacity = 0.5;
  expToggle.style.opacity = 1;
  exp.style.display = "block";
  edu.style.display = "none";
}

function showEducation() {
  var eduToggle = document.getElementById("education-toggle");
  var expToggle = document.getElementById("experience-toggle");
  var exp = document.getElementById("experience");
  var edu = document.getElementById("education");

  expToggle.style.opacity = 0.5;
  eduToggle.style.opacity = 1;
  edu.style.display = "block";
  exp.style.display = "none";
}