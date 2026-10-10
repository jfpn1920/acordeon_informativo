<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["exito" => false, "mensaje" => "Método de solicitud no permitido."]);
    exit;
}
#----------------------------------#
#--|recibir_datos_del_formulario|--#
#----------------------------------#
$datos = json_decode(file_get_contents("php://input"), true);
if (!is_array($datos)) {
    http_response_code(400);
    echo json_encode(["exito" => false, "mensaje" => "Los datos enviados no son válidos."]);
    exit;
}
$accion = $datos["accion"] ?? "crear";
#---------------------------------#
#--|eliminar_seccion_de_la_base|--#
#---------------------------------#
if ($accion === "eliminar") {
    $id = $datos["id"] ?? null;
    if (!is_scalar($id) || !ctype_digit((string) $id) || (int) $id < 1) {
        http_response_code(400);
        echo json_encode(["exito" => false, "mensaje" => "El identificador de la sección no es válido."]);
        $conexion->close();
        exit;
    }
    #----------------------------------------#
    #--|eliminar_registro_en_base_de_datos|--#
    #----------------------------------------#
    try {
        $consulta = $conexion->prepare("DELETE FROM secciones WHERE id = ?");
        $id = (int) $id;
        $consulta->bind_param("i", $id);
        $consulta->execute();
        if ($consulta->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(["exito" => false, "mensaje" => "La sección no existe en la base de datos."], JSON_UNESCAPED_UNICODE);
        } 
        else {
            echo json_encode(["exito" => true, "mensaje" => "La sección se eliminó correctamente."], JSON_UNESCAPED_UNICODE);
        }
        $consulta->close();
    } 
    catch (mysqli_sql_exception $error) {
        http_response_code(500);
        error_log("Error al eliminar la sección: " . $error->getMessage());
        echo json_encode(["exito" => false, "mensaje" => "No fue posible eliminar la sección."], JSON_UNESCAPED_UNICODE);
    }
    $conexion->close();
    exit;
}
#-------------------------------------------#
#--|recibir_y_validar_datos_de_la_seccion|--#
#-------------------------------------------#
$titulo = trim($datos["titulo"] ?? "");
$descripcion = trim($datos["descripcion"] ?? "");
if ($titulo === "" || $descripcion === "") {
    http_response_code(400);
    echo json_encode(["exito" => false, "mensaje" => "El título y la descripción son obligatorios."]);
    $conexion->close();
    exit;
}
if (mb_strlen($titulo) > 100 || mb_strlen($descripcion) > 2000) {
    http_response_code(400);
    echo json_encode(["exito" => false, "mensaje" => "El título o la descripción superan el límite permitido."], JSON_UNESCAPED_UNICODE);
    $conexion->close();
    exit;
}
#------------------------------------------#
#--|insertar_seccion_en_la_base_de_datos|--#
#------------------------------------------#
try {
    $consulta = $conexion->prepare("INSERT INTO secciones (titulo, descripcion) VALUES (?, ?)");
    $consulta->bind_param("ss", $titulo, $descripcion);
    $consulta->execute();
    http_response_code(201);
    echo json_encode(["exito" => true, "mensaje" => "La sección se guardó correctamente.", "seccion" => ["id" => $conexion->insert_id, "titulo" => $titulo, "descripcion" => $descripcion]], JSON_UNESCAPED_UNICODE);
    $consulta->close();
} 
catch (mysqli_sql_exception $error) {
    http_response_code(500);
    error_log("Error al guardar la sección: " . $error->getMessage());
    echo json_encode(["exito" => false, "mensaje" => "No fue posible guardar la sección."], JSON_UNESCAPED_UNICODE);
}
$conexion->close();
?>