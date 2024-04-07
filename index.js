const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreEL = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight
class Pacman {
  constructor({
    position,
    velocity
  }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openrate = 0.12
this.rotation = 0
  }
  draw() {
  c.save()
  c.translate(this.position.x,this.position.y)
  c.rotate(this.rotation)
  c.translate(-this.position.x,-this.position.y)
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.radians < 0 || this.radians > .75) this.openrate = -this.openrate

    this.radians += this.openrate


  }
}
let manger = new Audio('img/pac-man-ghost-touched-made-with-Voicemod.mp3');
manger.volume = 0.5
let die = new Audio('img/pacman_death.wav');
die.volume = 0.5
let mangerghost = new Audio('img/pacman_eatghost.wav');
mangerghost.volume = 0.5
let ghostchase = new Audio('img/ghost-siren-sound-2-101soundboards.mp3');
ghostchase.volume = 0.5
class Ghost {
  static speed = 2
  constructor({
    name,
    position,
    velocity,
    image,
    color = "red"
  }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.color = color
    this.prevcollissions = []
    this.speed = 2
    this.image = image
    this.name = name
    this.scared = false

  }
  draw() {
    if (this.scared == true) {
      this.image = createImage('img/Vulnerable-ghost.png')
      this.speed = 1
      c.drawImage(this.image, this.position.x - 20, this.position.y - 20)
    } else (c.drawImage(this.image, this.position.x - 20, this.position.y - 20))
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

  }
}

class Pellet {
  constructor({
    position,
  }) {
    this.position = position
    this.radius = 3
  }
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}

class PowerUp {
  constructor({
    position,
  }) {
    this.position = position
    this.radius = 10
  }
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}

class Boundary {
  static width = 40
  static height = 40
  constructor({
    position,
    image,
    name = null
  }) {
    this.position = position
    this.width = 40
    this.height = 40
    this.image = image
    this.name = name
  }
  draw() {
    /*  c.fillStyle = "blue"
     c.fillRect(this.position.x, this.position.y, this.width, this.height) */
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}
const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.height * 3 + Boundary.height / 2,
      y: Boundary.width * 1 + Boundary.width / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    name: 'pink',
    image: createImage("img/pinkRight.png")
  }), new Ghost({
    position: {
      x: Boundary.height * 4 + Boundary.height / 2,
      y: Boundary.width * 9 + Boundary.width / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    name: 'orange',
    image: createImage("img/orangeRight.png")
  }), new Ghost({
    position: {
      x: Boundary.height * 8 + Boundary.height / 2,
      y: Boundary.width * 11 + Boundary.width / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    name: 'red',
    image: createImage("img/redRight.png")
  })
]
const pacman = new Pacman({
  position: {
    x: Boundary.height + Boundary.height / 2,
    y: Boundary.width + Boundary.width / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
})
const keys = {
  z: {
    pressed: false
  },
  q: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}
let lastkey = ''
let score = 0
const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "6", "-", "-", "-", "-", "-", "-", "-", "-", "2", ],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "|", ".", ".", ".", ".", ".", ".", ".", ".", "|", ],
  ["|", ".", "[", "]", ".", "[", "-", "]", ".", "_", ".", "[", "-", "]", ".", "[", "]", ".", "|", ],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|", ],
  ["|", ".", "[", "]", ".", "=", ".", "[", "-", "6", "-", "]", ".", "=", ".", "[", "]", ".", "|", ],
  ["|", ".", ".", ".", ".", "|", ".", ".", ".", "|", ".", ".", ".", "|", ".", ".", ".", ".", "|", ],
  ["5", "-", "-", "2", ".", "5", "-", "]", ".", "_", ".", "[", "-", "7", ".", "1", "-", "-", "7", ],
  ["|", "§", "§", "|", ".", "|", ".", ".", ".", ".", ".", ".", ".", "|", ".", "|", "§", "§", "|", ],
  ["4", "-", "-", "3", ".", "_", ".", "[", "]", ".", "[", "]", ".", "_", ".", "4", "-", "-", "3", ],
  ["T1", ".", ".", ".", ".", ".", ".", ".", ".", "p", ".", ".", ".", ".", ".", ".", ".", ".", "T2", ],
  ["1", "-", "-", "2", ".", "=", ".", "[", "-", "-", "-", "]", ".", "=", ".", "1", "-", "-", "2", ],
  ["|", "§", "§", "|", ".", "|", ".", ".", ".", ".", ".", ".", ".", "|", ".", "|", "§", "§", "|", ],
  ["5", "-", "-", "3", ".", "_", ".", "[", "-", "6", "-", "]", ".", "_", ".", "4", "-", "-", "7", ],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "|", ".", ".", ".", ".", ".", ".", ".", ".", "|", ],
  ["|", ".", "[", "2", ".", "[", "-", "]", ".", "_", ".", "[", "-", "]", ".", "1", "]", ".", "|", ],
  ["|", ".", ".", "|", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|", ".", ".", "|", ],
  ["5", "]", ".", "_", ".", "=", ".", "[", "-", "6", "-", "]", ".", "=", ".", "_", ".", "[", "7", ],
  ["|", ".", ".", ".", ".", "|", ".", ".", ".", "|", ".", ".", ".", "|", ".", ".", ".", ".", "|", ],
  ["|", ".", "[", "-", "-", "8", "-", "]", ".", "_", ".", "[", "-", "8", "-", "-", "]", ".", "|", ],
  ["|", "p", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|", ],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3", ],
];
function choisirCouleurAleatoire() {
  // Un tableau contenant les couleurs disponibles
  const couleurs = ['red', 'orange', 'pink'];
  
  // Générer un index aléatoire basé sur la longueur du tableau couleurs
  const indexAleatoire = Math.floor(Math.random() * couleurs.length);
  
  // Sélectionner et retourner une couleur aléatoirement
  return couleurs[indexAleatoire];
}
function createImage(src) {
  const image = new Image()
  image.src = src
  return image
}
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeVertical.png"),
          })
        );
        break;
      case "B":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/block.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner4.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeConnectorRight.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeConnectorBottom.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeConnectorLeft.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeConnectorTop.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/capBottom.png"),
          })
        );
        break;
      case "=":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/capTop.png"),
          })
        );
        break
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: Boundary.width * j + Boundary.width / 2,
              y: Boundary.height * i + Boundary.height / 2,
            },
          })
        );
        break;
      case "§":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/blockvide.png"),
          })
        );
        break
      case "T1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/blockvide.png"),
            name: "T1"
          })
        );
        break
      case "T2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/blockvide.png"),
            name: "T2"
          })
        );
        break
      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: Boundary.width * j + Boundary.width / 2,
              y: Boundary.height * i + Boundary.height / 2,
            }
          })
        )
        break
    }
  })
})


