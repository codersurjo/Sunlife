<?php
    // My modifications to mailer script from:
    // http://blog.teamtreehouse.com/create-ajax-contact-form
    // Added input sanitizing to prevent injection

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

        // Check that data was sent to the mailer.
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Incorrect email example";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "hello@suncliffegin.com";

        // Set the email subject.
        $subject = "Mail from subscribe form";

        // Build the email content.
        $email_content = "Email: $email\n";

        // Build the email headers.
        $email_headers = "Mail from subscribe form";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Incorrect email example";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem, please try again.";
    }

?>
