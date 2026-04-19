<?php
$items  = get_field( 'marquee_items' );
$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';

// Fallback items if none configured
if ( ! $items ) {
	$items = [
		[ 'item_text' => 'Food' ],
		[ 'item_text' => 'Finance' ],
		[ 'item_text' => 'Travel' ],
		[ 'item_text' => 'Every Day Zing' ],
		[ 'item_text' => 'Real Life. Real Joy.' ],
	];
}

// Duplicate for seamless loop
$all_items = array_merge( $items, $items );
?>

<div class="marquee-block"<?php echo $anchor; ?> aria-hidden="true">
	<div class="marquee-block__track">
		<?php foreach ( $all_items as $item ) : ?>
			<span class="marquee-block__item">
				<?php echo esc_html( $item['item_text'] ); ?>
				<span class="marquee-block__dot">&#9679;</span>
			</span>
		<?php endforeach; ?>
	</div>
</div>
