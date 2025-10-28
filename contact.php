<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validazione
    if (empty($_POST["email"]) || empty($_POST["message"])) {
        die("Per favore, compila tutti i campi.");
    }
    if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        die("Indirizzo email non valido.");
    }

    $userEmail = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST["message"]);

    $mail = new PHPMailer(true);
    try {
        // Configurazione SMTP Gmail
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'noxusclan.info@gmail.com'; // tua email reale Gmail
        $mail->Password = 'password app';          // password app Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Mittente e destinatario
        $mail->setFrom('noxusclan.info@gmail.com', 'NOXUS');
        $mail->addAddress('noxusclan.info@gmail.com'); // dove ricevi le email
        $mail->addReplyTo($userEmail);                // reply all'utente che scrive

        // Contenuto
        $mail->isHTML(false);
        $mail->Subject = "Messaggio dal sito NOXUS";
        $mail->Body = "Email mittente: $userEmail\n\nMessaggio:\n$message";

        $mail->send();
        echo "Messaggio inviato con successo!";
    } catch (Exception $e) {
        error_log("Errore invio email: " . $mail->ErrorInfo);
        echo "Errore nell'invio del messaggio.";
    }
}
?>
