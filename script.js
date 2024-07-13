class Persona {
    constructor(id, nombre, apellido, edad) {
        if (id !== null && nombre !== null && apellido !== null && edad !== null) {
            this.id = id;
            this.nombre = nombre;
            this.apellido = apellido;
            this.edad = edad;
        }
    }

    toString() {
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Edad: ${this.edad}`;
    }
}
class Heroe extends Persona {
    constructor(id, nombre, apellido, edad, alterEgo, ciudad, publicado) {
        super(id, nombre, apellido, edad);
        if (alterEgo != null && ciudad != null && publicado > 1940) {
            this.alterEgo = alterEgo;
            this.ciudad = ciudad;
            this.publicado = publicado;
        }
    }

    toString() {
        return `Heroe: ${super.toString()}, AlterEgo: ${this.alterEgo}, Ciudad: ${this.ciudad}, publicado: ${this.publicado}`;
    }
}
class Villano extends Persona {
    constructor(id, nombre, apellido, edad, enemigo, robos, asesinatos) {
        super(id, nombre, apellido, edad);
        if (enemigo != null && robos > 0 && asesinatos > 0) {
            this.enemigo = enemigo;
            this.robos = robos;
            this.asesinatos = asesinatos;
        }
    }

    toString() {
        return `Villano: ${super.toString()}, Enemigo: ${this.enemigo}, Robos: ${this.robos}, Asesinatos: ${this.asesinatos}`;
    }
}

let dataPersonas;
let arrayPersonas = [];

function cargarPersonas() {
    dataPersonas.forEach((persona) => {
        if (persona.alterEgo) {
            let heroe = new Heroe(persona.id, persona.nombre, persona.apellido, persona.edad, persona.alterEgo, persona.ciudad, persona.publicado);
            arrayPersonas.push(heroe);
        } else if (persona.enemigo) {
            let villano = new Villano(persona.id, persona.nombre, persona.apellido, persona.edad, persona.enemigo, persona.robos, persona.asesinatos);
            arrayPersonas.push(villano);
        }
    });
    cargarTabla(arrayPersonas);
    ocultarSpinner();
}

function cargarTabla(arrayPersonas) {
    let tabla = document.getElementById("cuerpo_Tabla");
    tabla.innerHTML = "";

    arrayPersonas.forEach((persona) => {
        let fila = document.createElement("tr");
        fila.setAttribute("id", `fila-${persona.id}`);

        let celdaID = document.createElement("td");
        celdaID.textContent = persona.id;
        fila.appendChild(celdaID);

        let celdaNombre = document.createElement("td");
        celdaNombre.textContent = persona.nombre;
        fila.appendChild(celdaNombre);

        let celdaApellido = document.createElement("td");
        celdaApellido.textContent = persona.apellido;
        fila.appendChild(celdaApellido);

        let celdaEdad = document.createElement("td");
        celdaEdad.textContent = persona.edad;
        fila.appendChild(celdaEdad);

        let celdaAlterEgo = document.createElement("td");
        celdaAlterEgo.textContent = isEmpty(persona.alterEgo) ? "N/A" : persona.alterEgo;
        fila.appendChild(celdaAlterEgo);

        let celdaCiudad = document.createElement("td");
        celdaCiudad.textContent = isEmpty(persona.ciudad) ? "N/A" : persona.ciudad;
        fila.appendChild(celdaCiudad);

        let celdaPublicado = document.createElement("td");
        celdaPublicado.textContent = isEmpty(persona.publicado) ? "N/A" : persona.publicado;
        fila.appendChild(celdaPublicado);

        let celdaEnemigo = document.createElement("td");
        celdaEnemigo.textContent = isEmpty(persona.enemigo) ? "N/A" : persona.enemigo;
        fila.appendChild(celdaEnemigo);

        let celdaRobos = document.createElement("td");
        celdaRobos.textContent = isEmpty(persona.robos) ? "N/A" : persona.robos;
        fila.appendChild(celdaRobos);

        let celdaAsesinatos = document.createElement("td");
        celdaAsesinatos.textContent = isEmpty(persona.asesinatos) ? "N/A" : persona.asesinatos;
        fila.appendChild(celdaAsesinatos);

        let celdaModificar = document.createElement("td");
        let btnModificar = document.createElement("button");
        btnModificar.textContent = "Modificar";
        btnModificar.addEventListener('click', function () {
            modificarPersona(persona.id);
        });
        celdaModificar.appendChild(btnModificar);
        fila.appendChild(celdaModificar);

        let celdaEliminar = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener('click', function () {
            eliminarPersona(persona);//.id
        });
        celdaEliminar.appendChild(btnEliminar);
        fila.appendChild(celdaEliminar);

        tabla.appendChild(fila);
    });
}

function obtenerPersonasPorAPI() {
    let http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            dataPersonas = JSON.parse(http.response);
            cargarPersonas();
        }
        else {
            if (http.readyState == 4) {
                alert("Ocurrio un problema en la red");
            }
        }
    }
    http.open("GET", "https://examenesutn.vercel.app/api/PersonasHeroesVillanos", false);
    http.send();
}

function cargarPersonaPorAPI(persona) {
    mostrarSpinner();
    let personaCargar = { 
        nombre: persona.nombre, 
        apellido: persona.apellido, 
        edad: persona.edad, 
        alterEgo: persona.alterEgo, 
        ciudad: persona.ciudad, 
        publicado: persona.publicado, 
        enemigo: persona.enemigo, 
        robos: persona.robos, 
        asesinatos: persona.asesinatos 
    };
    let url = 'https://examenesutn.vercel.app/api/PersonasHeroesVillanos';
    let headers = { 'Content-Type': 'application/json' };

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(personaCargar)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo realizar la operación.');
            }
            return response.json();
        })
        .then(data => {
            let nuevoId = data.id;
            persona.id = nuevoId;
            arrayPersonas.push(persona);
            cargarTabla(arrayPersonas);
            ocultarSpinner();
            resolve(persona);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            ocultarSpinner();
            reject(error);
        })
        .finally(() => {
            ocultarSpinner();
        });
    });
}

async function modificarPersonaPorAPI(persona) {
    mostrarSpinner();
    let url = `https://examenesutn.vercel.app/api/PersonasHeroesVillanos`;
    let headers = {
        'Content-Type': 'application/json'
    };

    let personaModificada = {
        id: persona.id,
        nombre: persona.nombre,
        apellido: persona.apellido,
        edad: persona.edad
    };

    if (persona instanceof Heroe) {
        personaModificada.alterEgo = persona.alterEgo;
        personaModificada.ciudad = persona.ciudad;
        personaModificada.publicado = persona.publicado;
    } else if (persona instanceof Villano) {
        personaModificada.enemigo = persona.enemigo;
        personaModificada.robos = persona.robos;
        personaModificada.asesinatos = persona.asesinatos;
    }

    try {
        let response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(personaModificada)
        });

        if (!response.ok) {
            throw new Error('No se pudo realizar la operación.');
        }

        modificarPersonaArray(personaModificada);
        mostrarTabla();
        alert("Se modificó correctamente");
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        mostrarTabla();
        alert("No se pudo modificar la persona.");
    } finally {
        ocultarSpinner();
    }
}

