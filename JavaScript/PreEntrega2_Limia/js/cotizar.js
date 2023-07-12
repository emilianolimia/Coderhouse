// Declaramos la clase Divisa
class Divisa {

    constructor(nombre, valor, detalle){

        this.nombre = nombre;
        this.valor = valor;
        this.detalle = detalle;
    }

    // Método para calcular cualquier monto en cualquier divisa en pesos
    valor_en_pesos(monto) {

        let total_pesos = monto / this.valor;
        return total_pesos;
    };
}

// Declaramos las variables que vamos a necesitar
let monto, divisa_elegida, opcion, resultado, fecha;

// Declaramos un array y almacenamos todos los objetos Divisa que queramos
let divisas = [];
divisas.push(new Divisa ("Dólar blue", 500, "Es el dólar ilegal negociado entre privados en el mercado negro."));
divisas.push(new Divisa ("Dólar MEP", 460, "También llamado 'dólar bolsa', surge de la compra de bonos en pesos y su venta en dólares."));
divisas.push(new Divisa ("Dólar tarjeta", 430, "Es la cotización que surge al usar una tarjeta argentina en el exterior."));

// Ordenamos con "sort" el array de divisas según las cotizaciones
orden_ascendente(divisas);

function orden_ascendente(array){

    return array.sort((a, b) => a.valor - b.valor); // Arrow function
}

function comenzar(){

    // Definimos la variable "monto" llamando a la función pedir_monto
    monto = pedir_monto();

    // Definimos la variable "divisa_elegida" con una función a la que le pasamos por parámetro un array y otra función
    divisa_elegida = pedir_opcion(divisas, mostrar_opciones);

    // Definimos la variable "resultado" llamando al método "valor_en_pesos" de la clase Divisa
    resultado = divisa_elegida.valor_en_pesos(monto);

    // Registramos la fecha con el objeto "Date"
    fecha = new Date();

    // Mostramos el resultado al usuario con un alert
    alert("Fecha y hora: " + fecha.toLocaleString() + "\nMonto ingresado: $" + monto + " pesos\nOpción elegida: " + 
        divisa_elegida.nombre + "\nCotización: $" + divisa_elegida.valor + "\nEl resultado de su operación es u$s " + 
        resultado.toFixed(2) + " dólares.");
}

function pedir_monto() {

    monto = parseFloat(prompt("Ingrese el monto en pesos a convertir:"));

    // Validamos que el input sea correcto con un bucle while
    while (isNaN(monto)){

        monto = parseFloat(prompt("Monto inválido. Ingrese el monto en pesos a convertir:"));
    }

    return monto;
}

function pedir_opcion(array, funcion){
    
    let string_opcion = "Elija una opción de cotización: \n";
    let contador = 1;

    // Usamos "for of" para recorrer el array de divisas y mostrar al usuario todas las opciones
    for (const elemento of array) {
    
        // Usamos la función pasada por parámetro para concatenar la información de las divisas
        string_opcion = funcion(elemento, string_opcion, contador);
        contador++;
    }

    // Pedimos al usuario que elija una opción de cotización con prompt
    opcion = parseInt(prompt(string_opcion));  
    
    // Validamos que el input sea una opción correcta con un bucle while
    while (opcion > divisas.length){

        opcion = parseInt(prompt("Opción inválida. Intente nuevamente: \n" + string_opcion));
    }

    // Devolvemos la divisa elegida por el usuario
    return divisas[opcion - 1];
}

function mostrar_opciones(opcion, mensaje, contador){

    mensaje = mensaje + contador + " - " + opcion.nombre + " ($" + opcion.valor + ")\n";
    return mensaje;
}