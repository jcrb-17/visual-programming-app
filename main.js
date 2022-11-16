let agregarVariable = document.getElementById("AgregarVariable");
let agregarOperacion = document.getElementById("AgregarOperacion");
let agregarSi = document.getElementById("AgregarSi");
let agregarRepetir = document.getElementById("AgregarRepetir");

let agregarImprimir = document.getElementById("AgregarImprimir");

let ejecutar = document.getElementById("Ejecutar");
let guardar = document.getElementById("Guardar");
let cargar = document.getElementById("Cargar");
let listarProgramas = document.getElementById("ListarProgramas");
let convertir = document.getElementById("Convertir");

let variablesDiv = document.getElementById("variablesDiv");
let variables = document.getElementsByClassName("variable");
let demasInstrucciones = document.getElementById("demasInstrucciones");

let instrucciones2 = document.getElementById("instrucciones");

let operaciones = document.getElementsByClassName("operacion");

let mensajes = document.getElementById("mensajes");

let variablesLista = []; //almacena los nombres de las variables que se han creado

let textarea = document.getElementById("textarea"); // autofocus on textarea, esto se puede remover
//console.log(textarea.value);

let lenguaje = document.getElementById("leng");

let conversionExitosa = 0;

let textarea2 = document.getElementById("textarea2"); // autofocus on textarea, esto se puede remover

//let counter = 0;

//actualiza los nombres de las variables
//revisar que no se repitan nombres de variables
function recorrerVariables() {
  //console.log(variables.length);
  variablesLista = []; //cuidado, variable global
  for (let i = 0; i < variables.length; i++) {
    variablesLista.push(variables[i].childNodes[2].value); //childNodes[2] selecciona el input del nombre de la variable
  }
  //console.log(variablesLista);
}

//retorna un select con el nombre de las variables,se usa en operaciones
function recorrerVariables2() {
  //eliminar los divs de las Operaciones
  text = "<select>";
  for (let i = 0; i < variablesLista.length; i++) {
    text += "<option>" + variablesLista[i] + "</option>"; //childNodes[2] selecciona el input del nombre de la variable
  }
  text += "</select>";
  return text;
}

//Refresca el select de las variables dentro de las Operaciones
function refrescarVariables() {
  let operacionesL = operaciones.length;
  //console.log("Operaciones " +operacionesL);
  for (let i = 0; i <= operaciones.length; i++) {
    operaciones[i].remove();
  }
  for (let i = 0; i <= operacionesL; i++) {
    let div = document.createElement("div");
    div.className = "operacion";
    //div.id = "variable-"+counter;
    div.innerHTML = `<button class='close'>X</button><p>Operación</p>
      <p>Ingrese variable 1</p>${recorrerVariables2()}
      <p>Ingrese Operación</p>
      <select>
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
      <p>Ingrese variable 2</p>${recorrerVariables2()}
      <p>Guardar resultado en </p>${recorrerVariables2()}`;
    demasInstrucciones.appendChild(div);
    //recorrerVariables();
  }
  operacionesL = operaciones.length;
  //console.log("Operaciones " +operacionesL);
}

//elimina cada elemento cuando se le da en la x
window.addEventListener("click", function () {
  if (event.target.className === "close") {
    event.target.parentNode.remove();
    recorrerVariables();
    //refrescarVariables();
  }
});

//revisar refrescarVariables, no esta funcionando

//Cuando se presiona el boton de agregarVariable
agregarVariable.addEventListener("click", function () {
  crearVariable(variablesDiv);
  //refrescarVariables();
  //counter++;
});

//Cuando se presiona el boton de agregarOperacion
agregarOperacion.addEventListener("click", function () {
  crearOperacion(demasInstrucciones);
  //refrescarVariables();
});

//Cuando se presiona el boton de agregarSi
agregarSi.addEventListener("click", function () {
  crearSiBloque(demasInstrucciones);
});

//Cuando se presiona el boton de agregarRepetir
agregarRepetir.addEventListener("click", function () {
  crearRepetirBloque(demasInstrucciones);
});

