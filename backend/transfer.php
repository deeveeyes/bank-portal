<?php
require_once 'db.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->sender_id) && !empty($data->payeeAccount) && !empty($data->amount) && !empty($data->mode)) {
    $sender_id = $data->sender_id;
    $payeeAccount = $data->payeeAccount;
    $amount = floatval($data->amount);
    $mode = $data->mode;
    $comments = isset($data->comments) ? $data->comments : '';
    $transaction_id = 'TXN' . strtoupper(uniqid());

    try {
        $conn->beginTransaction();

        // 1. Check balance
        $stmt = $conn->prepare("SELECT balance FROM users WHERE id = :id FOR UPDATE");
        $stmt->bindParam(":id", $sender_id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            throw new Exception("User not found");
        }

        if ($user['balance'] < $amount) {
            throw new Exception("Insufficient balance");
        }

        // 2. Deduct balance
        $new_balance = $user['balance'] - $amount;
        $updateStmt = $conn->prepare("UPDATE users SET balance = :balance WHERE id = :id");
        $updateStmt->bindParam(":balance", $new_balance);
        $updateStmt->bindParam(":id", $sender_id);
        $updateStmt->execute();

        // 3. Record transaction
        $logStmt = $conn->prepare("INSERT INTO `transactions` (`transaction_id`, `sender_id`, `receiver_account`, `amount`, `mode`, `comments`, `balance_after`) VALUES (:tid, :sid, :racc, :amt, :mode, :comm, :bal)");
        $logStmt->bindParam(":tid", $transaction_id);
        $logStmt->bindParam(":sid", $sender_id);
        $logStmt->bindParam(":racc", $payeeAccount);
        $logStmt->bindParam(":amt", $amount);
        $logStmt->bindParam(":mode", $mode);
        $logStmt->bindParam(":comm", $comments);
        $logStmt->bindParam(":bal", $new_balance);
        $logStmt->execute();

        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Transfer successful",
            "transaction_id" => $transaction_id,
            "new_balance" => $new_balance
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Incomplete data"
    ]);
}
?>