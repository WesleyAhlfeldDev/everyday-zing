<?php
if ( ! have_rows( 'buttons' ) ) {
	return;
}

$align        = $block['align'] ?? '';
$anchor       = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
$align_class  = match ( $align ) {
	'center' => 'justify-content-center',
	'right'  => 'justify-content-end',
	default  => 'justify-content-start',
};
?>

<div<?php echo $anchor; ?> class="d-flex flex-wrap gap-3 <?php echo esc_attr( $align_class ); ?>">
	<?php while ( have_rows( 'buttons' ) ) : the_row(); ?>
		<?php
		$link         = get_sub_field( 'button_link' );
		$style        = get_sub_field( 'button_style' );
		$color        = get_sub_field( 'button_color' );
		$icon         = get_sub_field( 'button_icon' );
		$custom_class = get_sub_field( 'button_custom_class' );

		if ( empty( $link['url'] ) ) {
			continue;
		}

		// btn-lib-* styles are self-contained; Bootstrap .btn base is only needed for color-only buttons.
		if ( $style ) {
			$classes = implode( ' ', array_filter( [ $style, $custom_class ] ) );
		} else {
			$classes = implode( ' ', array_filter( [ 'btn', $color ?: 'btn-joy-pink', $custom_class ] ) );
		}
		$target_rel = ! empty( $link['target'] ) ? ' target="_blank" rel="noopener noreferrer"' : '';
		$icon_html  = $icon ? ' <i class="' . esc_attr( $icon ) . '" aria-hidden="true"></i>' : '';
		// btn-lib styles use span+i z-index for animations (e.g. Editorial sweep).
		$label = $style
			? '<span>' . esc_html( $link['title'] ) . '</span>'
			: esc_html( $link['title'] );
		?>
		<a href="<?php echo esc_url( $link['url'] ); ?>" class="<?php echo esc_attr( $classes ); ?>"<?php echo $target_rel; ?>>
			<?php echo $label; ?><?php echo $icon_html; ?>
		</a>
	<?php endwhile; ?>
</div>
