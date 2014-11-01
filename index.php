<!doctype html>
<html lang="en">
  <title>Home</title>
  <body>
  <h1>Map</h1>
  <?php
    // echo '$_SERVER[PHP_SELF]: ' . $_SERVER['PHP_SELF'] . '<br />';
    // echo '$_SERVER[DOCUMENT_ROOT]: ' . $_SERVER['DOCUMENT_ROOT'] . '<br />';
    $reference = explode('/', $_SERVER['PHP_SELF']);
    $reference = $reference[1];
    $dir    = $_SERVER['DOCUMENT_ROOT'].'/'.$reference;
    $files = scandir($dir);
    
    foreach ($files as $index_file => $filename) {
        if (!in_array($filename, array('.', '..'))) {
            list($name, $type) = explode('.', $filename);
            if ($type == 'html') {
                echo '<a href="/'.$reference.'/'.$filename.'"><span>' . $filename . '</span></a><br>';
            }
        }
    }
  ?>
  </body>
</html>