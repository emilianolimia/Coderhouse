// Declaramos las variables que vamos a necesitar
let monto, opcion, resultado;
let dolar_blue = 470;
let dolar_mep = 430;
let dolar_tarjeta = 400;

function comenzar(){

    // Definimos la variable "monto" llamando a la función pedir_monto
    monto = pedir_monto();

    // Definimos la variable "opcion" llamando a la función pedir_opcion
    opcion = pedir_opcion();

    // Definimos la variable "resultado" llamando a la función calcular_resultado
    resultado = calcular_resultado(monto, opcion);

    // Mostramos el resultado al usuario con un alert
    alert("Monto ingresado: $" + monto + " pesos\n" + "El resultado de la cotización es: u$s " + resultado.toFixed(2) + " dólares.");

    // Le preguntamos al usuario si quiere hacer otra cotización
    desea_continuar();
}

function pedir_monto() {

    monto = parseFloat(prompt("Ingrese el monto en pesos a convertir:"));

    // Validamos que el input sea correcto con un bucle while
    while (isNaN(monto)){

        monto = parseFloat(prompt("Monto inválido. Ingrese el monto en pesos a convertir:"));
    }

    return monto;
}

function pedir_opcion(){
    
    // Pedimos al usuario que elija una opción de cotización con prompt
    opcion = parseInt(prompt("Elija una opción de cotización: \n1 - Dólar blue \n2 - Dólar MEP \n3 - Dólar tarjeta"));  
    
    // Validamos que el input sea una opción correcta con un bucle while
    while (opcion != 1 && opcion != 2 && opcion != 3){

        opcion = parseInt(prompt("Opción inválida. Intente nuevamente: \n1 - Dólar blue \n2 - Dólar MEP \n3 - Dólar tarjeta"));
    }

    return opcion;
}

function calcular_resultado(monto, opcion){
    
    // Calculamos el resultado de la conversión en base a los datos ingresados por el usuario
    if (opcion == 1) {
        resultado = monto / dolar_blue;        
    } else if (opcion == 2) {
        resultado = monto / dolar_mep;
    } else {
        resultado = monto / dolar_tarjeta;
    }
    return resultado;
}
  
function desea_continuar(){
    
    let continuar = prompt("¿Desea realizar otra cotización? (SI/NO)").toLowerCase();
  
    // Validamos que el input sea correcto
    while (continuar != "si" && continuar != "no") {

      continuar = prompt("Opción inválida. Por favor, ingrese 'SI' para realizar otra cotización o 'NO' para salir.").toLowerCase();
    }
  
    // Volvemos a pedir monto o despedimos al usuario
    if (continuar == "si") {
        comenzar();
    } else {
        alert("¡Hasta luego!");
    }
}

// Damos la bienvenida al usuario
alert("Bienvenido/a al conversor de los distintos tipos de cambio");
comenzar();