<?php
require_once 'db.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->internetId)) {
    $internet_id = $data->internetId;

    $query = "SELECT id FROM users WHERE internet_id = :internet_id LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":internet_id", $internet_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "status" => "success",
            "message" => "User found"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Internet Banking ID not found"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Incomplete data"
    ]);
}
?>
