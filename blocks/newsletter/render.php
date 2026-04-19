<?php
/**
 * Newsletter signup block.
 * TODO ACF fields: nl_eyebrow, nl_title, nl_title_em, nl_subtitle,
 *                  nl_form_action (URL to email provider form action),
 *                  nl_button_label
 */

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="nl-block"<?php echo $anchor; ?> id="newsletter">
	<p class="nl-block__eyebrow"><?php esc_html_e( 'Join the list', 'everyday-zing-theme' ); ?></p>
	<h2 class="nl-block__title">
		<?php esc_html_e( 'Get your weekly ', 'everyday-zing-theme' ); ?><em><?php esc_html_e( 'zing', 'everyday-zing-theme' ); ?></em>
	</h2>
	<p class="nl-block__sub">
		<?php esc_html_e( "One email. No fluff. Real tips from Carol's kitchen, travels, and wallet — every week.", 'everyday-zing-theme' ); ?>
	</p>

	<!-- TODO: Replace form action with your email provider's action URL (Mailchimp, ConvertKit, etc.) -->
	<form class="nl-block__form" action="#" method="post">
		<input
			class="nl-block__input"
			type="email"
			name="email"
			placeholder="<?php esc_attr_e( 'your@email.com', 'everyday-zing-theme' ); ?>"
			required
			aria-label="<?php esc_attr_e( 'Email address', 'everyday-zing-theme' ); ?>"
		/>
		<button class="nl-block__btn" type="submit">
			<?php esc_html_e( "I'm in", 'everyday-zing-theme' ); ?>
		</button>
	</form>
</section>
