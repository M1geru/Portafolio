import  gsap  from "gsap";
import { Howl } from "howler";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import{DRACOLoader} from "three/addons/loaders/DRACOLoader.js";


const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const BACKGROUND_MUSIC_VOLUME = 0.1; // Volumen entre 0.0 y 1.0
const backgroundMusic = new Howl({
  src: ["/media/music/nier1.mp3"],
  loop: true,
  volume: BACKGROUND_MUSIC_VOLUME,
});


// Scene setup
const manager = new THREE.LoadingManager();

const dracoLoader = new DRACOLoader(manager);
dracoLoader.setDecoderPath('./draco/');

const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e3743);
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 200);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const light = new THREE.AmbientLight( 0xffffff,1); // soft white light

scene.add( light );

const light2 = new THREE.SpotLight( 0xffffff, 10, 100, Math.PI / 4, 1, 0 );

light2.position.set( 0, 15, 0 );


scene.add( light2 );






// UI update for title and background when switching sections
const workTitleEl = document.getElementById('work-section-title');
const portfolioTitleEl = document.querySelector('.folder-content h1');

const sectionMeta = {
  animacion: { title: 'Animation' },
  '3d': { title: '3D' },
  shorts: { title: 'Shorts' },
  web: { title: 'Web' },
  videojuegos: { title: 'Videogames' },
};

function updateWorkUI(section) {
  const meta = sectionMeta[section];
  if (meta && workTitleEl) workTitleEl.textContent = meta.title;
}

// Bind listeners locally to avoid dependency on external "tabs" variable
document.querySelectorAll('.folder-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const section = tab.getAttribute('data-section');
    updateWorkUI(section);
  });
  
  // Añadir eventos táctiles para móviles
  tab.addEventListener('touchstart', (e) => {
    e.preventDefault();
    tab.style.transform = 'scale(0.95)';
  }, { passive: false });
  
  tab.addEventListener('touchend', (e) => {
    e.preventDefault();
    tab.style.transform = '';
    
    // Ejecutar la misma acción que el clic
    const section = tab.getAttribute('data-section');
    updateWorkUI(section);
  }, { passive: false });
});








const musicButton = document.querySelector('.button-music');
const musicOnIcon = musicButton ? musicButton.querySelector('.music-on-icon') : null;
const musicOffIcon = musicButton ? musicButton.querySelector('.music-off-icon') : null;