function eliminarPersonaAPI(id) {
    return new Promise((resolve, reject) => {
        mostrarSpinner();

        let url = `https://examenesutn.vercel.app/api/PersonasHeroesVillanos
`;
        let headers = {
            'Content-Type': 'application/json'
        };

        let personaDelete = {
            id: id
        };

        fetch(url, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(personaDelete)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo realizar la operación.');
                }
                resolve();
                eliminarPersonaArray(id);
                mostrarTabla();
            })
            .catch(error => {
                reject(error);
                mostrarTabla();
                alert("Ocurrio un error al eliminar persona");
            })
            .finally(() => {
                ocultarSpinner();
            });
    });
}

function agregarPersona() {
    if (validarDatosIngresados()) {
        let persona;
        let id = 0;
        let nombre = document.getElementById("input_Nombre").value;
        let apellido = document.getElementById("input_Apellido").value;
        let edad = document.getElementById("input_Edad").value;
        let select_tipo = document.getElementById("select_tipo").value;
        let alterEgo = document.getElementById("input_AlterEgo").value;
        let ciudad = document.getElementById("input_Ciudad").value;
        let publicado = document.getElementById("input_Publicado").value;
        let enemigo = document.getElementById("input_Enemigo").value;
        let robos = document.getElementById("input_Robos").value;
        let asesinatos = document.getElementById("input_Asesinatos").value;

        if (select_tipo === "heroe") {
            persona = new Heroe(id, nombre, apellido, edad, alterEgo, ciudad, publicado);
        } else if (select_tipo === "villano") {
            persona = new Villano(id, nombre, apellido, edad, paisOrigen, enemigo, robos, asesinatos);
        }

        cargarPersonaPorAPI(persona)
            .then(() => {
                mostrarTabla();
                alert("Se agregó correctamente");
            })
            .catch(error => {
                console.error('Error al procesar la solicitud:', error);
                mostrarTabla();
                alert("No se pudo agregar la persona.");
            });
    } else {
        alert("No ingreso los campos correspondientes");
    }
}


