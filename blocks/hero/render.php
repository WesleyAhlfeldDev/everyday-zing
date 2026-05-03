<?php
$greeting = get_field( 'hero_greeting' )     ?: "hey hello, I'm";
$name     = get_field( 'hero_name' )          ?: 'Carol Joy';
$tagline  = get_field( 'hero_title_tagline' ) ?: 'finding the zing in everyday life';
$subtitle = get_field( 'hero_subtitle' )      ?: 'Real recipes, honest money talk, and adventures you can actually afford. Welcome to my corner of the internet.';
$photo          = get_field( 'hero_photo' );
$photo_position = get_field( 'hero_photo_position' ) ?: 'center center';
if ( $photo_position === 'custom' ) {
	$x              = get_field( 'hero_photo_position_x' ) ?? 50;
	$y              = get_field( 'hero_photo_position_y' ) ?? 50;
	$photo_position = $x . '% ' . $y . '%';
}
$bg_style         = get_field( 'hero_bg_style' ) ?: 'none';
$photo_size       = get_field( 'hero_photo_size' ) ?: 'lg';
$photo_size_custom = '';
if ( $photo_size === 'custom' ) {
	$custom_h         = get_field( 'hero_photo_size_custom' ) ?: 400;
	$photo_size_custom = ' style="--photo-max-h:' . esc_attr( $custom_h ) . 'px"';
}

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="hero-block"<?php echo $anchor; ?>>

	<div class="hero-block__left<?php echo $bg_style !== 'none' ? ' hero-block__left--bg-' . esc_attr( $bg_style ) : ''; ?>">
		<?php if ( $bg_style !== 'none' ) : ?>
		<div class="hero-block__bg">
			<?php if ( $bg_style === 'aurora' ) : ?>
				<div class="hero-block__blob hero-block__blob--1"></div>
				<div class="hero-block__blob hero-block__blob--2"></div>
				<div class="hero-block__blob hero-block__blob--3"></div>
			<?php elseif ( $bg_style === 'particles' ) : ?>
				<?php for ( $i = 1; $i <= 12; $i++ ) : ?>
					<div class="hero-block__particle hero-block__particle--<?php echo $i; ?>"></div>
				<?php endfor; ?>
			<?php endif; ?>
		</div>
		<?php endif; ?>
		<div class="hero-block__photo hero-block__photo--<?php echo esc_attr( $photo_size ); ?>"<?php echo $photo_size_custom; ?>>
			<?php if ( $photo ) : ?>
				<img src="<?php echo esc_url( $photo['url'] ); ?>"
					alt="<?php echo esc_attr( $photo['alt'] ?: $name ); ?>"
					width="<?php echo esc_attr( $photo['width'] ); ?>"
					height="<?php echo esc_attr( $photo['height'] ); ?>"
					style="object-position: <?php echo esc_attr( $photo_position ); ?>">
			<?php else : ?>
				<div class="hero-block__avatar">
					<?php echo esc_html( mb_substr( $name, 0, 2 ) ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div class="hero-block__right">
		<p class="hero-block__greeting"><?php echo esc_html( $greeting ); ?></p>
		<h1 class="hero-block__title">
			<em><?php echo esc_html( $name ); ?></em>
			<?php if ( $tagline ) : ?> — <?php echo esc_html( $tagline ); ?><?php endif; ?>
		</h1>
		<?php if ( $subtitle ) : ?>
			<div class="hero-block__sub"><?php echo wp_kses_post( $subtitle ); ?></div>
		<?php endif; ?>
		<?php if ( have_rows( 'buttons' ) ) : ?>
		<div class="hero-block__actions">
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

				if ( $style ) {
					$classes = implode( ' ', array_filter( [ $style, $custom_class ] ) );
				} else {
					$classes = implode( ' ', array_filter( [ 'btn', $color ?: 'btn-joy-pink', $custom_class ] ) );
				}
				$target_rel = ! empty( $link['target'] ) ? ' target="_blank" rel="noopener noreferrer"' : '';
				$icon_html  = $icon ? ' <i class="' . esc_attr( $icon ) . '" aria-hidden="true"></i>' : '';
				$label      = $style
					? '<span>' . esc_html( $link['title'] ) . '</span>'
					: esc_html( $link['title'] );
				?>
				<a href="<?php echo esc_url( $link['url'] ); ?>" class="<?php echo esc_attr( $classes ); ?>"<?php echo $target_rel; ?>>
					<?php echo $label; ?><?php echo $icon_html; ?>
				</a>
			<?php endwhile; ?>
		</div>
		<?php endif; ?>
	</div>

</section>
