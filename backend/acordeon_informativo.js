//----------------------------------------//
//--|funcionalidad_acordeon_informativo|--//
//----------------------------------------//
const acordeon = document.querySelector(".acordeon_informativo");
const formulario = document.getElementById("formulario_nueva_seccion");
const campo_titulo = document.getElementById("titulo_nueva_seccion");
const campo_descripcion = document.getElementById("descripcion_nueva_seccion");
const boton_abrir_todos = document.getElementById("boton_abrir_todos");
const boton_cerrar_todos = document.getElementById("boton_cerrar_todos");
const contador_secciones = document.getElementById("contador_secciones");
const items_acordeon_informativo = Array.from(acordeon.querySelectorAll(".item_acordeon_informativo"));
const total_secciones_originales = items_acordeon_informativo.length;
//--------------------------------------------------//
//--|recuperacion_de_sesiones_usando_localstorage|--//
//--------------------------------------------------//
const clave_estado = "estado_acordeon_informativo";
const clave_secciones = "secciones_acordeon_informativo";
let secciones_nuevas = [];
try {
    const datos_guardados = localStorage.getItem(clave_secciones);
    if (datos_guardados) {
        const datos = JSON.parse(datos_guardados);
        if (Array.isArray(datos)) {
            secciones_nuevas = datos.filter(function(seccion) {
                return (seccion && typeof seccion.id === "string" && typeof seccion.titulo === "string" && typeof seccion.descripcion === "string");
            })
            .map(function(seccion) {
                return {
                    id: seccion.id,
                    titulo: seccion.titulo,
                    descripcion: seccion.descripcion,
                    abierta: seccion.abierta === true
                };
            });
        }
    }
} 
catch (error) {
    console.error("Error al recuperar las secciones guardadas:", error);
}
//-------------------------------//
//--|obtener_total_de_sesiones|--//
//-------------------------------//
function obtener_todos_los_items() {
    return Array.from(acordeon.querySelectorAll(".item_acordeon_informativo"));
}
function obtener_total_secciones() {
    return obtener_todos_los_items().length;
}
//-------------------------------------------------//
//--|guardar_estado_de_sesiones_con_localstorage|--//
//-------------------------------------------------//
function guardar_estado() {
    const estados = [];
    items_acordeon_informativo.forEach(function(item, indice) {
        if (item.classList.contains("activo")) {
            estados.push(indice);
        }
    });
    try {
        localStorage.setItem(clave_estado, JSON.stringify(estados));
    } 
    catch (error) {
        console.error("Error al guardar el estado:", error);
    }
    guardar_secciones_nuevas();
}
function guardar_secciones_nuevas() {
    try {
        localStorage.setItem(clave_secciones, JSON.stringify(secciones_nuevas));
    } 
    catch (error) {
        console.error("Error al guardar las secciones nuevas:", error);
        alert("No fue posible guardar las secciones en este navegador.");
    }
}
//-------------------------//
//--|actualizar_contador|--//
//-------------------------//
function actualizar_contador() {
    const secciones_abiertas = acordeon.querySelectorAll(".item_acordeon_informativo.activo");
    const cantidad_abiertas = secciones_abiertas.length;
    const total_secciones = obtener_total_secciones();
    contador_secciones.textContent = "Secciones abiertas: " + cantidad_abiertas + " de " + total_secciones;
}
//-----------------------------------//
//--|mostrar_y_ocultar_las_seccion|--//
//-----------------------------------//
function mostrar_seccion(item) {
    if (!item) {
        return;
    }
    item.classList.add("activo");
    const boton = item.querySelector(".boton_acordeon_informativo");
    if (boton) {
        boton.setAttribute("aria-expanded", "true");
    }
    const icono = item.querySelector(".icono_acordeon_informativo");
    if (icono) {
        icono.textContent = "−";
    }
    actualizar_estado_guardado(item, true);
}
function ocultar_seccion(item) {
    if (!item) {
        return;
    }
    item.classList.remove("activo");
    const boton = item.querySelector(".boton_acordeon_informativo");
    if (boton) {
        boton.setAttribute("aria-expanded", "false");
    }
    const icono = item.querySelector(".icono_acordeon_informativo");
    if (icono) {
        icono.textContent = "+";
    }
    actualizar_estado_guardado(item, false);
}
//--------------------------------//
//--|actualizar_estado_guardado|--//
//--------------------------------//
function actualizar_estado_guardado(item, abierta) {
    const id = item.dataset.id;
    if (!id) {
        return;
    }
    const seccion = secciones_nuevas.find(function(elemento) {
        return elemento.id === id;
    });
    if (seccion) {
        seccion.abierta = abierta;
    }
}
//----------------------//
//--|alternar_seccion|--//
//----------------------//
function alternar_seccion(item) {
    if (!item) {
        return;
    }
    if (item.classList.contains("activo")) {
        ocultar_seccion(item);
    } 
    else {
        mostrar_seccion(item);
    }
    actualizar_contador();
    guardar_estado();
}
//-------------------------//
//--|abrir_y_cerrar_todo|--//
//-------------------------//
function abrir_todas_las_secciones() {
    const items = obtener_todos_los_items();
    items.forEach(function(item) {
        mostrar_seccion(item);
    });
    actualizar_contador();
    guardar_estado();
}
function cerrar_todas_las_secciones() {
    const items = obtener_todos_los_items();
    items.forEach(function(item) {
        ocultar_seccion(item);
    });
    actualizar_contador();
    guardar_estado();
}
//------------------------------------------//
//--|recuperar_estado_usando_localstorage|--//
//------------------------------------------//
function recuperar_estado() {
    try {
        const estado_guardado = localStorage.getItem(clave_estado);
        if (estado_guardado) {
            const estados = JSON.parse(estado_guardado);
            if (Array.isArray(estados)) {
                estados.forEach(function(indice) {
                    if (Number.isInteger(indice) && indice >= 0 && indice < total_secciones_originales) {
                        mostrar_seccion(items_acordeon_informativo[indice]);
                    }
                });
            }
        }
    } 
    catch (error) {
        console.error("Error al recuperar el estado:", error);
    }
    actualizar_contador();
}
//--------------------------//
//--|crear_elemento_texto|--//
//--------------------------//
function crear_elemento_texto(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = texto;
    return elemento;
}
//-------------------//
//--|generar_el_id|--//
//-------------------//
function generar_id() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return Date.now() + "-" + Math.random().toString(36).slice(2);
}
//----------------------//
//--|crear_la_seccion|--//
//----------------------//
function crear_seccion(seccion) {
    const articulo = document.createElement("article");
    articulo.className = "item_acordeon_informativo";
    articulo.dataset.id = String(seccion.id);
    const encabezado = document.createElement("div");
    encabezado.className = "encabezado_item_acordeon";
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton_acordeon_informativo";
    boton.setAttribute("aria-expanded", "false");
    const titulo = crear_elemento_texto("span", "", seccion.titulo);
    const icono = crear_elemento_texto("span", "icono_acordeon_informativo", "+");
    icono.setAttribute("aria-hidden", "true");
    boton.append(titulo, icono);
    const boton_eliminar = document.createElement("button");
    boton_eliminar.type = "button";
    boton_eliminar.className = "boton_eliminar_seccion";
    boton_eliminar.textContent = "Eliminar";
    boton_eliminar.setAttribute("aria-label", "Eliminar la sección: " + seccion.titulo);
    encabezado.append(boton, boton_eliminar);
    const contenido = document.createElement("div");
    contenido.className = "contenido_acordeon_informativo";
    const parrafo = crear_elemento_texto("p", "", seccion.descripcion);
    contenido.appendChild(parrafo);
    articulo.append(encabezado, contenido);
    acordeon.appendChild(articulo);
    if (seccion.abierta) {
        mostrar_seccion(articulo);
    } 
    else {
        ocultar_seccion(articulo);
    }
}
//--------------------------------//
//--|cargar_y_agregar_secciones|--//
//--------------------------------//
function cargar_secciones_guardadas() {
    secciones_nuevas.forEach(function(seccion) {
        crear_seccion(seccion);
    });
    actualizar_contador();
}
//---------------------------------------------//
//--|agregar_nueva_seccion_con_base_de_datos|--//
//---------------------------------------------//
async function agregar_nueva_seccion(evento) {
    evento.preventDefault();
    const titulo = campo_titulo.value.trim();
    const descripcion = campo_descripcion.value.trim();
    if (!titulo || !descripcion) {
        alert("Por favor, completa el título y la descripción.");
        return;
    }
    if (titulo.length > 100 || descripcion.length > 2000) {
        alert("El título o la descripción superan el límite permitido.");
        return;
    }
    //--------------------------------------//
    //--|enviar_los_datos_a_base_de_datos|--//
    //--------------------------------------//
    try {
        const respuesta = await fetch("acordeon_informativo.php", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                titulo: titulo,
                descripcion: descripcion
            })
        });
        const resultado = await respuesta.json();
        //--------------------------------------//
        //--|verificar_respuesta_del_servidor|--//
        //--------------------------------------//
        if (!respuesta.ok || !resultado.exito) {
            alert(resultado.mensaje || "No fue posible guardar la sección.");
            return;
        }
        //----------------------------//
        //--|crear_seccion_guardada|--//
        //----------------------------//
        const nueva_seccion = {
            id: String(resultado.seccion.id),
            titulo: resultado.seccion.titulo,
            descripcion: resultado.seccion.descripcion,
            abierta: false
        };
        secciones_nuevas.push(nueva_seccion);
        crear_seccion(nueva_seccion);
        actualizar_contador();
        //---------------------------//
        //--|limpiar_el_formulario|--//
        //---------------------------//
        formulario.reset();
        campo_titulo.focus();
        alert("La sección se guardó correctamente en la base de datos.");
    } 
    catch (error) {
        console.error("Error al guardar la sección:", error);
        alert("No se pudo conectar con el servidor. " + "Verifica que Apache y MySQL estén funcionando.");
    }
}
//--------------------------//
//--|eliminar_las_seccion|--//
//--------------------------//
async function eliminar_seccion(item) {
    if (!item || !item.dataset.id) {
        return;
    }
    const id = item.dataset.id;
    const seccion = secciones_nuevas.find(function(elemento) {
        return elemento.id === id;
    });
    if (!seccion) {
        return;
    }
    //--------------------------------------//
    //--|confirmar_eliminacion_de_seccion|--//
    //--------------------------------------//
    const confirmar = confirm('¿Deseas eliminar la sección "' + seccion.titulo + '"?');
    if (!confirmar) {
        return;
    }
    //--------------------------------//
    //--|enviar_el_id_para_eliminar|--//
    //--------------------------------//
    try {
        const respuesta = await fetch("acordeon_informativo.php", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                accion: "eliminar",
                id: id
            })
        });
        const resultado = await respuesta.json();
        //----------------------------------------//
        //--|verificar_respuesta_del_servidor|----//
        //----------------------------------------//
        if (!respuesta.ok || !resultado.exito) {
            alert(
                resultado.mensaje ||
                "No fue posible eliminar la sección."
            );
            return;
        }
        //--------------------------------------//
        //--|eliminar_la_seccion_de_la_pagina|--//
        //--------------------------------------//
        secciones_nuevas = secciones_nuevas.filter(
            function(elemento) {
                return elemento.id !== id;
            }
        );
        item.remove();
        //---------------------------------//
        //--|actualizar_datos_y_contador|--//
        //---------------------------------//
        guardar_estado();
        actualizar_contador();
        alert("La sección se eliminó correctamente.");
    } 
    catch (error) {
        console.error("Error al eliminar la sección:", error);
        alert("No se pudo conectar con el servidor. " + "Verifica que Apache y MySQL estén funcionando.");
    }
}
//-----------------------------------------//
//--|evento_de_los_acordeones_a_un_click|--//
//-----------------------------------------//
acordeon.addEventListener("click", function(evento) {
    const boton_eliminar = evento.target.closest(".boton_eliminar_seccion");
    if (boton_eliminar && acordeon.contains(boton_eliminar)) {
        const item = boton_eliminar.closest(".item_acordeon_informativo");
        eliminar_seccion(item);
        return;
    }
    const boton = evento.target.closest(".boton_acordeon_informativo");
    if (!boton || !acordeon.contains(boton)) {
        return;
    }
    const item = boton.closest(".item_acordeon_informativo");
    alternar_seccion(item);
});
//----------------------------//
//--|eventos_de_los_botones|--//
//----------------------------//
boton_abrir_todos.addEventListener("click", abrir_todas_las_secciones);
boton_cerrar_todos.addEventListener("click", cerrar_todas_las_secciones);
formulario.addEventListener("submit", agregar_nueva_seccion);
//-----------------------------//
//--|inicializar_el_programa|--//
//-----------------------------//
recuperar_estado();
cargar_secciones_guardadas();
actualizar_contador();