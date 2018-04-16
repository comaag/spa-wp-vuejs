<?php
/**
 * API class
 * 
 * contains REST Endpoint methods
 */
class API {

    protected $currentLang;

    public function __construct()
    {

    }

    /**
     * init example method
     * 
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function init(WP_REST_Request $request) {
        
        // Response setup
        return new WP_REST_Response( array(), 200 );

    }
}