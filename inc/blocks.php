<?php
defined( 'ABSPATH' ) || exit;

function zing_register_blocks(): void {
	$blocks_dir = get_template_directory() . '/blocks';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	foreach ( glob( $blocks_dir . '/*/block.json' ) as $block_json ) {
		register_block_type( dirname( $block_json ) );
	}
}
add_action( 'init', 'zing_register_blocks' );

// Allow ACF blocks to use the block editor category
function zing_block_categories( array $categories ): array {
	return array_merge(
		[
			[
				'slug'  => 'everyday-zing',
				'title' => __( 'Every Day Zing', 'everyday-zing-theme' ),
				'icon'  => 'star-filled',
			],
		],
		$categories
	);
}
add_filter( 'block_categories_all', 'zing_block_categories' );