//Cuando se presiona el boton Imprimir Variable
agregarImprimir.addEventListener("click", function () {
  console.log("ABBB");
  crearImprimirVariable(demasInstrucciones);
});

//Cuando se presiona el boton Ejecutar
ejecutar.addEventListener("click", function () {
  convertirFuncion();
  if (conversionExitosa == 1) {
    //si no hay errores en la conversion

    //enviar codigo a restApi
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhr.responseText);
        console.log(xhr.responseXML);
        llenarEnTextArea2(JSON.parse(xhr.responseText)["salida"].split("\n"));
      }
    };
    const json = {
      instrucciones: getInstrucciones(),
    };
    if (lenguaje.value == "Python") {
      //si el valor del select es Python
      json["lenguaje"] = "Python";
    }
    if (lenguaje.value == "Javascript") {
      //si el valor del select es Javascript
      json["lenguaje"] = "Javascript";
    }
    xhr.send(JSON.stringify(json));
    return false;
  } else {
    // si la conversion no fue exitosa
    mensajes.textContent += ". Hay un error en la conversión";
    return;
  }
});
//cuando se presiona el boton de guardar
guardar.addEventListener("click", function () {
  valores = {};
  valores["instrucciones"] = instrucciones.innerHTML; //retorna las instrucciones

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/guardar");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhr.responseText);
      //llenarEnTextArea2(JSON.parse(xhr.responseText)["salida"].split("\n"));
    }
  };

  xhr.send(JSON.stringify(valores));
  return false;
});

listarProgramas.addEventListener("click", function () {
  let programasDiv = document.getElementById("programas");
  let n = document.getElementById("programas").childNodes;
  while (n[0] != undefined) {
    n[0].remove();
  }
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:5000/listar");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(JSON.parse(xhr.responseText));
      let d = JSON.parse(xhr.responseText);
      // div.setAttribute("class","programas");
      for (let i = 0; i < d["instrucciones"].length; i++) {
        let p = document.createElement("p");
        p.textContent = d["instrucciones"][i][0];
        let c = document.createElement("button");
        c.textContent = "cargar";
        c.setAttribute("id", d["instrucciones"][i][1]);
        p.appendChild(c);
        programasDiv.appendChild(p);
        // div.appendChild(p);
      }
    }
  };

  // xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  return false;
});

//cuando se presiona un boton en listar programas
programas.addEventListener("click", function () {
  if (event.target.tagName == "BUTTON") {
    console.log(event.target);
    let btn = event.target;
    console.log(btn.id);
    let json = retornarRespuesta(btn.id);
  }
});

//dado un id retorna las instrucciones, que contienen ese id, en la bd
function retornarRespuesta(id) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/listar");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let json = JSON.parse(xhr.responseText);
      //console.log(json);
      //eliminar el div de variables y el de demasInstrucciones, dentro de el div con id instrucciones
      variablesDiv.remove();
      demasInstrucciones.remove();
      instrucciones2.innerHTML = json["instrucciones"]; //agregar
    } else {
      return undefined;
    }
  };
  const json = { id: id };

  xhr.send(JSON.stringify(json));
  return false;
}