function circlecollideswithrectangle({
  circle,
  rectangle
}) {
  const padding = Boundary.width / 2 - circle.radius - 1
  return (
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding

  )
}

let animationId

function animate() {
  animationId = requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  if (keys.z.pressed && lastkey === 'z') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circlecollideswithrectangle({
          circle: {
            ...pacman,
            velocity: {
              x: 0,
              y: -5
            }
          },
          rectangle: boundary
        })
      ) {
        pacman.velocity.y = 0
        break
      } else {
        pacman.velocity.y = -5
      }


    }
  } else if (keys.q.pressed && lastkey === 'q') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circlecollideswithrectangle({
          circle: {
            ...pacman,
            velocity: {
              x: -5,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        pacman.velocity.x = 0
        break
      } else {
        pacman.velocity.x = -5
      }


    }
  } else if (keys.s.pressed && lastkey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circlecollideswithrectangle({
          circle: {
            ...pacman,
            velocity: {
              x: 0,
              y: 5
            }
          },
          rectangle: boundary
        })
      ) {
        pacman.velocity.y = 0
        break
      } else {
        pacman.velocity.y = 5
      }


    }
  } else if (keys.d.pressed && lastkey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circlecollideswithrectangle({
          circle: {
            ...pacman,
            velocity: {
              x: 5,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        pacman.velocity.x = 0
        break
      } else {
        pacman.velocity.x = 5
      }


    }
  }
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i]
  if (Math.hypot(
    ghost.position.x - pacman.position.x,
    ghost.position.y - pacman.position.y) < ghost.radius + pacman.radius)  {
      if (ghost.scared){
    ghosts.splice(i,1)
    mangerghost.play()
    setTimeout(() => {
      ghosts.push( new Ghost({
        position: {
          x: Boundary.height * 16 + Boundary.height / 2,
          y: Boundary.width * 1 + Boundary.width / 2
        },
        velocity: {
          x: Ghost.speed,
          y: 0,
        },
        name:  choisirCouleurAleatoire(),
        image: createImage("img/pinkRight.png")
      }))
        
    }, 6000);
  } 
  
    else
 { cancelAnimationFrame(animationId) 
  
  die.play();
  afficherModale(false);
 }
}
}

function afficherModale(victoire) {
  const modale = document.getElementById('modale');
  const message = document.getElementById('message-modale');
  message.textContent = victoire ? 'Victoire !' : 'Défaite...';
  modale.className = 'modale-montrer'; // Affiche la modale
}

document.getElementById('rejouer').addEventListener('click', function() {
  document.getElementById('modale').className = 'modale-cacher'; // Cache la modale
  // Ajoutez ici la logique pour recommencer le jeu
});

document.querySelector('.fermer').addEventListener('click', function() {
  document.getElementById('modale').className = 'modale-cacher'; // Cache la modale
});

