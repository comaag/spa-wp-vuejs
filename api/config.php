<?php

// includes the main API class
include('API.php');

// register the custom endpoints
add_action( 'rest_api_init', function()
{
    $api = new API;

    // calls the API->init() method after calling /api/v1/init/ on a GET Request
    register_rest_route( 'api/v1', '/init/',
        [
            'methods'   => 'GET',
            'callback'  => array($api, 'init')
        ]
    );
});
