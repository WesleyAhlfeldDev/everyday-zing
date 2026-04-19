<?php
/**
 * Marquee ticker block.
 * TODO ACF field: marquee_items (repeater of text strings)
 */

// Placeholder items until ACF fields are added
$items = [ 'Food', 'Finance', 'Travel', 'Every Day Zing', 'Real Life. Real Joy.' ];

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<div class="marquee-block"<?php echo $anchor; ?> aria-hidden="true">
	<div class="marquee-block__track">
		<?php
		// Duplicate items so the loop is seamless
		$all = array_merge( $items, $items );
		foreach ( $all as $item ) :
		?>
			<span class="marquee-block__item">
				<?php echo esc_html( $item ); ?>
				<span class="marquee-block__dot">&#9679;</span>
			</span>
		<?php endforeach; ?>
	</div>
</div>