function validarDatosIngresados() {
    let datosValidos = false;
    let nombre = document.getElementById("input_Nombre").value;
    let apellido = document.getElementById("input_Apellido").value;
    let edad = document.getElementById("input_Edad").value;
    let select_tipo = document.getElementById("select_tipo").value;
    let alterEgo = document.getElementById("input_AlterEgo").value;
    let ciudad = document.getElementById("input_Ciudad").value;
    let publicado = document.getElementById("input_Publicado").value;
    let enemigo = document.getElementById("input_Enemigo").value;
    let robos = document.getElementById("input_Robos").value;
    let asesinatos = document.getElementById("input_Asesinatos").value;

    if (esValido(nombre) && esValido(apellido) && esValido(edad) && esValido(select_tipo)) {
        if (select_tipo === "heroe") {
            if (esValido(alterEgo) && esValido(ciudad) && esValido(publicado)) {
                datosValidos = true;
            }
        }
        else if (select_tipo === "villano") {
            if (esValido(enemigo) && esValido(robos) && esValido(asesinatos)) {
                datosValidos = true;
            }
        }
    }
    return datosValidos;
}

function mostrarTabla() {
    document.getElementById("form_Personas").style.display = "none";
    document.getElementById("tabla_Personas").style.display = "block";
}

function mostrarForm(bool) {
    document.getElementById("form_Personas").style.display = "block";
    document.getElementById("tabla_Personas").style.display = "none";
    ocultarMostrarCampo();
    if (bool) {
        document.getElementById("btnCrear").style.display = "none";
        document.getElementById("btnModificar").style.display = "inline";
    }
    else {
        let tituloForm = document.getElementById("tituloForm");
        tituloForm.innerHTML = "Cargar Persona";
        document.getElementById("btnCrear").style.display = "inline";
        document.getElementById("btnModificar").style.display = "none";
        document.getElementById("select_tipo").disabled = false;
        limpiarPantalla();
    }
}

function modificarPersona(id) {
    let tituloForm = document.getElementById("tituloForm");
    tituloForm.innerHTML = "Modificar Persona";
    mostrarForm(true);
    let persona;
    if (id > 0) {
        persona = arrayPersonas.find(persona => persona.id === id);
        cargarFormABM(persona);
    }
}

function modificarPersonaDatos() {
    if (validarDatosIngresados()) {
        let persona;
        let id = document.getElementById("input_Id").value;
        let nombre = document.getElementById("input_Nombre").value;
        let apellido = document.getElementById("input_Apellido").value;
        let edad = document.getElementById("input_Edad").value;
        let selectTipo = document.getElementById("select_tipo").value;
        let alterEgo = document.getElementById("input_AlterEgo").value;
        let ciudad = document.getElementById("input_Ciudad").value;
        let publicado = document.getElementById("input_Publicado").value;
        let enemigo = document.getElementById("input_Enemigo").value;
        let robos = document.getElementById("input_Robos").value;
        let asesinatos = document.getElementById("input_Asesinatos").value;

        if (selectTipo === "heroe") {
            persona = new Heroe(id, nombre, apellido, edad, alterEgo, ciudad, publicado);
        } else if (selectTipo === "villano") {
            persona = new Villano(id, nombre, apellido, edad, enemigo, robos, asesinatos);
        }

        modificarPersonaPorAPI(persona)
            .then(() => {
                mostrarTabla();
            })
            .catch(error => {
                console.error('Error al procesar la solicitud:', error);
                mostrarTabla();
            });
    } else {
        alert("No ingreso los campos correspondientes");
    }
}