//Cuando se presiona en los bloques Repetir y Si, la opcion de abajo
demasInstrucciones.addEventListener("click", function () {
  //console.log(event.target);
  if (
    event.target.tagName == "OPTION" &&
    event.target.value == "crearRepetir"
  ) {
    //Crear un bloque de repetir
    //
    if (saberSiYaSeAgregoUnElemento(event.target.parentNode.parentNode) == 1) {
      eliminarUltimoElemento(event.target.parentNode.parentNode);
      crearRepetirBloque(event.target.parentNode.parentNode);
    } else {
      crearRepetirBloque(event.target.parentNode.parentNode);
    }
  } else if (
    event.target.tagName == "OPTION" &&
    event.target.value == "crearSi"
  ) {
    //Crear un bloque de repetir
    //eliminarUltimoElemento(event.target.parentNode.parentNode);
    if (saberSiYaSeAgregoUnElemento(event.target.parentNode.parentNode) == 1) {
      eliminarUltimoElemento(event.target.parentNode.parentNode);
    }
    crearSiBloque(event.target.parentNode.parentNode);
  } else if (
    event.target.tagName == "OPTION" &&
    event.target.value == "crearVariable"
  ) {
    //Crear un bloque de repetir
    //eliminarUltimoElemento(event.target.parentNode.parentNode);
    if (saberSiYaSeAgregoUnElemento(event.target.parentNode.parentNode) == 1) {
      eliminarUltimoElemento(event.target.parentNode.parentNode);
    }
    crearVariable(event.target.parentNode.parentNode);
  } else if (
    event.target.tagName == "OPTION" &&
    event.target.value == "crearOperacion"
  ) {
    //Crear un bloque de repetir
    //eliminarUltimoElemento(event.target.parentNode.parentNode);
    if (saberSiYaSeAgregoUnElemento(event.target.parentNode.parentNode) == 1) {
      eliminarUltimoElemento(event.target.parentNode.parentNode);
    }
    crearOperacion(event.target.parentNode.parentNode);
  } else if (
    event.target.tagName == "OPTION" &&
    event.target.value == "crearImprimir"
  ) {
    //Crear un bloque de imprimir
    //eliminarUltimoElemento(event.target.parentNode.parentNode);
    if (saberSiYaSeAgregoUnElemento(event.target.parentNode.parentNode) == 1) {
      eliminarUltimoElemento(event.target.parentNode.parentNode);
    }
    crearImprimirVariable(event.target.parentNode.parentNode);
  }
});

function crearRepetirBloque(parent) {
  let div = document.createElement("div");
  div.className = "repetir bloque";
  //div.id = "variable-"+counter;
  div.innerHTML = `<button class='close'>X</button><p class="titulo">Repetir</p>
    <p>Veces</p>
    <input type="number" placeholder="Ingrese valor"/>
    <p>Hacer lo siguiente</p>
    <select>
      <option value="crearVariable">Crear variable</option>
      <option value="crearOperacion">Crear operación</option>
      <option value="crearSi">Crear si</option>
      <option value="crearRepetir">Crear repetir</option>
      <option value="crearImprimir">Crear Imprimir Variable</option>
    </select></br>`;
  parent.appendChild(div);
  recorrerVariables();
}

function crearSiBloque(parent) {
  let div = document.createElement("div");
  div.className = "si bloque";
  //div.id = "variable-"+counter;
  div.innerHTML = `<button class='close'>X</button><p class="titulo">Si</p>
    <p>Ingrese variable 1</p>${recorrerVariables2()}
    <p>Ingrese Comparación</p>
    <select>
      <option value=">">mayor</option>
      <option value="<">menor</option>
      <option value="==">igual</option>
      <option value="!=">diferente</option>
      <option value=">=">mayorigual</option>
      <option value="<=">menorigual</option>
    </select>
    <p>Ingrese variable 2</p>${recorrerVariables2()}
    <p>Hacer lo siguiente</p>
    <select>
      <option value="crearVariable">Crear variable</option>
      <option value="crearOperacion">Crear operación</option>
      <option value="crearSi">Crear si</option>
      <option value="crearRepetir">Crear repetir</option>
      <option value="crearImprimir">Crear Imprimir Variable</option>
    </select></br>`;
  parent.appendChild(div);
  recorrerVariables();
}

function crearVariable(parent) {
  let div = document.createElement("div");
  div.className = "variable bloque";
  //div.id = "variable-"+counter;
  div.innerHTML =
    "<button class='close'>X</button><p class='titulo'>Variable</p><input type='text' placeholder='nombre'> </br> <input type='number' placeholder='valor'> ";
  parent.appendChild(div);
  recorrerVariables();
}

