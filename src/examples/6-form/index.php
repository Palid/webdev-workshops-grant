<?php

header('Content-type: text/html; charset=utf-8');

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if(isset($_POST['email']) && isset($_POST['odpowiedz'])){
        echo 'Email do: '. $_POST['email'] . '<br>';
        echo 'Odpowiedź : '. $_POST['odpowiedz'] . '<br>';
        if(strtolower($_POST['odpowiedz']) == 'obama'){
            echo 'Odpowiedź poprawna! <br>';
        } else {
            echo 'Jestes pewien? USA ma chyba innego prezydenta <br>';
        }
    } else {
        echo 'Czy wysłałes pola email i odpowiedz?';
    }
    
} else {

    echo 'Czy na pewno wysłałes formularz?';

    
}
    
?>