function modificarPersonaArray(personaModif) {
    personaModificar = arrayPersonas.find((persona) => persona.id == personaModif.id);
    if (personaModificar != null) {
        personaModificar.nombre = personaModif.nombre;
        personaModificar.apellido = personaModif.apellido;
        personaModificar.edad = personaModif.edad;
        personaModificar.alterEgo = personaModif.alterEgo;
        personaModificar.ciudad = personaModif.ciudad;
        personaModificar.publicado = personaModif.publicado;
        personaModificar.enemigo = personaModif.enemigo;
        personaModificar.robos = personaModif.robos;
        personaModificar.asesinatos = personaModif.asesinatos;
        alert(`Usuario modificado:"\n"ID: ${personaModif.id}"\n"Nombre: ${personaModif.nombre}"\n"Apellido: ${personaModif.apellido}"\n"Edad: ${personaModif.edad}"\n"Alter Ego: ${personaModif.alterEgo}"\n"Ciudad: ${personaModif.ciudad}"\n"Publicado: ${personaModif.publicado}"\n"Enemigo: ${personaModif.enemigo}"\n"Robos: ${personaModif.robos}"\n"Asesinatos: ${personaModif.asesinatos}`);
        cargarTabla(arrayPersonas);
        mostrarTabla();
    }
    else {
        alert("No se encontro el ID")
    }
}
function cargarFormABM(persona) {
    document.getElementById("input_Id").value = persona.id;
    document.getElementById("input_Nombre").value = persona.nombre;
    document.getElementById("input_Apellido").value = persona.apellido;
    document.getElementById("input_Edad").value = persona.edad;
    if (persona instanceof Heroe) {
        document.getElementById("select_tipo").value = "heroe";
        document.getElementById("input_AlterEgo").value = persona.alterEgo;
        document.getElementById("input_Ciudad").value = persona.ciudad;
        document.getElementById("input_Publicado").value = persona.publicado;
        document.getElementById("input_Enemigo").value = "";
        document.getElementById("input_Robos").value = "";
        document.getElementById("input_Asesinatos").value = "";

        ocultarMostrarCampo();
    }
    else {
        document.getElementById("select_tipo").value = "villano";
        document.getElementById("input_Enemigo").value = persona.enemigo;
        document.getElementById("input_Robos").value = persona.robos;
        document.getElementById("input_Asesinatos").value = persona.asesinatos;
        document.getElementById("input_AlterEgo").value = "";
        document.getElementById("input_Ciudad").value = "";
        document.getElementById("input_Publicado").value = "";
        ocultarMostrarCampo();
    }
}

function ocultarMostrarCampo() {
    let valor = document.getElementById("select_tipo").value;
    if (valor === "heroe") {
        document.getElementById("input_AlterEgo").style.display = "block";
        document.getElementById("input_Ciudad").style.display = "block";
        document.getElementById("input_Publicado").style.display = "block";
        document.getElementById("input_Enemigo").style.display = "none";
        document.getElementById("input_Robos").style.display = "none";
        document.getElementById("input_Asesinatos").style.display = "none";
    }
    else if (valor === "villano") {
        document.getElementById("input_Enemigo").style.display = "block";
        document.getElementById("input_Robos").style.display = "block";
        document.getElementById("input_Asesinatos").style.display = "block";
        document.getElementById("input_AlterEgo").style.display = "none";
        document.getElementById("input_Ciudad").style.display = "none";
        document.getElementById("input_Publicado").style.display = "none";
    } else {
        document.getElementById("input_AlterEgo").style.display = "none";
        document.getElementById("input_Ciudad").style.display = "none";
        document.getElementById("input_Publicado").style.display = "none";
        document.getElementById("input_Enemigo").style.display = "none";
        document.getElementById("input_Robos").style.display = "none";
        document.getElementById("input_Asesinatos").style.display = "none";
    }
}

function eliminarPersona(persona) {
    eliminar = confirm(`Desea eliminar a: "\n"ID: ${persona.id}"\n"NOMBRE: ${persona.nombre}"\n"APELLIDO: ${persona.apellido}"\n"EDAD: ${persona.edad} ?`);
    if (persona.id > 0 && eliminar) {
        eliminarPersonaAPI(persona.id);
    }
    else {
        mostrarTabla();
    }
}

function eliminarPersonaArray(id) {
    if (id > 0) {
        arrayPersonas = arrayPersonas.filter(persona => persona.id != id);
        alert(`Persona con ID: ${id} eliminada`);
        cargarTabla(arrayPersonas);
    }
    mostrarTabla();
}

function limpiarPantalla() {
    document.getElementById("input_Id").value = "";
    document.getElementById("input_Nombre").value = "";
    document.getElementById("input_Apellido").value = "";
    document.getElementById("input_Edad").value = "";
    document.getElementById("input_AlterEgo").value = "";
    document.getElementById("input_Ciudad").value = "";
    document.getElementById("input_Publicado").value = "";
    document.getElementById("input_Enemigo").value = "";
    document.getElementById("input_Robos").value = "";
    document.getElementById("input_Asesinatos").value = "";
    document.getElementById("select_tipo").value = "";
}

function mostrarSpinner() {
    document.getElementById('pantallaCompletaSpinner').style.display = 'flex';
}

function ocultarSpinner() {
    document.getElementById('pantallaCompletaSpinner').style.display = 'none';
}

function isEmpty(str) {
    return (!str || str.length === 0 || undefined);
}

function esValido(valor) {
    return valor !== null && valor.trim() !== "";
}
