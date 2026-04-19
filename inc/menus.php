<?php
defined( 'ABSPATH' ) || exit;

function zing_register_menus(): void {
	register_nav_menus( [
		'primary' => __( 'Primary Navigation', 'everyday-zing-theme' ),
		'footer'  => __( 'Footer Navigation', 'everyday-zing-theme' ),
	] );
}
add_action( 'after_setup_theme', 'zing_register_menus' );

function zing_register_sidebars(): void {
	register_sidebar( [
		'name'          => __( 'Footer', 'everyday-zing-theme' ),
		'id'            => 'footer-1',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="site-footer__heading">',
		'after_title'   => '</h3>',
	] );
}
add_action( 'widgets_init', 'zing_register_sidebars' );
