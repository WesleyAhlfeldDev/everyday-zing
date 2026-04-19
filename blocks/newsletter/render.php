<?php
$eyebrow      = get_field( 'nl_eyebrow' )       ?: 'Join the list';
$title_prefix = get_field( 'nl_title_prefix' )  ?: 'Get your weekly';
$title_em     = get_field( 'nl_title_em' )      ?: 'zing';
$subtitle     = get_field( 'nl_subtitle' )       ?: "One email. No fluff. Real tips from Carol's kitchen, travels, and wallet — every week.";
$form_action  = get_field( 'nl_form_action' )   ?: '';
$btn_label    = get_field( 'nl_button_label' )  ?: "I'm in";

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="nl-block"<?php echo $anchor; ?> id="newsletter">

	<p class="nl-block__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>

	<h2 class="nl-block__title">
		<?php echo esc_html( $title_prefix ); ?>
		<?php if ( $title_em ) : ?> <em><?php echo esc_html( $title_em ); ?></em><?php endif; ?>
	</h2>

	<?php if ( $subtitle ) : ?>
		<p class="nl-block__sub"><?php echo esc_html( $subtitle ); ?></p>
	<?php endif; ?>

	<form class="nl-block__form"
		action="<?php echo esc_url( $form_action ?: '#newsletter' ); ?>"
		method="post">
		<input
			class="nl-block__input"
			type="email"
			name="email"
			placeholder="<?php esc_attr_e( 'your@email.com', 'everyday-zing-theme' ); ?>"
			required
			aria-label="<?php esc_attr_e( 'Email address', 'everyday-zing-theme' ); ?>"
		/>
		<button class="nl-block__btn" type="submit">
			<?php echo esc_html( $btn_label ); ?>
		</button>
	</form>

</section>
