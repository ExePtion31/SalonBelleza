let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []

}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();

});

function iniciarApp(){
    mostrarServicios();

    //Resalta el div actual segun al que se presiona 
    mostrarSeccion();

    //Oculta o muestra la seccion segun el tab que se presiona 
    cambiarSeccion();

    //Paginacion siguiente y anterior
    pagSiguiente();
    pagAnterior();

    //Compruba la pagina actual para mostrar o eliminar la paginacion
    botonesPaginador();

    //Muestra resumen de la cita o mensaje de error
    mostrarResumen();

    //Almacena el nombre de la cita
    nombreCita();

    //Almacena la fecha de la cita
    fechaCita();

    //Deshabilitar fechas pasadas
    fechasPasadas();

    //ALmacenar hora de la cita
    horaCita();
}

function mostrarSeccion(){

    //Eliminar seccion aterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    //Elinar la clase actual del tab anterior
    const tabAnterior = document.querySelector(".tabs .actual");
    if(tabAnterior){
        tabAnterior.classList.remove("actual");
    }
    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Resaltar tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}


function cambiarSeccion(){
    const enlaces = document.querySelectorAll(".tabs button");

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        });
    });
}

async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        //Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM Scripting


            //Generar nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = '$' + precio;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor
            const divServicio = document.createElement('DIV');
            divServicio.classList.add('servicio');
            divServicio.dataset.idServicio = id;


            //Inyectar precio y nombre al div
            divServicio.appendChild(nombreServicio);
            divServicio.appendChild(precioServicio);

            //Inyectar en HTML
            document.querySelector('#servicio').appendChild(divServicio);


            //Selecciona un servicio
            divServicio.onclick = seleccionarServicio;
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;

    if(e.target.tagName === "P"){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains("seleccionado")){
        elemento.classList.remove("seleccionado");

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add("seleccionado");

        const serviciosObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(serviciosObj);
        agregarServicio(serviciosObj);
    }
    
}

function pagSiguiente(){
    const paginaSiguiente = document.querySelector("#siguiente");

    paginaSiguiente.addEventListener("click", () =>{
        pagina++;

        botonesPaginador();
    });
}

function pagAnterior(){
    const paginaAnterior = document.querySelector("#anterior");

    paginaAnterior.addEventListener("click", () =>{
        pagina--;

        botonesPaginador();
    });

}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1){
        paginaAnterior.classList.add("ocultar");
    }else if(pagina === 3){
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.add("ocultar");
        mostrarResumen();
    }else{
        paginaSiguiente.classList.remove("ocultar");
        paginaAnterior.classList.remove("ocultar");
    }

    //Cambia la seccion que se muestra por la de la pag
    mostrarSeccion(); 

}

function mostrarResumen(){
    //Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //Seleccionar resumen
    const resumenDIv = document.querySelector(".contenido-resumen");

    //Limpiar HTML previo
    while(resumenDIv.firstChild){
        resumenDIv.removeChild(resumenDIv.firstChild);
    }


    //Validacion objeto
    if(Object.values(cita).includes("")){
        const noServicios = document.createElement("P");
        noServicios.textContent = "Faltan datos del nombre, fecha, hora o servicios";
        noServicios.classList.add("invalidar-cita");

        //Agregar a resumen div
        resumenDIv.appendChild(noServicios);

        return;
    }


    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";

    //Mostrar resumen
    const nombreCita = document.createElement("P");
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora: </span> ${hora}`;

    const serviciosCita = document.createElement("DIV");
    serviciosCita.classList.add("resumen-servicios"); 

    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";
    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;
    //Iterar en los servicios 
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.classList.add("precio");
        precioServicio.textContent = precio;

        //Colocar nombre y precio 
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

        const totalServicio = precio.split("$");
        cantidad += parseInt(totalServicio[1].trim());

        console.log(precio);

    });
    console.log(cantidad);
    resumenDIv.appendChild(headingCita);
    resumenDIv.appendChild(nombreCita);
    resumenDIv.appendChild(fechaCita);
    resumenDIv.appendChild(horaCita);
    resumenDIv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement("P");
    cantidadPagar.classList.add("total");
    cantidadPagar.innerHTML = `<span>Total a pagar: </span>$${cantidad}`;
    resumenDIv.appendChild(cantidadPagar);
}    

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
}

function agregarServicio(serviciosObj){
    const {servicios} = cita;

    cita.servicios = [...servicios, serviciosObj];
}

function nombreCita(){
    const nombreInput = document.querySelector("#nombre");
    nombreInput.addEventListener("input", e => {
        const nombreText = e.target.value.trim(); //trim elimina los espacios en blanco

        //validar el input nombre
        if(nombreText === "" || nombreText.length < 3){
            mostrarAlerta("Nombre no valido", "error");
        }else{
            const alerta = document.querySelector(".alerta");
            if(alerta){
                alerta.remove();
            }

            cita.nombre = nombreText;
        }
    });
}

function mostrarAlerta(mensaje, tipo){

    //Si existe una alerta, no cree otra
    const alertaprevia = document.querySelector(".alerta");
    if(alertaprevia){
        return;
    }

    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if(tipo == "error"){
        alerta.classList.add("error");
    }

    //Insertar en el HTML
    const formulario = document.querySelector(".formulario");
    formulario.appendChild(alerta);

    //ELiminar alerta despues de x tiempo
    setTimeout(() => {
        alerta.remove();    
    }, 3000);


}

function fechaCita(){
    const fechaCIta = document.querySelector("#fecha");
    fechaCIta.addEventListener("input", e => {
        const fecha = new Date(e.target.value).getUTCDay();

        if([0, 6].includes(fecha)){
            e.preventDefault();
            fechaCIta.value = "";
            mostrarAlerta("Los fines de semana no hay servicio.", "error");
        }else{

            //Fecha mas especifica
            const fechaCompleta = new Date(e.target.value);
            opciones = {
                weekday: "long",
                day: "numeric",
                year: "numeric",
                month: "long"
            }
            //console.log(fechaCompleta.toLocaleDateString("es-ES", opciones));

            cita.fecha = fechaCIta.value;
        }

    });
    
}

function fechasPasadas(){
    const inputFecha = document.querySelector("#fecha");
    const fechaAhora = new Date();

    const year = fechaAhora.getFullYear();
    const month = fechaAhora.getMonth() + 1;
    const day = fechaAhora.getDate();

    //formato fecha: DD-MM-YYYY
    if(month < 10){
        const fechaDeshabilitar = `${year}-0${month}-${day}`;
        inputFecha.min = fechaDeshabilitar;
    }else{
        const fechaDeshabilitar = `${year}-${month}-${day}`;
        inputFecha.min = fechaDeshabilitar;
    }


}

function horaCita(){
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(":")

        if(hora[0] < 09 || hora [0] > 22){
            e.preventDefault();
            inputHora.value = "";
            cita.hora = "";
            mostrarAlerta("Hora no valida", "error");

        }else{
            cita.hora = horaCita;
        }
    });
}