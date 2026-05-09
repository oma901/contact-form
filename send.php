<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Метод не разрешен'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$website = trim($_POST['website'] ?? '');

$errors = [];

if ($website !== '') {
    echo json_encode([
        'status' => 'error',
        'errors' => [
            'message' => 'Ошибка отправки формы'
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($name === '') {
    $errors['name'] = 'Введите имя';
}

if ($email === '') {
    $errors['email'] = 'Введите email';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Некорректный email';
}

if ($message === '') {
    $errors['message'] = 'Введите сообщение';
}

if (!empty($errors)) {
    echo json_encode([
        'status' => 'error',
        'errors' => $errors
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Форма успешно отправлена'
], JSON_UNESCAPED_UNICODE);
