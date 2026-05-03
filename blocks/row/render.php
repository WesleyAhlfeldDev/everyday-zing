<?php
$classes = implode( ' ', array_filter( [
	'row',
	$attributes['justify']    ?? '',
	$attributes['alignItems'] ?? '',
	$attributes['gutter']     ?? '',
	$attributes['gutterX']    ?? '',
	$attributes['gutterY']    ?? '',
	$attributes['rowCols']    ?? '',
	$attributes['rowColsSm']  ?? '',
	$attributes['rowColsMd']  ?? '',
	$attributes['rowColsLg']  ?? '',
	$attributes['className']  ?? '',
] ) );

$style_parts = array_filter( [
	! empty( $attributes['customPaddingTop'] )    ? 'padding-top:'    . esc_attr( $attributes['customPaddingTop'] )    : '',
	! empty( $attributes['customPaddingBottom'] ) ? 'padding-bottom:' . esc_attr( $attributes['customPaddingBottom'] ) : '',
	! empty( $attributes['customPaddingLeft'] )   ? 'padding-left:'   . esc_attr( $attributes['customPaddingLeft'] )   : '',
	! empty( $attributes['customPaddingRight'] )  ? 'padding-right:'  . esc_attr( $attributes['customPaddingRight'] )  : '',
	! empty( $attributes['customMarginTop'] )     ? 'margin-top:'     . esc_attr( $attributes['customMarginTop'] )     : '',
	! empty( $attributes['customMarginBottom'] )  ? 'margin-bottom:'  . esc_attr( $attributes['customMarginBottom'] )  : '',
] );
$style = $style_parts ? ' style="' . implode( ';', $style_parts ) . '"' : '';

$anchor = ! empty( $attributes['anchor'] ) ? ' id="' . esc_attr( $attributes['anchor'] ) . '"' : '';
?>

<div class="<?php echo esc_attr( $classes ); ?>"<?php echo $anchor; ?><?php echo $style; ?>>
	<?php echo $content; ?>
</div>
