

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let peopleArray = [];
let nameArray = [];
let decsArray = [];
let submitted = false;


let mouse = {
    x: undefined,
    y: undefined,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


window.addEventListener('click',
    async function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
        await sleep(100)
        mouse.x = undefined
        mouse.y = undefined

    }
)

class Particle {
    constructor(x, y, dirX, dirY, size, color) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.dirX = -this.dirX
        }
        if (this.y > canvas.height || this.y < 0) {
            this.dirY = -this.dirY
        }

        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10
            }
        }
        this.x += this.dirX
        this.y += this.dirY
        this.draw()
    }
}

function init() {
    particlesArray = []
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
        let y = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
        let dirX = (Math.random() * 5) - 2.5;
        let dirY = (Math.random() * 5) - 2.5;
        let color = "#eff1f3"

        particlesArray.push(new Particle(x, y, dirX, dirY, size, color))
    }
}
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    if (particlesArray) {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update()
        }
        connect()
    }

}

var search = document.getElementById("search-input")
search.addEventListener('keypress', searchArray)

function findDupe(array, value) {
    var dupe = array.find(function (x) {
        if (value === x) {
            return x
        }
    })
    return dupe
}

function changeParticleColor(particle, color) {
    particle.color = color


}

function searchArray(event) {
    if (event.keyCode == 13) {
        console.log("searching .  .  .")
        var _search = search.value
        if (findDupe(nameArray, _search)) {
            let index = nameArray.indexOf(_search)
            var particle_ = particlesArray[index]
            console.log(nameArray[index] + " / " + decsArray[index])
            changeParticleColor(particle_, "#b5352a")
            setTimeout(function () {
                changeParticleColor(particle_, "#eff1f3")
            }, 5000);

        } else {
            console.log("Does not exist")
        }
    }
}

window.addEventListener('resize', function () {
    canvas.width = innerWidth
    canvas.height = innerHeight
    mouse.radius = (canvas.height / 80) * (canvas.width / 80)
})


window.addEventListener('mouseout', function () {
    mouse.x = undefined
    mouse.y = undefined
})

function popUp() {
    var popUp = document.getElementById("form")
    popUp.style.display = "block"

}

function addButton() {
    popUp()
}

function add(name, desc) {
    if (!(findDupe(nameArray, name) && findDupe(decsArray, desc))) {
        nameArray.push(name)
        decsArray.push(desc)
        peopleArray.push([name, desc])
        addParticle()
    } else {
        console.log("already exists")
    }

}

function submitData() {
    var name = document.getElementById("name")
    var desc = document.getElementById("desc")

    console.log(name.value + " " + desc.value)

    if (name.value && desc.value) {
        add(name.value, desc.value)
        var popUp = document.getElementById("form")
        popUp.style.display = "none"
        name.value = ""
        desc.value = ""
    } else { console.log("nothing entered") }
}

function cancel() {
    const pop = document.getElementById("form")
    pop.style.display = "none"
}

var button = document.getElementById("add")
button.addEventListener('click', addButton)

var subBtn = document.getElementById('submit-btn')
subBtn.addEventListener('click', submitData)

var cancelBtn = document.getElementById('cancel-btn')
cancelBtn.addEventListener('click', cancel)

function connect() {
    let opacity = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y))
            if (distance < (canvas.width / 7) * (canvas.width / 7)) {
                opacity = 1 - (distance / 20000)
                ctx.strokeStyle = 'rgba(255, 255, 255,' + opacity + ')'
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                ctx.stroke()
            }
        }
    }
}



//init();
animate();

function addParticle() {
    let size = (Math.random() * 5) + 1;
    let x = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
    let y = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
    let dirX = (Math.random() * 5) - 2.5;
    let dirY = (Math.random() * 5) - 2.5;
    let color = "#eff1f3"
    console.log("added")
    particlesArray.push(new Particle(x, y, dirX, dirY, size, color))
}

