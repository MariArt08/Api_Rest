<?php
/**
 * Plugin Name: Portafolio API
 * Description: Muestra habilidades, intereses y proyectos consumidos desde JSON Server mediante shortcodes.
 * Version: 1.0.0
 * Author: Grupo ITI-621
 */

// Evita el acceso directo al archivo.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ---------- Constantes ----------
define( 'PORTAFOLIO_API_VERSION', '1.0.0' );
define( 'PORTAFOLIO_API_URL_BASE', 'http://localhost:3000' ); // URL base de JSON Server
define( 'PORTAFOLIO_API_DIR', plugin_dir_path( __FILE__ ) );
define( 'PORTAFOLIO_API_URL', plugin_dir_url( __FILE__ ) );

// ---------- Encolar JS y CSS ----------
function portafolio_api_enqueue_assets() {
    wp_enqueue_style(
        'portafolio-api-css',
        PORTAFOLIO_API_URL . 'portafolio-api.css',
        array(),
        PORTAFOLIO_API_VERSION
    );

    wp_enqueue_script(
        'portafolio-api-js',
        PORTAFOLIO_API_URL . 'portafolio-api.js',
        array(),
        PORTAFOLIO_API_VERSION,
        true // se carga en el footer
    );

    // Pasa la URL base de la API al JavaScript (sin credenciales).
    wp_localize_script(
        'portafolio-api-js',
        'PortafolioAPI',
        array(
            'apiUrl' => esc_url_raw( apply_filters( 'portafolio_api_url_base', PORTAFOLIO_API_URL_BASE ) ),
        )
    );
}
add_action( 'wp_enqueue_scripts', 'portafolio_api_enqueue_assets' );

// ---------- Función auxiliar: contenedor que el JS rellenará ----------
function portafolio_api_contenedor( $recurso ) {
    return sprintf(
        '<div class="portafolio-contenedor" id="portafolio-%1$s" data-recurso="%1$s">'
        . '<p class="portafolio-cargando">Cargando...</p></div>',
        esc_attr( $recurso )
    );
}

// ---------- Shortcodes ----------
function portafolio_api_shortcode_habilidades() {
    return portafolio_api_contenedor( 'habilidades' );
}
add_shortcode( 'portafolio_habilidades', 'portafolio_api_shortcode_habilidades' );

function portafolio_api_shortcode_intereses() {
    return portafolio_api_contenedor( 'intereses' );
}
add_shortcode( 'portafolio_intereses', 'portafolio_api_shortcode_intereses' );

function portafolio_api_shortcode_proyectos() {
    return portafolio_api_contenedor( 'proyectos' );
}
add_shortcode( 'portafolio_proyectos', 'portafolio_api_shortcode_proyectos' );