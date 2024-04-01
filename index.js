const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
class Pacman {
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 10

    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

class Boundary {
    static width = 40
    static height = 40
    constructor({
        position
    }) {
        this.position = position
        this.width = 40
        this.height = 40

    }
    draw() {
        c.fillStyle = "blue"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
const boundaries = []
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
const map = [
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", "-", "-", " ", " ", " ", "-", "-", "-", "-", "-"],
    ["-", " ", "-", "-", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", "-", "-", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", "-", "-", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", " ", " ", "-", "-", "-", "-", "-"],
    ["-", " ", "-", "-", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", "-", "-", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", "-", " ", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
]
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case "-":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.height * j,
                            y: Boundary.width * i
                        }
                    })
                )
                break
        }
    })
})

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    boundaries.forEach((boundary) => {
        boundary.draw()
        if (
            pacman.position.y - pacman.radius <= boundary.position.y + boundary.height && pacman.position.x + pacman.radius >= boundary.position.x && pacman.position.y + pacman.radius >= boundary.position.y && pacman.position.x - pacman.radius <= boundary.position.x + boundary.width

        ) {
            console.log('colision')
        }
    })
    pacman.update()
    pacman.velocity.y = 0
    pacman.velocity.x = 0

    if (keys.z.pressed && lastkey === 'z'){
        pacman.velocity.y = -5
    }else if (keys.q.pressed && lastkey === 'q'){
        pacman.velocity.x =-5
    }else if (keys.s.pressed && lastkey === 's'){
        pacman.velocity.y =5
    }else if (keys.d.pressed && lastkey === 'd'){
        pacman.velocity.x =5
    }
}
animate()

window.addEventListener('keydown', ({
    key
}) => {
    console.log(key)
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
    console.log(keys.d.pressed)
    console.log(keys.z.pressed)
    console.log(keys.s.pressed)
    console.log(keys.q.pressed)
})
window.addEventListener('keyup', ({key}) => {
    console.log(key)
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
    console.log(pacman.velocity)
})