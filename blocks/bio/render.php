<?php
$eyebrow       = get_field( 'bio_eyebrow' )      ?: 'A little about me';
$title_prefix  = get_field( 'bio_title_prefix' ) ?: 'I believe everyday life deserves a little';
$title_em      = get_field( 'bio_title_em' )     ?: 'zing';
$body          = get_field( 'bio_body' );
$pills         = get_field( 'bio_pills' );
$cta           = get_field( 'bio_cta' );

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

	<?php if ( $cta ) : ?>
		<a href="<?php echo esc_url( $cta['url'] ); ?>"
			class="bio-block__cta"
			<?php echo $cta['target'] ? 'target="' . esc_attr( $cta['target'] ) . '"' : ''; ?>>
			<?php echo esc_html( $cta['title'] ); ?>
		</a>
	<?php endif; ?>

</section>
