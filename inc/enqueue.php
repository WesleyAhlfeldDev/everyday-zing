<?php
defined( 'ABSPATH' ) || exit;

function zing_enqueue_assets(): void {
	$version = wp_get_theme()->get( 'Version' );
	$dist    = get_template_directory_uri() . '/assets/dist';
	$dir     = get_template_directory() . '/assets/dist';

	// Google Fonts
	wp_enqueue_style(
		'zing-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap',
		[],
		null
	);

	// Main compiled CSS (Bootstrap + theme SCSS)
	$css_file = $dir . '/main.css';
	wp_enqueue_style(
		'zing-main',
		$dist . '/main.css',
		[ 'zing-fonts' ],
		file_exists( $css_file ) ? filemtime( $css_file ) : $version
	);

	// Main JS
	$js_file = $dir . '/main.js';
	wp_enqueue_script(
		'zing-main',
		$dist . '/main.js',
		[],
		file_exists( $js_file ) ? filemtime( $js_file ) : $version,
		[ 'strategy' => 'defer' ]
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'zing_enqueue_assets' );

// Remove Elementor leftover styles if still registered
function zing_dequeue_elementor(): void {
	wp_dequeue_style( 'elementor-icons' );
	wp_dequeue_style( 'elementor-frontend' );
}
add_action( 'wp_enqueue_scripts', 'zing_dequeue_elementor', 20 );