function crearOperacion(parent) {
  let div = document.createElement("div");
  div.className = "operacion bloque";
  //div.id = "variable-"+counter;
  div.innerHTML = `<button class='close'>X</button><p class="titulo">Operación</p>
    <p>Ingrese variable 1</p>${recorrerVariables2()}
    <p>Ingrese Operación</p>
    <select>
      <option value="+">+</option>
      <option value="-">-</option>
      <option value="*">*</option>
      <option value="/">/</option>
    </select>
    <p>Ingrese variable 2</p>${recorrerVariables2()}
    <p>Guardar resultado en </p>${recorrerVariables2()}`;
  parent.appendChild(div);
  recorrerVariables();
}

function crearImprimirVariable(parent) {
  let div = document.createElement("div");
  div.className = "imprimir bloque";
  //div.id = "variable-"+counter;
  div.innerHTML = `<button class='close'>X</button><p class="titulo">Imprimir</p>
    <p>Ingrese variable a Imprimir</p>${recorrerVariables2()}`;
  parent.appendChild(div);
  recorrerVariables();
}

//se usa para eliminar en los bloques si y repetir en la ultima opcion, cuando se agrega otro bloque
function eliminarUltimoElemento(parent) {
  parent.removeChild(parent.lastElementChild); //remueve el ultimo elemento, para que solo se pueda agregar 1, en los bloques repetir y si
}

//se utiliza en los bloques si y repetir cuando se agrega un nuevo bloque al final
function saberSiYaSeAgregoUnElemento(parent) {
  if (
    parent.lastElementChild.className == "repetir" ||
    parent.lastElementChild.className == "si" ||
    parent.lastElementChild.className == "operacion" ||
    parent.lastElementChild.className == "variable" ||
    parent.lastElementChild.className == "imprimir"
  ) {
    return 0;
  } else {
    return 0;
  }
}

//las funciones refrescarVariables no se usan, porque deben verificarse

//Cuando se modifica el valor de una variable se actualiza en el dom
window.addEventListener("change", function () {
  //console.log(event.target);
  if (event.target.parentNode.className == "variable") {
    event.target.value = event.target.value;
    recorrerVariables();
  }
});

/////////////////////////////////////////////////

//Cuando se presiona el boton de convertir a codigo
convertir.addEventListener("click", function () {
  convertirFuncion();
});

//cuando se presiona el boton convertir
function convertirFuncion() {
  textarea.value = ""; //limpiar textarea
  recorrerVariables(); //para actualizar el valor de las variables
  //verificar que existan variables
  if (variablesLista.length == 0) {
    mensajes.textContent = "No existen variables";
    conversionExitosa = 0;
    return;
  }
  //verificar que las variables tengan nombre
  else {
    for (let i in variablesLista) {
      if (variablesLista[i] == "") {
        mensajes.textContent = "Hay variables que no tienen nombre";
        conversionExitosa = 0;
        return;
      }
      if (/^[0-9]/.test(variablesLista[i])) {
        //si empieza con numero
        mensajes.textContent =
          "Hay variables que empiezan con número, los nombres de las variables deben contener letras";
        conversionExitosa = 0;
        return;
      } else if (/["·#$%&/()=*{}¿:_*\\]/i.test(variablesLista[i])) {
        mensajes.textContent =
          "Los nombres de las variables solo pueden ser letras";
        conversionExitosa = 0;
        return;
      }
      //que no hayan repetidos
      else if (buscarRepetidos(variablesLista)) {
        mensajes.textContent =
          "Hay variables que tienen el mismo nombre. Los nombres de las variables tienen que ser distintos";
        conversionExitosa = 0;
        return;
      }
    }
    //verificar que las variables tengan valores numericos
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].childNodes[6].value === "") {
        mensajes.textContent =
          "Hay variables que no tienen valor, los valores solo pueden ser números";
        conversionExitosa = 0;
        return;
        //verificar que sean solo numeros
      } else if (
        /[a-z!"·#$%&/()=*{}¿:_*]/i.test(variables[i].childNodes[6].value)
      ) {
        mensajes.textContent =
          "Hay variables que no tienen valor, los valores solo pueden ser números";
        conversionExitosa = 0;
        return;
      }
    }

    //verificar que ningun campo de los select tenga como value ""
    let select = document.querySelectorAll("select");
    //console.log(select);
    for (let i = 0; i < select.length; i++) {
      //console.log(select[i]);
      if (select[i].value == "") {
        mensajes.textContent = "Hay campos que no tienen valor";
        conversionExitosa = 0;
        return;
      }
    }
    //verificar que ningun campo input tenga como value ""
    let inputs = document.querySelectorAll("input");
    //console.log(select);
    for (let i = 0; i < inputs.length; i++) {
      //console.log(select[i]);
      if (inputs[i].value == "") {
        mensajes.textContent = "Hay campos que no tienen valor";
        conversionExitosa = 0;
        return;
      }
    }
    //Si no hay errores
    conversionExitosa = 1;
    mensajes.textContent = "";
    llenarVariables();
    llenarDemasInstrucciones();
  }
}

