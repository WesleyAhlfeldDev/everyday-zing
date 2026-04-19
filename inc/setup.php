<?php
defined( 'ABSPATH' ) || exit;

function zing_setup(): void {
	load_theme_textdomain( 'everyday-zing-theme', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ] );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'custom-logo', [
		'height'      => 60,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	] );

	add_image_size( 'card-thumbnail', 640, 360, true );
	add_image_size( 'hero', 1920, 800, true );

	$GLOBALS['content_width'] = 720;
}
add_action( 'after_setup_theme', 'zing_setup' );
