<?php



// includes the config.php a configuration of Custom REST Endpoints
include('api/config.php');

// includes the translation array for polylang
global $translateConfig;
$translateConfig = include('api/translation-config.php');

// add theme supports
add_theme_support( 'title-tag' );
add_theme_support( 'post-thumbnails' );

/**
 * theme_scripts
 * 
 * register all scripts and styles for the theme
 * 
 */
function theme_scripts() {
    $base_url  = esc_url_raw( home_url() );
    $base_path = rtrim( parse_url( $base_url, PHP_URL_PATH ), '/' );

    // adding styles;
    wp_enqueue_style( 'normalize', get_template_directory_uri() . '/vendor/css/normalize.css', false, '5.0.0' );
    wp_enqueue_style( 'style', get_stylesheet_uri(), array( 'normalize' ) );

    
    // adding scripts
    wp_enqueue_script( 'theme-vendor-promise', get_template_directory_uri() . '/vendor/js/promise.min.js', array(), '1.0.0', true );

    // --- include here further scripts --->

    wp_enqueue_script( 'theme-vue', get_template_directory_uri() . '/build/build.js', array(), '1.0.0', true );
    wp_localize_script( 'theme-vue', 'wp', array(
        'root'      => esc_url_raw( rest_url() ),
        'base_url'  => $base_url,
        'base_path' => $base_path ? $base_path . '/' : '/',
        'nonce'     => wp_create_nonce( 'wp_rest' ),
        'site_name' => get_bloginfo( 'name' ),
        'routes'    => theme_routes(),
        'current_language' => (function_exists('pll_current_language')) ? pll_current_language() : 'de',
        'translations' => translations()
    ) );
}
add_action( 'wp_enqueue_scripts', 'theme_scripts' );

// ## PLUGIN: POLY LANG
// get translations with poly lang plugin
if(function_exists('pll_translate_string')) {
    
    /**
     * get translate strings of the Poly lang plugin
     * @see /api/tranlation-config.php
     * 
     * @return array
     */
    function translations() {

        $lang = (function_exists('pll_current_language')) ? pll_current_language() : 'de';
    
        global $translateConfig;
        //var_dump($translateConfig); die();
    
        $strings = array();
        foreach($translateConfig as $string) {
            $strings[str_replace("\r\n", '', $string)] = nl2br(pll_translate_string($string, $lang));
        }
    
        return $strings;
    }

}


/**
 * THEME ROUTES
 * returns an array of all possible routes in WP.
 * 
 * @return array
 */
function theme_routes() {
    $routes = array();

    $post_status = array('publish');

    if(is_user_logged_in()) {
        $post_status[] = 'pending';
        $post_status[] = 'draft';
        $post_status[] = 'auto-draft';
        $post_status[] = 'future';
        $post_status[] = 'private';
        $post_status[] = 'inherit';
        $post_status[] = 'trash';
    }

    $query = new WP_Query( array(
        'post_type'      => array('page', 'post', 'project'),
        'post_status'    => $post_status,
        'posts_per_page' => -1,
        'lang' => ''
    ) );
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $routes[] = array(
                'id'   => get_the_ID(),
                'type' =>  get_post_type(),
                'template' => basename( get_page_template() ),
                'slug' => theme_links(get_permalink()),
                'url' => theme_links(get_permalink())
            );
        }
    }
    wp_reset_postdata();

    $categories = get_categories();

    foreach($categories as $category) {
        $routes[] = array(
            'id'   => $category->term_id,
            'type' =>  'blog',
            'category' => $category->slug,
            'category_name' => $category->cat_name,
            'template' => '',
            'slug' => '/category/'.$category->slug,
        );
    }

    return $routes;
}

function theme_links ($link) {
    return str_replace(($_SERVER['HTTPS'] ? 'https'  : 'http' ) . '://' . $_SERVER['HTTP_HOST'], '', $link);
}


add_action( 'after_setup_theme', 'register_theme_menu' );
function register_theme_menu() {
    register_nav_menu( 'primary', __( 'Primary Menu', 'spa-wp-vuejs' ) );
    register_nav_menu( 'meta', __( 'Meta Menu', 'spa-wp-vuejs' ) );
}

// AFC in Rest
// Enable the option show in rest
add_filter( 'acf/rest_api/field_settings/show_in_rest', '__return_true' );

// Hide Admin Bar 
add_filter('show_admin_bar', '__return_false');