//coje el nombre de las variables y les pone su valor1
//ejemplo "x = 123"

function llenarVariables() {
  let tabCounter = 0;
  if (lenguaje.value == "Python") {
    //agregar variables
    for (let i = 0; i < variablesDiv.childNodes.length; i++) {
      insertarVariableEnTextArea(
        variablesDiv.childNodes[i].childNodes[2].value,
        variablesDiv.childNodes[i].childNodes[6].value,
        tabCounter,
        lenguaje.value
      );
    }
  } else if (lenguaje.value == "Javascript") {
    //agregar variables
    for (let i = 0; i < variablesDiv.childNodes.length; i++) {
      insertarVariableEnTextArea(
        variablesDiv.childNodes[i].childNodes[2].value,
        variablesDiv.childNodes[i].childNodes[6].value,
        tabCounter,
        lenguaje.value
      );
    }
  }
  textarea.value += "\n";
}

//falta llenar si es una variable
function llenarDemasInstrucciones() {
  if (lenguaje.value == "Python") {
    //agregar demasInstrucciones
    let tabCounter = 0; //for counting tab for formatting
    let ref = demasInstrucciones.childNodes;
    for (let i = 0; i < ref.length; i++) {
      rec(ref[i], tabCounter, lenguaje.value);
    }
  } else if (lenguaje.value == "Javascript") {
    //agregar demasInstrucciones
    let tabCounter = 0; //for counting tab for formatting
    let ref = demasInstrucciones.childNodes;
    for (let i = 0; i < ref.length; i++) {
      rec(ref[i], tabCounter, lenguaje.value);
    }
    //agregarLlavesFaltantes();
    agregarLlavesFaltantes2();
  }
}

//dado un numero retorna un string con n tabs
function agregarTabs(n) {
  let st = "";
  for (let i = 0; i < n; i++) {
    st += "\t";
  }
  return st;
}

function insertarVariableEnTextArea(variable, valor, tabCounter, leng) {
  if (leng == "Python") {
    textarea.value += `${agregarTabs(tabCounter)}${variable} = ${valor}\n`;
  } else if (leng == "Javascript") {
    textarea.value += `${agregarTabs(tabCounter)}let ${variable} = ${valor};\n`;
  }
}

function insertarOperacionEnTextArea(
  guardarEn,
  var1,
  operacion,
  var2,
  tabCounter,
  leng
) {
  if (leng == "Python") {
    textarea.value += `${agregarTabs(
      tabCounter
    )}${guardarEn} = ${var1} ${operacion} ${var2}\n`;
  } else if (leng == "Javascript") {
    textarea.value += `${agregarTabs(
      tabCounter
    )}${guardarEn} = ${var1} ${operacion} ${var2};\n`;
  }
}

function insertarImprimirEnTextArea(variable, tabCounter, leng) {
  if (leng == "Python") {
    textarea.value += `${agregarTabs(tabCounter)}print(${variable})\n`;
  } else if (leng == "Javascript") {
    textarea.value += `${agregarTabs(tabCounter)}console.log(${variable});\n`;
  }
}

