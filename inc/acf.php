<?php
defined( 'ABSPATH' ) || exit;

// Save field group JSON into the theme so changes are tracked in git.
add_filter( 'acf/settings/save_json', function (): string {
	return get_template_directory() . '/acf-json';
} );

// Load field group JSON from the same location.
add_filter( 'acf/settings/load_json', function ( array $paths ): array {
	$paths[] = get_template_directory() . '/acf-json';
	return $paths;
} );