// Solo inicializar si el botón existe
if (musicButton && musicOnIcon && musicOffIcon) {
  // Estado inicial: música activa
  musicOnIcon.style.display = 'block';
  musicOffIcon.style.display = 'none';
  
  const updateMuteState = (muted) => {
    if (muted) {
      backgroundMusic.volume(0);
    } else {
      backgroundMusic.volume(BACKGROUND_MUSIC_VOLUME);
      // Reanudar la música si está pausada
      if (!backgroundMusic.playing()) {
        backgroundMusic.play();
      }
    }
  };

const handleMuteToggle = (e) => {
  e.preventDefault();
  
  isMuted = !isMuted;
  updateMuteState(isMuted);
  
  // Toggle the 'muted' class on the button
  if (isMuted) {
    musicButton.classList.add('muted');
    // Intercambiar imágenes: mostrar off, ocultar on
    musicOnIcon.style.display = 'none';
    musicOffIcon.style.display = 'block';
  } else {
    musicButton.classList.remove('muted');
    // Intercambiar imágenes: mostrar on, ocultar off
    musicOnIcon.style.display = 'block';
    musicOffIcon.style.display = 'none';
  }

  // Add animation con retorno a estado normal
  gsap.to(musicButton, {
    scale: 1.3,
    rotate: 15,
    duration: 0.2,
    ease: "back.out(1.7)",
    onComplete: () => {
      // Regresar a estado normal
      gsap.to(musicButton, {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  });
};

let isMuted = false;
musicButton.addEventListener(
  "click",
  (e) => {
    if (touchHappened) return;
    handleMuteToggle(e);
  }
);

musicButton.addEventListener(
  "touchend",
  (e) => {
    touchHappened = true;
    handleMuteToggle(e);
    
    // Forzar retorno a estado normal en dispositivos táctiles
    setTimeout(() => {
      gsap.to(musicButton, {
        scale: 1,
        rotate: 0,
        duration: 0.2,
        ease: "power2.inOut"
      });
    }, 500);
  }
);

// Animaciones hover según el estado
musicButton.addEventListener("mouseenter", () => {
  if (isMuted) {
    // Estado muted: rotación inversa y escala diferente
    gsap.to(musicButton, {
      scale: 1.2,
      rotate: 15,
      duration: 0.3,
      //ease: "power2.inOut"
    });
    gsap.to(musicOffIcon, {
      scale: 1.1,
      duration: 0.2,
      //ease: "power1.inOut"
    });
  } else {
    // Estado activo: rotación normal
    gsap.to(musicButton, {
      scale: 1.2,
      rotate: 15,
      duration: 0.3,
     // ease: "power2.inOut"
    });
    gsap.to(musicOnIcon, {
      scale: 1.1,
      duration: 0.2,
     // ease: "power1.inOut"
    });
  }
});

musicButton.addEventListener("mouseleave", () => {
  // Restaurar estado normal
  gsap.to(musicButton, {
    scale: 1,
    rotate: 0,
    duration: 0.3,
    ease: "power2.inOut"
  });
  gsap.to([musicOnIcon, musicOffIcon], {
    scale: 1,
    duration: 0.2,
    ease: "power1.inOut"
  });
});

} // Cierre del bloque if (musicButton && musicOnIcon && musicOffIcon)

// Iniciar música con la primera interacción del usuario (requerido por navegadores)
let musicStarted = false;
function startMusicOnFirstInteraction() {
  if (!musicStarted && backgroundMusic) {
    backgroundMusic.play();
    musicStarted = true;

  }
}

// Agregar listeners para iniciar música
document.addEventListener('click', startMusicOnFirstInteraction, { once: true });
document.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });
document.addEventListener('keydown', startMusicOnFirstInteraction, { once: true });



/* -----------------------------------folder proyects ----------------------------------- */

document.querySelectorAll('.folder-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const section = this.getAttribute('data-section');
    document.querySelectorAll('.section-body').forEach(body => {
      body.style.display = 'none';
    });
    const targetSection = document.getElementById('section-' + section);
    if (targetSection) {
      targetSection.style.display = 'block';
      // reset scroll of the activated section
      targetSection.scrollTop = 0;
    }
    document.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    // Hide the big "Portafolio" title once a tab is selected
    if (portfolioTitleEl) {
      portfolioTitleEl.style.display = 'none';
    }
    // reset scroll of the folder content container as well
    const folderContent = document.getElementById('folder-content');
    if (folderContent) {
      folderContent.scrollTop = 0;
    }
  });

  // Añadir eventos táctiles para móviles
  tab.addEventListener('touchstart', (e) => {
    e.preventDefault();
    tab.style.transform = 'scale(0.95)';
  }, { passive: false });
  
  tab.addEventListener('touchend', (e) => {
    e.preventDefault();
    tab.style.transform = '';
    
    // Ejecutar la misma acción que el clic
    const section = tab.getAttribute('data-section');
    document.querySelectorAll('.section-body').forEach(body => {
      body.style.display = 'none';
    });
    const targetSection = document.getElementById('section-' + section);
    if (targetSection) {
      targetSection.style.display = 'block';
      // reset scroll of the activated section
      targetSection.scrollTop = 0;
    }
    document.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // Hide the big "Portafolio" title once a tab is selected
    if (portfolioTitleEl) {
      portfolioTitleEl.style.display = 'none';
    }
    // reset scroll of the folder content container as well
    const folderContent = document.getElementById('folder-content');
    if (folderContent) {
      folderContent.scrollTop = 0;
    }
  }, { passive: false });
});







/* -----------------------------------exit modal ----------------------------------- */

function exitwindow() {
  if (isModalOpen) {
    hideModal();
  }
}

document.querySelectorAll('.close-button, .modal-exit-button').forEach(btn => {
  btn.addEventListener('click', hideModal);
  
  // Agregar eventos táctiles para móviles
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideModal();
  }, { passive: false });
  
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });
});

