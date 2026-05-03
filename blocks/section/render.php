<?php
$allowed_tags = [ 'section', 'div', 'article', 'aside', 'header', 'footer', 'main' ];
$tag          = $attributes['tag'] ?? 'section';
if ( ! in_array( $tag, $allowed_tags, true ) ) {
	$tag = 'section';
}

$container = $attributes['container'] ?? '';

$has_bg_image  = ! empty( $attributes['backgroundImageUrl'] );
$overlay_type  = $attributes['overlayType'] ?? '';
$has_overlay   = $has_bg_image && $overlay_type !== '';

$outer_classes = implode( ' ', array_filter( [
	$attributes['paddingY']   ?? '',
	$attributes['paddingX']   ?? '',
	$attributes['marginY']    ?? '',
	$attributes['background'] ?? '',
	$attributes['textColor']  ?? '',
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

if ( $has_bg_image ) {
	$bg_size       = esc_attr( $attributes['backgroundSize']     ?? 'cover' );
	$bg_position   = esc_attr( $attributes['backgroundPosition'] ?? 'center center' );
	$bg_repeat     = esc_attr( $attributes['backgroundRepeat']   ?? 'no-repeat' );
	$style_parts[] = 'position:relative';
	$style_parts[] = 'background-image:url(' . esc_url( $attributes['backgroundImageUrl'] ) . ')';
	$style_parts[] = 'background-size:'     . $bg_size;
	$style_parts[] = 'background-position:' . $bg_position;
	$style_parts[] = 'background-repeat:'   . $bg_repeat;
}

$style  = $style_parts ? ' style="' . implode( ';', $style_parts ) . '"' : '';
$anchor = ! empty( $attributes['anchor'] ) ? ' id="' . esc_attr( $attributes['anchor'] ) . '"' : '';

// Build overlay div HTML.
$overlay_html = '';
if ( $has_overlay ) {
	$overlay_opacity = round( intval( $attributes['overlayOpacity'] ?? 50 ) / 100, 2 );
	$overlay_base    = 'position:absolute;inset:0;opacity:' . $overlay_opacity . ';pointer-events:none;';

	if ( $overlay_type === 'gradient' && ! empty( $attributes['overlayGradient'] ) ) {
		$overlay_bg   = 'background:' . esc_attr( $attributes['overlayGradient'] );
	} else {
		$overlay_bg   = 'background-color:' . esc_attr( $attributes['overlayColor'] ?? '#000000' );
	}

	$overlay_html = '<div aria-hidden="true" style="' . $overlay_base . $overlay_bg . ';"></div>';
}
?>

<<?php echo $tag; ?><?php echo $anchor; ?><?php if ( $outer_classes ) : ?> class="<?php echo esc_attr( $outer_classes ); ?>"<?php endif; ?><?php echo $style; ?>>
	<?php echo $overlay_html; ?>
	<?php if ( $container ) : ?>
		<div class="<?php echo esc_attr( $container ); ?>" style="<?php echo $has_overlay ? 'position:relative;z-index:1' : ''; ?>">
			<?php echo $content; ?>
		</div>
	<?php else : ?>
		<div<?php echo $has_overlay ? ' style="position:relative;z-index:1"' : ''; ?>>
			<?php echo $content; ?>
		</div>
	<?php endif; ?>
</<?php echo $tag; ?>>
