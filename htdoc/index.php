<?php
/**
 * Created by PhpStorm.
 * User: hotovec
 * Date: 18.10.2017
 * Time: 21:38
 */

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

$cache_dir = __DIR__ . '/.tmp';
$template = 'index.twig';
$data = null;

// check GET Template parameter
if (isset($_GET['t'])) {
    if (file_exists(__DIR__ . '/../templates/' . $_GET['t'] . '.twig')) {
        $template = $_GET['t'] . '.twig';
    } else {
        echo 'Err: [' . $_GET['t'] . '.twig] not exist! Using default';
    }
}

// get yaml configs
try {
    $data = Yaml::parse(file_get_contents(__DIR__ . '/../data/data.yml'));
} catch (ParseException $e) {
    printf("Unable to parse the YAML string: %s", $e->getMessage());
}


$loader = new Twig_Loader_Filesystem('../templates/');
$twig = new Twig_Environment($loader, array(
    'cache' => $latte_temp_dir,
));

//
echo $twig->render($template, $data);
