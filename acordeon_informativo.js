//----------------------------------------//
//--|funcionalidad_acordeon_informativo|--//
//----------------------------------------//
const botones_acordeon_informativo = document.querySelectorAll(".boton_acordeon_informativo");
const items_acordeon_informativo = document.querySelectorAll(".item_acordeon_informativo");
const boton_abrir_todos = document.getElementById("boton_abrir_todos");
const boton_cerrar_todos = document.getElementById("boton_cerrar_todos");
const contador_secciones = document.getElementById("contador_secciones");
const total_secciones = items_acordeon_informativo.length;
//---------------------//
//--|mostrar_seccion|--//
//---------------------//
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
}
//---------------------//
//--|ocultar_seccion|--//
//---------------------//
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
}
//----------------------//
//--|alternar_seccion|--//
//----------------------//
function alternar_seccion(item) {
    if (!item) {
        return;
    }
    if (
        item.classList.contains("activo")
    ) {
        ocultar_seccion(item);
    } else {
        mostrar_seccion(item);
    }
    actualizar_contador();
}
//-----------------//
//--|abrir_todas|--//
//-----------------//
function abrir_todas_las_secciones() {
    items_acordeon_informativo.forEach(
        function(item) {
            mostrar_seccion(item);
        }
    );
    actualizar_contador();
    guardar_estado();
}
//------------------//
//--|cerrar_todas|--//
//------------------//
function cerrar_todas_las_secciones() {
    items_acordeon_informativo.forEach(
        function(item) {
            ocultar_seccion(item);
        }
    );
    actualizar_contador();
    guardar_estado();
}
//-------------------------//
//--|actualizar_contador|--//
//-------------------------//
function actualizar_contador() {
    const secciones_abiertas = document.querySelectorAll(".item_acordeon_informativo.activo");
    const cantidad_abiertas = secciones_abiertas.length;
    contador_secciones.textContent = "Secciones abiertas: " + cantidad_abiertas + " de " + total_secciones;
}
//--------------------//
//--|guardar_estado|--//
//--------------------//
function guardar_estado() {
    const estados = [];
    items_acordeon_informativo.forEach(
        function(item, indice) {
            if (
                item.classList.contains("activo")
            ) {
                estados.push(indice);
            }
        }
    );
    localStorage.setItem("estado_acordeon_informativo", JSON.stringify(estados)
    );
}
//----------------------//
//--|recuperar_estado|--//
//----------------------//
function recuperar_estado() {
    const estado_guardado = localStorage.getItem("estado_acordeon_informativo");
    if (!estado_guardado) {
        actualizar_contador();
        return;
    }
    try {
        const estados = JSON.parse(estado_guardado);
        if (!Array.isArray(estados)) {
            actualizar_contador();
            return;
        }
        estados.forEach(
            function(indice) {
                if (
                    indice >= 0 &&
                    indice < total_secciones
                ) {
                    mostrar_seccion(items_acordeon_informativo[indice]
                    );
                }
            }
        );
    } catch (error) {
        console.error("Error al recuperar el estado:", error);
    }
    actualizar_contador();
}
//--------------------------------------//
//--|evento_general_de_los_acordeones|--//
//--------------------------------------//
botones_acordeon_informativo.forEach(
    function(boton, indice) {
        boton.addEventListener(
            "click",
            function() {
                const item = items_acordeon_informativo[indice];
                alternar_seccion(item);
                guardar_estado();
            }
        );
        boton.addEventListener(
            "keydown",
            function(evento) {
                if (
                    evento.key === "Enter" ||
                    evento.key === " "
                ) {
                    evento.preventDefault();
                    const item = items_acordeon_informativo[indice];
                    alternar_seccion(item);
                    guardar_estado();
                }
            }
        );
    }
);
//------------------------//
//--|evento_abrir_todos|--//
//------------------------//
boton_abrir_todos.addEventListener(
    "click",
    function() {
        abrir_todas_las_secciones();
    }
);
//-------------------------//
//--|evento_cerrar_todos|--//
//-------------------------//
boton_cerrar_todos.addEventListener(
    "click",
    function() {
        cerrar_todas_las_secciones();
    }
);
if (total_secciones > 0) {
    recuperar_estado();
}