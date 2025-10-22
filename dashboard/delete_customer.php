<?php
session_start();
require_once __DIR__ . '/../config.php';

// نتأكد أنه جاي id
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int) $_GET['id'];

    // تجهيز الاستعلام
    $stmt = $conn->prepare("DELETE FROM request WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // رجع للصفحة الرئيسية مع رسالة نجاح
        header("Location: ../dashboard.php?msg=deleted");
        exit();
    } else {
        echo "خطأ أثناء الحذف: " . $conn->error;
    }

    $stmt->close();
} else {
    echo "طلب غير صالح!";
}
$conn->close();
?>
