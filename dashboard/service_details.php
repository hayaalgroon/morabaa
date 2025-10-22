<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../ajax/auth_check.php';
include '../config.php';
include '../ajax/role_user.php';
?>

<?php
$request_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Fetch request data from database
$request = null;
if ($request_id > 0) {
    $stmt = $conn->prepare("
        SELECT
            request.*,
            request.service_id,
            services.name AS service_name,
            users.name AS referrer_name
        FROM request
        LEFT JOIN services ON request.service_id = services.id
        LEFT JOIN users ON request.referrer_by = users.id
        WHERE request.id = ?
    ");
    $stmt->bind_param("i", $request_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $request = $result->fetch_assoc();
    $stmt->close();
}

// Check access
$serviceId = isset($request['service_id']) ? (int)$request['service_id'] : 0;

if (is_manager() || is_employee()) {
    if (!has_service_access($serviceId)) {
        header("Location: ../dashboard.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html :class="{ 'theme-dark': dark }" x-data="data()" lang="en" dir="rtl">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blank - Windmill Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/css/tailwind.output.css" />
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
    <script src="../assets/js/init-alpine.js"></script>
</head>

<body>
    <?php include '../components/toast.php'; ?>

    <div class="flex h-screen bg-gray-50 dark:bg-gray-900" :class="{ 'overflow-hidden': isSideMenuOpen}">
        <?php include '../components/dashboard/side_menu.php'; ?>
        <div class="flex flex-col flex-1">
            <?php include '../components/dashboard/header.php'; ?>
            <?php if ($request): ?>
                <?php include '../components/service/details.php'; ?>
                <?php include '../components/service/comments.php'; ?>
            <?php else: ?>
                <p>لم يتم العثور على الطلب.</p>
            <?php endif; ?>
            </main>
        </div>
    </div>
</body>

</html>