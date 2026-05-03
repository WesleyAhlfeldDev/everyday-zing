<?php
$items   = get_field( 'marquee_items' );
$speed   = get_field( 'marquee_speed' ) ?: 20;
$padding = get_field( 'marquee_item_padding' ) ?: 16;
$anchor  = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';

if ( ! $items ) {
	$items = [
		[ 'item_text' => 'Food' ],
		[ 'item_text' => 'Finance' ],
		[ 'item_text' => 'Travel' ],
		[ 'item_text' => 'Every Day Zing' ],
		[ 'item_text' => 'Real Life. Real Joy.' ],
	];
}

// 3 copies per track ensures track width > any common viewport (≥ ~2000px)
$track_items = array_merge( $items, $items, $items );
?>

<div class="marquee-block"<?php echo $anchor; ?> aria-hidden="true" style="--marquee-pad:<?php echo esc_attr( $padding ); ?>px">
	<div class="marquee-block__inner" style="animation-duration:<?php echo esc_attr( $speed ); ?>s">

		<div class="marquee-block__track">
			<?php foreach ( $track_items as $item ) : ?>
				<span class="marquee-block__item"><?php echo esc_html( $item['item_text'] ); ?></span>
				<span class="marquee-block__dot"></span>
			<?php endforeach; ?>
		</div>

		<div class="marquee-block__track" aria-hidden="true">
			<?php foreach ( $track_items as $item ) : ?>
				<span class="marquee-block__item"><?php echo esc_html( $item['item_text'] ); ?></span>
				<span class="marquee-block__dot"></span>
			<?php endforeach; ?>
		</div>

	</div>
</div>
