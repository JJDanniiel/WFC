const celdas = []; // 10 x 10
let RETICULAX = document.getElementById("cellSize").value;
let RETICULAY;

let ancho; //anchura de las celdas
let alto; //altura de las celdas
const startButton = document.getElementById("start");

const azulejos = [];
const NA = 15; //número de azulejos

let opcionesI = [];

const reglas = [
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // 0
  { UP: 1, RIGHT: 1, DOWN: 1, LEFT: 0 }, // 1
  { UP: 0, RIGHT: 1, DOWN: 1, LEFT: 1 }, // 2
  { UP: 1, RIGHT: 1, DOWN: 0, LEFT: 1 }, // 3
  { UP: 1, RIGHT: 0, DOWN: 1, LEFT: 1 }, // 4
  { UP: 1, RIGHT: 0, DOWN: 0, LEFT: 1 }, // 5
  { UP: 1, RIGHT: 1, DOWN: 0, LEFT: 0 }, // 6
  { UP: 0, RIGHT: 1, DOWN: 1, LEFT: 0 }, // 7
  { UP: 0, RIGHT: 0, DOWN: 1, LEFT: 1 }, // 8
  { UP: 1, RIGHT: 1, DOWN: 1, LEFT: 1 }, // 9
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // 10
  { UP: 1, RIGHT: 0, DOWN: 1, LEFT: 0 }, // 11
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 1 }, // 12
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // 13
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }, // 14
];

function preload() {
  for (let i = 0; i < NA; i++) {
    azulejos[i] = loadImage(`azulejos/Tile${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }

  for (let i = 0; i < RETICULAX * RETICULAY; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
  startButton.addEventListener("click", resetAll);
}

function draw() {
  const celdasDisponibles = celdas.filter((celda) => {
    return celda.colapsada == false;
  });
  if (celdasDisponibles.length > 0) {
    celdasDisponibles.sort((a, b) => {
      return a.opciones.length - b.opciones.length;
    });

    const celdasPorColapsar = celdasDisponibles.filter((celda) => {
      return celda.opciones.length == celdasDisponibles[0].opciones.length;
    });

    const celdaSeleccionada = random(celdasPorColapsar);
    celdaSeleccionada.colapsada = true;

    const opcionSeleccionada = random(celdaSeleccionada.opciones);
    celdaSeleccionada.opciones = [opcionSeleccionada];

    // print(celdaSeleccionada);

    for (let x = 0; x < RETICULAX; x++) {
      for (let y = 0; y < RETICULAY; y++) {
        const celdaIndex = x + y * RETICULAX;
        const celdaActual = celdas[celdaIndex];
        if (celdaActual.colapsada) {
          const indiceDeAzulejo = celdaActual.opciones[0];
          const reglasActuales = reglas[indiceDeAzulejo];

          image(azulejos[indiceDeAzulejo], x * ancho, y * alto, ancho, alto);

          //Monitorear UP
          if (y > 0) {
            const indiceUP = x + (y - 1) * RETICULAX;
            const celdaUP = celdas[indiceUP];
            if (!celdaUP.colapsada) {
              cambiarEntropia(celdaUP, reglasActuales["UP"], "DOWN");
            }
          }

          //Monitorear RIGHT
          if (x < RETICULAX - 1) {
            const indiceRIGHT = x + 1 + y * RETICULAX;
            const celdaRIGHT = celdas[indiceRIGHT];
            if (!celdaRIGHT.colapsada) {
              cambiarEntropia(celdaRIGHT, reglasActuales["RIGHT"], "LEFT");
            }
          }
          //Monitorear DOWN
          if (y < RETICULAY - 1) {
            const indiceDOWN = x + (y + 1) * RETICULAX;
            const celdaDOWN = celdas[indiceDOWN];
            if (!celdaDOWN.colapsada) {
              cambiarEntropia(celdaDOWN, reglasActuales["DOWN"], "UP");
            }
          }
          //Monitorear LEFT
          if (x > 0) {
            const indiceLEFT = x - 1 + y * RETICULAX;
            const celdaLEFT = celdas[indiceLEFT];
            if (!celdaLEFT.colapsada) {
              cambiarEntropia(celdaLEFT, reglasActuales["LEFT"], "RIGHT");
            }
          }
        } else {
          // strokeWeight(6);
          // rect(x * ancho, y * alto, ancho, alto);
        }
      }
    }
    // noLoop();
  } else {
  }
}

function cambiarEntropia(_celda, _regla, _opuesta) {
  const nuevasOpciones = [];
  for (let i = 0; i < _celda.opciones.length; i++) {
    if (_regla == reglas[_celda.opciones[i]][_opuesta]) {
      const celdaCompatible = _celda.opciones[i];
      nuevasOpciones.push(celdaCompatible);
    }
  }
  _celda.opciones = nuevasOpciones;
}

function resetAll() {
  RETICULAX = document.getElementById("cellSize").value;

  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  background(255, 255, 255);

  for (let i = 0; i < RETICULAX * RETICULAX; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
}