function insertarSiEnTextArea(var1, comparacion, var2, tabCounter, leng) {
  if (leng == "Python") {
    textarea.value += `${agregarTabs(
      tabCounter
    )}if ${var1}${comparacion}${var2}:\n`;
  } else if (leng == "Javascript") {
    textarea.value += `${agregarTabs(
      tabCounter
    )}if(${var1}${comparacion}${var2}){\n`;
  }
}

function insertarRepetirEnTextArea(veces, tabCounter, leng) {
  if (leng == "Python") {
    textarea.value += `${agregarTabs(tabCounter)}for i in range(${veces}):\n`;
  } else if (leng == "Javascript") {
    textarea.value += `${agregarTabs(
      tabCounter
    )}for(let i = 0; i < ${veces}; i++){\n`;
  }
}

function rec(elemento, tabCounter, leng) {
  if (
    /variable/.test(elemento.className) ||
    /imprimir/.test(elemento.className) ||
    /operacion/.test(elemento.className)
  ) {
    //si es una variable
    if (/variable/.test(elemento.className)) {
      insertarVariableEnTextArea(
        elemento.childNodes[2].value,
        elemento.childNodes[6].value,
        tabCounter,
        leng
      );
      return;
    } else if (/imprimir/.test(elemento.className)) {
      insertarImprimirEnTextArea(
        elemento.childNodes[4].value,
        tabCounter,
        leng
      );
      return;
    } else if (/operacion/.test(elemento.className)) {
      insertarOperacionEnTextArea(
        elemento.childNodes[14].value,
        elemento.childNodes[4].value,
        elemento.childNodes[8].value,
        elemento.childNodes[11].value,
        tabCounter,
        leng
      );
      return;
    }
  } else {
    if (/si/.test(elemento.className)) {
      insertarSiEnTextArea(
        elemento.childNodes[4].value,
        elemento.childNodes[8].value,
        elemento.childNodes[11].value,
        tabCounter,
        leng
      );
      tabCounter++;
      let aux3 = elemento.querySelector(".bloque");
      if (aux3 == null) {
        // cuando en un bloque de repetir, o si, el ultimo elemento no tiene un campo asignado todavia
        return;
      }
      while (aux3.nextSibling != null) {
        if (aux3.nextSibling == null) {
          break;
        } else {
          rec(aux3, tabCounter, leng);
          aux3 = aux3.nextSibling;
        }
      }
      rec(aux3, tabCounter, leng);
    } else if (/repetir/.test(elemento.className)) {
      insertarRepetirEnTextArea(elemento.childNodes[5].value, tabCounter, leng);
      tabCounter++;
      let aux3 = elemento.querySelector(".bloque");
      if (aux3 == null) {
        // cuando en un bloque de repetir, o si, el ultimo elemento no tiene un campo asignado todavia
        return;
      }
      while (aux3.nextSibling != null) {
        if (aux3.nextSibling == null) {
          break;
        } else {
          rec(aux3, tabCounter, leng);
          aux3 = aux3.nextSibling;
        }
      }
      rec(aux3, tabCounter, leng);
    }
  }
}

