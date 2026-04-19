<?php
/**
 * Bio / About block.
 * TODO ACF fields: bio_eyebrow, bio_title, bio_title_em, bio_body,
 *                  bio_pills (repeater), bio_cta_label, bio_cta_url
 */
$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="bio-block"<?php echo $anchor; ?>>
	<p class="bio-block__eyebrow"><?php esc_html_e( 'A little about me', 'everyday-zing-theme' ); ?></p>
	<h2 class="bio-block__title">
		<?php esc_html_e( 'I believe everyday life deserves a little ', 'everyday-zing-theme' ); ?><em><?php esc_html_e( 'zing', 'everyday-zing-theme' ); ?></em>
	</h2>
	<p class="bio-block__body">
		<?php esc_html_e( "I'm Carol Joy — a home cook, reluctant-but-enthusiastic investor, and someone who has packed too many bags for too many trips on too little budget. I write about all of it, honestly.", 'everyday-zing-theme' ); ?>
	</p>
	<div class="bio-block__pills">
		<span class="bio-block__pill">🍽️ food that feeds you</span>
		<span class="bio-block__pill">📈 money without the fear</span>
		<span class="bio-block__pill">✈️ travel on real budgets</span>
	</div>
	<a href="#" class="bio-block__cta"><?php esc_html_e( 'Read my story →', 'everyday-zing-theme' ); ?></a>
</section>
