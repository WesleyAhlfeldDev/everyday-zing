<?php
$classes = implode( ' ', array_filter( [
	! empty( $attributes['colXs'] ) ? $attributes['colXs'] : 'col',
	$attributes['colSm']        ?? '',
	$attributes['colMd']        ?? '',
	$attributes['colLg']        ?? '',
	$attributes['colXl']        ?? '',
	$attributes['offsetMd']     ?? '',
	$attributes['offsetLg']     ?? '',
	$attributes['alignSelf']    ?? '',
	$attributes['className']    ?? '',
] ) );

$anchor = ! empty( $attributes['anchor'] ) ? ' id="' . esc_attr( $attributes['anchor'] ) . '"' : '';
?>

<div class="<?php echo esc_attr( $classes ); ?>"<?php echo $anchor; ?>>
	<?php echo $content; ?>
</div>
