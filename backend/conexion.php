
<?php
$servidor = "localhost";
$usuario = "root";
$contrasena = "";
$base_datos = "acordeon_informativo";
try {
    $conexion = new mysqli($servidor, $usuario, $contrasena, $base_datos);
    $conexion->set_charset("utf8mb4");
} 
catch (mysqli_sql_exception $error) {
    http_response_code(500);
    die("Error al conectar con la base de datos.");
}
?>