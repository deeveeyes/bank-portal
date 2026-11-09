<?php
require_once 'db.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->internetId) && !empty($data->password)) {
    $internet_id = $data->internetId;
    $password = $data->password;

    $query = "SELECT * FROM users WHERE internet_id = :internet_id LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":internet_id", $internet_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($password, $row['password'])) {
            // Password is correct
            // Remove password from response
            unset($row['password']);
            
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => $row
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid password"
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "User not found"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Incomplete data"
    ]);
}
?>
