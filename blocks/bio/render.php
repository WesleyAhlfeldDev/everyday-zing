<?php
$eyebrow       = get_field( 'bio_eyebrow' )      ?: 'A little about me';
$title_prefix  = get_field( 'bio_title_prefix' ) ?: 'I believe everyday life deserves a little';
$title_em      = get_field( 'bio_title_em' )     ?: 'zing';
$body          = get_field( 'bio_body' );
$pills         = get_field( 'bio_pills' );
$ig_handle     = get_field( 'ig_handle' )     ?: 'caroljoyzing';
$ig_handle_url = get_field( 'ig_handle_url' ) ?: 'https://instagram.com/caroljoyzing';
$ig_shortcode  = get_field( 'ig_shortcode' )  ?: '[instagram-feed]';

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';

$default_pills = [
	[ 'pill_text' => '🍽️ food that feeds you' ],
	[ 'pill_text' => '📈 money without the fear' ],
	[ 'pill_text' => '✈️ travel on real budgets' ],
];
if ( ! $pills ) $pills = $default_pills;
?>

<section class="bio-block"<?php echo $anchor; ?>>

	<p class="bio-block__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>

	<h2 class="bio-block__title">
		<?php echo esc_html( $title_prefix ); ?>
		<?php if ( $title_em ) : ?> <em><?php echo esc_html( $title_em ); ?></em><?php endif; ?>
	</h2>

	<?php if ( $body ) : ?>
		<div class="bio-block__body"><?php echo wp_kses_post( $body ); ?></div>
	<?php else : ?>
		<p class="bio-block__body">
			<?php esc_html_e( "I'm Carol Joy — a home cook, reluctant-but-enthusiastic investor, and someone who has packed too many bags for too many trips on too little budget. I write about all of it, honestly.", 'everyday-zing-theme' ); ?>
		</p>
	<?php endif; ?>

	<?php if ( $pills ) : ?>
		<div class="bio-block__pills">
			<?php foreach ( $pills as $pill ) : ?>
				<span class="bio-block__pill"><?php echo esc_html( $pill['pill_text'] ); ?></span>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<?php if ( have_rows( 'buttons' ) ) : ?>
	<div class="bio-block__actions">
		<?php while ( have_rows( 'buttons' ) ) : the_row();
			$link         = get_sub_field( 'button_link' );
			$style        = get_sub_field( 'button_style' );
			$color        = get_sub_field( 'button_color' );
			$icon         = get_sub_field( 'button_icon' );
			$custom_class = get_sub_field( 'button_custom_class' );

			if ( empty( $link['url'] ) ) { continue; }

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


	<div class="ig-block__header">
		<h2 class="ig-block__heading"><?php esc_html_e( 'Follow along', 'everyday-zing-theme' ); ?></h2>
		<a class="ig-block__handle" href="<?php echo esc_url( $ig_handle_url ); ?>" target="_blank" rel="noopener noreferrer">
			<span class="ig-block__ig-logo"></span>
			@<?php echo esc_html( ltrim( $ig_handle, '@' ) ); ?>
		</a>
	</div>

	<div class="ig-block__feed">
		<?php echo do_shortcode( $ig_shortcode ); ?>
	</div>

</section>
