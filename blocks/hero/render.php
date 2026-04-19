<?php
/**
 * Hero block render template.
 *
 * ACF fields: hero_heading, hero_subtext, hero_cta_label, hero_cta_url,
 *             hero_background_image, hero_overlay_opacity
 */

$heading          = get_field( 'hero_heading' );
$subtext          = get_field( 'hero_subtext' );
$cta_label        = get_field( 'hero_cta_label' );
$cta_url          = get_field( 'hero_cta_url' );
$bg_image         = get_field( 'hero_background_image' );
$overlay_opacity  = get_field( 'hero_overlay_opacity' ) ?: 50;

$bg_style = $bg_image
	? 'background-image: url(' . esc_url( $bg_image['url'] ) . ');'
	: '';

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="hero-block"<?php echo $anchor; ?> style="<?php echo esc_attr( $bg_style ); ?>">
	<div class="hero-block__overlay" style="opacity: <?php echo esc_attr( $overlay_opacity / 100 ); ?>;"></div>
	<div class="container hero-block__inner">
		<?php if ( $heading ) : ?>
			<h1 class="hero-block__heading"><?php echo esc_html( $heading ); ?></h1>
		<?php endif; ?>
		<?php if ( $subtext ) : ?>
			<p class="hero-block__subtext"><?php echo esc_html( $subtext ); ?></p>
		<?php endif; ?>
		<?php if ( $cta_label && $cta_url ) : ?>
			<a href="<?php echo esc_url( $cta_url ); ?>" class="btn btn-primary hero-block__cta">
				<?php echo esc_html( $cta_label ); ?>
			</a>
		<?php endif; ?>
	</div>
</section>