if(pellets.length === 0){console.log('you win'); afficherModale(true);
cancelAnimationFrame(animationId)}
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i]
    powerUp.draw()
    if (Math.hypot(
        powerUp.position.x - pacman.position.x,
        powerUp.position.y - pacman.position.y) < powerUp.radius + pacman.radius) {
      powerUps.splice(i, 1)
      manger.play();

      ghosts.forEach(ghost => {
        ghost.scared = true
        ghostchase.play();
        console.log(ghost.scared)
        setTimeout(() => {
          ghost.scared = false
          console.log(ghost.scared)
          
        }, 6000)

      });
    }
  }
  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i]
    pellet.draw()
    if (Math.hypot(
        pellet.position.x - pacman.position.x,
        pellet.position.y - pacman.position.y) < pellet.radius + pacman.radius) {
      pellets.splice(i, 1)
      score += 10
      manger.play();
      scoreEL.innerHTML = score
    }
  }



  boundaries.forEach((boundary) => {
    boundary.draw()
    if (
      circlecollideswithrectangle({
        circle: pacman,
        rectangle: boundary
      })
    ) {
      if (boundary.name == "T1") {
        pacman.position.y = 9 * Boundary.height + 20
        pacman.position.x = 17 * Boundary.width + 20
        return
      }
      if (boundary.name == "T2") {
        pacman.position.y = 9 * Boundary.height + 20
        pacman.position.x = 1 * Boundary.width + 20
        return
      }
      pacman.velocity.x = 0
      pacman.velocity.y = 0
    }

  })

  pacman.update(),

    ghosts.forEach((ghost) => {
      ghost.update()
      

      const collisions = []
      boundaries.forEach(boundary => {
        if (circlecollideswithrectangle({
            circle: ghost,
            rectangle: boundary
          })) {

          if (boundary.name == "T1") {
            ghost.position.y = 9 * Boundary.height + 20
            ghost.position.x = 17 * Boundary.width + 20
            return
          }
          if (boundary.name == "T2") {
            ghost.position.y = 9 * Boundary.height + 20
            ghost.position.x = 1 * Boundary.width + 20
            return
          }
        }
        if (

          !collisions.includes('right') &&
          circlecollideswithrectangle({
            circle: {
              ...ghost,
              velocity: {
                x: ghost.speed,
                y: 0
              }
            },
            rectangle: boundary
          })
        )


        {
          collisions.push('right')
        }
        if (
          !collisions.includes('left') &&
          circlecollideswithrectangle({
            circle: {
              ...ghost,
              velocity: {
                x: -ghost.speed,
                y: 0
              }
            },
            rectangle: boundary
          })
        ) {
          collisions.push('left')
        }
        if (
          !collisions.includes('up') &&
          circlecollideswithrectangle({
            circle: {
              ...ghost,
              velocity: {
                x: 0,
                y: -ghost.speed
              }
            },
            rectangle: boundary
          })
        ) {
          collisions.push('up')
        }
        if (
          !collisions.includes('down') &&
          circlecollideswithrectangle({
            circle: {
              ...ghost,
              velocity: {
                x: 0,
                y: ghost.speed
              }
            },
            rectangle: boundary
          })
        ) {
          collisions.push('down')
        }
      })
      if (collisions.length > ghost.prevcollissions.length)
        ghost.prevcollissions = collisions
      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevcollissions)) {
        /* console.log('gogo') */

        if (ghost.velocity.x > 0) ghost.prevcollissions.push('right')
        else if (ghost.velocity.x < 0) ghost.prevcollissions.push('left')
        else if (ghost.velocity.y < 0) ghost.prevcollissions.push('up')
        else if (ghost.velocity.y > 0) ghost.prevcollissions.push('down')

        const pathways = ghost.prevcollissions.filter((collision) => {
          return !collisions.includes(collision)
        })
        const direction = pathways[Math.floor(Math.random() * pathways.length)]
        switch (direction) {
          case 'down':
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            ghost.image = createImage(`./img/${ghost.name}Down.png`)
            break
          case 'up':
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            ghost.image = createImage(`./img/${ghost.name}Up.png`)
            break
          case 'right':
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            ghost.image = createImage(`./img/${ghost.name}Right.png`)
            break
          case 'left':
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            ghost.image = createImage(`./img/${ghost.name}Left.png`)
            break
        }

        ghost.prevcollissions = []
      }
    })

    if (pacman.velocity.x>0) pacman.rotation=0
    else if  (pacman.velocity.x<0) pacman.rotation = Math.PI
    else if  (pacman.velocity.y>0) pacman.rotation = Math.PI/2
    else if  (pacman.velocity.y<0) pacman.rotation = Math.PI*1.5
}



animate()

window.addEventListener('keydown', ({
  key
}) => {
  switch (key) {
    case 'z':
      keys.z.pressed = true
      lastkey = 'z'
      break
    case 'q':
      keys.q.pressed = true
      lastkey = 'q'
      break
    case 's':
      keys.s.pressed = true
      lastkey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastkey = 'd'
      break
  }
})
window.addEventListener('keyup', ({
  key
}) => {
  switch (key) {
    case 'z':
      keys.z.pressed = false
      break
    case 'q':
      keys.q.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

// Modification du gestionnaire d'événement pour le bouton 'rejouer'
document.getElementById('rejouer').addEventListener('click', function() {
  // Recharge la page
  window.location.reload();
});

// Le reste de la logique pour gérer la fermeture de la modale et l'affichage en cas de victoire ou défaite reste le même
document.querySelector('.fermer').addEventListener('click', function() {
  document.getElementById('modale').className = 'modale-cacher'; // Cache la modale
});
