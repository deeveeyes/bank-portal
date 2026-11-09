<?php
require_once 'db.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->internetId) && !empty($data->newPassword)) {
    $internet_id = $data->internetId;
    $new_password = $data->newPassword;

    // Check if user exists
    $check_query = "SELECT id FROM users WHERE internet_id = :internet_id LIMIT 1";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(":internet_id", $internet_id);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        // Hash the new password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // Update password
        $update_query = "UPDATE users SET password = :password WHERE internet_id = :internet_id";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bindParam(":password", $hashed_password);
        $update_stmt->bindParam(":internet_id", $internet_id);

        if ($update_stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Password updated successfully"
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to update password"
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