//Se usa en lenguajes como Javascript
//funciona pero solo en unos casos
function agregarLlavesFaltantes() {
  let arr = textarea.value.split("\n");
  let stack = [];
  for (let i in arr) {
    //si el elemento contiene una llave
    if (/{$/g.test(arr[i])) {
      //contar la cantidad de tabs
      let c = arr[i].match(/\t/g);
      let temp = "";
      for (let j in c) {
        temp += c[j];
      }
      temp += "}";
      stack.unshift(temp);
    }
  }

  //usar el stack

  for (let i in stack) {
    textarea.value += stack[i] + "\n";
  }
}

//nueva Version
//verificar que pasa cuando el stack no contiene elementos dentro del if
function agregarLlavesFaltantes2() {
  let arr = textarea.value.split("\n"); //obtener linea por linea
  let stack = []; //va a almacenar la cantidad de tabs, que tienen las {

  let arr2 = []; //se va a utilizar guardando el codigo formateado

  for (let i = 0; i < arr.length; i++) {
    //ir linea por linea

    if (/{$/.test(arr[i])) {
      //si contiene {

      if (stack.length == 0) {
        //si stack esta vacio
        let c = obtenerCantidadDeTabs(arr[i]); //obtener cantidad de tabs de la cadena
        stack.unshift(c); //agregar al stack
        arr2.push(arr[i] + "\n"); //agregar cadena al arr2
        continue;
      } else {
        //si el stack no esta vacio
        let primerElemStack = stack[0]; //obtener el primer elemento del stack, el stack contiene solo numeros que es la cantidad de tabs
        let c = obtenerCantidadDeTabs(arr[i]); //obtener cantidad de tabs de la cadena
        if (c > primerElemStack) {
          stack.unshift(c); //agregar al stack
          arr2.push(arr[i] + "\n"); //agregar cadena al arr2
          continue;
        } else if (c == primerElemStack) {
          arr2.push(`${agregarTabs(primerElemStack)}}\n${arr[i]}\n`);
          stack.shift(); //eliminar primer elemento
          stack.unshift(c); //agregar elemento
          continue;
        } else if (c < primerElemStack) {
          while (stack.length > 0) {
            arr2.push(`${agregarTabs(stack[0])}}\n`);
            stack.shift(); //eliminar primer elemento del stack
          }
          arr2.push(arr[i] + "\n");
          stack.unshift(c); //imp
          continue;
        }
      }
    } else {
      // si no contiene {
      if (stack.length > 0) {
        //si el stack contiene elementos
        let primerElemStack = stack[0]; //obtener el primer elemento del stack, el stack contiene solo numeros que es la cantidad de tabs
        let c = obtenerCantidadDeTabs(arr[i]); //obtener cantidad de tabs de la cadena
        if (c > primerElemStack) {
          arr2.push(arr[i] + "\n"); //agregar cadena al arr2
          continue;
        } else if (c == primerElemStack) {
          arr2.push(`${agregarTabs(primerElemStack)}}\n${arr[i]}\n`);
          stack.shift(); //eliminar primer elemento
          continue;
        } else if (c < primerElemStack) {
          while (stack.length > 0) {
            //vaciar el stack
            arr2.push(`${agregarTabs(stack[0])}}\n`);
            stack.shift(); //eliminar primer elemento del stack
          }
          arr2.push(arr[i] + "\n");
          continue;
        }
      } else {
        //si el stack esta vacio
        arr2.push(arr[i] + "\n");
        continue;
      }
    }
  }

  if (stack.length > 0) {
    //si el stack aun tiene elementos
    for (let i in stack) {
      arr2.push(`${agregarTabs(stack[i])}}\n`);
    }
  }
  textarea.value = ""; //limpiar textarea
  //llenarVariables(); //cuidado con esta parte <-
  for (let i in arr2) {
    textarea.value += arr2[i];
  }
}

//dada una cadena retorna la cantidad de tabs
function obtenerCantidadDeTabs(cadena) {
  let x = cadena.match(/\t/g);
  if (x == null) {
    return 0;
  } else {
    return x.length;
  }
}

//se usa en variablesLista, para que 2 variables no tengan el mismo nombre, esta funcion
//retorna falso, si no hay repetidos o verdadero si hay repetidos
function buscarRepetidos(arr) {
  if (arr.length == 1) {
    return 0;
  }
  for (let i = 1; i < arr.length; i++) {
    if (arr[0] == arr[i]) {
      return 1;
    }
  }
  return 0;
}

//esta funcion coje los valores del textarea y los agrega en un array, al final retorna el array
//esta funcion se utiliza cuando se presiona el boton ejecutar
function getInstrucciones() {
  return textarea.value.split("\n");
}

function llenarEnTextArea2(arr) {
  textarea2.value = "";
  for (let i in arr) {
    textarea2.value += arr[i] + "\n";
  }
}
