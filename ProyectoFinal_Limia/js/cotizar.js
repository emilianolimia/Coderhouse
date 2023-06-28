// Declaramos la clase Divisa
class Divisa {

    constructor(nombre, valor, detalle){

        this.nombre = nombre;
        this.valor = valor;
        this.detalle = detalle;
    }

    // Método para definir el innerHTML del elemento
    mostrar_HTML () {

        return `<h3> ${this.nombre} </h3>
                <div class="valor">
                    <b>$ ${this.valor} </b>
                </div>
                <p class="detalle"> ${this.detalle} </p>`;
    }
}

// Declaramos algunas variables que vamos a necesitar
let monto, valor_elegido, contenedor_padre, ultima_fecha, fecha, fecha_ISO;

// Declaramos un array y almacenamos todos los objetos Divisa que queramos
let divisas = [];
divisas.push(new Divisa ("Dólar Blue", 0, "Es el dólar ilegal, negociado entre privados en el mercado negro."));
divisas.push(new Divisa ("Dólar MEP", 0, "Vulgarmente 'dólar bolsa', surge de la compra de bonos en pesos y su venta en dólares."));
divisas.push(new Divisa ("Dólar Qatar", 0, "Cotización que surge por compra superior a 300 dólares con tarjeta argentina en el exterior."));
divisas.push(new Divisa ("Dólar Ahorro", 0, "Es la cotización para aquellos que pueden comprar 200 dólares mensuales en entidad bancaria."));
divisas.push(new Divisa ("Dólar Oficial", 0, "Cotización oficial del Banco de la Nación Argentina."));

// Obtenemos los precios de los distintos tipos de dólar usando la API de criptoya.com
fetch('https://criptoya.com/api/dolar')
    .then(response => response.json())
    .then(data => {
        
        // Accedemos a los datos de cotización
        divisas[0].valor = data.blue;
        divisas[1].valor = data.mep;
        divisas[2].valor = data.qatar;
        divisas[3].valor = data.solidario;
        divisas[4].valor = data.oficial;

        // Ordenamos con "sort" el array de divisas según las cotizaciones
        orden_ascendente(divisas);

        function orden_ascendente(array){

            return array.sort((a, b) => a.valor - b.valor); // Arrow function
        }

        valor_elegido = divisas[0].valor;
        
        // Definimos al contenedor padre y le quitamos la clase loading
        contenedor_padre = document.getElementById("divisas-principal");
        contenedor_padre.classList.remove("loading");

        // Por cada objeto del array, creamos un elemento en el DOM
        for (let i = 0; i < divisas.length; i++) {
            
            let divisa = divisas[i];
            let contenedor_hijo = document.createElement("div");

            // Definimos el innerHTML del elemento con un método
            contenedor_hijo.innerHTML = divisa.mostrar_HTML();

            // Agregamos una clase al elemento div
            contenedor_hijo.classList.add("recuadro");

            // Agregamos el elemento creado al contenedor padre
            contenedor_padre.appendChild(contenedor_hijo);

            // Ponemos el elemento a la escucha de varios eventos
            contenedor_hijo.addEventListener("click", function() {
                
                valor_elegido = divisa.valor;
                dolar_input.value = (isNaN(monto)) ? 0 : (monto / valor_elegido).toFixed(2);
            });

            contenedor_hijo.addEventListener("mouseover", function () {
                contenedor_hijo.classList.add("recuadro-hover");
            });

            contenedor_hijo.addEventListener("mouseout", function () {
                contenedor_hijo.classList.remove("recuadro-hover");
            });

            contenedor_hijo.addEventListener("click", function () {
            
                let recuadros = document.querySelectorAll(".recuadro");
                
                // Removemos la clase "recuadro-seleccionado" de todos los recuadros
                recuadros.forEach(function (recuadro) {
                recuadro.classList.remove("recuadro-seleccionado");
                });

                // Agregamos la clase "recuadro-seleccionado" al recuadro clickeado
                contenedor_hijo.classList.add("recuadro-seleccionado");
            });

            // Por defecto, el primer recuadro estará seleccionado
            if (i === 0) {
                contenedor_hijo.classList.add("recuadro-seleccionado");
            }
        }

        // Almacenamos en localStorage el array de divisas y la fecha
        let guardar_local = (clave, valor) => {localStorage.setItem(clave, valor)};
        guardar_local("divisas", JSON.stringify(divisas));

        // Registramos la fecha con el objeto "Date" y la guardamos en localStorage
        fecha = new Date();
        fecha_ISO = fecha.toISOString();
        localStorage.setItem("ultima_fecha", fecha_ISO);

        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

// Agregamos algunos eventos al header
let cripto = document.getElementById('criptomonedas');
let tooltip = document.getElementById('tooltip');

cripto.addEventListener('mouseover', () => {
    cripto.classList.add('disabled');
    tooltip.style.display = 'block';
});

cripto.addEventListener('mouseout', () => {
    cripto.classList.remove('disabled');
    tooltip.style.display = 'none';
});

// Referenciamos los inputs del DOM
let monto_input = document.getElementById("monto");
let dolar_input = document.getElementById("equivalente");

// Enfocamos automáticamente el input para que el usuario intuya que debe introducir un número allí
window.addEventListener('DOMContentLoaded', (event) => {

    monto_input.focus();
    monto_input.select();
});


// Recuperamos datos del localStorage y los mostramos al usuario
ultima_fecha = localStorage.getItem("ultima_fecha");

if (ultima_fecha) {

    let elemento_fecha = document.createElement('p');

    // Formateamos la fecha a un formato legible
    let fecha_LS = new Date(ultima_fecha);
    let fecha_formato = { day: 'numeric', month: 'numeric', year: 'numeric' };
    let fecha_formateada = fecha_LS.toLocaleDateString('es-ES', fecha_formato);
    let hora = fecha_LS.toLocaleTimeString('es-ES');
    elemento_fecha.textContent = `Última consulta: ${fecha_formateada} - ${hora}`;

    // Obtenemos el listado de divisas almacenado
    let divisas_LS = JSON.parse(localStorage.getItem("divisas"));

    for (const divisa of divisas_LS) {
    
        let linea = document.createElement('p');
        linea.textContent = `${divisa.nombre}: $ ${divisa.valor}`;
        elemento_fecha.appendChild(linea);
    }
    
    elemento_fecha.style.fontSize = "11px";
    elemento_fecha.style.margin = "15px";
    document.body.appendChild(elemento_fecha);
}

// Ponemos a la escucha el input en el que el usuario ingresa el monto en pesos
monto_input.addEventListener("input", cotizar)

function cotizar() {

    monto = parseFloat(monto_input.value);

    // Validamos que el input sea un número válido con un operador ternario
    dolar_input.value = (isNaN(monto)) ? 0 : (monto / valor_elegido).toFixed(2);
}

// Evitamos que se ingresen caracteres no númericos (permitimos el uso de borrar, flechas y punto)
monto_input.addEventListener("keydown", function(e) {

    let key = e.key;

    if (!/^\d$|^\.$|^Backspace$|^Arrow(Up|Down|Left|Right)$/.test(key)) {
        
        e.preventDefault();

        // Usamos la librería Toastify para mostrar un mensaje de error
        Toastify({
            text: "Caracter inválido",
            duration: 3000,
            gravity: "bottom",
            offset: {
                x: 50, // eje horizontal donde queremos que aparezca el toast
                y: 300 // eje vertical donde queremos que aparezca el toast
            }
        }).showToast();
    }
});