// Agregar eventos táctiles al contenedor SVG también
document.querySelectorAll('.exit-button-svg').forEach(container => {
  container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideModal();
  }, { passive: false });
  
  container.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });
  
  // Agregar evento de clic adicional para móviles
  container.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideModal();
  });
  
  // Hacer el contenedor más accesible
  container.style.cursor = 'pointer';
  container.style.touchAction = 'manipulation';
});


/* -----------------------------------not pick behind ----------------------------------- */


function showModal(modalClass) {
  document.querySelector('.modals').style.display = 'block';
  document.querySelector(`.${modalClass}`).style.display = 'block';
  isModalOpen = true;
}

function hideModal() {
  document.querySelector('.modals').style.display = 'none';
  document.querySelector('.about').style.display = 'none';
  document.querySelector('.work').style.display = 'none';
  document.querySelector('.Contact').style.display = 'none';
   document.querySelector('.CV').style.display = 'none';
  isModalOpen = false;
}

/* -----------------------------------load screem ----------------------------------- */
let touchHappened = false;
let isModalOpen = false;


function setupCvTouchOpen() {
  const links = document.querySelectorAll('.CV .window-content a[href$=\'.pdf\']');
  if (!links.length) return;

  links.forEach((a) => {

    let openedFromTouch = false;

    a.addEventListener('touchstart', (e) => {
      openedFromTouch = true;
      try { window.open(a.href, '_blank', 'noopener,noreferrer'); } catch (err) {}
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    a.addEventListener('click', (e) => {
      if (openedFromTouch) {
        openedFromTouch = false;
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
}

if (document.readyState !== 'loading') {
  setupCvTouchOpen();
} else {
  document.addEventListener('DOMContentLoaded', setupCvTouchOpen);
}

const loadingScreen=document.querySelector(".loading-screen");
const loadingScreenButton = document.querySelector(".load-button");


manager.onLoad = function()  {

 loadingScreenButton.style.border = "8px solidrgb(184, 152, 13)";
  loadingScreenButton.style.background = "#590c19";
  loadingScreenButton.style.color = "#e6dede";
  loadingScreenButton.style.boxShadow = "rgba(209, 16, 16, 0.46) 0px 3px 8px";
  loadingScreenButton.textContent = "Entrar!";
  loadingScreenButton.style.cursor = "pointer";
  loadingScreenButton.style.transition =
    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  let isDisabled = false;
   
  function handleEnter() {
    if (isDisabled) return;
    loadingScreenButton.style.cursor = "default";
    loadingScreenButton.style.border = "8px solidrgb(113, 134, 116)";
    loadingScreenButton.style.background = "#590c19";
    loadingScreenButton.style.color = "#ffffff";
    loadingScreenButton.style.boxShadow = "none";
    loadingScreenButton.textContent = "~ BIENVENIDO ~";
    loadingScreen.style.background = "#b8e3d5";
    isDisabled = true;
    playReveal();
}

  loadingScreenButton.addEventListener("mouseenter", () => {
    loadingScreenButton.style.transform = "scale(1.3)";
   
  });

  loadingScreenButton.addEventListener("touchend", (e) => {
    touchHappened = true;
    e.preventDefault();
    handleEnter();
  });

  loadingScreenButton.addEventListener("click", (e) => {
    if (touchHappened) return;
    handleEnter();
  });

  loadingScreenButton.addEventListener("mouseleave", () => {
    loadingScreenButton.style.transform = "none";
  });
};





function playReveal() {
  const tl = gsap.timeline();
  tl.to(loadingScreen, {
    scale: 0.5,
    duration: 1.2,
    delay: 0.25,
    ease: "back.in(1.8)",
  }).to(
    loadingScreen,
    {
      y: "200vh",
      transform: "perspective(1000px) rotateX(45deg) rotateY(-35deg)",
      duration: 1.2,
      ease: "back.in(1.8)",
      onComplete: () => {
        isModalOpen = false;
        playIntroAnimation();
        loadingScreen.remove();
      },
    },
    "-=0.1"
  );
}

function playIntroAnimation() {

  const model = scene.children.find(obj => obj.type === "Group" || obj.type === "Mesh");

  if (!model) return;
  loadedModel.visible = true;

  if (model.type === "Group") {
    model.traverse(child => {
      if (child.isMesh) {
        animateMeshScale(child);
      }
    });
  } else if (model.isMesh) {
    animateMeshScale(model);
  }
}


function animateMeshScale(child) {

  if (!child.userData.originalScale) {
    child.userData.originalScale = child.scale.clone();
  }


  child.scale.set(0, 0, 0);

  gsap.to(child.scale, {
    x: child.userData.originalScale.x,
    y: child.userData.originalScale.y,
    z: child.userData.originalScale.z,
    duration: 1 + Math.random(),
    ease: "back.out(2)",
    delay: Math.random() * 0.5
  });
}





const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 20;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = Math.PI / 2;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;

const minPan = new THREE.Vector3(-5, 0, -5);
const maxPan = new THREE.Vector3(5, 5, 5);

const originalUpdate = controls.update;


controls.update = function() {

  originalUpdate.call(this);
  

  const clampedTarget = this.target.clone().clamp(minPan, maxPan);
  
  const distance = this.target.distanceTo(clampedTarget);
  if (distance > 0.01) { 
    this.target.lerp(clampedTarget, 0.05); 
  }
};

controls.update();

function updateCameraPosition() {
  // Posiciones para móvil y escritorio
  const mobilePosition = {
    x: 30.567116827654726,
    y: 14.018476147584705,
    z: 40.37040363900147,
    minDistance: 10,
    maxDistance: 45,
    targetX: -0.08206262548844094,
    targetY: 3.3119233527087255,
    targetZ: -0.7433922282864018
  };
  
  const desktopPosition = {
    x: 17.49173098423395,
    y: 9.108969527553887,
    z: 17.850992894238058,
    minDistance: 10,
    maxDistance: 20,
    targetX: 0.4624746759408973,
    targetY: 1.9719940043010387,
    targetZ: -0.8300979125494505
  };
  
  // Calcular factor de interpolación (0 = escritorio, 1 = móvil)
  const minWidth = 400;
  const maxWidth = 1200;
  let factor = 0;
  
  if (window.innerWidth <= minWidth) {
    factor = 1; // 100% móvil
  } else if (window.innerWidth >= maxWidth) {
    factor = 0; // 100% escritorio
  } else {
    // Interpolación lineal entre minWidth y maxWidth
    factor = 1 - (window.innerWidth - minWidth) / (maxWidth - minWidth);
  }
  
  // Interpolar posición de cámara
  camera.position.x = desktopPosition.x + (mobilePosition.x - desktopPosition.x) * factor;
  camera.position.y = desktopPosition.y + (mobilePosition.y - desktopPosition.y) * factor;
  camera.position.z = desktopPosition.z + (mobilePosition.z - desktopPosition.z) * factor;
  
  // Interpolar target
  controls.target.x = desktopPosition.targetX + (mobilePosition.targetX - desktopPosition.targetX) * factor;
  controls.target.y = desktopPosition.targetY + (mobilePosition.targetY - desktopPosition.targetY) * factor;
  controls.target.z = desktopPosition.targetZ + (mobilePosition.targetZ - desktopPosition.targetZ) * factor;
  
  // Interpolar distancias
  controls.minDistance = desktopPosition.minDistance + (mobilePosition.minDistance - desktopPosition.minDistance) * factor;
  controls.maxDistance = desktopPosition.maxDistance + (mobilePosition.maxDistance - desktopPosition.maxDistance) * factor;
  
  controls.update();
}

// Configurar cámara inicial
updateCameraPosition();

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  
    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  
    // Actualizar posición de cámara según tamaño (ahora interpolada)
    updateCameraPosition();
  
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  
// Add GLTFLoader



let loadedModel = null;
let screen1Material = null;
let screen2Material = null;

// Índices de video para cada pantalla
let currentVideoIndex1 = 0;
let currentVideoIndex2 = 0;

// Texturas de video
let videoTexture1 = null;
let videoTexture2 = null;

// Elementos de video para cada pantalla
let videoElements1 = [];
let videoElements2 = [];

// Listas de videos para cada pantalla
const videoFiles1 = [
  
  '/videos/tresh.webm',
  '/videos/edit.webm',
  '/videos/code_page_1.webm',
  // Agrega más videos para la pantalla 1 si es necesario
];

const videoFiles2 = [
  '/videos/alien.webm',
  '/videos/model_2.webm',
  '/videos/code_page.webm',
  // Agrega más videos para la pantalla 2 si es necesario
];

// Crear elementos de video para una pantalla específica
function createVideoElements(videoFiles, videoElements, onVideoEnd) {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);
  
  videoFiles.forEach((src, index) => {
    const video = document.createElement('video');
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = src;
    video.load();
    container.appendChild(video);
    videoElements.push(video);
    
    // Cuando un video termina, llamar a la función de callback
    video.addEventListener('ended', () => {
      if (typeof onVideoEnd === 'function') {
        onVideoEnd();
      }
    });
  });
  
  return videoElements;
}

// Reproducir el siguiente video en la lista para una pantalla específica
function playNextVideo(screenNumber = 1) {
  let currentIndex, videoFiles, videoElements;
  
  if (screenNumber === 1) {
    currentIndex = currentVideoIndex1;
    videoFiles = videoFiles1;
    videoElements = videoElements1;
  } else {
    currentIndex = currentVideoIndex2;
    videoFiles = videoFiles2;
    videoElements = videoElements2;
  }
  
  // Detener el video actual
  if (videoElements[currentIndex]) {
    videoElements[currentIndex].pause();
    videoElements[currentIndex].currentTime = 0;
  }
  
  // Pasar al siguiente video
  const nextIndex = (currentIndex + 1) % videoFiles.length;
  
  // Actualizar el índice correspondiente
  if (screenNumber === 1) {
    currentVideoIndex1 = nextIndex;
  } else {
    currentVideoIndex2 = nextIndex;
  }
  
  // Reproducir el siguiente video
  if (videoElements[nextIndex]) {
    videoElements[nextIndex].play().catch(e => console.error(`Error al reproducir video ${screenNumber}:`, e));
  }
  
  // Actualizar las texturas de video
  updateVideoTextures();
}

// Actualizar las texturas de video en los materiales
function updateVideoTextures() {
  // Actualizar textura de la pantalla 1
  if (videoElements1.length > 0 && screen1Material) {
    const currentVideo1 = videoElements1[currentVideoIndex1];
    if (currentVideo1) {
      if (!videoTexture1) {
        videoTexture1 = new THREE.VideoTexture(currentVideo1);
        videoTexture1.minFilter = THREE.LinearFilter;
        videoTexture1.magFilter = THREE.LinearFilter;
        videoTexture1.format = THREE.RGBFormat;
        screen1Material.map = videoTexture1;
      } else {
        videoTexture1.image = currentVideo1;
      }
      videoTexture1.needsUpdate = true;
      screen1Material.needsUpdate = true;
    }
  }
  
  // Actualizar textura de la pantalla 2
  if (videoElements2.length > 0 && screen2Material) {
    const currentVideo2 = videoElements2[currentVideoIndex2];
    if (currentVideo2) {
      if (!videoTexture2) {
        videoTexture2 = new THREE.VideoTexture(currentVideo2);
        videoTexture2.minFilter = THREE.LinearFilter;
        videoTexture2.magFilter = THREE.LinearFilter;
        videoTexture2.format = THREE.RGBFormat;
        screen2Material.map = videoTexture2;
      } else {
        videoTexture2.image = currentVideo2;
      }
      videoTexture2.needsUpdate = true;
      screen2Material.needsUpdate = true;
    }
  }
}


// Configurar la reproducción de videos para ambas pantallas
function setupVideoPlayback() {
  // Inicializar videos de la pantalla 1 si no se han creado
  if (videoElements1.length === 0 && videoFiles1.length > 0) {
    createVideoElements(videoFiles1, videoElements1, () => playNextVideo(1));
    
    // Iniciar el primer video de la pantalla 1
    if (videoElements1[0]) {
      videoElements1[0].play().catch(e => console.error('Error al reproducir video 1:', e));
    }
  }
  
  // Inicializar videos de la pantalla 2 si no se han creado
  if (videoElements2.length === 0 && videoFiles2.length > 0) {
    createVideoElements(videoFiles2, videoElements2, () => playNextVideo(2));
    
    // Iniciar el primer video de la pantalla 2
    if (videoElements2[0]) {
      // Esperar un poco antes de iniciar el segundo video
      setTimeout(() => {
        if (videoElements2[0]) {
          videoElements2[0].play().catch(e => console.error('Error al reproducir video 2:', e));
        }
      }, 500);
    }
  }
  
  // Verificar si los videos actuales terminaron y pasar al siguiente
  if (videoElements1[currentVideoIndex1]?.ended) {
    playNextVideo(1);
  }
  
  if (videoElements2[currentVideoIndex2]?.ended) {
    playNextVideo(2);
  }
  

  updateVideoTextures();
}

function startTextureAnimation() {
  if (!screen1Material && !screen2Material) {
    console.error('No se encontraron los materiales de las pantallas');
    return;
  }
  
  // Configurar la reproducción de videos
  setupVideoPlayback();

}

// Cuando cargues el modelo, puedes asignar el material:
loader.load(
  '/porta.gltf',
  function (gltf) {
    const model = gltf.scene;
    model.visible = false;
    scene.add(model);
    loadedModel = model;
    model.traverse((child) => {
      if (child.isMesh) {
        // Buscar los materiales de las pantallas
        if (child.name === 'polySurface47' || child.name.includes('Pantalla_1')) {
          screen1Material = Array.isArray(child.material) ? child.material[0] : child.material;
        } else if (child.name === 'polySurface44' || child.name.includes('Pantalla_2')) {
          screen2Material = Array.isArray(child.material) ? child.material[0] : child.material;
        }
      }
    });
    
    // Función para buscar materiales en todo el modelo
    function findScreenMaterials() {
      model.traverse((child) => {
        if (child.isMesh) {
  
          if (!screen1Material && (child.name.includes('Pantalla_1') || child.name.includes('pantalla1') || child.name.includes('screen1') || 
                                 (child.material && (child.material.name.includes('Pantalla_1') || child.material.name.includes('pantalla1'))))) {
            screen1Material = Array.isArray(child.material) ? child.material[0] : child.material;
          }
          
          if (!screen2Material && (child.name.includes('Pantalla_2') || child.name.includes('pantalla2') || child.name.includes('screen2') ||
                                 (child.material && (child.material.name.includes('Pantalla_2') || child.material.name.includes('pantalla2'))))) {
            screen2Material = Array.isArray(child.material) ? child.material[0] : child.material;
          }
        }
      });
    }
    

    findScreenMaterials();
    

    if (!screen1Material || !screen2Material) {

      model.traverse((child) => {
        if (child.isMesh) {
          if (!screen1Material && child.name.toLowerCase().includes('pantalla')) {
            screen1Material = Array.isArray(child.material) ? child.material[0] : child.material;
          }
        }
      });
      
 
      if (!screen1Material || !screen2Material) {
        model.traverse((child) => {
          if (child.isMesh) {
            if (!screen1Material) {
              screen1Material = Array.isArray(child.material) ? child.material[0] : child.material;
            } else if (!screen2Material) {
              screen2Material = Array.isArray(child.material) ? child.material[0] : child.material;
            }
          }
          
    
          if (screen1Material && screen2Material) return;
        });
      }
    }
    
 
    if (screen1Material || screen2Material) {
      startTextureAnimation();
    } else {
      console.error('No se pudieron encontrar los materiales de las pantallas');
    }

   
  },
  
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded'); 
  },
  function (error) {
    console.error('An error occurred while loading the model:', error);
  }
);


const encryptedContact = {
  email: 'aWcubWlndWVscm9qYXNAZ21haWwuY29t', 
  linkedin: 'aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL21pZ3VlbC1hbmdlbC1yLXIv', 
  whatsapp: 'KzU3MzE2NDUyMTkwMw==' 
};


function decryptBase64(encoded) {
  return atob(encoded);
}


function initContactButtons() {
  const contactButtons = document.querySelectorAll('.window_button .content-button');
  
  contactButtons.forEach((button, index) => {
 
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1000;
      white-space: nowrap;
    `;
    document.body.appendChild(tooltip);
    
   
    button.addEventListener('mouseenter', () => {
      let text;
      switch(index) {
        case 0: 
          text = 'Gmail';
          break;
        case 1:
          text = 'LinkedIn';
          break;
        case 2: 
          text = 'Whatsapp';
          break;
      }
      
      if (text) {
        tooltip.textContent = text;
        tooltip.style.opacity = '1';
        
        const rect = button.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
      }
    });
    

    button.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    

    button.addEventListener('click', () => {
      let action;
      
      switch(index) {
        case 0: 
          const email = decryptBase64(encryptedContact.email);
          action = `mailto:${email}`;
          break;
        case 1: 
          const linkedin = decryptBase64(encryptedContact.linkedin);
          action = linkedin;
          break;
        case 2: 
          const phone = decryptBase64(encryptedContact.whatsapp);
          action = `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
          break;
      }
      
      if (action) {
        window.open(action, '_blank', 'noopener,noreferrer');
      }
    });
    

    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      button.style.transform = 'scale(0.95)';
    }, { passive: false });
    
    button.addEventListener('touchend', (e) => {
      e.preventDefault();
      button.style.transform = 'scale(1)';
      let action;
      
      switch(index) {
        case 0: 
          const email = decryptBase64(encryptedContact.email);
          action = `mailto:${email}`;
          break;
        case 1:
          const linkedin = decryptBase64(encryptedContact.linkedin);
          action = linkedin;
          break;
        case 2: 
          const phone = decryptBase64(encryptedContact.whatsapp);
          action = `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
          break;
      }
      
      if (action) {
        window.open(action, '_blank', 'noopener,noreferrer');
      }
    }, { passive: false });
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initContactButtons);

const socialLinks = {
  red_1: "https://github.com/M1geru/Portafolio",
  red_2: "https://www.linkedin.com/in/miguel-angel-r-r/",
  Red_4: "https://sketchfab.com/Miguel-R",
};
const overpick = [
  "red_1", "red_2", "Red_4", "Contact_button", "My_Work_button", "About_button","CV_button"
];
const overpickscale = [
  "red_1", "red_2", "Red_4", "Contact_button", "My_Work_button", "About_button","CV_button","Plant","book_1","book_2","book_3","Camera","photo1","photo2","photo3","photo4","photo5","photo6","photo7","photo8","photo9","photo10","Cubeta","mouse","tablet"
  ,"Muneco","poster1","derbuf", "izbuf","teclado1","pen_1","pen_2","hoja"

];



function animateMeshscale(isHovering, Obj) {
  const scaleUp = 1.3;

  
  // Escala el hoveredObj si corresponde
    if (isHovering) {
      if (!Obj.userData.originalScale) {
        Obj.userData.originalScale = Obj.scale.clone();
      }
            gsap.to(Obj.scale, {
             // x: Obj.userData.originalScale.x * scaleUp,
             // y: Obj.userData.originalScale.y * scaleUp,
              z: Obj.userData.originalScale.z * scaleUp,
              duration: 0.3,
              ease: "back.out(2)",
            });
    }else {
      // Restaura la escala si no está en hover
      scene.traverse(child => {
        gsap.to(child.scale, {
         //x: child.userData.originalScale ? child.userData.originalScale.x : child.scale.x,
          //y: child.userData.originalScale ? child.userData.originalScale.y : child.scale.y,
          z: child.userData.originalScale ? child.userData.originalScale.z : child.scale.z,
       duration: 0.3,
        ease: "back.out(2)",
        
        });

      });
    }
       
  }

 
function pick() {
  

  if (!isModalOpen) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      let found = false;
      for (const intersect of intersects) {
        let obj = intersect.object;
        // Revisa el objeto y sus padres
        while (obj && !found) {

          if (obj.name === "Contact_button") {
            showModal('Contact');
            console.log("contacto");
            found = true;
          } else if (obj.name === "My_Work_button") {
            showModal('work');
            console.log("mis trabajos");
            found = true;
          } else if (obj.name === "About_button") {
            showModal('about');
            console.log("about");
            found = true;
          }else if (obj.name === "CV_button") {
            showModal('CV');
            console.log("CV");
            found = true;
          }


          Object.entries(socialLinks).forEach(([key, url]) => {
            //console.log(key);
            if (obj.name === key && !found) {
              window.open(url, "_blank", "noopener,noreferrer");
              found = true;
            }
          });
          
          obj = obj.parent;
        }
        if (found) break;
      }
    }
  }
}



let lastHoveredObj = null;

function over() {

  if (isModalOpen) return;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  let isHovering = false;
  let hoveredObj = null;

  if (intersects && intersects.length > 0) {
    for (const intersect of intersects) {
      let obj = intersect.object;
      if (obj.name==="silla_top" ) {

        if (!obj.userData.rotationTimeline || !obj.userData.rotationTimeline.isActive()) {
          obj.userData.rotationTimeline = gsap.to(obj.rotation, {
          z: obj.rotation.z + Math.PI,
          duration: 2,
          ease: "back.out(2)"
          });
        }
      }
      while (obj) {
        if (overpick.includes(obj.name)) {
          isHovering = true;
        }
        if (overpickscale.includes(obj.name)) {
          hoveredObj = obj;
          break;
        }
        obj = obj.parent;
      }
      if (hoveredObj) break;
    }
  }

  // Si el raycast apunta a un objeto escalable, escálalo; si no, restaura todos
  if (hoveredObj !== lastHoveredObj) {
    // Si había un objeto escalado antes, lo restauramos
    if (lastHoveredObj && overpickscale.includes(lastHoveredObj.name)) {
      animateMeshscale(false, lastHoveredObj);
    
    }
    // Si hay uno nuevo, lo escalamos
    if (hoveredObj && overpickscale.includes(hoveredObj.name)) {
      animateMeshscale(true, hoveredObj);
    }
    lastHoveredObj = hoveredObj;
  }

  // Si no hay ningún objeto escalable bajo el cursor, restaura todos
  if (!hoveredObj|| isModalOpen) {
    scene.traverse(child => {
      if (overpickscale.includes(child.name)) {
        animateMeshscale(false, child);
      }
    });
    lastHoveredObj = null;
  }

  canvas.style.cursor = isHovering ? "pointer" : "default";
}


const pointer = new THREE.Vector2();

document.querySelector('.modals').addEventListener('click', function(e) {
  // Solo cierra si el click es directamente en el fondo, no en las ventanas internas
  if (e.target === this) {
    exitwindow();
  }
});


window.addEventListener(  
  "touchstart", (e) => {
    touchHappened = false;
		pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },{ passive: false }

);
window.addEventListener("mousemove", (e) => {
  
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
  throttledOver();
});

window.addEventListener(  
  "touchend", (e) => {
    e.preventDefault();
    pick();
   
  },{ passive: false }

);
window.addEventListener("click", pick);

  
function extraAnim() {
  scene.traverse(child => {
    // Animar los ventiladores (fan_1, fan_2, fan_3, fan_4)
    if ([ "fan_2", "fan_3", "fan_1"].includes(child.name)) {
      child.rotation.y += 0.09; // velocidad de giro
    }

    if(child.name==="fan_4" ) {
      child.rotation.x += 0.09;
    }
    // Animar la lámpara (lamp)
    //if (child.name === "lamp") {
     // child.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
   // }
    // Animar la planta (Plant)
    //if (child.name === "Plant") {
    //  child.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
   // }
    // Animar el cubo de basura (Cubeta)
   
  });
}




const render = (timestamp) => {
    controls.update();
    extraAnim();
    
    // Actualizar videos
    if (screen1Material || screen2Material) {
      setupVideoPlayback();
    }
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
}

render();



let lastRaycastTime = 0;
function throttledOver() {
  const now = performance.now();
  if (now - lastRaycastTime > 30) { 
    over();
    lastRaycastTime = now;
  }
}


const about = document.getElementById('about');
const windowContent = about?.querySelector('.window-content');

if (windowContent) {
  windowContent.addEventListener('scroll', () => {
    const scrollPercent =
      windowContent.scrollTop /
      (windowContent.scrollHeight - windowContent.clientHeight);

    const posY = scrollPercent * 100;
    about.style.backgroundPosition = `center ${posY}%`;
  });
}
